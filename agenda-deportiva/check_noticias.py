
import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv(dotenv_path='../agenda-web/.env.local')
SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

try:
    res = supabase.table("noticias").select("slug", count="exact").execute()
    print(f"Total noticias: {res.count}")
    if res.data:
        print("Muestra de slugs:")
        for n in res.data[:5]:
            print(f"  {n['slug']}")
except Exception as e:
    print(f"Error: {e}")
