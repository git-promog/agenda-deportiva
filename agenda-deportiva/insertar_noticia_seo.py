import os
import requests
import json
from datetime import datetime
from dotenv import load_dotenv

# Cargar variables de entorno desde .env
load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("⚠️ Faltan variables de entorno. Revisa tu archivo .env")
    exit(1)

url = f"{SUPABASE_URL}/rest/v1/noticias"
key = SUPABASE_KEY

headers = {
    "apikey": key,
    "Authorization": f"Bearer {key}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

# Borramos la noticia de prueba "Lorem Ipsum" si existe (buscamos por titulo o slug)
# Get existing news
get_resp = requests.get(url, headers=headers)
if get_resp.status_code == 200:
    for n in get_resp.json():
        if "lorem" in n.get("titulo", "").lower() or "lorem" in n.get("contenido", "").lower() or n.get("slug") == "noticia-prueba":
            del_url = f"{url}?id=eq.{n['id']}"
            requests.delete(del_url, headers=headers)

# Creamos la Nueva Noticia Profesional (SEO)
contenido_seo = """¿Estás preparado para el choque de titanes más esperado de la temporada? Este fin de semana los reflectores se centran en el Clásico Nacional, un encuentro que promete fuegos artificiales tácticos, jugadas de fantasía y noventa minutos de puro estrés cardiológico entre las Águilas y el Rebaño Sagrado.

EL ANÁLISIS DE GUIASPORTS

Ambas escuadras llegan a este partido en su mejor momento de la competencia. Con un estilo de juego vertical y sumamente agresivo, el América buscará dominar la posesión desde el primer minuto, apostando a las transiciones rápidas por las bandas. Sin embargo, Chivas domina el arte del contragolpe y cuenta con una defensa sólida preparada para frenar los embates azulcremas.

La clave táctica estará en el medio campo: el equipo que logre interrumpir los pases filtrados dictará el ritmo y las oportunidades del duelo. En el historial reciente, se han dividido victorias, dejándonos claro que en esta clase de rivalidades, las estadísticas quedan reducidas a simples números al escuchar el pitazo inicial.

ALINEACIONES PROBABLES Y BAJAS

El cuadro local respira con alivio tras la recuperación completa de su central estrella, quien pasó tres semanas de baja por molestias físicas. En contraste, el lado visitante sufre por la acumulación de tarjetas y no podrá contar con su contención principal, provocando un vacío que el técnico intentará solventar con sangre joven de la cantera.

HORARIO Y DÓNDE VERLO EN VIVO EN MÉXICO

Para que no te pierdas un solo segundo de este magistral enfrentamiento, te recordamos que en GuíaSports tenemos toda la cobertura a tu alcance.

- Día del Partido: Hoy
- Sede: Estadio Azteca / Estadio Akron
- Dónde Ver: La transmisión estará disponible en exclusiva por Canal 5, TUDN y ViX Premium. Búscalo en nuestra cartelera principal filtrando por 'Sólo TV Abierta' en la aplicación de GuíaSports.
- Minuto a Minuto: Mantente atento a nuestras alertas.

Sigue consultando la agenda más rápida y automatizada de México, ¡solo en GuíaSports!"""

noticia = {
    "titulo": "Previa Oficial: El Clásico Nacional paraliza al país ¿Por dónde verlo y a qué hora?",
    "slug": "previa-liguilla-clasico-definitivo-donde-verlo",
    "contenido": contenido_seo,
    "imagen_url": "/clasico_nacional.png",
    "fecha": datetime.now().strftime("%Y-%m-%d")
}

response = requests.post(url, headers=headers, json=noticia)

if response.status_code in [200, 201]:
    print("¡Noticia SEO insertada con éxito!")
    print(response.json())
else:
    print(f"Error: {response.status_code} - {response.text}")
