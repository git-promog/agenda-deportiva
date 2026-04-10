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

        # 5. Subir con Triple Seguridad
        if not datos_finales:
            print("⚠️ No hay datos finales para subir. Abortando para proteger la DB.")
            return

        print(f"3. Validando e insertando {len(datos_finales)} eventos...")
        
        # Limpiamos los datos para asegurarnos que solo enviamos lo que la DB acepta
        columnas_validas = ['fecha', 'hora', 'evento', 'competicion', 'deporte', 'canales', 
                            'destacado', 'destacado_dia', 'estelar_dia', 'destacado_finde', 
                            'carrusel_ig', 'ajuste_manual']
        
        datos_limpios = []
        for d in datos_finales:
            limpio = {k: v for k, v in d.items() if k in columnas_validas}
            # Asegurar que los booleanos no sean None
            for col in ['destacado_dia', 'estelar_dia', 'destacado_finde', 'carrusel_ig', 'ajuste_manual']:
                if col in limpio and limpio[col] is None:
                    limpio[col] = False
            datos_limpios.append(limpio)

        try:
            # FLUJO: Borrar todo e insertar todo el bloque limpio
            supabase.table("eventos").delete().neq("id", 0).execute()
            
            # Insertar en bloques pequeños si es necesario (evita timeouts)
            for i in range(0, len(datos_limpios), 100):
                batch = datos_limpios[i:i+100]
                supabase.table("eventos").insert(batch).execute()
            
            print("✅ Inserción completada con éxito.")

        except Exception as e:
            error_msg = str(e)
            print(f"❌ ERROR CRÍTICO EN INSERCIÓN: {error_msg}")
            
            if "column" in error_msg.lower() or "field" in error_msg.lower():
                print("   Reintentando con esquema mínimo de emergencia...")
                columnas_minimas = ['fecha', 'hora', 'evento', 'competicion', 'deporte', 'canales']
                datos_emergencia = []
                for d in datos_limpios:
                    emergencia = {k: v for k, v in d.items() if k in columnas_minimas}
                    datos_emergencia.append(emergencia)
                
                supabase.table("eventos").delete().neq("id", 0).execute()
                supabase.table("eventos").insert(datos_emergencia).execute()
                print("⚠️ Web recuperada con esquema mínimo.")
            else:
                print("   No se pudo recuperar automáticamente. La tabla podría estar vacía.")

        # 6. Restaurar banderas de marketing y destacados (Solo si existen las columnas)
        print("4. Restaurando banderas de marketing...")
        eventos_nuevos = supabase.table("eventos").select("id, evento, fecha, competicion").execute()
        restaurados = 0
        if eventos_nuevos.data:
            for ev in eventos_nuevos.data:
                key = f"{ev['evento']}||{ev['fecha']}||{ev['competicion']}"
                if key in configuraciones_persistentes:
                    params = configuraciones_persistentes[key]
                    
                    # Limpiar params de valores None
                    update_data = {k: v for k, v in params.items() if v is not None}
                    
                    if update_data:
                        try:
                            supabase.table("eventos").update(update_data).eq("id", ev["id"]).execute()
                            restaurados += 1
                        except:
                            pass 
        print(f"   Se restauraron configuraciones en {restaurados} eventos")

        # --- STEP 6: WRAP UP ---
        print("6. Actualizando hora de sincronización...")
        tz_mx = pytz.timezone('America/Mexico_City')
        ahora_mx = datetime.now(tz_mx).strftime("%d/%m/%Y %I:%M %p")
        supabase.table("status").delete().eq("nombre", "ultima_actualizacion").execute()
        supabase.table("status").insert({"nombre": "ultima_actualizacion", "valor": ahora_mx}).execute()
        
        print(f"✅ PROCESO COMPLETADO: Sincronizado a las {ahora_mx}")

    except Exception as e:
        print(f"❌ Ocurrió un error general: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    actualizar_base_de_datos()