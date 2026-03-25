import requests
from bs4 import BeautifulSoup
from datetime import datetime
import re

def obtener_agenda_real():
    url = "https://www.futbolenvivomexico.com/deporte"
    headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'}
    
    try:
        response = requests.get(url, headers=headers, timeout=20)
        soup = BeautifulSoup(response.text, 'html.parser')
        lista_eventos = []
        fecha_actual_db = datetime.now().strftime("%Y-%m-%d")
        
        filas = soup.find_all('tr')
        print(f"Analizando {len(filas)} filas...")

        for fila in filas:
            clases = fila.get('class', [])
            
            if 'cabeceraTabla' in clases:
                match = re.search(r'(\d{2})/(\d{2})/(\d{4})', fila.get_text())
                if match:
                    d, m, a = match.groups()
                    fecha_actual_db = f"{a}-{m}-{d}"
                continue

            # EXTRAER DATOS
            celda_detalles = fila.find('td', class_='detalles')
            celda_local = fila.find('td', class_='local')
            celda_visitante = fila.find('td', class_='visitante')
            celda_hora = fila.find('td', class_='hora')
            celda_canales = fila.find('td', class_='canales')

            if celda_local and celda_visitante:
                # 1. Extraer DEPORTE real desde la imagen
                txt_deporte = "Fútbol" # Por defecto
                if celda_detalles:
                    img_dep = celda_detalles.find('img')
                    if img_dep:
                        txt_deporte = img_dep.get('title') or img_dep.get('alt') or "Fútbol"

                # 2. Extraer Competición (nombre de la liga)
                # Buscamos el label dentro de detalles
                comp_label = celda_detalles.find('label') if celda_detalles else None
                competicion = comp_label.get_text(strip=True) if comp_label else "Varios"

                # 3. Resto de datos
                hora = celda_hora.get_text(strip=True) if celda_hora else "--:--"
                evento = f"{celda_local.get_text(strip=True)} vs {celda_visitante.get_text(strip=True)}"
                
                # Canales
                canales = [li.get('title') or li.get_text(strip=True) for li in celda_canales.find_all('li')] if celda_canales else []
                if not canales and celda_canales:
                    canales = [img.get('title') or img.get('alt') for img in celda_canales.find_all('img')]
                
                lista_eventos.append({
                    "fecha": fecha_actual_db,
                    "hora": hora,
                    "evento": evento,
                    "competicion": competicion,
                    "deporte": txt_deporte, # <-- NUEVA COLUMNA
                    "canales": ", ".join(list(dict.fromkeys(canales))) if canales else "Por confirmar"
                })

        return lista_eventos
    except Exception as e:
        print(f"Error: {e}")
        return []