import os
import requests
from supabase import create_client, Client
from scraper import obtener_agenda_real
from datetime import datetime
import pytz # Para manejar la hora de México
from dotenv import load_dotenv

# Cargar variables de entorno desde .env
load_dotenv()

# --- CONFIGURACIÓN ---
# El robot de GitHub usará las variables de entorno, en local usará el .env
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", SUPABASE_KEY)

if not SUPABASE_URL or not SUPABASE_KEY:
    print("⚠️ Faltan variables de entorno. Revisa tu archivo .env")
    exit(1)

def actualizar_base_de_datos():
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        
        print("1. Iniciando el Scraper...")
        datos = obtener_agenda_real()
        
        if not datos:
            print("❌ Error: No se obtuvieron datos del scraper.")
            # Al menos actualizamos la hora para saber que el workflow corrió
            tz_mx = pytz.timezone('America/Mexico_City')
            ahora_mx = datetime.now(tz_mx).strftime("%d/%m/%Y %I:%M %p")
            supabase.table("status").delete().eq("nombre", "ultima_actualizacion").execute()
            supabase.table("status").insert({"nombre": "ultima_actualizacion", "valor": f"SCRAPER VACÍO - {ahora_mx}"}).execute()
            return

        print(f"2. Se encontraron {len(datos)} eventos. Preservando configuraciones manuales...")
        
        # Guardar todos los eventos existentes para cruzarlos
        respuesta = supabase.table("eventos").select("*").execute()
        eventos_existentes = respuesta.data or []
        
        # Mapear eventos manuales y configuraciones por clave (evento + fecha + competicion)
        eventos_manuales = {}
        configuraciones_persistentes = {} # Para preservar destacado, destacado_dia, etc.
        
        for ev in eventos_existentes:
            key = f"{ev['evento']}||{ev['fecha']}||{ev['competicion']}"
            
            # Guardamos las banderas de marketing/destacado para re-aplicarlas después
            configuraciones_persistentes[key] = {
                'destacado': ev.get('destacado'),
                'destacado_dia': ev.get('destacado_dia', False),
                'estelar_dia': ev.get('estelar_dia', False),
                'destacado_finde': ev.get('destacado_finde', False),
                'carrusel_ig': ev.get('carrusel_ig', False)
            }
            
            # Si el usuario lo editó a mano, este objeto es SAGRADO
            if ev.get('ajuste_manual'):
                eventos_manuales[key] = ev

        # 3. Procesar datos del scraper respetando los ajustes manuales
        datos_finales = []
        claves_procesadas = set()
        
        for ev_scrapeado in datos:
            key = f"{ev_scrapeado['evento']}||{ev_scrapeado['fecha']}||{ev_scrapeado['competicion']}"
            
            if key in eventos_manuales:
                # Usar la versión manual (con hora corregida, deporte corregido, etc.)
                # Quitamos el ID para la nueva inserción
                manual_data = {k: v for k, v in eventos_manuales[key].items() if k != 'id'}
                datos_finales.append(manual_data)
                print(f"   Ajuste manual aplicado (Prevaleció sobre scraper): {ev_scrapeado['evento']}")
            else:
                # Usar versión del scraper
                datos_finales.append(ev_scrapeado)
            
            claves_procesadas.add(key)

        # 4. Agregar eventos manuales que NO están en el scraper (eventos añadidos a mano)
        tz_mx = pytz.timezone('America/Mexico_City')
        hoy = datetime.now(tz_mx).strftime("%Y-%m-%d")
        
        for key, ev_manual in eventos_manuales.items():
            if key not in claves_procesadas:
                # Solo si es de hoy o futuro
                if ev_manual.get('fecha', '') >= hoy:
                    manual_data = {k: v for k, v in ev_manual.items() if k != 'id'}
                    datos_finales.append(manual_data)
                    print(f"   Evento manual extra preservado: {ev_manual['evento']}")

        # 5. Limpiar y Subir
        print(f"3. Limpiando tabla y subiendo {len(datos_finales)} eventos...")
        supabase.table("eventos").delete().neq("id", 0).execute()
        
        if datos_finales:
            # Insertar en bloques para evitar límites de Supabase si es necesario, 
            # pero aquí son pocos usualmente.
            supabase.table("eventos").insert(datos_finales).execute()
        
        # 6. Restaurar banderas de marketing y destacados
        print("4. Restaurando banderas de marketing...")
        eventos_nuevos = supabase.table("eventos").select("id, evento, fecha, competicion").execute()
        restaurados = 0
        if eventos_nuevos.data:
            for ev in eventos_nuevos.data:
                key = f"{ev['evento']}||{ev['fecha']}||{ev['competicion']}"
                if key in configuraciones_persistentes:
                    params = configuraciones_persistentes[key]
                    supabase.table("eventos").update(params).eq("id", ev["id"]).execute()
                    restaurados += 1
        print(f"   Se restauraron configuraciones en {restaurados} eventos")
        
        # --- PASO NUEVO: TOQUE DE VIDA ---
        print("6. Actualizando hora de sincronización...")
        
        # Definimos la zona horaria de CDMX
        tz_mx = pytz.timezone('America/Mexico_City')
        ahora_mx = datetime.now(tz_mx).strftime("%d/%m/%Y %I:%M %p")
        
        # Borramos la fila vieja y creamos una nueva (mismo patrón que funciona con eventos)
        supabase.table("status").delete().eq("nombre", "ultima_actualizacion").execute()
        supabase.table("status").insert({"nombre": "ultima_actualizacion", "valor": ahora_mx}).execute()
        
        print(f"   Hora guardada: {ahora_mx}")
        print(f"✅ PROCESO COMPLETADO: Sincronizado a las {ahora_mx}")

    except Exception as e:
        print(f"❌ Ocurrió un error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    actualizar_base_de_datos()