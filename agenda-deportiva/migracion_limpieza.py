import os
from supabase import create_client, Client
from dotenv import load_dotenv
import sys

# Añadir el directorio actual al path para importar el sanitizador
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from scraper import sanitizar_canal

load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Faltan variables en .env")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def migrar_limpieza_canales():
    print("🚀 Iniciando migración de limpieza de canales en Supabase...")
    
    # 1. Obtener eventos que podrían tener CTAs
    res = supabase.table("eventos").select("id, evento, canales").execute()
    eventos = res.data or []
    
    actualizados = 0
    total = len(eventos)
    
    print(f"   Analizando {total} eventos en la base de datos...")
    
    for ev in eventos:
        id_evento = ev['id']
        canales_original = ev.get('canales', '')
        
        if not canales_original:
            continue
            
        # Aplicar sanitización
        canales_split = [c.strip() for c in canales_original.split(",")]
        canales_limpios_list = [sanitizar_canal(c) for c in canales_split]
        # Eliminar duplicados y unir
        canales_final = ", ".join(list(dict.fromkeys(filter(None, canales_limpios_list))))
        
        # Solo actualizar si hubo un cambio real
        if canales_final != canales_original:
            try:
                supabase.table("eventos").update({"canales": canales_final}).eq("id", id_evento).execute()
                print(f"   ✅ Limpiado ID {id_evento}: '{canales_original}' -> '{canales_final}'")
                actualizados += 1
            except Exception as e:
                print(f"   ❌ Error actualizando ID {id_evento}: {e}")

    print(f"\n✨ Migración finalizada. Se actualizaron {actualizados} eventos.")

if __name__ == "__main__":
    migrar_limpieza_canales()
