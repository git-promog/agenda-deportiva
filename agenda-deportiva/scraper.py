import requests
from bs4 import BeautifulSoup
from datetime import datetime
import re

def extraer_deporte_de_url(img_tag):
    if not img_tag: return "Fútbol"
    # El usuario detectó que 'alt-img' contiene la clave del deporte
    url = img_tag.get('alt-img') or img_tag.get('src') or ""
    if not url: return "Fútbol"

    try:
        # Extraemos lo que hay después del último guion y antes del punto
        # Ejemplo: .../20200729125932-rugby.png -> rugby
        clave = url.split('-')[-1].split('.')[0].lower()
        
        # Mapeo de nombres de archivo a categorías de GuíaSports
        mapeo = {
            "futbol": "Fútbol",
            "baloncesto": "Básquetbol",
            "beisbol": "Béisbol",
            "automovilismo": "Fórmula 1",
            "motociclismo": "Motorismo",
            "ciclismo": "Ciclismo",
            "rugby": "Rugby",
            "mma": "Combate",
            "boxeo": "Combate",
            "tenis": "Tenis",
            "golf": "Golf",
            "voleibol": "Voleibol",
            "natacion": "Natación",
            "balonmano": "Otros",
            "futbol-sala": "Fútbol Sala"
        }
        return mapeo.get(clave, clave.capitalize())
    except:
        return "Fútbol"

def obtener_agenda_real():
    url = "https://www.futbolenvivomexico.com/deporte"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=20)
        soup = BeautifulSoup(response.text, 'html.parser')
        lista_eventos = []
        fecha_actual_db = datetime.now().strftime("%Y-%m-%d")
        
        # Buscamos TODAS las filas de la tabla
        filas = soup.find_all('tr')
        print(f"Analizando {len(filas)} filas...")

        for fila in filas:
            clases = fila.get('class', [])
            
            # 1. Detectar Fecha
            if 'cabeceraTabla' in clases:
                match = re.search(r'(\d{2})/(\d{2})/(\d{4})', fila.get_text())
                if match:
                    d, m, a = match.groups()
                    fecha_actual_db = f"{a}-{m}-{d}"
                continue

            # 2. Intentar extraer datos (sin importar la clase de la fila)
            tds = fila.find_all('td')
            
            # Una fila válida debe tener al menos la hora y los equipos
            # El sitio usa celdas con clases 'local' y 'visitante'
            celda_local = fila.find('td', class_='local')
            celda_visitante = fila.find('td', class_='visitante')
            celda_hora = fila.find('td', class_='hora')
            celda_detalles = fila.find('td', class_='detalles')
            celda_canales = fila.find('td', class_='canales')

            if celda_local and celda_visitante and celda_hora:
                # EXTRAER DEPORTE DESDE EL NOMBRE DE LA IMAGEN (Tu descubrimiento)
                img_deporte = celda_detalles.find('img') if celda_detalles else None
                deporte_final = extraer_deporte_de_url(img_deporte)

                hora = celda_hora.get_text(strip=True)
                local = celda_local.get_text(strip=True)
                visitante = celda_visitante.get_text(strip=True)
                evento = f"{local} vs {visitante}"
                
                # Competición
                label = celda_detalles.find('label') if celda_detalles else None
                competicion = label.get_text(strip=True) if label else "Varios"

                # Canales
                canales_list = []
                if celda_canales:
                    for li in celda_canales.find_all('li'):
                        canales_list.append(li.get('title') or li.get_text(strip=True))
                    if not canales_list:
                        for img in celda_canales.find_all('img'):
                            canales_list.append(img.get('title') or img.get('alt'))
                
                canales_final = ", ".join(list(dict.fromkeys(filter(None, canales_list))))

                lista_eventos.append({
                    "fecha": fecha_actual_db,
                    "hora": hora,
                    "evento": evento,
                    "competicion": competicion,
                    "deporte": deporte_final,
                    "canales": canales_final if canales_final else "Por confirmar"
                })

        return lista_eventos
    except Exception as e:
        print(f"Error: {e}")
        return []