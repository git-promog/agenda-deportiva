import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

try:
    # Get one row to see its keys
    res = supabase.table("eventos").select("*").limit(1).execute()
    if res.data:
        print("Existing columns in 'eventos':")
        print(list(res.data[0].keys()))
    else:
        print("Table is empty.")
    
    # Try to insert a row with all new columns to see which one fails
    new_cols = ['destacado_dia', 'estelar_dia', 'destacado_finde', 'carrusel_ig', 'ajuste_manual']
    for col in new_cols:
        try:
            print(f"Testing column '{col}'...")
            supabase.table("eventos").insert({
                "evento": "TEST", 
                "fecha": "2026-01-01", 
                "hora": "00:00", 
                "competicion": "TEST", 
                "deporte": "Otros", 
                col: False
            }).execute()
            print(f"  Column '{col}' exists.")
        except Exception as e:
            print(f"  Column '{col}' FAILS: {e}")

except Exception as e:
    print(f"Error checking schema: {e}")
