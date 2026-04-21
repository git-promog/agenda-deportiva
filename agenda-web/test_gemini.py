import os
import requests
import json

URL = "http://localhost:3000/api/noticias/generar"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer guiasports-secret-2024"
}

data = {
    "evento": "América vs Cruz Azul",
    "instrucciones": "",
    "metadatos": {
        "competicion": "Liga MX",
        "hora": "20:00",
        "canales": "TUDN",
        "fecha": "2024-06-20",
        "deporte": "Fútbol"
    }
}

try:
    print("Testing locally generated API...")
    res = requests.post(URL, headers=headers, data=json.dumps(data))
    print(f"Status Code: {res.status_code}")
    print(res.text)
except Exception as e:
    print("Failed to reach localhost:3000. Is next dev running?")
    import google.generativeai as genai
    from dotenv import load_dotenv
    load_dotenv('.env.local')
    
    print("\nTesting Gemini API directly...")
    try:
        genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))
        model = genai.GenerativeModel("gemini-2.0-flash")
        result = model.generate_content("Dime hola.")
        print(result.text)
    except Exception as e2:
        print("Gemini API error:", str(e2))
