import os
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

        print(f"2. Se encontraron {len(datos)} eventos. Limpiando tabla...")
        
        # Limpiar tabla de eventos
        supabase.table("eventos").delete().neq("id", 0).execute()

        print("3. Subiendo nuevos datos a Supabase...")
        supabase.table("eventos").insert(datos).execute()
        
        # --- PASO NUEVO: TOQUE DE VIDA ---
        print("4. Actualizando hora de sincronización...")
        
        # Definimos la zona horaria de CDMX
        tz_mx = pytz.timezone('America/Mexico_City')
        ahora_mx = datetime.now(tz_mx).strftime("%d/%m/%Y %I:%M %p") # Ejemplo: 24/03/2024 10:30 PM
        
        # Actualizamos la tabla 'status' que creaste en el paso anterior
        supabase.table("status").update({"valor": ahora_mx}).eq("nombre", "ultima_actualizacion").execute()

        print(f"✅ PROCESO COMPLETADO: Sincronizado a las {ahora_mx}")

    except Exception as e:
        print(f"❌ Ocurrió un error: {e}")

if __name__ == "__main__":
    actualizar_base_de_datos()