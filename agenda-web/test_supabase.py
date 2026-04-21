import os
import requests
import json

SUPABASE_URL = "https://dmutaluipvmrxuvxtluq.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtdXRhbHVpcHZtcnh1dnh0bHVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMjg5ODIsImV4cCI6MjA4OTkwNDk4Mn0.X97I7C-5Ap4XfpJNd3xKg5EJCoqgyS1pqeOZSglYe0E"

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

data = {
    "titulo": "Prueba API RLS",
    "contenido": "Esta es una prueba de RLS en noticias",
    "imagen_url": "https://example.com/img.jpg",
    "fecha": "2024-06-20",
    "slug": "prueba-api-rls"
}

url = f"{SUPABASE_URL}/rest/v1/noticias"
print("Attempting to insert...")
response = requests.post(url, headers=headers, data=json.dumps(data))

print(f"Status Code: {response.status_code}")
print(f"Response: {response.text}")
