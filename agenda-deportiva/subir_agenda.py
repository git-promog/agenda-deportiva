import os
from supabase import create_client, Client
from scraper import obtener_agenda_real

# --- CONFIGURACIÓN ---
SUPABASE_URL = "https://dmutaluipvmrxuvxtluq.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtdXRhbHVpcHZtcnh1dnh0bHVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMjg5ODIsImV4cCI6MjA4OTkwNDk4Mn0.X97I7C-5Ap4XfpJNd3xKg5EJCoqgyS1pqeOZSglYe0E"

def actualizar_base_de_datos():
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        
        print("1. Iniciando el Scraper... (esto puede tardar 10-15 segundos)")
        datos = obtener_agenda_real()
        
        if not datos:
            print("❌ Error: El scraper no devolvió nada. Revisa tu conexión o el sitio web.")
            return

        print(f"2. ¡Éxito! Se obtuvieron {len(datos)} eventos.")
        print("3. Limpiando tabla en Supabase...")
        
        # Borrar datos viejos
        supabase.table("eventos").delete().neq("id", 0).execute()

        print("4. Subiendo nuevos datos a la nube...")
        # Insertar datos
        supabase.table("eventos").insert(datos).execute()
        
        print("✅ PROCESO COMPLETADO: Tu web ya tiene los datos actualizados.")

    except Exception as e:
        print(f"❌ Ocurrió un error inesperado: {e}")

if __name__ == "__main__":
    actualizar_base_de_datos()