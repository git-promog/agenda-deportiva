# Auditoria Confirmada: Hub Liga MX + Datos Oficiales

Fecha de auditoria: 2026-07-21  
Proyecto: `/Users/iturralde/pgweb/proyecto-agenda-final`  
Objetivo: conectar informacion oficial de Liga MX al Hub Liga MX sin afectar el sistema actual de scraping que alimenta eventos, horarios y canales.

## 1. Resumen ejecutivo

El proyecto ya tiene una arquitectura separada en dos areas:

- `agenda-deportiva`: scripts Python para obtener agenda deportiva, cargar eventos en Supabase y generar noticias.
- `agenda-web`: aplicacion Next.js que consume Supabase, muestra hubs, paginas SEO, noticias, eventos y Mundial 2026.

La integracion recomendada para Liga MX debe ser una capa nueva y aislada:

- No modificar el scraper actual.
- No cambiar el ciclo de carga de la tabla `eventos`.
- No usar la web oficial de Liga MX para canales de transmision.
- Usar Liga MX oficial solo para datos complementarios: tabla general, resultados oficiales, estado de partido, goleo, estadisticas, jornada y fase.
- Renderizar esos datos en `/futbol/liga-mx`, preservando como prioridad los eventos/canales existentes.

La estrategia mas segura es crear un bot nuevo: `agenda-web/scripts/sync-ligamx.mjs`, un workflow nuevo: `.github/workflows/sync_ligamx.yml`, y tablas nuevas en Supabase bajo prefijo `ligamx_*`.

## 2. Hallazgos confirmados del sistema actual

### 2.1 Scraper principal

Archivo: `agenda-deportiva/scraper.py`

Hallazgos:

- La fuente actual de eventos es `https://www.futbolenvivomexico.com/deporte`.
- La funcion principal es `obtener_agenda_real()`.
- Extrae:
  - `fecha`
  - `hora`
  - `evento`
  - `competicion`
  - `deporte`
  - `canales`
- La limpieza de canales esta concentrada en `sanitizar_canal()`.
- El scraper filtra eventos pasados y solo conserva hoy/futuro.

Lineas relevantes:

- Fuente del scraper: `agenda-deportiva/scraper.py:58-60`
- Extraccion de local/visitante/evento: `agenda-deportiva/scraper.py:106-121`
- Extraccion de deporte/competicion: `agenda-deportiva/scraper.py:136-140`
- Extraccion y sanitizacion de canales: `agenda-deportiva/scraper.py:141-153`
- Payload final de evento: `agenda-deportiva/scraper.py:155-162`

Conclusion:

Este archivo no debe tocarse para la integracion Liga MX. Es la fuente principal de canales, horarios y programacion.

### 2.2 Carga de agenda en Supabase

Archivo: `agenda-deportiva/subir_agenda.py`

Hallazgos:

- Usa `SUPABASE_URL`, `SUPABASE_KEY` y opcionalmente `GEMINI_API_KEY`.
- Llama a `obtener_agenda_real()`.
- Lee todos los eventos existentes desde `eventos`.
- Preserva ciertos ajustes manuales comparando por llave:
  - `evento`
  - `fecha`
  - `competicion`
- Marca eventos manuales con `ajuste_manual`.
- Borra todos los registros de `eventos` con `delete().neq("id", 0)`.
- Inserta de nuevo todos los eventos combinados.
- Actualiza `status` con `ultima_actualizacion`.

Lineas relevantes:

- Variables de entorno: `agenda-deportiva/subir_agenda.py:14-17`
- Llamada al scraper: `agenda-deportiva/subir_agenda.py:61-66`
- Lectura total de `eventos`: `agenda-deportiva/subir_agenda.py:70-72`
- Preservacion de ajustes manuales: `agenda-deportiva/subir_agenda.py:96-109`
- Columnas consideradas para subir: `agenda-deportiva/subir_agenda.py:144-149`
- Preservacion de eventos manuales no presentes en scraper: `agenda-deportiva/subir_agenda.py:151-166`
- Borrado total de `eventos`: `agenda-deportiva/subir_agenda.py:176-181`
- Actualizacion de `status`: `agenda-deportiva/subir_agenda.py:185-189`

Conclusion critica:

La tabla `eventos` es una zona sensible. Cualquier integracion que agregue columnas o datos oficiales directamente a `eventos` corre riesgo de perderse en cada ejecucion del scraper, porque el flujo borra y reinserta registros. Por eso, Liga MX oficial debe vivir en tablas nuevas y ser consumida por lectura desde el Hub.

### 2.3 Workflow actual de agenda

Archivo: `.github/workflows/scraper_auto.yml`

Hallazgos:

- Corre cada 6 horas: `cron: '0 */6 * * *'`.
- Instala `agenda-deportiva/requirements.txt`.
- Ejecuta `python agenda-deportiva/subir_agenda.py`.
- Usa secrets:
  - `SUPABASE_URL`
  - `SUPABASE_KEY`

Lineas relevantes:

- Schedule: `.github/workflows/scraper_auto.yml:3-6`
- Instalacion Python: `.github/workflows/scraper_auto.yml:15-22`
- Ejecucion del scraper: `.github/workflows/scraper_auto.yml:24-29`

Conclusion:

No modificar este workflow. Debe seguir operando igual.

### 2.4 Bot Mundial 2026

Archivo: `agenda-web/scripts/sync-fifa.mjs`

Hallazgos:

- Consume API oficial de FIFA.
- Lee overrides manuales desde `scripts/broadcasters-overrides.json`.
- Regenera `src/data/mundialData.ts`.
- Preserva transmisiones manuales.
- Calcula grupos y standings dentro del script.

Lineas relevantes:

- URL FIFA: `agenda-web/scripts/sync-fifa.mjs:25-30`
- Lectura de overrides: `agenda-web/scripts/sync-fifa.mjs:109-116`
- Extraccion de goles/marcadores: `agenda-web/scripts/sync-fifa.mjs:143-161`
- Calculo de standings: `agenda-web/scripts/sync-fifa.mjs:164-221`
- Escritura de `mundialData.ts`: `agenda-web/scripts/sync-fifa.mjs:263-354`

Archivo: `.github/workflows/sync_fifa.yml`

Hallazgos:

- Corre cada 4 horas.
- Instala dependencias Node.
- Ejecuta `npm run sync-fifa`.
- Si cambia `mundialData.ts`, hace commit y push a `main`.

Lineas relevantes:

- Schedule: `.github/workflows/sync_fifa.yml:3-6`
- Permisos de escritura: `.github/workflows/sync_fifa.yml:11-13`
- Ejecucion: `.github/workflows/sync_fifa.yml:30-32`
- Commit automatico: `.github/workflows/sync_fifa.yml:34-43`

Conclusion:

El patron del Mundial sirve como referencia conceptual, pero no debe copiarse exactamente para Liga MX. Para Liga MX no conviene generar archivo versionado ni hacer commits frecuentes, porque los datos cambian muchas veces durante jornadas. Es mejor guardar snapshots en Supabase.

### 2.5 Hub Liga MX actual

Archivo: `agenda-web/src/app/futbol/[competicion]/page.tsx`

Hallazgos:

- Define hubs de competencia en `COMPETITION_HUBS`.
- Ya existe `liga-mx`.
- El Hub Liga MX usa:
  - `name: Liga MX`
  - `query: Liga MX`
  - title/description/intro SEO.
- Consulta Supabase con:
  - `from('eventos')`
  - `eq('deporte', 'Futbol')` en el codigo aparece como `Fútbol`
  - `ilike('competicion', %Liga MX%)`
  - `gte('fecha', hoyStr)`
  - orden por fecha/hora
  - limite 30
- Tambien consulta noticias por titulo.
- Renderiza proximos partidos con hora, evento, competencia y canales.
- Actualmente no tiene tabla general, resultados oficiales ni estadisticas.

Lineas relevantes:

- Config de `liga-mx`: `agenda-web/src/app/futbol/[competicion]/page.tsx:7-14`
- Metadata: `agenda-web/src/app/futbol/[competicion]/page.tsx:55-79`
- Cliente Supabase: `agenda-web/src/app/futbol/[competicion]/page.tsx:103-110`
- Query de eventos: `agenda-web/src/app/futbol/[competicion]/page.tsx:111-120`
- Query de noticias: `agenda-web/src/app/futbol/[competicion]/page.tsx:121-127`
- JSON-LD actual: `agenda-web/src/app/futbol/[competicion]/page.tsx:133-140`
- Render de partidos/canales: `agenda-web/src/app/futbol/[competicion]/page.tsx:161-184`

Conclusion:

Este es el archivo principal a tocar para mostrar la nueva experiencia del Hub Liga MX. Debe seguir mostrando la agenda/canales desde `eventos`.

### 2.6 Hub futbol general

Archivo: `agenda-web/src/app/futbol/page.tsx`

Hallazgos:

- Tiene `revalidate = 300`.
- Consulta todos los eventos de futbol desde `eventos`.
- Agrupa por fecha.
- Muestra eventos en vivo por calculo local de 2 horas.
- Usa metadata y JSON-LD basico.

Lineas relevantes:

- ISR: `agenda-web/src/app/futbol/page.tsx:8`
- Query `eventos`: `agenda-web/src/app/futbol/page.tsx:54-62`
- Agrupacion: `agenda-web/src/app/futbol/page.tsx:64-73`
- Render de eventos/canales: `agenda-web/src/app/futbol/page.tsx:150-184`

Conclusion:

No es necesario tocarlo en fase 1. La mejora debe enfocarse primero en `/futbol/liga-mx`.

### 2.7 Home y entrada al Hub Liga MX

Archivo: `agenda-web/src/components/HomeClient.tsx`

Hallazgos:

- El home muestra seccion `Competiciones Destacadas`.
- Ya existe link a `/futbol/liga-mx`.
- Usa logo `/images/logo_ligas/liga_mx.webp`.
- El filtro por competencias se basa en los valores de `eventos.competicion`.

Lineas relevantes:

- Hubs de competencias: `agenda-web/src/components/HomeClient.tsx:501-578`
- Link Liga MX: `agenda-web/src/components/HomeClient.tsx:523-540`
- Filtro de competiciones: `agenda-web/src/components/HomeClient.tsx:148-150`
- Eventos filtrados por competencia: `agenda-web/src/components/HomeClient.tsx:186-204`

Conclusion:

No es necesario tocar el Home para el primer lanzamiento. Ya apunta al Hub correcto.

### 2.8 Pagina detalle de evento

Archivo: `agenda-web/src/app/evento/[slug]/page.tsx`

Hallazgos:

- Consulta eventos por id extraido del slug.
- Usa solo `eventos`.
- Genera metadata SEO especifica de evento.
- Genera JSON-LD `SportsEvent`.
- Muestra fecha, hora, competicion y canales.

Lineas relevantes:

- ISR: `agenda-web/src/app/evento/[slug]/page.tsx:11`
- Query por id: `agenda-web/src/app/evento/[slug]/page.tsx:34-45`
- Metadata: `agenda-web/src/app/evento/[slug]/page.tsx:63-102`
- JSON-LD SportsEvent: `agenda-web/src/app/evento/[slug]/page.tsx:113-148`
- Bloque "Donde ver": `agenda-web/src/app/evento/[slug]/page.tsx:200-205`

Conclusion:

No tocar en fase inicial. Si se desea mostrar marcador oficial por partido, hacerlo en fase posterior mediante union read-only con tablas `ligamx_*`, nunca actualizando `eventos`.

### 2.9 Sitemap

Archivo: `agenda-web/src/app/sitemap.ts`

Hallazgos:

- Incluye hubs de competencia:
  - `liga-mx`
  - `champions-league`
  - `premier-league`
- Incluye eventos dinamicos desde `eventos` para los proximos 14 dias.
- Incluye paginas Mundial, sedes y partidos.

Lineas relevantes:

- Hubs: `agenda-web/src/app/sitemap.ts:12`
- Query de eventos para sitemap: `agenda-web/src/app/sitemap.ts:50-59`
- URLs de hubs: `agenda-web/src/app/sitemap.ts:123-128`
- URLs Mundial: `agenda-web/src/app/sitemap.ts:148-164`

Conclusion:

El Hub Liga MX ya esta en sitemap. Si se crean paginas nuevas por jornada o equipo, agregar rutas aqui en una fase SEO posterior.

### 2.10 Admin

Archivo: `agenda-web/src/app/admin/page.tsx`

Hallazgos:

- El admin usa anon key desde cliente.
- Permite leer, borrar, actualizar e insertar eventos.
- La contrasena esta hardcodeada en frontend.
- Los eventos editados se marcan con `ajuste_manual: true`.
- Permite editar `canales`, `competicion`, `hora`, `fecha`, `deporte`.

Lineas relevantes:

- Cliente Supabase anon: `agenda-web/src/app/admin/page.tsx:9-12`
- Login hardcodeado: `agenda-web/src/app/admin/page.tsx:81-84`
- Carga eventos: `agenda-web/src/app/admin/page.tsx:96-123`
- Delete de evento: `agenda-web/src/app/admin/page.tsx:144-149`
- Update destacado y ajuste manual: `agenda-web/src/app/admin/page.tsx:152-173`
- Update masivo: `agenda-web/src/app/admin/page.tsx:175-187`
- Guardar evento: `agenda-web/src/app/admin/page.tsx:200-216`
- Campos del modal: `agenda-web/src/app/admin/page.tsx:849-863`

Conclusion:

No tocar admin para Liga MX en fase 1. Si se requiere supervision de conflictos Liga MX, crear una vista nueva solo lectura en fase posterior.

## 3. Zonas sensibles que NO se deben tocar

### No tocar en fase 1

- `agenda-deportiva/scraper.py`
- `agenda-deportiva/subir_agenda.py`
- `.github/workflows/scraper_auto.yml`
- Tabla Supabase `eventos`
- Tabla Supabase `status`
- Campos:
  - `eventos.fecha`
  - `eventos.hora`
  - `eventos.evento`
  - `eventos.competicion`
  - `eventos.deporte`
  - `eventos.canales`
  - `eventos.ajuste_manual`
  - `eventos.destacado`
  - `eventos.destacado_dia`
  - `eventos.estelar_dia`
  - `eventos.destacado_finde`
  - `eventos.carrusel_ig`

### Razon

El script `subir_agenda.py` borra y reinserta la tabla `eventos`. Si se agregan campos oficiales ahi, se podrian perder en la siguiente ejecucion.

## 4. Fuentes oficiales Liga MX analizadas

URLs utiles:

- Home oficial: `https://ligamx.net/`
- Partidos: `https://ligamx.net/cancha/partidos`
- Estadistica: `https://ligamx.net/cancha/estadistica`
- Tabla de goleo: `https://ligamx.net/cancha/tablas/tablaGoleoCompleta/sp/...`
- Reglamentos: `https://ligamx.net/cancha/reglamentos`

Datos disponibles en la web oficial:

- Torneo Apertura 2026 / Temporada 2026-2027.
- Jornadas `J-1` a `J-17`.
- Fases finales `CF`, `SF`, `F`.
- Tabla General con:
  - `Pos`
  - `Club`
  - `JJ`
  - `JG`
  - `JE`
  - `JP`
  - `GF`
  - `GC`
  - `Dif`
  - `PTS`
- Desglose local/visitante.
- Tabla de goleo con:
  - jugador
  - club
  - goles
  - minutos jugados
  - anota cada
  - nacionalidad
- Estado de partidos.
- Marcadores.
- Enlaces a minuto a minuto e informe arbitral.

Advertencia:

La pagina oficial tambien muestra un bloque de transmision, pero no debe usarse como fuente de canales porque el proyecto ya obtiene mejor esa informacion desde el scraper actual.

## 5. Arquitectura recomendada para el proyecto

### 5.1 Flujo actual

```text
futbolenvivomexico.com
  -> agenda-deportiva/scraper.py
  -> agenda-deportiva/subir_agenda.py
  -> Supabase.eventos
  -> agenda-web paginas Home / Futbol / Hub Liga MX / Evento
```

### 5.2 Flujo nuevo recomendado

```text
ligamx.net
  -> agenda-web/scripts/sync-ligamx.mjs
  -> Supabase.ligamx_* tablas nuevas
  -> /futbol/liga-mx lee eventos + ligamx_*
```

### 5.3 Prioridad de fuentes

1. Canales, horarios y agenda: `eventos` desde scraper actual.
2. Correcciones editoriales: admin/manual.
3. Tabla, resultados y estadisticas: `ligamx_*`.
4. La fuente Liga MX oficial nunca debe escribir en `eventos`.

## 6. Modelo de datos propuesto en Supabase

Crear tablas nuevas:

```sql
create table if not exists ligamx_sync_runs (
  id bigserial primary key,
  source text not null default 'ligamx.net',
  tournament_slug text not null,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  status text not null default 'running',
  fetched_url text,
  http_status int,
  content_hash text,
  rows_standings int default 0,
  rows_scorers int default 0,
  rows_matches int default 0,
  error_message text
);

create table if not exists ligamx_team_aliases (
  id bigserial primary key,
  canonical_name text not null,
  official_name text not null,
  internal_name text,
  slug text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists ligamx_standings_latest (
  tournament_slug text not null,
  team_slug text not null,
  position int not null,
  team_name text not null,
  played int not null default 0,
  won int not null default 0,
  drawn int not null default 0,
  lost int not null default 0,
  goals_for int not null default 0,
  goals_against int not null default 0,
  goal_difference int not null default 0,
  points int not null default 0,
  home_played int default 0,
  home_won int default 0,
  home_drawn int default 0,
  home_lost int default 0,
  home_goals_for int default 0,
  home_goals_against int default 0,
  home_goal_difference int default 0,
  home_points int default 0,
  away_played int default 0,
  away_won int default 0,
  away_drawn int default 0,
  away_lost int default 0,
  away_goals_for int default 0,
  away_goals_against int default 0,
  away_goal_difference int default 0,
  away_points int default 0,
  source_url text,
  synced_at timestamptz not null default now(),
  primary key (tournament_slug, team_slug)
);

create table if not exists ligamx_standings_snapshots (
  id bigserial primary key,
  run_id bigint references ligamx_sync_runs(id),
  tournament_slug text not null,
  team_slug text not null,
  position int not null,
  team_name text not null,
  played int not null default 0,
  won int not null default 0,
  drawn int not null default 0,
  lost int not null default 0,
  goals_for int not null default 0,
  goals_against int not null default 0,
  goal_difference int not null default 0,
  points int not null default 0,
  captured_at timestamptz not null default now()
);

create table if not exists ligamx_top_scorers_latest (
  tournament_slug text not null,
  player_slug text not null,
  position int,
  player_name text not null,
  team_name text,
  team_slug text,
  goals int not null default 0,
  minutes_played int default 0,
  scores_every_minutes numeric,
  nationality text,
  source_url text,
  synced_at timestamptz not null default now(),
  primary key (tournament_slug, player_slug)
);

create table if not exists ligamx_official_match_results (
  id bigserial primary key,
  tournament_slug text not null,
  jornada text,
  official_match_key text not null unique,
  home_team_name text not null,
  away_team_name text not null,
  home_team_slug text,
  away_team_slug text,
  home_score int,
  away_score int,
  status text,
  match_date date,
  match_time text,
  stadium text,
  minute_by_minute_url text,
  report_url text,
  source_url text,
  synced_at timestamptz not null default now()
);

create table if not exists ligamx_data_conflicts (
  id bigserial primary key,
  conflict_type text not null,
  severity text not null default 'review',
  internal_event_id text,
  official_match_key text,
  internal_payload jsonb,
  official_payload jsonb,
  message text,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);
```

Indices recomendados:

```sql
create index if not exists idx_ligamx_standings_latest_tournament_position
on ligamx_standings_latest (tournament_slug, position);

create index if not exists idx_ligamx_scorers_tournament_goals
on ligamx_top_scorers_latest (tournament_slug, goals desc);

create index if not exists idx_ligamx_results_date
on ligamx_official_match_results (match_date);

create index if not exists idx_ligamx_results_teams
on ligamx_official_match_results (home_team_slug, away_team_slug);
```

RLS sugerido:

```sql
alter table ligamx_sync_runs enable row level security;
alter table ligamx_team_aliases enable row level security;
alter table ligamx_standings_latest enable row level security;
alter table ligamx_standings_snapshots enable row level security;
alter table ligamx_top_scorers_latest enable row level security;
alter table ligamx_official_match_results enable row level security;
alter table ligamx_data_conflicts enable row level security;

create policy "Public read Liga MX standings"
on ligamx_standings_latest for select
using (true);

create policy "Public read Liga MX scorers"
on ligamx_top_scorers_latest for select
using (true);

create policy "Public read Liga MX match results"
on ligamx_official_match_results for select
using (true);

create policy "Public read Liga MX aliases"
on ligamx_team_aliases for select
using (true);
```

No crear politicas publicas de insert/update/delete. Esas operaciones deben hacerse solo con `SUPABASE_SERVICE_ROLE_KEY` desde GitHub Actions.

## 7. Archivos nuevos recomendados

### 7.1 Script principal Liga MX

Crear:

```text
agenda-web/scripts/sync-ligamx.mjs
```

Responsabilidades:

- Descargar HTML de `https://ligamx.net/` y paginas de tabla/goleo.
- Detectar el torneo activo `apertura-2026`.
- Parsear Tabla General.
- Parsear Tabla de Goleo.
- Parsear resultados/marcadores por jornada si es viable.
- Normalizar nombres de equipos.
- Validar datos antes de escribir.
- Insertar run en `ligamx_sync_runs`.
- Upsert en `ligamx_standings_latest`.
- Insert en `ligamx_standings_snapshots`.
- Upsert en `ligamx_top_scorers_latest`.
- Upsert en `ligamx_official_match_results`.
- Registrar conflictos sin tocar `eventos`.

### 7.2 Modulo de normalizacion

Crear:

```text
agenda-web/scripts/lib/ligamx-normalize.mjs
```

Responsabilidades:

- `slugify`
- aliases de equipos
- normalizacion de nombres
- parsing numerico
- comparacion flexible de equipos

Aliases iniciales sugeridos:

```js
export const TEAM_ALIASES = {
  'america': ['America', 'América', 'Club America', 'Club América', 'Aguilas America', 'Águilas América'],
  'guadalajara': ['Guadalajara', 'Chivas', 'Chivas Guadalajara'],
  'cruz-azul': ['Cruz Azul'],
  'pumas': ['Pumas', 'UNAM', 'Pumas UNAM'],
  'tigres': ['Tigres', 'UANL', 'Tigres UANL'],
  'monterrey': ['Monterrey', 'Rayados'],
  'toluca': ['Toluca'],
  'pachuca': ['Pachuca'],
  'leon': ['León', 'Leon'],
  'atlas': ['Atlas'],
  'tijuana': ['Tijuana', 'Xolos'],
  'necaxa': ['Necaxa'],
  'puebla': ['Puebla'],
  'santos-laguna': ['Santos Laguna', 'Santos'],
  'atletico-san-luis': ['Atlético de San Luis', 'Atletico de San Luis', 'ADSL', 'San Luis'],
  'fc-juarez': ['FC Juárez', 'FC Juarez', 'Juárez', 'Juarez'],
  'queretaro': ['Querétaro', 'Queretaro', 'Gallos Blancos de Querétaro', 'Gallos Blancos'],
  'atlante': ['Atlante']
};
```

### 7.3 Cliente Supabase servidor

Crear:

```text
agenda-web/src/lib/supabaseServer.ts
```

Uso recomendado:

- Centralizar `createClient`.
- Evitar repetir clientes.
- Para frontend SSR usar anon key.
- Para scripts usar service role solo en Node/GitHub Actions.

### 7.4 Componentes UI Liga MX

Crear:

```text
agenda-web/src/components/ligamx/LigaMxStandings.tsx
agenda-web/src/components/ligamx/LigaMxTopScorers.tsx
agenda-web/src/components/ligamx/LigaMxMatchStrip.tsx
agenda-web/src/components/ligamx/LigaMxSeoFaq.tsx
agenda-web/src/components/ligamx/LigaMxLastUpdated.tsx
```

### 7.5 Workflow nuevo

Crear:

```text
.github/workflows/sync_ligamx.yml
```

Propuesta:

```yaml
name: Sincronizar Estadisticas Liga MX

on:
  schedule:
    - cron: '15 */2 * * *'
  workflow_dispatch:

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout del codigo
        uses: actions/checkout@v4

      - name: Configurar Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '24'
          cache: 'npm'
          cache-dependency-path: agenda-web/package-lock.json

      - name: Instalar dependencias
        working-directory: agenda-web
        run: npm ci

      - name: Ejecutar sincronizacion Liga MX
        working-directory: agenda-web
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
        run: npm run sync-ligamx
```

Importante:

- No necesita `contents: write`.
- No hace commit.
- No toca `eventos`.

## 8. Cambios recomendados a archivos existentes

### 8.1 `agenda-web/package.json`

Agregar script:

```json
"sync-ligamx": "node scripts/sync-ligamx.mjs"
```

No modificar scripts existentes.

### 8.2 `agenda-web/src/app/futbol/[competicion]/page.tsx`

Modificar solo cuando `competicion === 'liga-mx'`.

Agregar queries nuevas:

```ts
const isLigaMx = competicion === 'liga-mx';

const [eventosResult, noticiasResult, standingsResult, scorersResult, resultsResult] = await Promise.all([
  supabase
    .from('eventos')
    .select('*')
    .eq('deporte', 'Fútbol')
    .ilike('competicion', `%${hub.query}%`)
    .gte('fecha', hoyStr)
    .order('fecha', { ascending: true })
    .order('hora', { ascending: true })
    .limit(30),
  supabase
    .from('noticias')
    .select('titulo, slug, fecha, created_at')
    .ilike('titulo', `%${hub.query}%`)
    .order('created_at', { ascending: false })
    .limit(6),
  isLigaMx
    ? supabase
        .from('ligamx_standings_latest')
        .select('*')
        .eq('tournament_slug', 'apertura-2026')
        .order('position', { ascending: true })
    : Promise.resolve({ data: [] }),
  isLigaMx
    ? supabase
        .from('ligamx_top_scorers_latest')
        .select('*')
        .eq('tournament_slug', 'apertura-2026')
        .order('goals', { ascending: false })
        .limit(10)
    : Promise.resolve({ data: [] }),
  isLigaMx
    ? supabase
        .from('ligamx_official_match_results')
        .select('*')
        .eq('tournament_slug', 'apertura-2026')
        .order('match_date', { ascending: true })
        .limit(20)
    : Promise.resolve({ data: [] }),
]);
```

Agregar secciones visuales despues del header y antes de proximos partidos:

- Resumen de torneo.
- Tabla General compacta.
- Top goleadores.
- Jornada/resultados oficiales.

Mantener la seccion actual de proximos partidos intacta, porque ahi estan los canales.

### 8.3 `agenda-web/src/app/sitemap.ts`

Fase 1: no tocar.

Fase 2 SEO: si se crean paginas nuevas:

- `/futbol/liga-mx/tabla-general`
- `/futbol/liga-mx/jornada/[jornada]`
- `/futbol/liga-mx/equipos/[equipo]`

entonces agregar esas rutas.

## 9. UX/UI recomendado para `/futbol/liga-mx`

Orden de bloques recomendado:

1. Header:
   - H1: `Liga MX Apertura 2026`
   - Subcopy: `Tabla general, resultados y donde ver los partidos en Mexico`
   - Badge: `Datos de transmisiones: GuíaSports`
   - Badge: `Estadisticas: Liga MX`

2. Proximos partidos / donde ver:
   - Mantenerlo arriba o inmediatamente despues de un resumen corto.
   - Esta es la propuesta principal de valor del sitio.

3. Tabla General:
   - Mobile: columnas `Pos`, `Club`, `JJ`, `Dif`, `PTS`.
   - Desktop: mostrar `JJ`, `JG`, `JE`, `JP`, `GF`, `GC`, `Dif`, `PTS`.
   - Resaltar Top 8 como zona de Liguilla.
   - Indicar `Actualizado: fecha/hora`.

4. Jornada actual:
   - Marcadores oficiales si existen.
   - Si hay evento interno enlazado, mostrar tambien `Donde ver`.

5. Goleadores:
   - Top 5 o Top 10.
   - Jugador, club, goles.

6. Contenido SEO:
   - Explicacion breve de formato del torneo.
   - Preguntas frecuentes.
   - Texto editorial propio, no copiado de Liga MX.

7. Noticias:
   - Mantener bloque actual.

## 10. SEO recomendado

Actualizar metadata de Liga MX:

```ts
'liga-mx': {
  name: 'Liga MX',
  query: 'Liga MX',
  title: 'Liga MX Apertura 2026: Tabla General, Partidos y Dónde Ver',
  description: 'Consulta la Tabla General de Liga MX Apertura 2026, resultados, próximos partidos y canales para verlos en vivo en México.',
  intro: 'Todo el Hub Liga MX: partidos, canales de transmisión, tabla general, resultados y estadísticas del Apertura 2026.'
}
```

JSON-LD recomendado:

- `CollectionPage` para el Hub.
- `ItemList` para proximos partidos.
- `SportsEvent` para partidos visibles, usando los canales del scraper.
- `FAQPage` para preguntas frecuentes.

FAQs sugeridas:

- `¿Dónde ver partidos de Liga MX hoy?`
- `¿Cómo se ordena la Tabla General de Liga MX?`
- `¿Cuántos equipos clasifican a la Liguilla del Apertura 2026?`
- `¿Cada cuándo se actualiza la tabla de Liga MX en GuíaSports?`

## 11. Validaciones obligatorias del bot Liga MX

Antes de escribir en Supabase:

- Tabla General debe tener 18 equipos.
- `position` debe ser unico.
- `team_slug` debe ser unico.
- `played = won + drawn + lost`.
- `goal_difference = goals_for - goals_against`.
- `points = won * 3 + drawn`, salvo penalizaciones oficiales. Si no cuadra, registrar warning, no fallar automaticamente.
- Total `goals_for` debe ser igual a total `goals_against`.
- No guardar tabla si menos de 12 equipos fueron parseados.
- No borrar datos previos si la nueva descarga falla.
- Guardar error en `ligamx_sync_runs`.

## 12. Comandos concretos para agentes IA

### 12.1 Auditoria local segura

```bash
cd /Users/iturralde/pgweb/proyecto-agenda-final
rg -n "from\\('eventos'\\)|table\\(\"eventos\"\\)|delete\\(|insert\\(|update\\(" agenda-web/src agenda-web/scripts agenda-deportiva
rg -n "liga-mx|Liga MX|sync-fifa|SUPABASE|revalidate" agenda-web agenda-deportiva .github
```

### 12.2 Crear rama

```bash
cd /Users/iturralde/pgweb/proyecto-agenda-final
git checkout -b codex/liga-mx-official-stats
```

### 12.3 Instalar dependencias existentes

```bash
cd /Users/iturralde/pgweb/proyecto-agenda-final/agenda-web
npm ci
```

### 12.4 Agregar script

Editar:

```text
agenda-web/package.json
```

Agregar:

```json
"sync-ligamx": "node scripts/sync-ligamx.mjs"
```

### 12.5 Crear tablas Supabase

Ejecutar manualmente en SQL Editor de Supabase el SQL de la seccion 6.

### 12.6 Probar parser sin escribir

El script debe soportar:

```bash
cd /Users/iturralde/pgweb/proyecto-agenda-final/agenda-web
node scripts/sync-ligamx.mjs --dry-run
```

Salida esperada:

- numero de equipos parseados
- top 3 tabla general
- top 3 goleadores
- warnings
- cero escritura en Supabase

### 12.7 Probar escritura en staging

```bash
cd /Users/iturralde/pgweb/proyecto-agenda-final/agenda-web
NEXT_PUBLIC_SUPABASE_URL="..." SUPABASE_SERVICE_ROLE_KEY="..." node scripts/sync-ligamx.mjs
```

### 12.8 Verificar frontend

```bash
cd /Users/iturralde/pgweb/proyecto-agenda-final/agenda-web
npm run lint
npm run build
```

### 12.9 Verificar que no se toco scraping

```bash
git diff -- agenda-deportiva/scraper.py agenda-deportiva/subir_agenda.py .github/workflows/scraper_auto.yml
```

Salida esperada:

```text
sin cambios
```

## 13. Plan de accion por fases y subfases

### Fase 0: Congelamiento de zonas sensibles

Objetivo: proteger el sistema actual.

Subfases:

1. Crear rama nueva.
2. Confirmar que no se modifican:
   - `agenda-deportiva/scraper.py`
   - `agenda-deportiva/subir_agenda.py`
   - `.github/workflows/scraper_auto.yml`
3. Definir en el ticket de trabajo: "Liga MX oficial no escribe en `eventos`".
4. Marcar `eventos` como solo lectura para esta tarea.

Criterio de salida:

- `git diff` no muestra cambios en archivos sensibles.

### Fase 1: Base de datos nueva

Objetivo: crear almacenamiento aislado.

Subfases:

1. Ejecutar SQL de tablas `ligamx_*`.
2. Crear RLS de solo lectura publica para tablas que usa el frontend.
3. No crear politicas publicas de escritura.
4. Cargar aliases iniciales de equipos.

Criterio de salida:

- Supabase tiene tablas nuevas.
- El anon key puede leer `ligamx_standings_latest`, `ligamx_top_scorers_latest`, `ligamx_official_match_results`.
- Solo service role puede escribir.

### Fase 2: Parser y bot Liga MX

Objetivo: obtener datos oficiales sin afectar la agenda.

Subfases:

1. Crear `agenda-web/scripts/sync-ligamx.mjs`.
2. Crear `agenda-web/scripts/lib/ligamx-normalize.mjs`.
3. Implementar `--dry-run`.
4. Parsear Tabla General.
5. Parsear goleadores.
6. Parsear resultados si la estructura es estable.
7. Agregar validaciones.
8. Guardar run en `ligamx_sync_runs`.
9. Hacer upsert solo en `ligamx_*`.

Criterio de salida:

- `node scripts/sync-ligamx.mjs --dry-run` muestra datos validos.
- La ejecucion real escribe en tablas nuevas.
- No hay queries contra `eventos` salvo lectura opcional para conflictos.

### Fase 3: Workflow GitHub Actions

Objetivo: automatizar sin commits.

Subfases:

1. Crear `.github/workflows/sync_ligamx.yml`.
2. Usar Node 24.
3. Usar `npm ci`.
4. Ejecutar `npm run sync-ligamx`.
5. Pasar secrets:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
6. Programar cada 2 horas.
7. Durante jornadas, evaluar cada 30 minutos si se requiere mas frescura.

Criterio de salida:

- Workflow manual corre exitosamente.
- Workflow programado no genera commits.
- Errores quedan registrados en `ligamx_sync_runs`.

### Fase 4: Hub Liga MX UI

Objetivo: mostrar valor al usuario sin romper el Hub.

Subfases:

1. Editar solo `agenda-web/src/app/futbol/[competicion]/page.tsx`.
2. Detectar `isLigaMx`.
3. Mantener query actual a `eventos`.
4. Agregar queries a `ligamx_standings_latest`, `ligamx_top_scorers_latest`, `ligamx_official_match_results`.
5. Crear componentes `components/ligamx/*`.
6. Renderizar tabla compacta.
7. Renderizar goleadores.
8. Renderizar resultados oficiales.
9. Agregar fallback si no hay datos oficiales.

Criterio de salida:

- `/futbol/liga-mx` sigue mostrando partidos/canales aunque las tablas `ligamx_*` esten vacias.
- La tabla general aparece si hay datos.
- La pagina no depende del bot para cargar la agenda.

### Fase 5: SEO

Objetivo: mejorar indexacion y contenido.

Subfases:

1. Actualizar metadata del Hub Liga MX.
2. Agregar `FAQPage` JSON-LD.
3. Agregar texto editorial propio.
4. Agregar `lastUpdated`.
5. Agregar `ItemList` para tabla y partidos.
6. Mantener canonical `/futbol/liga-mx`.

Criterio de salida:

- HTML renderizado incluye H1, tabla, FAQs y JSON-LD.
- No depende de contenido client-side para SEO principal.

### Fase 6: QA

Objetivo: asegurar que no se rompe nada.

Subfases:

1. Ejecutar `npm run lint`.
2. Ejecutar `npm run build`.
3. Revisar `/`.
4. Revisar `/futbol`.
5. Revisar `/futbol/liga-mx`.
6. Revisar `/evento/[slug]`.
7. Validar mobile y desktop.
8. Confirmar que `agenda-deportiva/*` no cambio.

Criterio de salida:

- Build exitoso.
- Hub Liga MX muestra canales desde `eventos`.
- Datos oficiales aparecen como complemento.

### Fase 7: Lanzamiento

Objetivo: publicar con bajo riesgo.

Subfases:

1. Deploy staging.
2. Ejecutar workflow manual en staging.
3. Revisar logs y tabla `ligamx_sync_runs`.
4. Activar produccion.
5. Ejecutar workflow manual.
6. Monitorear 24 horas.

Criterio de salida:

- No se afectan eventos.
- No cambia el workflow del scraper.
- Datos oficiales se actualizan sin errores recurrentes.

### Fase 8: Iteraciones futuras

Objetivo: ampliar valor UX/SEO.

Ideas:

- Pagina `/futbol/liga-mx/tabla-general`.
- Pagina `/futbol/liga-mx/jornada/[numero]`.
- Paginas por equipo.
- Comparador de equipos.
- Forma reciente.
- Historico de posiciones.
- Bloque "carrera a Liguilla".
- Panel admin solo lectura para conflictos.

## 14. Criterios de aceptacion final

La implementacion se considera correcta si:

- El scraper actual sigue funcionando igual.
- `eventos.canales` sigue siendo la fuente de verdad para transmisiones.
- Liga MX oficial no escribe en `eventos`.
- El Hub Liga MX muestra tabla oficial sin depender de la agenda.
- Si falla ligamx.net, el Hub sigue mostrando partidos y canales.
- Los datos oficiales tienen `synced_at`.
- Hay atribucion visible a Liga MX para estadisticas.
- El SEO mejora con contenido renderizado y FAQs.

## 15. Recomendacion final

Implementar en este orden:

1. SQL de tablas nuevas.
2. `sync-ligamx.mjs` con `--dry-run`.
3. Workflow separado sin commits.
4. Componentes de tabla/goleadores.
5. Mejora SEO en `/futbol/liga-mx`.
6. Resultados oficiales por jornada.
7. Matching opcional con eventos internos.

El punto mas importante: no integrar Liga MX oficial en el pipeline Python actual. Ese sistema tiene buena funcion para el negocio porque resuelve canales de transmision, y debe permanecer como fuente principal de la agenda.
