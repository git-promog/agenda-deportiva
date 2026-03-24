import os
from supabase import create_client, Client
from scraper import obtener_agenda_real

# Intentar leer desde las variables de entorno (GitHub Actions)
# Si no existen (estás en local), usa tus llaves directas como respaldo
SUPABASE_URL = os.environ.get("SUPABASE_URL") or "TU_URL_DE_SUPABASE_AQUÍ"
SUPABASE_KEY = os.environ.get("SUPABASE_KEY") or "TU_LLAVE_ANON_AQUÍ"

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