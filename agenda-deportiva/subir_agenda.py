import os
import requests
import json
import google.generativeai as genai
from supabase import create_client, Client
from scraper import obtener_agenda_real
from datetime import datetime
import pytz 
from dotenv import load_dotenv

# Cargar variables de entorno desde .env
load_dotenv()

# --- CONFIGURACIÓN ---
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

# Criterios de Relevancia Estática (Rápida)
TOP_TEAMS = ["América", "Chivas", "Cruz Azul", "Pumas", "Real Madrid", "Barcelona", "Manchester City", "Liverpool", "México", "Selección"]
TOP_COMPETICIONES = ["Liga MX", "Champions League", "Premier League", "LaLiga", "Fórmula 1", "NBA", "MLB", "NFL", "Copa del Mundo", "Liguilla"]

if not SUPABASE_URL or not SUPABASE_KEY:
    print("⚠️ Faltan variables de entorno. Revisa tu archivo .env")
    exit(1)

def identificar_destacados_ia(eventos_hoy):
    """Usa Gemini para identificar los eventos más relevantes del día de forma masiva."""
    if not GEMINI_API_KEY or not eventos_hoy:
        return []
    
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-2.0-flash')
    
    # Preparamos la lista simplificada para la IA
    lista_ia = [{"id": i, "evento": e['evento'], "competicion": e['competicion']} for i, e in enumerate(eventos_hoy)]
    
    prompt = f"""
    Eres un experto analista deportivo en México. De la siguiente lista de eventos, selecciona los 8 más importantes para la audiencia mexicana hoy.
    Considera rivalidades, importancia de la liga y popularidad de los equipos.
    
    LISTA: {json.dumps(lista_ia)}
    
    Responde estrictamente un JSON con los índices (ID) de los eventos seleccionados:
    [0, 3, 5, ...]
    """
    
    try:
        response = model.generate_content(prompt)
        text = response.text.replace("```json", "").replace("```", "").strip()
        indices = json.loads(text)
        return indices
    except Exception as e:
        print(f"   ⚠️ Error en IA de Relevancia: {e}")
        return []

def actualizar_base_de_datos():
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        
        print("1. Iniciando el Scraper...")
        datos_scraper = obtener_agenda_real()
        
        if not datos_scraper:
            print("❌ Error: No se obtuvieron datos del scraper.")
            return

        print(f"2. Se encontraron {len(datos_scraper)} eventos. Analizando Relevancia...")
        
        # Obtener estado actual de la DB para preservar ajustes
        respuesta = supabase.table("eventos").select("*").execute()
        eventos_existentes = {f"{ev['evento']}||{ev['fecha']}||{ev['competicion']}": ev for ev in (respuesta.data or [])}
        
        tz_mx = pytz.timezone('America/Mexico_City')
        hoy_mx = datetime.now(tz_mx).strftime("%Y-%m-%d")
        
        eventos_finales = []
        eventos_para_ia = [] # Solo los de hoy que están en modo auto
        
        # Identificar eventos manuales que NO vienen del scraper para preservarlos
        eventos_manual_keys = {k for k, v in eventos_existentes.items() if v.get('ajuste_manual') == True}
        
        for ev in datos_scraper:
            key = f"{ev['evento']}||{ev['fecha']}||{ev['competicion']}"
            
            # Valores por defecto (Modo Auto)
            ev['destacado'] = None
            ev['destacado_dia'] = False
            ev['estelar_dia'] = False
            ev['destacado_finde'] = False
            ev['carrusel_ig'] = False
            ev['ajuste_manual'] = False
            
            # Si ya existía, preservamos su configuración
            if key in eventos_existentes:
                existente = eventos_existentes[key]
                ev['destacado'] = existente.get('destacado') # Puede ser True, False o None
                ev['destacado_dia'] = existente.get('destacado_dia', False)
                ev['estelar_dia'] = existente.get('estelar_dia', False)
                ev['destacado_finde'] = existente.get('destacado_finde', False)
                ev['carrusel_ig'] = existente.get('carrusel_ig', False)
                ev['ajuste_manual'] = existente.get('ajuste_manual', False)
                
                # Si es un ajuste manual total, el scraper no lo toca
                if ev['ajuste_manual']:
                    ev.update({k: v for k, v in existente.items() if k != 'id'})

            # --- MOTOR DE RELEVANCIA INTELIGENTE ---
            # Solo aplicamos lógica si el usuario lo dejó en "Modo Auto" (destacado is None)
            if ev['destacado'] is None:
                # A. Relevancia por Palabras Clave (Local)
                nombre_low = ev['evento'].lower()
                comp_low = ev['competicion'].lower()
                
                if any(t.lower() in nombre_low for t in TOP_TEAMS) or \
                   any(c.lower() in comp_low for c in TOP_COMPETICIONES) or \
                   any(tv.lower() in ev['canales'].lower() for tv in ["Canal 5", "Azteca 7", "TUDN"]):
                    ev['destacado'] = True
                
                # B. Si es de hoy y sigue sin decidirse, lo mandamos a la IA
                if ev['destacado'] is None and ev['fecha'] == hoy_mx:
                    eventos_para_ia.append(ev)
            
            eventos_finales.append(ev)

        # --- RELEVANCIA BASADA EN IA (TENDENCIAS) ---
        if eventos_para_ia:
            print(f"   🤖 Consultando IA para {len(eventos_para_ia)} eventos ambiguos de hoy...")
            indices_top = identificar_destacados_ia(eventos_para_ia)
            for idx in indices_top:
                if 0 <= idx < len(eventos_para_ia):
                    eventos_para_ia[idx]['destacado'] = True
                    print(f"      ✨ IA destacó: {eventos_para_ia[idx]['evento']}")

        # 3. Subir a Supabase
        print(f"3. Sincronizando {len(eventos_finales)} eventos con la DB...")
        
        # Limpieza final de datos
        columnas = ['fecha', 'hora', 'evento', 'competicion', 'deporte', 'canales', 
                    'destacado', 'destacado_dia', 'estelar_dia', 'destacado_finde', 
                    'carrusel_ig', 'ajuste_manual']
        
        datos_subir = [{k: v for k, v in ev.items() if k in columnas} for ev in eventos_finales]
        
        # Agregar eventos que existen en la DB pero NO vienen del scraper (creados/editados manualmente)
        # Estos se preservan automáticamente para que no se pierdan al actualizar
        eventos_en_scraper = {f"{ev['evento']}||{ev['fecha']}||{ev['competicion']}" for ev in datos_scraper}
        
        for key, existente in eventos_existentes.items():
            if key not in eventos_en_scraper:
                # El evento está en DB pero no en scraper = fue creado/editado manualmente, lo preservamos
                evento_manual = {k: v for k, v in existente.items() if k in columnas}
                evento_manual['destacado'] = existente.get('destacado')
                evento_manual['destacado_dia'] = existente.get('destacado_dia', False)
                evento_manual['estelar_dia'] = existente.get('estelar_dia', False)
                evento_manual['destacado_finde'] = existente.get('destacado_finde', False)
                evento_manual['carrusel_ig'] = existente.get('carrusel_ig', False)
                evento_manual['ajuste_manual'] = True  # Se marca como manual para futuras actualizaciones
                datos_subir.append(evento_manual)
                print(f"   ✅ Preservando evento manual: {evento_manual['evento']} ({evento_manual['fecha']})")
        
        # Primero eliminar todos los eventos existentes (solo los del scraper, no los manuales)
        supabase.table("eventos").delete().neq("id", 0).execute()
        
        # Luego insertar los eventos combinados (scraper + manuales preservados)
        for i in range(0, len(datos_subir), 100):
            supabase.table("eventos").insert(datos_subir[i:i+100]).execute()
        
        print(f"✅ Sincronización completada: {len(datos_subir)} eventos totales.")

        # 4. Actualizar Status
        tz_mx = pytz.timezone('America/Mexico_City')
        ahora_mx = datetime.now(tz_mx).strftime("%d/%m/%Y %I:%M %p")
        supabase.table("status").delete().eq("nombre", "ultima_actualizacion").execute()
        supabase.table("status").insert({"nombre": "ultima_actualizacion", "valor": f"ACTUALIZADO - {ahora_mx}"}).execute()
        
        print(f"🚀 Sincronización Finalizada: {ahora_mx}")

    except Exception as e:
        print(f"❌ Error general: {e}")

if __name__ == "__main__":
    actualizar_base_de_datos()