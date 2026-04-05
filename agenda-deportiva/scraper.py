import requests
from bs4 import BeautifulSoup
from datetime import datetime
import re
import pytz

def extraer_deporte_limpio(celda_detalles):
    if not celda_detalles: return "Otros"
    
    # Intentamos sacar el nombre del atributo 'alt' o 'title' de la imagen, que es lo más fiable
    img = celda_detalles.find('img')
    if img:
        nombre = (img.get('alt') or img.get('title') or "").strip()
        # Normalización rápida
        if "fútbol sala" in nombre.lower() or "futsal" in nombre.lower(): return "Fútbol Sala"
        if "hockey" in nombre.lower(): return "Hockey"
        if "automovilismo" in nombre.lower() or "f1" in nombre.lower(): return "Fórmula 1"
        if "motociclismo" in nombre.lower() or "motogp" in nombre.lower(): return "Motorismo"
        if "ciclismo" in nombre.lower(): return "Ciclismo"
        if "rugby" in nombre.lower(): return "Rugby"
        if "mma" in nombre.lower() or "box" in nombre.lower(): return "Combate"
        return nombre.capitalize()
    return "Otros"

def obtener_agenda_real():
    url = "https://www.futbolenvivomexico.com/deporte"
    headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'}
    
    try:
        response = requests.get(url, headers=headers, timeout=20)
        soup = BeautifulSoup(response.text, 'html.parser')
        lista_eventos = []
        tz_mx = pytz.timezone('America/Mexico_City')
        hoy = datetime.now(tz_mx).strftime("%Y-%m-%d")
        fecha_actual_db = hoy
        
        print(f"   Fecha de hoy (filtro): {hoy}")
        
        filas = soup.find_all('tr')
        
        if not filas or len(filas) < 5:
            print("🚨 CRITICAL WARNING: No se encontraron suficientes filas '<tr/>' en el origen.")
            print("🚨 Es posible que 'futbolenvivomexico.com' haya cambiado su diseño o esté bloqueando el scraper.")

        eventos_ayer = 0
        eventos_hoy = 0
        eventos_futuro = 0

        for fila in filas:
            clases = fila.get('class', [])
            
            # 1. Cambio de fecha
            if 'cabeceraTabla' in clases:
                match = re.search(r'(\d{2})/(\d{2})/(\d{4})', fila.get_text())
                if match:
                    d, m, a = match.groups()
                    fecha_actual_db = f"{a}-{m}-{d}"
                continue

            # 2. Identificar el nombre del evento (SOPORTE MULTIDEPORTE)
            local = fila.find('td', class_='local')
            visitante = fila.find('td', class_='visitante')
            partido_gen = fila.find('td', class_='partido') # Para F1/Ciclismo
            
            evento = ""
            if local and visitante:
                evento = f"{local.get_text(strip=True)} vs {visitante.get_text(strip=True)}"
            elif partido_gen:
                evento = partido_gen.get_text(strip=True)
            else:
                # Si no tiene esas clases, buscamos la segunda celda de la fila
                tds = fila.find_all('td')
                if len(tds) >= 3:
                    evento = tds[1].get_text(strip=True)

            # Filtrar estrictamente: solo eventos de hoy o futuros
            if evento and len(evento) > 3:
                if fecha_actual_db < hoy:
                    eventos_ayer += 1
                    continue  # Saltar eventos de días anteriores
                if fecha_actual_db == hoy:
                    eventos_hoy += 1
                else:
                    eventos_futuro += 1
                    
                celda_hora = fila.find('td', class_='hora')
                celda_detalles = fila.find('td', class_='detalles')
                celda_canales = fila.find('td', class_='canales')

                # Extraer deporte y liga
                deporte_final = extraer_deporte_limpio(celda_detalles)
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
                    "hora": celda_hora.get_text(strip=True) if celda_hora else "--:--",
                    "evento": evento,
                    "competicion": competicion,
                    "deporte": deporte_final,
                    "canales": canales_final if canales_final else "Por confirmar"
                })

        print(f"   Eventos filtrados: {eventos_hoy} hoy, {eventos_futuro} futuros, {eventos_ayer} de ayer descartados")
        return lista_eventos
    except Exception as e:
        print(f"Error: {e}")
        return []