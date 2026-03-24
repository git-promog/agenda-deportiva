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
        competicion_actual = "Deportes"
        # Fecha por defecto por si acaso (hoy)
        fecha_actual_db = datetime.now().strftime("%Y-%m-%d")
        
        filas = soup.find_all('tr')
        print(f"Analizando {len(filas)} filas...")

        for fila in filas:
            clases_fila = fila.get('class', [])
            
            # --- 1. DETECTAR CAMBIO DE FECHA (Fila azul con la fecha) ---
            if 'cabeceraTabla' in clases_fila:
                texto_fecha = fila.get_text(strip=True)
                # Buscamos algo como "24/03/2026" usando una expresión regular
                match = re.search(r'(\d{2})/(\d{2})/(\d{4})', texto_fecha)
                if match:
                    dia, mes, anio = match.groups()
                    fecha_actual_db = f"{anio}-{mes}-{dia}" # Formato YYYY-MM-DD
                    print(f"Cambiando a fecha: {fecha_actual_db}")
                continue

            # --- 2. DETECTAR CABECERA DE COMPETICIÓN ---
            if 'cabeceraCompericion' in clases_fila or 'cabeceraCompeticion' in clases_fila:
                competicion_actual = fila.get_text(strip=True)
                continue

            # --- 3. EXTRAER DATOS DEL PARTIDO ---
            celda_local = fila.find('td', class_='local')
            celda_visitante = fila.find('td', class_='visitante')
            celda_hora = fila.find('td', class_='hora')
            celda_canales = fila.find('td', class_='canales')

            if celda_local and celda_visitante:
                hora = celda_hora.get_text(strip=True) if celda_hora else "N/A"
                local = celda_local.get_text(strip=True)
                visitante = celda_visitante.get_text(strip=True)
                evento = f"{local} vs {visitante}"

                # Canales
                nombres_canales = []
                if celda_canales:
                    items = celda_canales.find_all('li')
                    for li in items:
                        canal = li.get('title') or li.get_text(strip=True)
                        if canal: nombres_canales.append(canal)
                    
                    if not nombres_canales:
                        for img in celda_canales.find_all('img'):
                            canal = img.get('title') or img.get('alt')
                            if canal: nombres_canales.append(canal)

                canales_final = ", ".join(list(dict.fromkeys(nombres_canales)))

                # Liga
                celda_detalles = fila.find('td', class_='detalles')
                competicion = competicion_actual
                if celda_detalles:
                    competicion = celda_detalles.get_text(strip=True)

                lista_eventos.append({
                    "fecha": fecha_actual_db, # Usamos la fecha detectada arriba
                    "hora": hora,
                    "evento": evento,
                    "competicion": competicion,
                    "canales": canales_final if canales_final else "Por confirmar"
                })

        return lista_eventos

    except Exception as e:
        print(f"Error en el scraper: {e}")
        return []

if __name__ == "__main__":
    res = obtener_agenda_real()
    if res:
        print(f"✅ Se encontraron {len(res)} eventos.")
        # Verificamos uno del final para ver si cambió la fecha
        print(f"Último evento: {res[-1]['fecha']} - {res[-1]['evento']}")