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

# 1. Traer TODAS las noticias
get_resp = requests.get(url, headers=headers)
if get_resp.status_code == 200:
    todas = get_resp.json()
    # 2. Borrar todas para limpiar el error de ".maybeSingle()" duplicado
    for n in todas:
        del_url = f"{url}?id=eq.{n['id']}"
        requests.delete(del_url, headers=headers)
        print(f"Borrando ID: {n['id']}")

# 3. Insertar SOLO 1 artículo para el América vs Chivas
contenido_seo_1 = """¿Estás preparado para el choque de titanes más esperado de la temporada? Este fin de semana los reflectores se centran en el Clásico Nacional, un encuentro que promete fuegos artificiales tácticos, jugadas de fantasía y noventa minutos de puro estrés cardiológico entre las Águilas y el Rebaño Sagrado.

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

# 4. Insertar otro artículo para rellenar la segunda tarjeta (ej. Champions)
contenido_seo_2 = """La UEFA Champions League regresa con una jornada épica que definirá el rumbo de los equipos hacia Madrid. Los ojos de Europa entera están fijos en este partidazo internacional, digno de una final anticipada.

EL ANÁLISIS DE GUIASPORTS

Los gigantes europeos miden fuerzas. El equipo local intentará aprovechar la localía presionando alto desde la salida, una estrategia que les ha rendido frutos aplastantes durante la fase de grupos. Por otro lado, la escuadra visitante sabe sufrir y jugar con marcador corto, basando todo su esquema en el talento desequilibrante de su estrella mundial.

QUÉ ESPERAR DE ESTE ENCUENTRO

- Un medio campo trabado en los primeros 20 minutos.
- Destellos de velocidad por los extremos.
- La experiencia y la mística europea pesando más que nunca en los instantes finales del segundo tiempo.

DÓNDE Y CÓMO VERLO EN MÉXICO

- Día del Partido: Hoy
- Transmisión en México: Max / TNT Sports (Streaming Premium).
- Revisa las alertas de GuíaSports para conocer variaciones de última hora.

La Orejona está un paso más cerca. ¡Que ruede el balón!"""

noticia_1 = {
    "titulo": "Previa Oficial: El Clásico Nacional paraliza al país ¿Por dónde verlo y a qué hora?",
    "slug": "clasico-nacional-previa-oficial-donde-verlo",
    "contenido": contenido_seo_1,
    "imagen_url": "/clasico_nacional.png",
    "fecha": datetime.now().strftime("%Y-%m-%d")
}

noticia_2 = {
    "titulo": "Noches Mágicas: Vuelve la Champions con un duelo a muerte en Cuartos de Final",
    "slug": "champions-league-cuartos-de-final-previo",
    "contenido": contenido_seo_2,
    "imagen_url": "/noticia_ia_preview.png",
    "fecha": datetime.now().strftime("%Y-%m-%d")
}

resp_1 = requests.post(url, headers=headers, json=noticia_1)
resp_2 = requests.post(url, headers=headers, json=noticia_2)

print("Status 1:", resp_1.status_code)
print("Status 2:", resp_2.status_code)
