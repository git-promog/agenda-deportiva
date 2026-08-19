import os
import requests
from dotenv import load_dotenv

# Cargar variables desde .env.local si existe
load_dotenv('.env.local')

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY deben estar definidos en el entorno.")
    exit(1)

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json"
}

url = f"{SUPABASE_URL}/rest/v1/noticias?select=id&limit=1"
print("Verificando lectura pública de noticias...")
response = requests.get(url, headers=headers, timeout=15)

print(f"Status Code: {response.status_code}")
print(f"Response: {response.text}")
