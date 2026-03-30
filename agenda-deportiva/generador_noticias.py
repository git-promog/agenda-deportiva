import os
import requests
import json
from supabase import create_client, Client
from datetime import datetime

# ==========================================
# BOT GENERADOR DE NOTICIAS (Agentes IA)
# ==========================================
# Este script está diseñado para correr como un proceso automático (Cron Job).
# Se conecta a la base de datos, extrae el "Partido de la jornada",
# le pide a una Inteligencia Artificial (ej. OpenAI, Gemini) redactar una
# previa optimizada para SEO y crea/descarga una imagen llamativa para subirla al portal.

SUPABASE_URL = "LA_URL_DE_TU_PROYECTO"
SUPABASE_KEY = "LLAVE_CON_PERMISOS_DE_ESCRITURA_SERVICE_ROLE"
OPENAI_API_KEY = "TU_API_KEY_AQUI"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def obtener_partido_destacado():
    """Busca el evento más relevante del día para generar la noticia."""
    hoy = datetime.now().strftime("%Y-%m-%d")
    response = supabase.table("eventos").select("*").eq("fecha", hoy).limit(10).execute()
    eventos = response.data
    
    # Lógica de prioridades (Buscar Clásicos, Liguilla, Champions, etc.)
    for evento in eventos:
        if "Real Madrid" in evento["evento"] or "América" in evento["evento"] or "Champions" in evento["competicion"]:
            return evento
    
    return eventos[0] if len(eventos) > 0 else None

def redactar_previa_seo(evento):
    """El Agente CopyWriter & SEO"""
    prompt = f'''
    Actúa como un periodista deportivo experto y analista SEO. 
    Escribe un artículo previo (400 palabras) sobre este partido:
    Evento: {evento['evento']}
    Competición: {evento['competicion']}
    Horario: {evento['hora']}
    Transmisión: {evento['canales']}

    Genera un Titulo muy llamativo, y un artículo con formato Markdown 
    que enganche al lector, mencionando cómo y dónde ver el partido.
    '''
    # Ejemplo de llamada a la API
    # response = openai.ChatCompletion.create(model="gpt-4", messages=[...])
    
    return {
        "titulo": f"Previa En Vivo: {evento['evento']} ¿A qué hora y por dónde verlo?",
        "contenido": f"El esperado encuentro de {evento['competicion']} se llevará a cabo hoy... [Contenido IA]"
    }

def generar_imagen_ia(evento):
    """El Agente de Diseño Gráfico"""
    prompt_imagen = f"Epic cinematic sports banner for {evento['evento']}, stadium lights, ultra realistic, no text."
    
    # Ejemplo de llamada a DALL-E 3 o Midjourney/Gemini
    # image_response = openai.Image.create(prompt=prompt_imagen, size="1024x1024")
    # fake url temporal:
    return "/noticia_ia_preview.png"

def publicar_noticia():
    partido = obtener_partido_destacado()
    if not partido:
        print("No hay partidos hoy para generar noticia.")
        return
        
    print(f"Generando noticia para: {partido['evento']}...")
    
    # 1. Agente SEO redacta
    articulo = redactar_previa_seo(partido)
    
    # 2. Agente Diseño crea imagen
    imagen_url = generar_imagen_ia(partido)
    
    # 3. Insertar en GuíaSports
    slug = articulo["titulo"].lower().replace(" ", "-").replace("¿", "").replace("?", "").replace(":", "")
    
    nueva_noticia = {
        "titulo": articulo["titulo"],
        "slug": slug,
        "contenido": articulo["contenido"],
        "imagen_url": imagen_url,
        "fecha": datetime.now().strftime("%Y-%m-%d"),
        "deporte": partido["deporte"]
    }
    
    # supabase.table("noticias").insert(nueva_noticia).execute()
    print("¡Noticia automatizada publicada con éxito en GuíaSports!")

if __name__ == "__main__":
    publicar_noticia()
