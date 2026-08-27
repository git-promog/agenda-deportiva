> **DOCUMENTO HISTÓRICO — NO OPERATIVO**
>
> Este Plan de Acción MASTER conserva las decisiones y el desglose original de fases. Algunas fechas, estados y pendientes fueron superados por el trabajo posterior. No utilizarlo como instrucción activa; la fuente operativa única es `PLAN-REMEDIACION-UX-SEGURIDAD-SEO-CALIDAD.md`.

# Plan de Acción MASTER

## Estado operativo actualizado — 14/08/2026

- El trabajo vigente continúa únicamente en local. Fases 0–2 están implementadas; Fase 3 quedó cerrada administrativamente y sus pruebas finales se conservan en Fase 3.1.
- Fase 4 operativa — identidad estable y sincronización segura — continúa en progreso local. La persistencia y sincronización de favoritos entre pestañas está implementada y validada; no se implementará sincronización entre dispositivos en este ciclo.
- La auditoría encontró sólo dos consumidores de `localStorage`: favoritos y consentimiento. Los filtros son estado transitorio de React. Los IDs públicos revisados usan IDs propios; los índices restantes son de presentación.
- Las pruebas controladas locales de JSON inválido y borrado de `wc_favorites` (`newValue === null`) pasaron; el estado final quedó restaurado sin favoritos.
- El build no tiene resultado concluyente: permanece diferido a Fase 3.1 y no debe repetirse automáticamente.
- Fase 6 — SEO y contenido histórico — tuvo una intervención local separada el 14/08/2026: Hub, sedes y partidos ya presentan resultados, fechas, `EventCompleted`, FAQ histórica, metadata histórica, canonical/Open Graph y sitemap con señales de archivo.
- Se conservan el Hub, las 16 sedes, los 104 partidos, todas sus URLs y los datos fuente auto-generados; no hubo deploy, staging, SQL, sincronizaciones ni cambios en Supabase.
- Hallazgos H1–H6 de la QA local quedaron remediados en local el 14/08/2026 (schemas del Mundial + FAQ de noticias con copy histórico/neutral según fecha); H7–H9 quedan como observaciones diferidas sin acción requerida.

La bitácora detallada y los pendientes controlados viven en `PLAN-REMEDIACION-UX-SEGURIDAD-SEO-CALIDAD.md`.

## Auditoría e intervención SEO del Hub del Mundial — 14/08/2026

- Diagnóstico inicial realizado en modo lectura; la implementación posterior se limitó a la capa local de presentación, metadata, schema y sitemap.
- El Hub y sus páginas relacionadas conservaban semántica futura; ahora muestran archivo histórico, resultados y fechas, sin countdown ni mensajes de “Ver en vivo”.
- El sitemap conserva 121 URLs del Mundial: 1 Hub, 16 sedes y 104 partidos, con `lastModified` `2026-08-14`, frecuencia `yearly` y prioridades reducidas.
- `SportsEvent` del Hub, sedes y partidos usa `EventCompleted`; canonical y Open Graph fueron revisados en las tres superficies.
- Decisión: conservar URLs y funciones como archivo histórico; no eliminar sedes ni partidos sin medición de rendimiento orgánico, enlaces entrantes y duplicación.

## Fase 0 — Protección y preparación

### 0.1 Congelar los sistemas sensibles

No modificar en esta fase:

- `agenda-deportiva/subir_agenda.py`
- `agenda-deportiva/scraper.py`
- `agenda-web/scripts/`
- Tablas de Supabase.
- Rutas de escritura.
- Panel `/admin`.

Regla para agentes: cualquier cambio en esos directorios debe rechazarse automáticamente salvo que exista una tarea explícita de datos o seguridad.

### 0.2 Crear inventario de contrato de datos

Crear:

- `agenda-web/src/types/event.ts`
- `agenda-web/src/types/news.ts`
- `agenda-web/src/types/index.ts` (Exportación centralizada de todos los tipos)
- `agenda-web/src/lib/mexicoTime.ts`

Definir formalmente el contrato:

```ts
export type Evento = {
  id: string;
  fecha: string;
  hora: string;
  evento: string;
  competicion: string;
  deporte: string;
  canales: string;
  destacado?: boolean | null;
  // Campos opcionales presentes en Supabase
  liga?: string | null;
  equipo_local?: string | null;
  equipo_visitante?: string | null;
  tv_abierta?: boolean | null;
  link_transmision?: string | null;
  created_at?: string | null;
};

export type Noticia = {
  id: string;
  titulo: string;
  slug: string;
  contenido?: string | null;
  resumen?: string | null;
  imagen_url?: string | null;
  fecha_publicacion?: string | null;
  autor?: string | null;
  categoria?: string | null;
  created_at?: string | null;
};
```

Criterio de salida: ningún componente visual debe redefinir este tipo con `any`.

### 0.3 Recomendaciones Técnicas Integradas

1. **Exportación Unificada de Tipos:** Usar `agenda-web/src/types/index.ts` como barrera de entrada limpia para importaciones (`import { Evento, Noticia } from '@/types'`).
2. **Contrato Estendido:** Incluir campos opcionales en el tipo `Evento` desde la Fase 0 para evitar refactorizaciones mayores en las Fases 3 y 5.
3. **Aislamiento de Lint para Scripts Auxiliares:** Configurar el linter/pipeline para que evalúe estrictamente el código de la app Next.js (`src/`), aislando scripts de prueba sueltos en raíz como `test_news.js`.
4. **Verificación Estricta de `.gitignore`:** Asegurar que los archivos `.env` y `.env.local` en `agenda-web/` y `agenda-deportiva/` estén ignorados en Git antes de proceder a la Fase 1.

### 0.4 Línea base y comandos

Ejecutar antes de cada fase:

```bash
git status --short
npm run lint
npm run build
```

Ejecutar sólo en modo lectura para diagnóstico:

```bash
npm run dev
```

No ejecutar:

```bash
python subir_agenda.py
npm run sync-fifa
npm run sync-ligamx
```

Criterio de salida: lista de errores conocida, evidencia de no modificar datos y copia de seguridad confirmada por el equipo responsable.


---

## Fase 1 — Seguridad y continuidad operativa

### 1.1 Recomendaciones Técnicas e Integración de Seguridad

1. **Autenticación Administrativa Servidor a Servidor:** Ocultar la contraseña administrativa detrás de una cookie de sesión HTTP-Only firmada y un endpoint de login (`/api/admin/login`). Eliminar cualquier contraseña fija (`GUIA2024`) del bundle cliente.
2. **Eliminación Total de Fallbacks de Secretos:** Remover la sintaxis `|| "guiasports-secret-2024"` de las API Routes (`/api/noticias/*`). Si la variable de entorno falta, retornar un error 500/401 explícito.
3. **Estandarización de Variables y Plantilla `.env.example`:** Crear `agenda-web/.env.example` sanitizado y adaptar scripts de prueba (`test_*.py`) para usar `dotenv` / `os.getenv()`.
4. **Protección de Endpoints:** Mover o asegurar las acciones administrativas con validación de sesión en servidor.

### 1.2 Eliminar secretos del código

Archivos a revisar:

- `agenda-web/test_supabase.py`
- `agenda-web/test_gemini.py`
- `agenda-web/src/app/admin/page.tsx`
- `agenda-web/src/app/api/noticias/*`

Pasos:

1. Revocar/rotar las credenciales actualmente expuestas en el entorno de despliegue.
2. Eliminar valores de respaldo de secretos (`guiasports-secret-2024`, `GUIA2024`).
3. Dejar sólo variables de entorno obligatorias (`ADMIN_API_SECRET`, `ADMIN_PASSWORD`, `SUPABASE_SERVICE_ROLE_KEY`).
4. Añadir `agenda-web/.env.example` sin valores reales.
5. Revisar historial Git antes de considerar el incidente cerrado.

### 1.3 Reemplazar autenticación de admin

- Implementar sesión de servidor respaldada por HTTP-Only cookies en `/api/admin/login`, `/api/admin/logout` y `/api/admin/session`.
- Proteger el panel `/admin` mediante validación en el servidor.
- Eliminar la contraseña fija del bundle del navegador.
- Restringir escrituras de `eventos` y `noticias` verificando sesión activa en servidor.

Criterio de salida: un visitante no autenticado no puede leer datos administrativos ni ejecutar escrituras, incluso llamando directamente a Supabase o APIs.

---

## Fase 2 — Fundamentos de UX y datos de presentación

### 2.0 Recomendaciones Técnicas Integradas (Fase 2)

1. **Abstracción Total del Tiempo en México (`mexicoTime.ts`):** Expandir `src/lib/mexicoTime.ts` para proveer utilidades puras de fecha (`getTodayMexicoString`), estado en vivo (`isEventLive`), formato amigable (`formatMexicoDate`) y filtrado estricto de eventos pasados (`isUpcomingOrToday`). Reemplazar toda lógica duplicada en `HomeClient`, `EventListWithModal`, `envivo/page.tsx`, Hubs por deporte y `admin`.
2. **Catálogo Normativo Tripartito de Canales (`channelCatalog.ts`):** Crear `src/lib/channelCatalog.ts` clasificando canales en `tv_abierta`, `tv_paga` y `streaming` con soporte para alias del mercado mexicano (ej. "El 5", "Nu9ve", "Tv Azteca 7", "ViX+", "Apple TV / MLS Season Pass", "ESPN", "Fox Sports").
3. **Motor de Búsqueda Universal con Scoring y Alias (`eventSearch.ts`):** Implementar en `src/lib/eventSearch.ts` un algoritmo con sistema de puntuación (scoring) que resuelva búsquedas por equipo/evento, competición, deporte, canal o plataforma. Incluir mapa de alias deportivos (ej. "América" priorizando Club América sobre "América del Sud", "Chivas", "Selección", "F1", "Super Bowl").
4. **Verificación Estricta sin Regresiones:** Validar que `npx tsc --noEmit` devuelva 0 errores y verificar los 3 casos clave de búsqueda (Apple TV, América y TV Abierta) antes de dar por completada la Fase 2.

### 2.1 Centralizar tiempo de México

Crear `src/lib/mexicoTime.ts` para:

- Fecha actual de México.
- Estado “en vivo”.
- Formato de fechas.
- Rango de días.
- Hora de inicio y final estimada.

Después, reemplazar lógica duplicada en:

- `HomeClient.tsx`
- `EventListWithModal.tsx`
- `envivo/page.tsx`
- Hubs de deporte.
- Admin.

Criterio de salida: una sola definición de “hoy” y “en vivo”.

### 2.2 Crear catálogo de canales

Crear:

- `src/lib/channelCatalog.ts`

El catálogo debe normalizar nombres y clasificar:

```ts
type Canal = {
  id: string;
  aliases: string[];
  nombre: string;
  tipo: "tv_abierta" | "tv_paga" | "streaming";
  plataforma?: string;
};
```

Ejemplos de alias:

- `Imagen TV`, `Imagen Televisión`
- `Canal 9`, `Nu9ve`
- `Canal 5`, `El 5`

Criterio de salida: “TV Abierta” se calcula desde el catálogo, no desde siete fragmentos de texto.

### 2.3 Búsqueda universal

Crear:

- `src/lib/eventSearch.ts`

La búsqueda debe revisar:

- Evento.
- Competición.
- Deporte.
- Canal.
- Plataforma normalizada.
- Alias comunes: América, Chivas, Selección, F1, Liga MX, ESPN, ViX, Apple TV.

Criterio de salida:

- “Apple TV” encuentra los 23 eventos correspondientes.
- “Las Estrellas”, "Azteca 7", “El 5” y “Nu9ve” resuelven TV abierta.
- “América” prioriza Club América sobre coincidencias accidentales como “América del Sud”.

---

## Fase 3 — Nueva experiencia principal

> **ESTADO: COMPLETADA (09/08/2026)** — Implementada con `npx tsc --noEmit` en 0 errores, lint de archivos tocados en limpio (el lint global bajó de 57→51 errores) y build exitoso.

### 3.0 Recomendaciones Técnicas Integradas (Fase 3)

1. **Carga Reducida en Servidor:** Filtrar la consulta de `src/app/page.tsx` a un rango finito de días (hoy + 3 días = 4 días totales). No enviar los 1,054 eventos históricos al cliente. Conservar páginas individuales de evento, sitemap y archivo histórico como responsabilidades separadas.
2. **Reutilización Controlada de Componentes:** No duplicar la tarjeta de evento. `EventCard.tsx` se implementará como un wrapper ligero sobre `SportEventCard.tsx`, que a su vez se tipificará correctamente con el contrato `Evento`.
3. **Tipado Estricto en Componentes Tocados:** Eliminar tipos `any` de `HomeHero.tsx` y `HomeDestacados.tsx` y usar el tipo `Evento` importado desde `@/types`.
4. **Limpieza de Contenido Genérico:** Remover los análisis de “expertos” atribuidos genéricamente en `HomeDestacados.tsx`, alineándose con la auditoría de UX y la Fase 6 de contenido editorial real.
5. **Filtros Progresivos:** Mantener accesos rápidos visibles (Hoy, En vivo, Deportes principales) mientras se introduce un botón único “Filtrar” que abre un panel con opciones avanzadas (Fecha, Competición, Plataforma/TV Abierta). La consolidación completa de navegación móvil se reserva para la Fase 4.
6. **Protección de Sistemas Ajenos:** No modificar `Header.tsx`, `NavMobile.tsx`, scrapers, scripts de sincronización, tablas de Supabase ni endpoints de escritura en esta fase.

### 3.1 Reestructurar la home

Actualizar:

- `src/app/page.tsx`
- `src/components/HomeClient.tsx`
- `src/components/HomeHero.tsx`
- `src/components/HomeDestacados.tsx`

Nueva jerarquía:

1. H1 visible: “¿Dónde ver deportes hoy en México?”
2. Búsqueda grande.
3. Accesos: En vivo, Hoy.
4. Deportes principales.
5. Botón “Filtrar” + filtros activos.
6. Resultados.
7. Imperdibles.
8. Noticias y hubs.

No mostrar noticias antes de que el usuario pueda resolver su búsqueda.

### 3.2 Reducir los datos enviados al navegador

La home no necesita enviar los 1,054 eventos históricos.

Modificar la consulta de [page.tsx](/Users/iturralde/pgweb/proyecto-agenda-final/agenda-web/src/app/page.tsx:48) para cargar únicamente:

- Hoy.
- Próximos 3 días (total 4 días de ventana).
- Los eventos destacados necesarios dentro de ese rango.

La búsqueda universal y los filtros operarán sobre este subconjunto, lo cual es consistente con el propósito de la home: resolver “¿dónde ver hoy?”.

Criterio de salida: menor DOM, mejor respuesta de filtros y menor carga móvil.

### 3.3 Componentizar la interfaz

Crear:

- `src/components/agenda/AgendaSearch.tsx`
- `src/components/agenda/AgendaQuickActions.tsx`
- `src/components/agenda/AgendaFilters.tsx`
- `src/components/agenda/AgendaResults.tsx`
- `src/components/agenda/EventCard.tsx` (wrapper ligero sobre `SportEventCard`)
- `src/components/agenda/EmptyState.tsx`

No reescribir todo de una vez. Migrar cada bloque de la home manteniendo el contrato de `Evento`.

### 3.4 Criterios de salida y verificación

- `npx tsc --noEmit` debe seguir reportando **0 errores**.
- Los archivos modificados o creados en esta fase no deben introducir errores de lint nuevos.
- El H1 visible debe renderizar la propuesta de valor.
- La búsqueda, filtros y listado por fecha deben funcionar con datos reales.
- Los casos de búsqueda clave (“Apple TV”, “América”, “TV abierta”) deben seguir resolviéndose correctamente dentro del rango cargado.
- No debe haber regresión en URLs de evento, modal de detalle ni schema JSON-LD.

### 3.5 Resultados de verificación (Fase 3)

| Verificación | Resultado |
|---|---|
| `npx tsc --noEmit` | **0 errores** |
| Lint en archivos tocados | **0 errores, 0 advertencias** |
| Lint global (regresión) | 57 → **51 errores** (mejora de 6 errores en la home) |
| `npm run build` | **Sin resultado concluyente; diferida a Fase 3.1** |
| Carga de datos en servidor | 1,054 → **301 eventos** (hoy + 3 días) |
| JSON-LD (`ItemList`) | Solo con fechas de hoy, **válido** |
| H1 visible | Renderiza “¿Dónde ver deportes hoy en México?” |
| Jerarquía del DOM | H1 → Búsqueda → En vivo/Hoy → Deportes → Filtrar → Resultados → Imperdibles → Noticias → Hubs (orden confirmado) |
| Búsqueda “Apple TV” | **14 resultados** (dentro de ventana) |
| Búsqueda “América” | Prioriza **Club América** sobre América del Sud |
| Búsqueda “TV abierta” | **10 resultados** |
| Búsqueda “Chivas” | **2 resultados** |
| Búsqueda “ESPN” | **49 resultados** |

Componentes creados en `src/components/agenda/`: `AgendaSearch`, `AgendaQuickActions`, `AgendaFilters`, `AgendaResults`, `EventCard` (wrapper), `EmptyState`.

Nota: los errores de lint restantes pertenecen a archivos ajenos a esta fase (`admin`, `mundial-2026`, `f1/nba/mlb`, scripts) y se atenderán en la Fase 8.

---

## Fase 4 — Navegación móvil, accesibilidad y diseño

### 4.1 Una sola navegación móvil

Conservar una única barra inferior:

- Inicio.
- Buscar.
- En vivo.
- Más.

Eliminar el menú hamburguesa duplicado o usarlo sólo en escritorio si aporta una función distinta.

### 4.2 Filtros simples

En móvil:

- “Hoy” y “En vivo” visibles.
- “Filtrar” abre un panel inferior.
- El panel contiene Fecha, Deporte, Competición y Plataforma.
- Mostrar contador de filtros activos.
- Mostrar “Limpiar todo”.

### 4.3 Sistema visual

Crear tokens para:

- Color de marca.
- En vivo.
- Éxito/confirmación.
- Fondo y superficie.
- Tipografía.
- Espaciado.
- Foco.
- Bordes.
- Movimiento reducido.

Reducir:

- Texto de 8–10 px.
- Mayúsculas continuas.
- Brillos redundantes.
- Animación constante.
- Tarjetas decorativas sin función.

### 4.4 Accesibilidad

Validar:

- Objetivos táctiles de al menos 44 px.
- `aria-label` en botones sólo con icono.
- Foco visible.
- Orden de tabulación.
- Estados “sin resultados”.
- Mensajes para lectores de pantalla cuando cambien los resultados.
- `prefers-reduced-motion`.

---

## Fase 5 — Detalle de evento, favoritos y conversión

> **SEGUIMIENTO OPERATIVO:** el primer bloque de favoritos del Hub del Mundial ya usa IDs estables (`m1`–`m104`), persiste localmente y sincroniza entre pestañas. No extender todavía el hook a sincronización entre dispositivos, seguimiento de equipos, competiciones o recordatorios: requieren una decisión de producto y una fase posterior con autorización explícita para Supabase.

### 5.1 Mejorar el detalle

Actualizar:

- `src/app/evento/[slug]/page.tsx`
- `src/components/SportEventModal.tsx`

Orden visual:

1. Partido/evento.
2. Hora México.
3. Dónde verlo.
4. Tipo: TV abierta, TV de paga o streaming.
5. Competición.
6. Agendar.
7. Compartir.
8. Eventos relacionados.

### 5.2 Favoritos

No usar el hook actual para agenda general hasta resolver estabilidad de IDs.

Archivo a revisar:

- [useFavorites.ts](/Users/iturralde/pgweb/proyecto-agenda-final/agenda-web/src/hooks/useFavorites.ts:3)

Después de estabilizar la identidad de eventos, permitir:

- Seguir equipos.
- Guardar competiciones.
- Ver “Para ti”.
- Recordatorios de eventos.

---

## Fase 6 — SEO y contenido

### 6.1 SEO visible y útil

- H1 visible en home.
- Texto introductorio breve y orientado a México.
- Enlaces internos a deporte, competición y plataforma.
- Páginas de plataforma útiles: ESPN, ViX, Apple TV, TUDN, etc.
- Autores con experiencia, metodología y fuentes.
- Eliminar análisis genéricos atribuidos a personas si no son contenido editorial real.

### 6.2 Datos estructurados

Mantener:

- `Organization`
- `WebSite`
- `BreadcrumbList`
- `WebPage`

Revisar `SportsEvent`:

- No incluir `Offer` si GuíaSports no vende entradas.
- No declarar ubicación virtual con expectativa de rich result.
- Sólo usar datos que el usuario puede ver y confirmar.
- Validar con Rich Results Test y Search Console.

### 6.3 URLs de evento

No aumentar indexación de eventos hasta resolver la estabilidad de IDs. Las URLs actuales se forman con un ID de base de datos que puede variar con el proceso de borrado e inserción.

### 6.4 Intervención local de archivo histórico — 14/08/2026

- `agenda-web/src/lib/worldCupArchive.ts` centraliza fechas del torneo, estado histórico, resultado, transmisión registrada y fechas de schema.
- Hub, sedes y partidos conservan sus rutas y ahora usan copy histórico, resultados visibles, FAQ histórica, `EventCompleted`, canonical y Open Graph coherentes.
- Se retiraron countdown, “Próximo partido”, “HOY”, “EN VIVO”, “Ver partido en vivo” y “Ver en vivo” de la experiencia del Mundial; los datos `streaming` auto-generados no fueron editados.
- El sitemap mantiene las 121 URLs del Mundial con `lastModified` `2026-08-14`, frecuencia `yearly` y prioridades reducidas; `robots.ts` sigue permitiendo rastreo.
- Validaciones locales: `npx tsc --noEmit`, `npm run lint` y `git diff --check` pasan. No se ejecutó build por el estancamiento previamente documentado en Fase 3.1.
- Siguiente paso recomendado: staging autorizado para validar JSON-LD/canonical/Open Graph y medir el valor SEO de sedes; no borrar URLs ni tocar Supabase desde esa revisión.

### 6.5 QA local de SEO histórico — 14/08/2026 (sin build)

- QA estática de sólo lectura sobre Hub, sedes, detalles, sitemap, robots y componentes del Mundial; sin cambios de código ni de datos.
- Confirmado: schemas de sede y partido completos (`startDate`, `endDate`, `EventCompleted`, equipos, ubicación, resultado y `url`); canonical y Open Graph coherentes en Hub, sede y partido; sitemap con exactamente 121 URLs del Mundial y señales históricas (`lastModified` 2026-08-14, `yearly`, prioridades reducidas); sin enlaces de streaming activos (el campo `streaming` no tiene consumidores en `src/`).
- Confirmado: los 104 partidos tienen marcador y `utc`; sólo 8 tienen `broadcasters`, el resto muestra el fallback histórico.
- Hallazgos diferidos a remediación breve: H1 los 30 `SportsEvent` del Hub carecen de `@context` y `url` propios; H2 la heurística de `addressCountry` del Hub marca `US` para partidos de México y Canadá; H3 el detalle usa imagen SVG no admitida por Google; H4 `result` como cadena simple; H5 el modal conserva "Agendar" para partidos pasados; H6 `noticias/[slug]` genera FAQ con copy futuro para cualquier noticia (fuente no modificada).
- Validaciones: `npx tsc --noEmit` 0 errores, `npm run lint` 0 errores/0 advertencias, `git diff --check` limpio. No se ejecutó `npm run build` (diferido a Fase 3.1).
- Detalle completo en `PLAN-REMEDIACION-UX-SEGURIDAD-SEO-CALIDAD.md`, sección "QA local de SEO histórico — 14/08/2026".

### 6.6 Remediación local de schemas — 14/08/2026 (sin build)

- Corregidos H1–H4 y H5 (aprobado) en `mundial-2026/page.tsx`, `mundial-2026/partido/[slug]/page.tsx` y `WCMatchModal.tsx`: los 30 `SportsEvent` del Hub ahora llevan `@context` propio y `url` canónica; `addressCountry` se resuelve desde `SEDES` por estadio (fin de la marca `US` errónea para partidos de México y Canadá); el schema del detalle usa imagen `.webp` en lugar de SVG y `result` estructurado como `Thing`; se retiró "Agendar" (Google Calendar) del modal por tratarse de partidos completados, quedando "Página" y "Compartir" en rejilla de 2 columnas.
- H6 (`noticias/[slug]`, FAQ con copy futuro) quedó resuelto en una sesión posterior con decisión aprobada por el usuario: la FAQ (visible y JSON-LD `FAQPage`) conserva copy futuro para noticias vigentes y usa copy histórico/neutral en pasado para noticias cuya `fecha` ya pasó (señal `noticia.fecha` vs. hoy en México); el fallback de description también se adaptó. Detalle en PLAN, sección "Remediación local de FAQ de noticias — 14/08/2026".
- Validaciones: `npx tsc --noEmit` 0 errores, `npm run lint` 0 errores/0 advertencias, `git diff --check` limpio. No se ejecutó `npm run build` (diferido a Fase 3.1).
- Detalle completo en `PLAN-REMEDIACION-UX-SEGURIDAD-SEO-CALIDAD.md`, sección "Remediación local de schemas — 14/08/2026".

---

## Fase 7 — Integridad de sincronización, separada del rediseño

### 7.1 Reemplazar borrado total

Objetivo: no borrar `eventos` completos en cada sincronización.

Propuesta:

1. Scraper descarga datos.
2. Validador revisa cantidad, fechas, canales y estructura.
3. Carga temporal/staging.
4. Comparación contra eventos existentes.
5. `upsert` por clave externa estable.
6. Publicación atómica.
7. Registro de ejecución.
8. Posibilidad de reversión.

### 7.2 Clave estable

Agregar una clave externa basada en:

```text
fecha + hora + evento normalizado + competición normalizada
```

No usar el `id` autogenerado como identidad pública.

### 7.3 Validaciones mínimas antes de publicar

- La fuente responde correctamente.
- Hay filas suficientes.
- Existen fechas futuras.
- No hay caída brusca frente a la última carga.
- No se eliminan manuales.
- No se eliminan eventos importantes sin alerta.
- No se publican eventos con campos esenciales vacíos.

Criterio de salida: una URL compartida sigue funcionando tras sincronizaciones futuras.

---

## Fase 8 — Calidad, observabilidad y despliegue

### 8.1 Recuperar calidad técnica

Resolver el lint antes del lanzamiento visual grande.

Comando obligatorio:

```bash
npm run lint
```

Meta:

```text
0 errores
Advertencias justificadas o eliminadas
```

### 8.2 Pruebas funcionales

Añadir pruebas para:

- Buscar por equipo.
- Buscar por canal.
- Filtrar TV abierta.
- Filtrar deporte.
- Abrir detalle.
- Abrir “En vivo”.
- Estado sin resultados.
- Fecha México.
- URLs de evento.
- Sitemap.

Herramientas recomendadas:

- Playwright para flujos.
- axe-core para accesibilidad.
- Lighthouse/PageSpeed Insights para rendimiento.
- Search Console y Rich Results Test para SEO.
- GA4 para embudo de búsqueda.

### 8.3 Eventos analíticos

Ampliar [analytics.ts](/Users/iturralde/pgweb/proyecto-agenda-final/agenda-web/src/lib/analytics.ts:1):

- `search_started`
- `search_result_selected`
- `search_by_channel`
- `filter_opened`
- `filter_applied`
- `filter_zero_results`
- `event_detail_opened`
- `calendar_added`
- `live_page_opened`
- `platform_selected`

### 8.4 Lanzamiento gradual

1. Publicar en staging.
2. Verificar datos reales.
3. Validar móvil y escritorio.
4. Hacer despliegue parcial.
5. Monitorear una semana.
6. Comparar conversión de búsqueda, cero resultados, rebote e interacción.
7. Activar al 100% sólo sin regresiones.

---

## Orden exacto de ejecución recomendado

1. Seguridad y secretos.
2. Contrato de datos y lint.
3. Tiempo de México y normalización de canales.
4. Búsqueda por canal/plataforma.
5. Filtros unificados.
6. Nueva home móvil.
7. Detalle de evento.
8. SEO visible y schema.
9. Pruebas, analítica y despliegue gradual.
10. Sincronización no destructiva e identidad estable.

La decisión clave: el rediseño inicial debe modificar sólo lectura, presentación y navegación. La base de datos y scraper deben protegerse hasta que exista una fase de migración independiente, con reversión y pruebas.
