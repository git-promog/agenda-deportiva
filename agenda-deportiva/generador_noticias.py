import os
import requests
import json
from supabase import create_client, Client
from datetime import datetime
import google.generativeai as genai
from dotenv import load_dotenv

# Cargar variables de entorno desde .env
load_dotenv()

# ==========================================
# BOT GENERADOR DE NOTICIAS (Agentes IA)
# ==========================================
# Este script está diseñado para correr como un proceso automático (Cron Job).
# Se conecta a la base de datos, extrae el "Partido de la jornada",
# le pide a Gemini redactar una previa optimizada para SEO y publica en Supabase.

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

if not SUPABASE_URL or not SUPABASE_KEY or not GEMINI_API_KEY:
    print("⚠️ Faltan variables de entorno. Asegúrate de configurar SUPABASE_URL, SUPABASE_KEY y GEMINI_API_KEY.")
    # No detenemos el script aquí para permitir debugging, pero fallará en las llamadas.

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY) if SUPABASE_URL and SUPABASE_KEY else None

def obtener_partido_destacado():
    """Busca el evento más relevante del día para generar la noticia."""
    if not supabase: return None
    
    hoy = datetime.now().strftime("%Y-%m-%d")
    try:
        response = supabase.table("eventos").select("*").eq("fecha", hoy).execute()
        eventos = response.data
        
        if not eventos:
            return None
        
        # Lógica de prioridades (Buscar Clásicos, Liguilla, Champions, etc.)
        for evento in eventos:
            ev_nombre = evento["evento"].lower()
            if any(t in ev_nombre for t in ["real madrid", "barcelona", "méxico", "champions", "liguilla", "clásico", "final"]):
                return evento
        
        # Si no hay uno "top", devolvemos el primero que tenga canales de TV abierta
        for evento in eventos:
            if any(c in evento["canales"].lower() for c in ["canal 5", "azteca 7", "tudn"]):
                return evento
                
        return eventos[0]
    except Exception as e:
        print(f"Error al obtener eventos: {e}")
        return None

def redactar_previa_seo(evento):
    """El Agente CopyWriter & SEO usando Gemini"""
    if not GEMINI_API_KEY:
        return {
            "titulo": f"Previa: {evento['evento']} - GuíaSports",
            "contenido": "Error: Gemini API Key no configurada."
        }
    
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-2.0-flash')
    
    prompt = f"""
    Actúa como un periodista deportivo experto y analista SEO en México. 
    Escribe un artículo previo emocionante y profesional (400 palabras) sobre este partido:
    Evento: {evento['evento']}
    Competición: {evento['competicion']}
    Horario: {evento['hora']}
    Canales confirmados: {evento['canales']}

    REGLAS:
    1. Genera un Titulo muy llamativo enfocado en SEO (máximo 60 caracteres).
    2. Usa secciones en MAYÚSCULAS como: ANÁLISIS, CLAVES DEL ENCUENTRO y DÓNDE VERLO.
    3. NO uses símbolos de Markdown como # o ##. Tampoco uses negritas (**).
    4. El tono debe ser épico pero formal.
    5. Menciona que la mejor forma de seguir la agenda es en GuíaSports.
    6. Salida estricta en JSON con este formato:
    {{
        "titulo": "...",
        "contenido": "...",
        "slug": "..."
    }}
    """
    
    try:
        response = model.generate_content(prompt)
        # Limpiar la respuesta para asegurar JSON válido
        text = response.text.replace("```json", "").replace("```", "").strip()
        data = json.loads(text)
        return data
    except Exception as e:
        print(f"Error redactando con Gemini: {e}")
        return {
            "titulo": f"Gran Duelo: {evento['evento']} En Vivo",
            "contenido": f"No te pierdas el encuentro entre {evento['evento']} hoy a las {evento['hora']}. Síguelo por {evento['canales']}.",
            "slug": f"noticia-{evento['evento'].lower().replace(' ', '-')}"
        }

def seleccionar_imagen(deporte):
    """Selecciona una imagen representativa según el deporte"""
    imagenes = {
        "Fútbol": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80",
        "Básquetbol": "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80",
        "Béisbol": "https://images.unsplash.com/photo-1536128560176-d6652a30310d?w=800&q=80",
        "Fórmula 1": "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
        "Motorismo": "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80",
        "Tenis": "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80",
        "Fútbol Americano": "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800&q=80",
        "Combate": "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&q=80",
        "Ciclismo": "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80",
        "Otros": "https://images.unsplash.com/photo-1461896836934-2660d2cc12df?w=800&q=80"
    }
    return imagenes.get(deporte, imagenes["Otros"])

def publicar_noticia():
    partido = obtener_partido_destacado()
    if not partido:
        print("📭 No hay partidos hoy para generar noticia.")
        return
        
    print(f"🤖 Iniciando generación de noticia para: {partido['evento']}...")
    
    # 1. Agente SEO redacta
    articulo = redactar_previa_seo(partido)
    
    # 2. Selección de imagen
    imagen_url = seleccionar_imagen(partido["deporte"])
    
    # 3. Preparar payload
    # Aseguramos que el slug sea único agregando un ID aleatorio o timestamp
    slug_final = f"{articulo.get('slug', 'noticia-deportiva')}-{datetime.now().strftime('%H%M')}"
    
    nueva_noticia = {
        "titulo": articulo["titulo"],
        "slug": slug_final,
        "contenido": articulo["contenido"],
        "imagen_url": imagen_url,
        "fecha": datetime.now().strftime("%Y-%m-%d"),
        "deporte": partido["deporte"]
    }
    
    # 4. Insertar en Supabase
    try:
        if supabase:
            response = supabase.table("noticias").insert(nueva_noticia).execute()
            print(f"✅ ¡NOTICIA PUBLICADA! Título: {articulo['titulo']}")
            print(f"🔗 Slug: {slug_final}")
        else:
            print("❌ Error: No se pudo conectar a Supabase. No se publicó la noticia.")
            print(f"Dataset generado: {json.dumps(nueva_noticia, indent=2)}")
    except Exception as e:
        print(f"❌ Error al insertar en base de datos: {e}")

if __name__ == "__main__":
    publicar_noticia()

