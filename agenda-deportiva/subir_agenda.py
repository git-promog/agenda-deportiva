import os
import requests
import json
import google.generativeai as genai
from supabase import create_client, Client
from scraper import obtener_agenda_real, sanitizar_canal
from datetime import datetime
import pytz
from dotenv import load_dotenv

# Cargar variables de entorno desde .env
load_dotenv()

# --- CONFIGURACIÓN ---
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

# Criterios de Relevancia Estática (Rápida)
TOP_TEAMS = ["América", "Chivas", "Cruz Azul", "Pumas", "Real Madrid", "Barcelona", "Manchester City", "Liverpool", "México", "Selección"]
TOP_COMPETICIONES = ["Liga MX", "Champions League", "Premier League", "LaLiga", "Fórmula 1", "NBA", "MLB", "NFL", "Copa del Mundo", "Liguilla"]

if not SUPABASE_URL or not SUPABASE_KEY:
    print("⚠️ Faltan variables de entorno. Revisa tu archivo .env")
    exit(1)

def normalizar_evento_key(evento, fecha, competicion=None):
    """Normaliza la clave de evento para matching resiliente."""
    e = " ".join((evento or "").strip().lower().split())
    f = (fecha or "").strip()
    if competicion:
        c = " ".join((competicion or "").strip().lower().split())
        return f"{e}||{f}||{c}"
    return f"{e}||{f}"

def identificar_destacados_ia(eventos_hoy):
    """Usa Gemini para identificar los eventos más relevantes del día de forma masiva."""
    if not GEMINI_API_KEY or not eventos_hoy:
        return []

    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-2.0-flash')

    # Preparamos la lista simplificada para la IA
    lista_ia = [{"id": i, "evento": e['evento'], "competicion": e['competicion']} for i, e in enumerate(eventos_hoy)]

    prompt = f"""
    Eres un experto analista deportivo en México. De la siguiente lista de eventos, selecciona los 8 más importantes para la audiencia mexicana hoy.
    Considera rivalidades, importancia de la liga y popularidad de los equipos.

    LISTA: {json.dumps(lista_ia)}

    Responde estrictamente un JSON con los índices (ID) de los eventos seleccionados:
    [0, 3, 5, ...]
    """

    try:
        response = model.generate_content(prompt)
        text = response.text.replace("```json", "").replace("```", "").strip()
        indices = json.loads(text)
        return indices
    except Exception as e:
        print(f"   ⚠️ Error en IA de Relevancia: {e}")
        return []

def actualizar_base_de_datos():
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

        tz_mx = pytz.timezone('America/Mexico_City')
        hoy_mx = datetime.now(tz_mx).strftime("%Y-%m-%d")

        print(f"1. Iniciando el Scraper (Fecha Hoy: {hoy_mx})...")
        datos_scraper = obtener_agenda_real()

        if not datos_scraper:
            print("❌ Error: No se obtuvieron datos del scraper.")
            return

        print(f"2. Se encontraron {len(datos_scraper)} eventos raspados. Consultando DB activa...")

        # 1. Obtener eventos de la DB desde hoy hacia adelante (solo ventana activa)
        # Esto evita el límite de 1000 filas de PostgREST sobre eventos históricos pasados
        respuesta = supabase.table("eventos").select("*").gte("fecha", hoy_mx).order("id", desc=False).execute()
        db_rows = respuesta.data or []

        # Agrupar eventos existentes por clave para detectar duplicados previos y conservar el principal
        eventos_existentes_por_key = {}
        ids_duplicados_a_eliminar = []
        fechas_con_ajuste_manual = set()

        for ev in db_rows:
            if ev.get('ajuste_manual'):
                fechas_con_ajuste_manual.add(ev.get('fecha'))

            key_exacta = normalizar_evento_key(ev.get('evento'), ev.get('fecha'), ev.get('competicion'))
            key_fallback = normalizar_evento_key(ev.get('evento'), ev.get('fecha'))

            # Si ya tenemos un registro para este mismo evento y fecha en la DB, marcamos el duplicado para limpieza
            if key_exacta in eventos_existentes_por_key:
                existente_previo = eventos_existentes_por_key[key_exacta]
                if ev.get('ajuste_manual') and not existente_previo.get('ajuste_manual'):
                    ids_duplicados_a_eliminar.append(existente_previo['id'])
                    eventos_existentes_por_key[key_exacta] = ev
                    eventos_existentes_por_key[key_fallback] = ev
                else:
                    ids_duplicados_a_eliminar.append(ev['id'])
            else:
                eventos_existentes_por_key[key_exacta] = ev
                if key_fallback not in eventos_existentes_por_key:
                    eventos_existentes_por_key[key_fallback] = ev

        if ids_duplicados_a_eliminar:
            print(f"   ℹ️ Detectadas {len(ids_duplicados_a_eliminar)} filas duplicadas previas en la DB para limpieza.")

        if fechas_con_ajuste_manual:
            print(f"   ℹ️ Detectados ajustes manuales en fechas: {', '.join(sorted(list(fechas_con_ajuste_manual)))}. La IA se deshabilitará para estos días.")

        # 2. Deduplicar eventos dentro del propio scraper combinando canales
        eventos_dedup = {}
        for ev in datos_scraper:
            key = normalizar_evento_key(ev.get('evento'), ev.get('fecha'), ev.get('competicion'))
            if key in eventos_dedup:
                c1 = eventos_dedup[key].get('canales', '') or ''
                c2 = ev.get('canales', '') or ''
                canales_combinados = ", ".join(list(dict.fromkeys(filter(None, [c.strip() for c in (c1 + "," + c2).split(",")]))))
                eventos_dedup[key]['canales'] = canales_combinados
            else:
                eventos_dedup[key] = dict(ev)

        eventos_finales = []
        eventos_para_ia = []

        for ev in eventos_dedup.values():
            key_exacta = normalizar_evento_key(ev['evento'], ev['fecha'], ev['competicion'])
            key_fallback = normalizar_evento_key(ev['evento'], ev['fecha'])

            existente = eventos_existentes_por_key.get(key_exacta) or eventos_existentes_por_key.get(key_fallback)

            # Valores por defecto (Modo Auto)
            ev['destacado'] = None
            ev['destacado_dia'] = False
            ev['estelar_dia'] = False
            ev['destacado_finde'] = False
            ev['carrusel_ig'] = False
            ev['ajuste_manual'] = False

            # Si ya existía, preservamos su configuración editorial
            if existente:
                ev['destacado'] = existente.get('destacado')
                ev['destacado_dia'] = existente.get('destacado_dia', False)
                ev['estelar_dia'] = existente.get('estelar_dia', False)
                ev['destacado_finde'] = existente.get('destacado_finde', False)
                ev['carrusel_ig'] = existente.get('carrusel_ig', False)
                ev['ajuste_manual'] = existente.get('ajuste_manual', False)

                # Si es un ajuste manual total, no sobrescribir datos editoriales
                if ev['ajuste_manual']:
                    ev.update({k: v for k, v in existente.items() if k != 'id'})

            # Motor de Relevancia Inteligente
            if ev['destacado'] is None:
                if ev['fecha'] in fechas_con_ajuste_manual:
                    ev['destacado'] = False
                else:
                    nombre_low = ev['evento'].lower()
                    comp_low = ev['competicion'].lower()

                    if any(t.lower() in nombre_low for t in TOP_TEAMS) or \
                       any(c.lower() in comp_low for c in TOP_COMPETICIONES) or \
                       any(tv.lower() in ev['canales'].lower() for tv in ["Canal 5", "Azteca 7", "TUDN"]):
                        ev['destacado'] = True

                    if ev['destacado'] is None and ev['fecha'] == hoy_mx:
                        eventos_para_ia.append(ev)

            eventos_finales.append(ev)

        # Relevancia basada en IA
        if eventos_para_ia:
            print(f"   🤖 Consultando IA para {len(eventos_para_ia)} eventos ambiguos de hoy...")
            indices_top = identificar_destacados_ia(eventos_para_ia)
            for idx in indices_top:
                if 0 <= idx < len(eventos_para_ia):
                    eventos_para_ia[idx]['destacado'] = True
                    print(f"      ✨ IA destacó: {eventos_para_ia[idx]['evento']}")

        # 3. Clasificación exacta entre Insertar y Actualizar
        print(f"3. Sincronizando {len(eventos_finales)} eventos con la DB...")

        columnas = ['fecha', 'hora', 'evento', 'competicion', 'deporte', 'canales',
                    'destacado', 'destacado_dia', 'estelar_dia', 'destacado_finde',
                    'carrusel_ig', 'ajuste_manual']

        datos_actualizar = []  # filas con 'id': actualizan en sitio conservando IDs y URLs
        datos_insertar = []    # filas sin 'id': se insertan como nuevas
        untouched_manuales = 0

        for ev in eventos_finales:
            key_exacta = normalizar_evento_key(ev['evento'], ev['fecha'], ev['competicion'])
            key_fallback = normalizar_evento_key(ev['evento'], ev['fecha'])
            existente = eventos_existentes_por_key.get(key_exacta) or eventos_existentes_por_key.get(key_fallback)

            if existente and existente.get('ajuste_manual'):
                untouched_manuales += 1
                continue

            filtrado = {k: v for k, v in ev.items() if k in columnas}

            if filtrado.get('canales'):
                canales_limpios = [sanitizar_canal(c.strip()) for c in filtrado['canales'].split(",")]
                filtrado['canales'] = ", ".join(list(dict.fromkeys(filter(None, canales_limpios))))

            if existente:
                filtrado['id'] = existente['id']
                datos_actualizar.append(filtrado)
            else:
                datos_insertar.append(filtrado)

        # Unicidad estricta en datos_actualizar por 'id'
        dict_actualizar = {}
        for d in datos_actualizar:
            dict_actualizar[d['id']] = d
        datos_actualizar = list(dict_actualizar.values())

        # Unicidad estricta en datos_insertar por clave normalizada
        dict_insertar = {}
        for d in datos_insertar:
            k = normalizar_evento_key(d['evento'], d['fecha'], d['competicion'])
            dict_insertar[k] = d
        datos_insertar = list(dict_insertar.values())

        # Ejecutar inserciones de nuevos eventos
        if datos_insertar:
            for i in range(0, len(datos_insertar), 100):
                supabase.table("eventos").insert(datos_insertar[i:i+100]).execute()

        # Ejecutar actualizaciones en sitio
        if datos_actualizar:
            for i in range(0, len(datos_actualizar), 100):
                supabase.table("eventos").upsert(datos_actualizar[i:i+100], on_conflict="id").execute()

        # Limpiar filas duplicadas previas en la DB
        if ids_duplicados_a_eliminar:
            print(f"🧹 Limpiando {len(ids_duplicados_a_eliminar)} filas duplicadas de ejecuciones anteriores...")
            for i in range(0, len(ids_duplicados_a_eliminar), 100):
                supabase.table("eventos").delete().in_("id", ids_duplicados_a_eliminar[i:i+100]).execute()

        print(f"✅ Sincronización completada: {len(datos_insertar)} insertados, {len(datos_actualizar)} actualizados, {len(ids_duplicados_a_eliminar)} duplicados eliminados, {untouched_manuales} manuales intactos.")

        # 4. Actualizar Status
        tz_mx = pytz.timezone('America/Mexico_City')
        ahora_mx = datetime.now(tz_mx).strftime("%d/%m/%Y %I:%M %p")
        try:
            supabase.table("status").upsert(
                {"nombre": "ultima_actualizacion", "valor": f"ACTUALIZADO - {ahora_mx}"},
                on_conflict="nombre"
            ).execute()
        except Exception:
            supabase.table("status").delete().eq("nombre", "ultima_actualizacion").execute()
            supabase.table("status").insert({"nombre": "ultima_actualizacion", "valor": f"ACTUALIZADO - {ahora_mx}"}).execute()

        print(f"🚀 Sincronización Finalizada: {ahora_mx}")

    except Exception as e:
        print(f"❌ Error general: {e}")
        raise e

if __name__ == "__main__":
    actualizar_base_de_datos()