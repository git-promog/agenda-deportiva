import requests
from bs4 import BeautifulSoup
from datetime import datetime
import re

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
        
        filas = soup.find_all('tr')
        print(f"Analizando {len(filas)} filas...")

        for fila in filas:
            clases = fila.get('class', [])
            
            # Cambio de fecha
            if 'cabeceraTabla' in clases:
                match = re.search(r'(\d{2})/(\d{2})/(\d{4})', fila.get_text())
                if match:
                    d, m, a = match.groups()
                    fecha_actual_db = f"{a}-{m}-{d}"
                continue

            # Identificar partido
            celda_local = fila.find('td', class_='local')
            celda_visitante = fila.find('td', class_='visitante')
            
            if celda_local and celda_visitante:
                # --- EXTRAER DEPORTE (Lógica mejorada) ---
                txt_deporte = "Fútbol" # Valor por defecto
                celda_detalles = fila.find('td', class_='detalles')
                
                if celda_detalles:
                    # Intento 1: Buscar en el alt/title de la imagen
                    img_dep = celda_detalles.find('img')
                    if img_dep:
                        # Obtenemos el texto y quitamos espacios extras
                        txt_deporte = (img_dep.get('title') or img_dep.get('alt') or "Fútbol").strip()
                    
                    # Intento 2: Si el deporte sigue siendo muy genérico, 
                    # podrías buscar palabras clave en el texto (opcional)

                # --- EXTRAER COMPETICIÓN ---
                comp_label = celda_detalles.find('label') if celda_detalles else None
                competicion = comp_label.get_text(strip=True) if comp_label else "Varios"

                # --- RESTO DE DATOS ---
                celda_hora = fila.find('td', class_='hora')
                hora = celda_hora.get_text(strip=True) if celda_hora else "00:00"
                evento = f"{celda_local.get_text(strip=True)} vs {celda_visitante.get_text(strip=True)}"
                
                celda_canales = fila.find('td', class_='canales')
                canales = [li.get('title') or li.get_text(strip=True) for li in celda_canales.find_all('li')] if celda_canales else []
                if not canales and celda_canales:
                    canales = [img.get('title') or img.get('alt') for img in celda_canales.find_all('img')]

                # IMPORTANTE: El nombre de la clave debe ser exactamente 'deporte'
                # para que coincida con la columna en Supabase
                lista_eventos.append({
                    "fecha": fecha_actual_db,
                    "hora": hora,
                    "evento": evento,
                    "competicion": competicion,
                    "deporte": txt_deporte,
                    "canales": ", ".join(list(dict.fromkeys(canales))) if canales else "Por confirmar"
                })

        print(f"✅ Scraper terminó: {len(lista_eventos)} eventos encontrados.")
        if lista_eventos:
            print(f"DEBUG - Ejemplo primer deporte: {lista_eventos[0]['deporte']}")
            
        return lista_eventos
    except Exception as e:
        print(f"Error en Scraper: {e}")
        return []