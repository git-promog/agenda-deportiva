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
            print("❌ Error: No se obtuvieron datos.")
            return

        print(f"2. Se encontraron {len(datos)} eventos. Preservando destacados y manuales...")
        
        # Guardar TODOS los eventos existentes antes de borrar
        respuesta = supabase.table("eventos").select("*").execute()
        eventos_existentes = respuesta.data or []
        
        # Guardar destacados por clave
        destacados_guardados = {}
        eventos_por_clave = {}
        for ev in eventos_existentes:
            key = f"{ev['evento']}||{ev['fecha']}||{ev['competicion']}"
            destacados_guardados[key] = ev.get('destacado')
            eventos_por_clave[key] = ev
        
        # Claves de los eventos scrapeados
        claves_scrapeadas = set()
        for ev in datos:
            key = f"{ev['evento']}||{ev['fecha']}||{ev['competicion']}"
            claves_scrapeadas.add(key)
        
        # Identificar eventos manuales (existen pero no están en el scrapeo)
        eventos_manuales = []
        for key, ev in eventos_por_clave.items():
            if key not in claves_scrapeadas:
                # Es un evento manual, guardarlo para re-insertar después
                eventos_manuales.append(ev)
        
        print(f"   Destacados a preservar: {len(destacados_guardados)}")
        print(f"   Eventos manuales detectados: {len(eventos_manuales)}")
        
        # Limpiar tabla de eventos
        supabase.table("eventos").delete().neq("id", 0).execute()

        print("3. Subiendo nuevos datos a Supabase...")
        supabase.table("eventos").insert(datos).execute()
        
        # Re-insertar eventos manuales
        if eventos_manuales:
            print(f"4. Re-insertando {len(eventos_manuales)} eventos manuales...")
            for ev_manual in eventos_manuales:
                # Eliminar el id viejo para que se genere uno nuevo
                ev_sin_id = {k: v for k, v in ev_manual.items() if k != 'id'}
                supabase.table("eventos").insert(ev_sin_id).execute()
        
        # Reaplicar valores de "destacado" a los eventos que coincidan
        print("5. Restaurando configuraciones de destacados...")
        eventos_nuevos = supabase.table("eventos").select("id, evento, fecha, competicion").execute()
        restaurados = 0
        if eventos_nuevos.data:
            for ev in eventos_nuevos.data:
                key = f"{ev['evento']}||{ev['fecha']}||{ev['competicion']}"
                if key in destacados_guardados:
                    valor = destacados_guardados[key]
                    supabase.table("eventos").update({"destacado": valor}).eq("id", ev["id"]).execute()
                    restaurados += 1
        print(f"   Se restauraron {restaurados} destacados")
        
        # --- PASO NUEVO: TOQUE DE VIDA ---
        print("6. Actualizando hora de sincronización...")
        
        # Definimos la zona horaria de CDMX
        tz_mx = pytz.timezone('America/Mexico_City')
        ahora_mx = datetime.now(tz_mx).strftime("%d/%m/%Y %I:%M %p")
        
        # Usamos la API REST directa con service_role para bypass RLS
        # SUPABASE_KEY ya es la service_role key (la misma que usamos para delete/insert)
        headers = {
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "resolution=merge-duplicates"
        }
        
        # Hacemos upsert: inserta si no existe, actualiza si existe
        resp = requests.post(
            f"{SUPABASE_URL}/rest/v1/status",
            headers=headers,
            json={"nombre": "ultima_actualizacion", "valor": ahora_mx}
        )
        
        print(f"   Status code: {resp.status_code}")
        if resp.status_code in (200, 201, 204):
            print(f"   Hora guardada exitosamente: {ahora_mx}")
        else:
            print(f"   ⚠️ Response: {resp.status_code} - {resp.text[:200]}")
            # Fallback: intentamos con update directo
            resp2 = requests.patch(
                f"{SUPABASE_URL}/rest/v1/status?nombre=eq.ultima_actualizacion",
                headers={"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}", "Content-Type": "application/json"},
                json={"valor": ahora_mx}
            )
            print(f"   Fallback status: {resp2.status_code}")
        
        print(f"✅ PROCESO COMPLETADO: Sincronizado a las {ahora_mx}")

    except Exception as e:
        print(f"❌ Ocurrió un error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    actualizar_base_de_datos()