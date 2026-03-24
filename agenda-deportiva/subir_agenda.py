import os

# Intenta leer de los secretos de GitHub, si no, usa lo que tengas local (opcional)
SUPABASE_URL = os.getenv("SUPABASE_URL", "TU_URL_LOCAL_AQUÍ")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "TU_LLAVE_LOCAL_AQUÍ")

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