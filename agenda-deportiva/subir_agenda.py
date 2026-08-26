import os
import requests
import json
import google.generativeai as genai
from supabase import create_client, Client
from scraper import obtener_agenda_real, sanitizar_canal
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
        
        # Identificar fechas que ya tienen al menos un ajuste manual
        fechas_con_ajuste_manual = {v.get('fecha') for v in eventos_existentes.values() if v.get('ajuste_manual') == True}
        if fechas_con_ajuste_manual:
            print(f"   ℹ️ Detectados ajustes manuales en fechas: {', '.join(sorted(list(fechas_con_ajuste_manual)))}. La IA se deshabilitará para estos días.")
        
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
                # REGLA DE ORO: Si la fecha ya tiene ajustes manuales, NO auto-destacamos nada nuevo
                if ev['fecha'] in fechas_con_ajuste_manual:
                    ev['destacado'] = False 
                else:
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

        # 3. Sincronizar con Supabase (UPSERT no destructivo)
        print(f"3. Sincronizando {len(eventos_finales)} eventos con la DB...")

        columnas = ['fecha', 'hora', 'evento', 'competicion', 'deporte', 'canales', 
                    'destacado', 'destacado_dia', 'estelar_dia', 'destacado_finde', 
                    'carrusel_ig', 'ajuste_manual']

        # Clasificación por clave compuesta: {fecha}||{evento}||{competicion}
        # - Clave ya existe en DB  -> UPDATE (se conserva el mismo 'id', no cambian las URLs)
        # - Clave nueva            -> INSERT (solo se agregan eventos nuevos)
        # - Con ajuste manual      -> se respeta tal cual, no se sobrescribe
        datos_actualizar = []  # filas con 'id': upsert on_conflict='id' las actualiza en sitio
        datos_insertar = []    # filas sin 'id': upsert on_conflict='id' las inserta como nuevas
        untouched_manuales = 0

        for ev in eventos_finales:
            key = f"{ev['evento']}||{ev['fecha']}||{ev['competicion']}"
            existente = eventos_existentes.get(key)

            # Los eventos con ajuste manual no se tocan: el editor humano manda
            if existente and existente.get('ajuste_manual'):
                untouched_manuales += 1
                continue

            filtrado = {k: v for k, v in ev.items() if k in columnas}

            # --- LIMPIEZA DE ÚLTIMA MILLA (Sanitización de Canales) ---
            if filtrado.get('canales'):
                canales_limpios = [sanitizar_canal(c.strip()) for c in filtrado['canales'].split(",")]
                filtrado['canales'] = ", ".join(list(dict.fromkeys(filter(None, canales_limpios))))

            if existente:
                # Mismo id => no se rompen las URLs indexadas por Google
                filtrado['id'] = existente['id']
                datos_actualizar.append(filtrado)
            else:
                datos_insertar.append(filtrado)

        # Eventos en DB que NO vienen del scraper (histórico vigente o creados a mano):
        # se preservan intactos. El UPSERT nunca borra filas.
        eventos_en_scraper = {f"{ev['evento']}||{ev['fecha']}||{ev['competicion']}" for ev in eventos_finales}
        preservados_sin_scraper = sum(1 for key in eventos_existentes if key not in eventos_en_scraper)

        # 1. Insertar filas nuevas (sin 'id', para que Postgres genere la secuencia automática)
        if datos_insertar:
            for i in range(0, len(datos_insertar), 100):
                supabase.table("eventos").insert(datos_insertar[i:i+100]).execute()

        # 2. Actualizar filas existentes (con 'id', actualiza en sitio preservando IDs y URLs)
        if datos_actualizar:
            for i in range(0, len(datos_actualizar), 100):
                supabase.table("eventos").upsert(datos_actualizar[i:i+100], on_conflict="id").execute()

        print(f"✅ Sincronización completada: {len(datos_insertar)} insertados, {len(datos_actualizar)} actualizados, {preservados_sin_scraper} históricos preservados, {untouched_manuales} manuales intactos.")

        # 4. Actualizar Status (UPSERT con fallback)
        tz_mx = pytz.timezone('America/Mexico_City')
        ahora_mx = datetime.now(tz_mx).strftime("%d/%m/%Y %I:%M %p")
        try:
            supabase.table("status").upsert(
                {"nombre": "ultima_actualizacion", "valor": f"ACTUALIZADO - {ahora_mx}"},
                on_conflict="nombre"
            ).execute()
        except Exception:
            # Fallback si "nombre" no tiene constraint único en la tabla status
            supabase.table("status").delete().eq("nombre", "ultima_actualizacion").execute()
            supabase.table("status").insert({"nombre": "ultima_actualizacion", "valor": f"ACTUALIZADO - {ahora_mx}"}).execute()
        
        print(f"🚀 Sincronización Finalizada: {ahora_mx}")

    except Exception as e:
        print(f"❌ Error general: {e}")
        raise e

if __name__ == "__main__":
    actualizar_base_de_datos()