import requests
from bs4 import BeautifulSoup

url = "https://www.futbolenvivomexico.com/"
headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'}

response = requests.get(url, headers=headers)
soup = BeautifulSoup(response.text, 'html.parser')

# Vamos a ver las primeras 10 filas de cualquier tabla
filas = soup.find_all('tr')
print(f"Se encontraron {len(filas)} filas en total.\n")

for i, fila in enumerate(filas[:15]):
    clases = fila.get('class', 'Sin Clase')
    texto = fila.get_text(strip=True)[:50] # Solo los primeros 50 caracteres
    print(f"Fila {i}: Clase={clases} | Texto={texto}...")