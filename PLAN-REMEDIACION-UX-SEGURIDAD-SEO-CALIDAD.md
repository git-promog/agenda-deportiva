# Plan de remediación UX, seguridad, SEO y calidad

Este documento conserva el estado operativo del plan y evita depender del historial de un chat. Todo el trabajo de las fases actuales se realiza **en local**. No se debe hacer deploy, ejecutar sincronizaciones ni aplicar SQL en producción hasta completar la fase de staging y la lista de aprobación final.

## Estado de ejecución

- Fases 0 y 1: implementadas localmente.
- Fase 2 — lint y tipado: errores bloqueantes resueltos localmente.
- Fase 3 — móvil y accesibilidad: implementación cerrada administrativamente en local; sus validaciones finales quedaron trasladadas a Fase 3.1.
- Fase 3.1 — QA final de accesibilidad y build local: **completada el 18/08/2026**. Tab y VoiceOver validados manualmente por el usuario; `npm run build` concluyente con éxito (salida en `/tmp/guidasports-build-20260818.log`). Las tres validaciones finales permanecen limpias.
- Fase 4 — identidad estable y sincronización segura: en progreso local; se completó el primer bloque y las pruebas controladas de persistencia/sincronización local de favoritos, sin sincronización remota ni cambios en Supabase.
- `npx tsc --noEmit`: 0 errores.
- `npm run lint`: 0 errores y 0 advertencias.
- `git diff --check`: limpio.
- `npm run build`: la ejecución heredada PID 10897 (`npm run build`) y PID 10909 (`next build`) permaneció 44:49 en estado `S`, con 0.0% de CPU y sin salida posterior a `Creating an optimized production build ...`; se terminó sólo con SIGTERM. Después se detuvo temporalmente `next dev` PID 37920/37921 para evitar competencia sobre `.next` y se ejecutó un único `npm run build` nuevo: shell PID 12649, `npm run build` PID 12651 y `next build` PID 12663. Tras 4:14 sin salida adicional y 0.0% de CPU, también se terminó sólo con SIGTERM. La salida completa quedó conservada en `/private/tmp/guidasports-build-20260812.log`; el build local siguió sin resultado final confirmado hasta el 18/08/2026, cuando un nuevo `npm run build` completó con éxito (ver Fase 3.1).
- El servidor local fue reiniciado sólo después de esa ejecución: PID 12884 (`npm run dev`), padre PID 90713; PID 12896 (`next dev`) y PID 12899 (`next-server (v16.2.1)`), todos en `/Users/iturralde/pgweb/proyecto-agenda-final/agenda-web`, sirviendo `http://localhost:3000`. No se usó `kill -9`, no se borraron locks, `.next` ni archivos fuente, y no queda ningún `next build` activo.
- Riesgo operativo documentado: detener estos procesos sólo afecta la compilación y el servidor local. No afecta producción, deploy, Supabase ni los cambios fuente. El riesgo local es perder la compilación en curso, dejar `.next` parcialmente generado o requerir una recompilación.
- Procedimiento seguro aplicado: confirmar PID, padre, ruta y estado; terminar ordenadamente el build estancado; detener temporalmente `next dev`; ejecutar un único build y conservar su salida; reiniciar `next dev` sólo después del resultado observable. No se limpió ningún artefacto de forma destructiva.
- QA manual responsive y accesibilidad repetido tras el reinicio: en ancho 1280 px no hubo overflow (`scrollWidth` y `clientWidth` de 1265 px); el árbol accesible mostró 1229 controles visibles, todos con nombre y ninguno con `tabindex` positivo. En móvil se observaron 930 controles visibles, todos con nombre y ninguno con `tabindex` positivo. El logotipo anuncia `GuíaSports, inicio` en la versión actual.
- Menú móvil: `aria-expanded` cambia a `true`, el foco inicial pasa a `AGENDA`, `Escape` cierra y devuelve el foco al botón. Modal: `role="dialog"`, `aria-modal="true"`, foco inicial en `Cerrar`, `Escape` cierra, restaura el foco al evento y devuelve el scroll a `unset`.
- La prueba de Tab real no pudo completarse con el controlador de navegador asistido: la tecla `Tab` no movió el foco después de enfocarlo mediante click, aunque `Escape` sí funcionó en menú y modal. Por tanto, queda pendiente un recorrido completo real con teclado y lector de pantalla OS; el árbol accesible y la auditoría estática no sustituyen esas dos validaciones.
- Deploy: deliberadamente pendiente.
- Rotación de credenciales y aplicación de RLS: pendientes manuales para el cierre del plan.

## Orden de fases

1. Protección y baseline.
2. Seguridad administrativa.
3. Tipado estricto y lint global.
4. Navegación móvil y accesibilidad.
4.1. QA final de accesibilidad y build local.
5. Identidad estable y sincronización segura.
6. Detalle de evento y favoritos.
7. SEO, schemas y contenido.
8. Pruebas automatizadas y analítica.
9. Staging, QA, release gradual y monitoreo.

Nota de nomenclatura: para el trabajo operativo usamos Fase 0 = baseline, Fase 1 = seguridad, Fase 2 = lint/tipado y Fase 3 = móvil/accesibilidad. Por eso la Fase 3 aparece como el punto 4 en esta lista secuencial.

## Fase 3 — móvil y accesibilidad

Estado: **implementación cerrada administrativamente en local; validación técnica final trasladada a Fase 3.1**.

Archivos principales modificados:

- `agenda-web/src/components/NavMobile.tsx`
- `agenda-web/src/components/Header.tsx`
- `agenda-web/src/components/EventListWithModal.tsx`
- `agenda-web/src/components/SportEventCard.tsx`
- `agenda-web/src/components/SportEventModal.tsx`
- `agenda-web/src/app/globals.css`
- `agenda-web/src/app/layout.tsx`

Correcciones registradas: navegación ARIA, foco visible, soporte de teclado y Escape, objetivos táctiles, responsive del dock móvil, safe area, reducción de movimiento, prevención de overflow y controles condicionales.

Validaciones estáticas y manuales reportadas por esta sesión:

- `npx tsc --noEmit`: 0 errores.
- `npm run lint`: 0 errores y 0 advertencias.
- `git diff --check`: limpio.
- Viewports comprobados: 320, 375, 768 y 1280 px; sin overflow horizontal observado.
- Menú móvil: nombre accesible, apertura, foco inicial, foco visible, cierre con `Escape` y retorno al botón disparador.
- Modal: `role="dialog"`, `aria-modal`, foco inicial en `Cerrar`, cierre con `Escape`, bloqueo de scroll y retorno al botón que abrió el modal.
- Árbol DOM accesible: navegación, búsqueda, controles de evento, modal y acciones exponen nombres comprensibles.
- El enlace del logotipo del encabezado recibió `aria-label="GuíaSports, inicio"` en el código fuente y la versión actual reiniciada ya lo expone en el árbol accesible.

La implementación de esta fase se considera cerrada para permitir la continuidad del trabajo local. Esto no equivale a una certificación técnica final: los pendientes de accesibilidad y build quedan registrados en Fase 3.1 y bloquean cualquier cierre de QA/release.

Errores restantes de esta fase:

- No hay errores de TypeScript, ESLint ni formato.
- El build `next build` se estanca en `Creating an optimized production build ...` sin resultado final confirmado; no se debe repetir ni limpiar su estado sin una decisión operativa posterior.
- El árbol accesible y la auditoría de nombres pasaron en desktop y móvil, y los flujos críticos de menú/modal pasaron; no se pudo sustituir con esta sesión una prueba real de lector de pantalla OS ni un recorrido completo de Tab porque el controlador no desplazó el foco con esa tecla.
- La aplicación ahora se prueba mediante el `next dev` reiniciado y la pestaña local refleja el encabezado actual. La validación final de build y las dos pruebas manuales de teclado/lector se trasladan a Fase 3.1.
- La intervención local autorizada se ejecutó completa: se conservaron los artefactos y la salida, se usaron sólo señales normales y no se modificó producción, Supabase, deploy, staging ni el código fuente.

## Fase 3.1 — QA final de accesibilidad y build local

Estado: **completada en local el 18/08/2026; sin deploy, staging, sincronizaciones ni cambios en Supabase**.

Objetivo: completar las validaciones que no pudieron cerrarse con el navegador asistido y confirmar que el proyecto puede producir un build local concluyente.

Resultado de las validaciones (18/08/2026):

1. **Recorrido completo de `Tab`:** realizado manualmente por el usuario sobre la agenda y los controles persistentes. Navegación sencilla, sin pérdida de foco ni controles inaccesibles observados; retorno al inicio funcionando.
2. **Lector de pantalla OS (VoiceOver):** realizado manualmente por el usuario sobre encabezado, búsqueda, filtros, eventos, menú móvil, modal y pie de página. Descripciones auditivas correctas y comprensibles en todos los flujos críticos.
3. **Build local concluyente:** `npm run build` **completó con éxito** el 18/08/2026. Salida conservada en `/tmp/guidasports-build-20260818.log`: `✓ Compiled successfully in 4.2s`, `Finished TypeScript in 3.1s`, `✓ Generating static pages using 11 workers (173/173) in 2.7s`, finalización y resumen de rutas (sin errores ni advertencias). Se ejecutó un único build con el `next dev` detenido temporalmente para evitar competencia sobre `.next`; no hubo estancamiento, no se usó `kill -9` ni se borraron artefactos.

Criterios de cierre de Fase 3.1 — estado:

- Recorrido completo de `Tab` documentado sin pérdida de foco ni controles inaccesibles: **cumplido**.
- Lector de pantalla OS documentado para los flujos críticos, sin nombres o estados incomprensibles: **cumplido**.
- `npm run build` termina con resultado explícito y salida conservada: **cumplido**.
- `npx tsc --noEmit`, `npm run lint` y `git diff --check` continúan limpios: **cumplido** al cierre.

Nota operativa adicional (18/08/2026): durante el QA se reportó `Autenticación no disponible` en el login de `/admin`. Causa: `ADMIN_SESSION_SECRET` no estaba en el entorno del `next dev`. Se generó con `openssl rand -hex 32` y se agregó a `agenda-web/.env.local` (sin leer el archivo ni exponer el valor), se reinició el dev server y el login funcionó. No se modificó código fuente.

Límites: esta fase se ejecutó sólo en local. No autoriza deploy, staging, sincronizaciones, SQL, cambios en Supabase ni rotación de credenciales.

## Fase 4 — identidad estable y sincronización segura

Estado: **en progreso local; auditoría de alcance y pruebas controladas de almacenamiento completadas**.

Alcance operativo de esta sesión:

- Los partidos del Mundial usan identificadores estables (`m1`…`m104`) y los eventos procedentes de Supabase se normalizan a `String(e.id)` antes de llegar a la interfaz.
- La sesión administrativa firmada y sus cookies pertenecen a la remediación de seguridad previa; no se modifican en esta fase.
- La sincronización remota de favoritos no se implementa: queda fuera de esta intervención y no se ejecutan sincronizaciones, SQL ni cambios en Supabase.

Cambios realizados:

- `agenda-web/src/hooks/useFavorites.ts`: se centralizó la clave de almacenamiento, se validó y deduplicó el contenido persistido, se manejó JSON inválido sin romper el listener, se sincronizó el borrado entre pestañas y se separó la persistencia del actualizador de estado de React.
- `agenda-web/src/components/CookieConsent.tsx`: se protegieron las lecturas y escrituras de consentimiento ante almacenamiento del navegador bloqueado o no disponible; el aviso puede cerrarse en la sesión aunque `localStorage` no acepte la escritura.

Auditoría de alcance realizada:

- Los únicos consumidores de `localStorage` en `agenda-web/src/` son `useFavorites.ts` (`wc_favorites`) y `CookieConsent.tsx` (`cookie-consent`). No existen consumidores de `sessionStorage`.
- Los filtros de agenda y del Hub del Mundial (`fecha`, `fase`, `sede`, búsqueda, zona horaria y favoritos visibles) viven en estado de React; no se encontró persistencia oculta de filtros.
- `MATCHES` contiene 104 identificadores propios, únicos y consecutivos (`m1`…`m104`). Las tarjetas, modales, calendario visual, favoritos y rutas de partido consumen `match.id`; las sedes usan `sede.id`.
- Las listas dinámicas de eventos y partidos usan sus IDs. Los usos restantes de `key={i}`, `key={index}` o equivalentes corresponden a presentación estática, placeholders, separadores, posiciones de tabla o contenido editorial, no a una identidad pública.
- Las URLs de evento y partido conservan un sufijo de ID fuente después de `--`. En eventos dinámicos ese ID proviene de `eventos.id` y se normaliza a string; cambiar su semántica exigiría una decisión de datos/SEO y no se debe improvisar sin tocar la fuente ni migrar URLs.

Validaciones de comportamiento del bloque:

- Un valor no válido en `localStorage` produce una lista vacía segura.
- Los favoritos duplicados o valores que no sean strings se descartan.
- El evento `storage` con `newValue === null` limpia los favoritos en las demás pestañas.
- La escritura local ocurre sólo después de completar la carga inicial.
- La revisión inicial de usos de `key={i}`/`key={index}` encontró únicamente listas estáticas de presentación, placeholders o menús sin identidad pública; las listas de eventos y partidos usan sus IDs.
- Prueba manual en dos pestañas de `/mundial-2026`: añadir en una pestaña actualizó la otra, quitar desde la segunda actualizó la primera y recargar la segunda conservó el favorito persistido. El estado se dejó nuevamente sin favoritos.
- Prueba controlada de JSON inválido: una página local temporal del mismo origen escribió `not-json` en `wc_favorites`; tras recargar `/mundial-2026`, el calendario siguió operativo, no apareció error y los 10 partidos visibles quedaron con 10 botones `Añadir a favoritos` y 0 `Quitar de favoritos`.
- Prueba controlada de `newValue === null`: se añadió un favorito en el Hub (9 botones `Añadir` y 1 `Quitar`), se eliminó la clave desde la segunda pestaña y la primera volvió a 10 `Añadir` y 0 `Quitar`, sin error. La lista vacía se restauró al final.
- La página temporal de prueba se eliminó después de la validación; no se conservaron cambios auxiliares.

Validaciones ejecutadas en esta sesión:

- `npx tsc --noEmit`: 0 errores.
- `npm run lint`: 0 errores y 0 advertencias.
- `git diff --check`: limpio.
- No se ejecutó `npm run build`; permanece como pendiente diferido de Fase 3.1 y no era necesario para este bloque local.

Pendientes de Fase 4:

- La revisión explícita de IDs públicos no encontró índices de array ni valores temporales usados como identidad; mantener esta regla en futuras páginas y scripts.
- Definir, antes de cualquier trabajo futuro, si la sincronización entre dispositivos requiere una decisión de producto y una fase posterior con autorización para Supabase; no inferir esa autorización desde esta fase local.
- Las pruebas controladas de JSON inválido y `newValue === null` quedaron validadas manualmente en local; conservarlas como cobertura de regresión futura, sin presentarlas como pruebas automatizadas.
- La prueba completa de teclado con `Tab`, el lector de pantalla OS y el build concluyente permanecen en Fase 3.1; no se reabren desde Fase 4.

Observación específica del Hub del Mundial:

- El hallazgo de frescura se trasladó formalmente a Fase 6 y quedó implementado localmente: el Hub, las sedes y los 104 detalles ahora comunican archivo histórico con resultados, fechas y sedes; se retiraron countdown, estados activos y copy de transmisión actual.
- La decisión reversible se mantiene: conservar el Hub, las páginas de sede, los detalles de partido y sus URLs como archivo histórico indexable. No se eliminaron funciones, URLs ni datos fuente.
- Si las páginas de sede demuestran poco valor o duplicación después de esa revisión, la alternativa segura sería reducir su enlazado/prioridad o aplicar una política SEO específica, nunca borrarlas ni tocar Supabase desde esta fase. Esta deuda sí puede bloquear el cierre SEO/release del Hub, pero no la auditoría actual de identidad local.

## Intervención separada de Fase 6 — SEO y contenido histórico del Hub del Mundial

Estado: **implementación local completada el 14/08/2026; sin deploy, staging, SQL, sincronizaciones ni cambios en Supabase**.

Superficie revisada:

- `agenda-web/src/app/mundial-2026/layout.tsx`: title, description, keywords, robots, Open Graph, Twitter y canonical.
- `agenda-web/src/app/mundial-2026/page.tsx`: contenido visible, countdown, próximo partido, estados `HOY`/`EN VIVO`, FAQPage y `SportsEvent` JSON-LD.
- `agenda-web/src/components/mundial/WCCountdown.tsx` y `WCMatchCard.tsx`: cuenta regresiva, etiquetas temporales y enlaces de streaming.
- `agenda-web/src/app/mundial-2026/[sede_id]/page.tsx`: metadatos, `StadiumOrArena`, eventos de sede y enlaces internos.
- `agenda-web/src/app/mundial-2026/partido/[slug]/page.tsx`: metadatos, canonical, `SportsEvent`, transmisión y resumen.
- `agenda-web/src/app/sitemap.ts` y `agenda-web/src/app/robots.ts`: cobertura, prioridad, frecuencia, `lastModified` y directivas de rastreo.
- `agenda-web/src/data/mundialData.ts`: 104 partidos, fechas, marcadores, sedes e identificadores.

Hallazgos:

1. **P0 — Semántica temporal incorrecta:** los datos cubren del `2026-06-11` al `2026-07-19`, pero el Hub mantiene “Cuenta Regresiva”, “El sueño comienza”, “Inicia en”, “Próximo partido”, “Calendario Oficial” y `EventScheduled`. Después del 19 de julio, `WCCountdown` queda en ceros y las sedes muestran `Iniciado`, pero no existe un modo histórico explícito.
2. **P0 — Schema de evento obsoleto:** el Hub publica un `SportsEvent` agregado y los primeros 30 partidos con `eventStatus` `EventScheduled`; cada página de partido también conserva ese estado aunque las fechas ya terminaron. Las páginas de sede publican eventos sin estado, URL, `endDate` ni zona horaria explícita.
3. **P1 — Mensajes de transmisión potencialmente engañosos:** `WCMatchCard` muestra `EN VIVO` sólo porque existe `match.streaming`, sin comprobar que el partido esté en vivo; el detalle y el modal conservan “Ver partido en vivo”/“Ver en vivo”. Para un archivo deben convertirse en transmisión histórica o retirarse cuando no exista una fuente archivada verificable.
4. **P1 — Metadatos orientados al futuro:** Hub, sedes y partidos usan “calendario oficial”, “horarios”, “dónde ver” y “se jugarán”. Las páginas de partido no exponen marcador aunque `mundialData.ts` sí contiene goles; eso reduce el valor histórico del contenido.
5. **P1 — Sitemap desactualizado en sus señales:** incluye 121 URLs del Mundial (1 Hub, 16 sedes y 104 partidos), todas con `lastModified` fijo `2026-04-25`, `daily` para el Hub y `weekly` para sedes/partidos, además de prioridades altas. `robots.ts` permite el rastreo, decisión compatible con conservar el archivo, pero las señales deben revisarse cuando se actualice el modo histórico.
6. **P2 — FAQ y enlazado:** las preguntas frecuentes están redactadas en futuro (“¿Cuándo empieza?”, “¿Dónde será la final?”), y las sedes enlazan al Hub y al calendario como si fueran recursos activos. Los enlaces y las URLs deben conservarse, pero con copy histórico y prioridades revisadas.

Decisiones y recomendaciones:

- Mantener indexables el Hub, las 16 sedes y los 104 detalles; no se eliminó ninguna URL, función ni dato fuente.
- El modo histórico se deriva de la fecha final del torneo mediante `agenda-web/src/lib/worldCupArchive.ts`; al 14/08/2026 todos los partidos se presentan como finalizados.
- Se retiraron countdown, mensajes activos y enlaces de streaming sin fuente archivada verificable; las cadenas conservadas se muestran como transmisión registrada.
- Se actualizaron titles, descriptions, FAQ, Open Graph, canonical, datos estructurados y sitemap en la misma intervención.
- Las páginas de sede conservan su enlazado y prioridad reducida; cualquier política SEO adicional requiere medición posterior y no implica borrado.

### Resultado de la implementación local

- Hub: cabecera y copy de archivo, bloque “El torneo concluyó”, FAQ histórica, resultados visibles, sin countdown ni “Próximo partido”, sin “HOY”/“EN VIVO” y `SportsEvent` con `EventCompleted`.
- Sedes: metadata histórica con canonical/Open Graph; schema de cada partido con `startDate`, `endDate`, URL, ubicación, equipos, resultado y `EventCompleted`; listado titulado “Archivo de partidos y resultados”.
- Partidos: title/description históricos, canonical/Open Graph, resultado final visible, schema completado y transmisión registrada sin enlace “Ver en vivo”.
- Componentes compartidos: tarjetas y modal muestran `FINALIZADO`, marcadores y transmisión registrada; `WCCountdown.tsx` conserva su ruta de componente pero ahora presenta una nota de archivo sin contador.
- Sitemap: se conservan las 121 URLs del Mundial; Hub, sedes y partidos usan `lastModified` `2026-08-14`, frecuencia `yearly` y prioridades históricas reducidas.
- No se modificó `agenda-web/src/data/mundialData.ts`, scripts auto-generados, Supabase, APIs de escritura, SQL, `.env`, `.env.local`, `.next` ni `node_modules`.

Validaciones de esta intervención:

- `npx tsc --noEmit`: **0 errores**.
- `npm run lint`: **0 errores, 0 advertencias**.
- `git diff --check`: **limpio**.
- Revisión textual de las superficies del Mundial: no quedan countdown, “EN VIVO”, “Ver partido en vivo”, “Ver en vivo”, “Calendario Oficial”, “Inicia en” ni FAQ futura en el Hub y sus componentes; el schema activo del Hub/sedes/partidos quedó en `EventCompleted`.

Pendientes, riesgos y decisiones:

- El build concluyente sigue diferido a Fase 3.1; no se repitió automáticamente por la instrucción vigente.
- La validación externa de Rich Results Test/Search Console y la medición de rendimiento orgánico de sedes quedan para staging; no se ejecutan en esta línea local.
- `streaming` permanece en los datos fuente auto-generados para no tocarlos, pero ya no se representa como enlace o disponibilidad actual.
- `robots.ts` continúa permitiendo el rastreo: decisión deliberada para conservar el archivo histórico y sus URLs.
- Riesgo residual: el contenido de noticias cargado desde Supabase puede tener copy temporal propio; esta intervención no alteró ni sincronizó esa fuente.

Riesgo de la decisión: conservar contenido temporal sin actualizarlo puede generar señales contradictorias para usuarios y buscadores; eliminarlo ahora puede perder valor histórico y URLs compartidas. La opción reversible es conservar y transformar.

Límites: Fase 4 continúa únicamente en local. Fase 3.1 permanece diferida y no se reabre desde esta intervención.

### QA local de SEO histórico — 14/08/2026 (sin build)

Estado: **completada en modo lectura; no se modificó código, datos fuente, Supabase ni configuración**.

Alcance revisado estáticamente:

- JSON-LD del Hub (`mundial-2026/page.tsx`), sedes (`mundial-2026/[sede_id]/page.tsx`) y detalles (`mundial-2026/partido/[slug]/page.tsx`).
- Metadata: `mundial-2026/layout.tsx`, `generateMetadata` de sede y partido.
- `sitemap.ts`, `robots.ts`, `lib/worldCupArchive.ts`, `lib/worldCupUrls.ts` y componentes `mundial/*`.
- Superficies de noticias (`noticias/[slug]/page.tsx`) como fuente potencial de copy temporal, sin modificarla.

Confirmaciones:

1. **Schema de partido completo en sedes y detalles:** `startDate`, `endDate`, `eventStatus: EventCompleted`, equipos (`performer`/`homeTeam`/`awayTeam`/`competitor`), ubicación (`Place` + `PostalAddress`), resultado visible y/o descripción coherente y `url` canónica válida. Los 104 partidos tienen `goles1`/`goles2` definidos y campo `utc`; no existe "Marcador no disponible" en la práctica.
2. **Hub:** `SportsEvent` agregado del torneo con `startDate`/`endDate`/`EventCompleted`, 16 `Place`, organizador FIFA y descripción histórica; `FAQPage` histórica y `BreadcrumbList` presentes. Los primeros 30 partidos se publican con `EventCompleted`, fechas y descripción con resultado.
3. **Canonical y Open Graph:** confirmados en `/mundial-2026` (layout), en sedes y en detalles de partido (`generateMetadata` con `alternates.canonical`, `openGraph` y `twitter` coherentes con el modo histórico).
4. **Sitemap:** conserva exactamente 121 URLs del Mundial (1 Hub + 16 sedes + 104 partidos, verificado contra `mundialData.ts`: `SEDES` = 16, `MATCHES` = 104). Señales históricas: `lastModified` `2026-08-14` (`WORLD_CUP_ARCHIVE_LAST_MODIFIED`), `changeFrequency: yearly`, prioridades 0.8 (Hub), 0.6 (sedes) y 0.65 (partidos).
5. **robots.ts:** permite rastreo general y declara el sitemap; sin cambios.
6. **Streaming:** el campo `streaming` de los datos fuente no tiene ningún consumidor en `src/`; no existe enlace activo de streaming presentado como actual. Las cadenas se muestran sólo como "Transmisión registrada" textual. Los únicos enlaces externos del modal son Google Calendar, la página de detalle y compartir.
7. **Revisión textual:** sin countdown, `EventScheduled`, "EN VIVO", "Ver en vivo", "Ver partido en vivo", "Calendario Oficial", "Inicia en" ni FAQ futura en las superficies del Mundial. Las coincidencias de `EN VIVO`/`EventScheduled` restantes pertenecen a la agenda dinámica general (home, `evento/[slug]`), que sí describe eventos vigentes y queda fuera del alcance de esta QA.

Hallazgos nuevos (no bloqueantes; QA de sólo lectura, correcciones diferidas a una siguiente sesión autorizada):

- **H1 (P2):** los 30 `SportsEvent` de partido emitidos por el Hub dentro del array JSON-LD no incluyen `"@context"` propio; los parsers de datos estructurados pueden ignorarlos. Tampoco incluyen `url` al detalle del partido, que existe y es canónica.
- **H2 (P2):** en el Hub, `addressCountry` de cada partido se infiere con `m.estadio.includes('Azteca'|'Akron'|'BBVA')`, pero los valores reales son "Estadio Ciudad de México", "Estadio Guadalajara" y "Estadio Monterrey": la heurística nunca coincide y los partidos de México y Canadá quedan marcados como `US`. Las páginas de sede sí usan el país correcto desde `sede.pais`.
- **H3 (P3):** el detalle de partido usa `image: GuiaSports-logo.svg` en el schema; Google no admite SVG como imagen de datos estructurados. El Hub y las tarjetas OG ya usan `.webp`.
- **H4 (P3):** `result` del detalle se emite como cadena simple (`"2–0"`); schema.org espera un `Thing` estructurado. Es tolerado, pero mejorable.
- **H5 (P3):** `WCMatchModal` conserva el botón "Agendar" (Google Calendar) para partidos ya disputados; el copy es histórico, pero la acción crea eventos de calendario en el pasado.
- **H6 (P3, riesgo conocido confirmado):** `noticias/[slug]/page.tsx` genera FAQ con copy futuro para cualquier noticia —incluidas las del Mundial—: "está programado para", "estará disponible", "antes del silbatazo", "ver ... en vivo en México" (fallback de description). No se modificó esa fuente; su remediación requiere decisión separada.
- **H7 (observación):** `WCCountdown.tsx` ya no se importa en ninguna superficie; permanece como componente de compatibilidad, decisión deliberada ya documentada.
- **H8 (observación de datos):** sólo 8 de 104 partidos tienen `broadcasters`; los 96 restantes muestran el fallback "No se registró una fuente histórica de transmisión." No se tocaron los datos auto-generados.
- **H9 (observación SEO menor):** el Hub conserva `priority: 0.8` en el sitemap, igual que los hubs activos (`nba`, `mlb`, `f1`); es reducida respecto a su valor anterior, pero no respecto a los hubs vigentes.

Validaciones ejecutadas al final de esta QA:

- `npx tsc --noEmit`: **0 errores**.
- `npm run lint`: **0 errores, 0 advertencias**.
- `git diff --check`: **limpio**.
- `npm run build`: **no ejecutado**, conforme a la instrucción vigente; permanece diferido a Fase 3.1.

Siguiente paso recomendado: una sesión breve de remediación de schemas (H1–H4, y valorar H5) limitada a `mundial-2026/page.tsx` y `partido/[slug]/page.tsx`, con las mismas tres validaciones y sin build; la validación externa (Rich Results Test, Search Console) sigue requiriendo staging autorizado.

### Remediación local de schemas — 14/08/2026 (sin build)

Estado: **completada en modo local; sólo se modificaron `mundial-2026/page.tsx`, `mundial-2026/partido/[slug]/page.tsx` y `WCMatchModal.tsx`. No se tocaron datos fuente, scripts, Supabase, sitemap, robots ni URLs.**

Cambios aplicados sobre los hallazgos de la QA anterior:

- **H1 (resuelto):** los 30 `SportsEvent` de partido del Hub ahora incluyen `"@context": "https://schema.org"` y `"url"` canónica del detalle (`buildWorldCupMatchUrl`), coherente con las URLs del sitemap.
- **H2 (resuelto):** se sustituyó la heurística por estadio (`includes('Azteca'|'Akron'|'BBVA')`) por `getVenueAddressCountry(m.estadio)`, que resuelve el país real desde `SEDES` (`México` → `MX`, `Canadá` → `CA`, `USA` → `US`). Los 16 estadios de `MATCHES` coinciden 1:1 con `SEDES.estadio` (verificado); los partidos de México (Ciudad de México/Guadalajara/Monterrey) y Canadá (Toronto/BC Place Vancouver) dejan de emitirse como `US`.
- **H3 (resuelto):** la imagen del schema del detalle pasó de `GuiaSports-logo.svg` (SVG no admitido por Google en datos estructurados) a `https://www.guiasports.com/images/mundial/Copa_Mundial_FIFA_2026-logo.webp`, la misma imagen `.webp` ya usada por el Hub.
- **H4 (resuelto):** `result` del detalle pasa de cadena simple a un `Thing` estructurado: `SportsEvent` con `name` (incluye el marcador), `homeTeam`, `awayTeam` y `eventStatus: EventCompleted`.
- **H5 (aprobado y resuelto):** se retiró el botón "Agendar" (Google Calendar) del modal `WCMatchModal`; los 104 partidos están completados (`EventCompleted`) y la invitación quedaba en el pasado. Quedan "Página" y "Compartir" en rejilla de 2 columnas; se eliminó el código asociado (`buildCalendarLink`, icono `CalendarPlus`, import `getWorldCupResult`).
- **H6:** resuelto en sesión posterior con decisión separada (ver sección siguiente "Remediación local de FAQ de noticias — 14/08/2026").

Notas de verificación:

- `buildWorldCupMatchUrl` es seguro en componente cliente: `SITE_URL` es una constante de módulo y `WCMatchModal` ya la consume desde un componente `"use client"`.
- Tras H5, los enlaces externos del modal se reducen a compartir; ya no existe ningún enlace de calendario en el archivo histórico.

Validaciones ejecutadas al final de esta remediación:

- `npx tsc --noEmit`: **0 errores**.
- `npm run lint`: **0 errores, 0 advertencias**.
- `git diff --check`: **limpio**.
- `npm run build`: **no ejecutado**, conforme a la instrucción vigente; permanece diferido a Fase 3.1.

Siguiente paso: la validación externa (Rich Results Test, Search Console) sigue requiriendo staging autorizado; Fase 3.1 permanece diferida y no se reabre desde esta intervención.

### Remediación local de FAQ de noticias — 14/08/2026 (sin build)

Estado: **completada en modo local; decisión aprobada por el usuario. Sólo se modificó `agenda-web/src/app/noticias/[slug]/page.tsx`. No se tocaron datos fuente, scripts, Supabase, sitemap, robots ni URLs.**

Decisión aprobada (opción recomendada): mantener la FAQ (visible y JSON-LD `FAQPage`) para todas las noticias, pero si la noticia ya es histórica usar copy en pasado/neutral en lugar del copy futuro. Señal utilizada: `noticia.fecha` (fecha de publicación, `YYYY-MM-DD`) comparada contra hoy en zona de México vía `getTodayMexicoString()`; si `fecha < hoy`, la noticia se trata como histórica.

Cambios aplicados sobre H6:

- **Helper `isNoticiaHistorica(fecha)`:** compara `fecha` contra `getTodayMexicoString()` (fecha de México); sin fecha devuelve `false` (se conserva el comportamiento de previa).
- **`getFaqs` con modo histórico:** para noticias históricas las tres preguntas y respuestas usan copy en pasado: "¿Cuándo y a qué hora se disputó...?", "se disputó...", "¿En qué canal... se transmitió...?", "estuvo disponible a través de las señales de...", "¿Cómo se transmitió en vivo online y por streaming...?", "se transmitió de forma online y por streaming...". Las noticias vigentes conservan el copy futuro original ("está programado para", "estará disponible", "antes del silbatazo"). El JSON-LD `FAQPage` se genera desde el mismo `faqs`, por lo que el rich result de noticias históricas ya no emite copy futuro.
- **`buildSeoDescription` con fallback histórico:** el fallback de description para noticias históricas pasa de "ver ${title} en vivo en México" a "Consulta el horario, canal de TV y streaming del partido de ${title} disputado en México."; las vigentes conservan el texto original. La llamada en `generateMetadata` ahora pasa `noticia.fecha`.

Notas:

- La señal es la fecha de publicación; si una noticia describe un evento que aún no ocurre pero su `fecha` ya pasó, se trataría como histórica. Es el límite aceptado de la decisión (no existe un campo de fecha de evento confiable en la fuente).
- No se modificó el contenido del artículo, la sección visible de FAQ ni el schema `NewsArticle`; sólo cambia el copy derivado según temporalidad.

Validaciones ejecutadas al final de esta remediación:

- `npx tsc --noEmit`: **0 errores**.
- `npm run lint`: **0 errores, 0 advertencias**.
- `git diff --check`: **limpio**.
- `npm run build`: **no ejecutado**, conforme a la instrucción vigente; permanece diferido a Fase 3.1.

Siguiente paso: con H1–H6 cerrados en local, queda pendiente la validación externa (Rich Results Test, Search Console) que requiere staging autorizado; Fase 3.1 permanece diferida y no se reabre desde esta intervención. Hallazgos restantes sin acción requerida: H7, H8 y H9.

## Sesión de cierre de Fase 3.1 — 18/08/2026

Estado: **Fase 3.1 completada en local; Tab y VoiceOver validados manualmente por el usuario y `npm run build` concluyente con éxito**.

Registro:

- Paso 0 (pre-flight): se confirmaron los procesos `next dev` activos y la ausencia de builds concurrentes; el log de referencia `/private/tmp/guidasports-build-20260812.log` ya no existía.
- Incidencia no bloqueante detectada durante el QA manual: el login de `/admin` devolvía `Autenticación no disponible`. Diagnóstico: `ADMIN_SESSION_SECRET` no estaba en el entorno del `next dev` (`login/route.ts` devuelve ese error cuando la variable falta). Corrección local: se generó un secreto con `openssl rand -hex 32` y se agregó a `agenda-web/.env.local` sin leer el archivo ni exponer el valor; se reinició el dev server y el login funcionó. No se modificó código fuente.
- Paso 1 (recorrido completo de `Tab`): realizado manualmente por el usuario. Navegación sencilla, sin pérdida de foco ni controles inaccesibles; retorno al inicio funcionando.
- Paso 2 (VoiceOver): realizado manualmente por el usuario. Descripciones auditivas correctas y comprensibles en encabezado, búsqueda, filtros, eventos, menú móvil, modal y pie de página.
- Paso 3 (build concluyente): se detuvo temporalmente `next dev` con SIGTERM para evitar competencia sobre `.next` y se ejecutó un único `npm run build`. Resultado: **éxito** — `✓ Compiled successfully in 4.2s`, TypeScript en 3.1s, `173/173` páginas estáticas generadas; salida completa conservada en `/tmp/guidasports-build-20260818.log`. Sin errores ni advertencias.
- Tras el build se reinició `next dev` (log `/tmp/guidasports-dev-20260818.log`); responde HTTP 200 en `/`, `/mundial-2026` y `/admin/login`.

Criterios de cierre de Fase 3.1:

- Recorrido completo de `Tab` documentado sin pérdida de foco ni controles inaccesibles: **cumplido**.
- Lector de pantalla OS documentado para los flujos críticos: **cumplido**.
- `npm run build` con resultado explícito y salida conservada: **cumplido**.
- `npx tsc --noEmit`, `npm run lint` y `git diff --check` continúan limpios: **cumplido**.

Validaciones ejecutadas al cierre:

- `npx tsc --noEmit`: **0 errores**.
- `npm run lint`: **0 errores, 0 advertencias**.
- `git diff --check`: **limpio**.

Pendientes que permanecen:

- Validación externa (Rich Results Test, Search Console) y ciclo de staging: requieren autorización.
- Pendientes manuales del cierre del plan: rotación de credenciales (A), RLS (B), `.env.example` (C) y el resto del orden de fases (staging, QA, release gradual, monitoreo).

Límites: esta sesión se ejecutó sólo en local. No se hizo deploy, staging, sincronizaciones ni cambios en Supabase.

## Sección de contingencia y reversión (baseline-pre-staging)

Estado: **activa desde el 18/08/2026. Protege todo el avance local antes del ciclo de staging/validación externa.**

Objetivo: permitir abortar el ciclo de staging en cualquier momento y restaurar el estado aprobado local sin depender del historial del chat.

### Capa 1 — Punto de restauración Git

- Commit: `f0c1b5b baseline-pre-staging: estado aprobado del plan de remediacion (Fases 0-4, 6 y QA SEO local)`.
- Tag: `baseline-pre-staging`.
- Rama: `main` (local, sin push). Contiene todo el working tree de las fases 0-4, 6 y QA SEO local.
- Restaurar el estado aprobado en la rama actual (descartando cambios del staging):

```bash
git checkout baseline-pre-staging
git reset --hard baseline-pre-staging   # sólo si se quiere descartar el estado actual
```

- Para volver a `main` desde `staging` sin perder el baseline:

```bash
git checkout main
git tag -f baseline-pre-staging        # ya existe; no re-crear
```

### Capa 2 — Rama aislada de staging

- Rama de trabajo del ciclo de staging/validación externa: `staging` (creada desde `baseline-pre-staging`).
- `main` queda congelado en el estado aprobado. Si el ciclo colapsa, se borra `staging` y se continúa desde `main`:

```bash
git checkout main
git branch -D staging   # descarta la rama de staging local
```

### Capa 3 — Respaldo externo de secretos y artefactos

- `agenda-web/.env.local` copiado fuera del repo: `/tmp/backup-env-20260818/.env.local.baseline` (sha256 `69c89e0306e651859e10fe162ac55d511b865e48c8f6e6c8e57c75f24e2659b8`).
- Logs conservados: `/tmp/guidasports-build-20260818.log` (build concluyente), `/tmp/guidasports-dev-20260818.log` (dev server).
- Antes de cualquier SQL/RLS en Supabase: confirmar backup reciente en `Database → Backups` y documentar su fecha/identificador en este plan.

### Criterios de aborto del ciclo de staging (se dispara con cualquiera)

1. Un paso de staging modifica `main` o el baseline de forma no prevista.
2. Un paso requiere SQL/RLS/escritura en Supabase sin backup reciente confirmado y documentado.
3. `npx tsc --noEmit`, `npm run lint` o `git diff --check` dejan de pasar en la rama de staging.
4. El deploy a staging rompe login, lectura, edición, publicación o generación de noticias y no existe reversión del proveedor inmediata.
5. Cualquier decisión de la lista de "Regla de no deploy" se intenta omitir.

### Reversión por capa

- **Código local:** `git checkout main && git branch -D staging` (o `git reset --hard baseline-pre-staging` si se trabaja sobre `main`).
- **Supabase:** restaurar desde el backup documentado; no ejecutar SQL adicional sin confirmarlo.
- **Secreto de sesión admin:** restaurar `/tmp/backup-env-20260818/.env.local.baseline` a `agenda-web/.env.local`.
- **Servidor local:** reiniciar `npm run dev` con el log `/tmp/guidasports-dev-20260818.log` como referencia.

## Pruebas automatizadas (Vitest) — 18/08/2026

Estado: **implementadas en la rama `staging` (aislada desde `baseline-pre-staging`). Sin deploy, sin Supabase, sin cambios de datos.**

Motivo: cerrar el prerrequisito "pruebas críticas automatizadas" de la "Regla de no deploy" antes del ciclo de staging/validación externa.

Cambios realizados:

- `agenda-web/vitest.config.mts`: config Vitest con `@vitejs/plugin-react`, resolución de paths de tsconfig nativa y entorno `jsdom`.
- `agenda-web/package.json`: scripts `test` (`vitest run`) y `test:watch` (`vitest`).
- DevDependencies: `vitest`, `@vitejs/plugin-react`, `jsdom`, `@testing-library/react`, `@testing-library/dom`, `vite-tsconfig-paths` (instalado y luego reemplazado por `resolve.tsconfigPaths` nativo; se mantiene en dependencias).

Cobertura crítica mínima (4 archivos, 33 tests):

- `src/lib/adminSession.test.ts`: creación de token firmado, verificación, rechazo de token alterado/expirado/malformado, `isAdminRequest` (cookie válida, ausente o forjada) e `isAuthorizedAdminRequest` (Bearer con `ADMIN_API_SECRET` correcto/incorrecto/ausente).
- `src/app/api/admin/adminApi.test.ts`: login fail-closed sin `ADMIN_SESSION_SECRET` (500) y sin `ADMIN_PASSWORD` (500), contraseña incorrecta (401), contraseña correcta (200 con cookie HttpOnly+SameSite), password no-string (401); session con/sin cookie; logout que borra la cookie.
- `src/hooks/useFavorites.test.tsx`: arranque vacío, JSON inválido → lista vacía, duplicados y no-strings descartados, toggle añadir/quitar, persistencia post-carga, `newValue === null` limpia entre pestañas, evento `storage` sincroniza.
- `src/lib/mexicoTime.test.ts`: zona horaria, formato `YYYY-MM-DD`, `isEventLive`, `isUpcomingOrToday`, `formatMexicoDate` (Hoy/corto/button), `getDateRangeMexico`.

Validaciones:

- `npm run test`: **4 archivos / 33 tests pasan**.
- `npx tsc --noEmit`: **0 errores**.
- `npm run lint`: **0 errores, 0 advertencias**.
- `git diff --check`: **limpio**.
- Commit: `9a3a07f test: cobertura critica minima con Vitest (adminSession, APIs admin, useFavorites, mexicoTime)` en rama `staging`.

Pendientes: los escenarios validados manualmente en Fase 4 (JSON inválido, `newValue === null`) quedaron formalizados como pruebas de regresión automatizadas. Queda el resto del prerrequisito de staging (backup Supabase, rotación de credenciales, RLS, staging aprobado) y la validación externa (Rich Results Test, Search Console).

## Definición del entorno de staging en Vercel — 18/08/2026

Estado: **proveedor confirmado (Vercel); entorno Preview operativo; validación externa de Rich Results en curso y mayormente superada**. La rama `staging` ya fue pusheada a GitHub (`git push -u origin staging`), Vercel generó el preview y quedó **Ready** en `agenda-deportiva-git-staging-rauls-projects-5e98afa6.vercel.app`. Se cargaron las env vars en el entorno Preview y se hizo redeploy. El preview responde `302` hacia el SSO de Vercel mientras está activa la Deployment Protection, por lo que, para permitir la validación externa (Rich Results Test/Search Console), se desactivó temporalmente la protección (ver paso 7 de reversión obligatoria).

Aclaración: "definir el proveedor de staging" no implicaba elegir un proveedor nuevo. El proyecto ya usa Vercel para producción (dominio particular conectado). El trabajo de staging consiste en **aislar un entorno Preview dentro del mismo Vercel**, sin tocar el dominio ni la rama de producción.

### `agenda-web/vercel.json` (draft, en rama `staging`)

Creado con configuración mínima: `framework: "nextjs"`, `buildCommand: "next build"` e `installCommand: "npm ci"`. Next.js se autodetecta en Vercel; este archivo fija explícitamente el comportamiento y documenta la intención. No afecta al build local ni a otras plataformas.

### Pasos de configuración del entorno Preview en Vercel (manuales, pendientes de ejecución)

1. En Vercel abrir el proyecto (el que ya está conectado al repo `git-promog/agenda-deportiva`).
2. Confirmar que **Production Branch es `main`**. Si no, cambiarla a `main` para que `staging` nunca pise producción.
3. Conectar/confirmar la rama `staging` como rama de Preview: cada push a `staging` generará un deployment en una URL propia (`<proyecto>-git-staging-<hash>.vercel.app`), sin usar el dominio personalizado. **Ejecutado** el 18/08/2026 (`git push -u origin staging`; preview Ready).
4. Cargar las variables de entorno en el entorno **Preview** (o Production, según se rotará en cada fase):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_PASSWORD`
   - `ADMIN_API_SECRET`
   - `ADMIN_SESSION_SECRET`
   - `GEMINI_API_KEY`
   - `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
   Nunca pegar valores en Git. **Ejecutado** el 18/08/2026 (env vars del Preview cargadas y redeploy realizado).
5. Hacer el primer push de `staging` a GitHub para disparar el preview, verificar HTTP 200 en `/`, `/mundial-2026` y `/admin/login`, y ejecutar el QA funcional (Bloque 5 del handoff). **Ejecutado** el 18/08/2026: HTTP 200 en `/`, `/mundial-2026`, `/admin/login`, `/sitemap.xml` y `/robots.txt`; login del panel admin probado por el usuario sin problemas.
6. Definir el dominio del preview: opción recomendada es dejar la URL `.vercel.app` por defecto. Si se quiere un dominio de staging dedicado, decidirlo antes de cualquier SQL/RLS y documentarlo aquí.
7. **Reversión obligatoria de la exposición pública (riesgo de seguridad):** para permitir la validación externa se desactivó temporalmente `Settings → Deployment Protection → Vercel Authentication` en el proyecto. Esto deja el preview (y cualquier futura URL de preview) accesible públicamente sin autenticación. **Obligatorio revertir al terminar la validación externa:** volver a `Settings → Deployment Protection → Vercel Authentication` y reactivar la protección (o limitarla a los usuarios autorizados del equipo). NO cerrar el plan ni hacer deploy a producción con esta protección desactivada. Registrar aquí la fecha/hora de la reactivación.

Límites: este paso es de configuración, no autoriza deploy a producción, SQL, sincronizaciones ni rotación de credenciales.

## Validación externa Rich Results en staging — 18/08/2026

Estado: **primera pasada de Rich Results Test completada sobre el preview; errores críticos de eventos remediados y revalidados sin errores**.

### Hallazgos y decisiones

1. **`noindex` en previews (esperado, no defecto):** Vercel añade `X-Robots-Tag: noindex` por defecto a los previews `.vercel.app`; `www.guiasports.com` (producción) no lo tiene. Rich Results Test sobre la URL de preview siempre reporta ese error de indexación. No es un problema del sitio; la validación real de indexación se hace sobre producción tras el release.
2. **Hub `/mundial-2026` — eventos inválidos:** los `SportsEvent` del Hub (evento agregado + 30 de partido) carecían de `eventAttendanceMode` y `offers` (exigidos por Google para el rich result de Event); el evento agregado también carecía de `url`. **Remediado** en commit `dbf080e`: se agregó `eventAttendanceMode: OfflineEventAttendanceMode`, `offers` (con `url`, `price: 0`, `priceCurrency`, `availability: SoldOut`, `validFrom`/`validThrough`) y `url` al evento agregado.
3. **Home `/` — `ItemList` incompleto:** los hasta 50 `SportsEvent` del `ItemList` del home carecían de `location` (crítico) y de `endDate`, `offers`, `organizer`, `performer` (opcionales). **Remediado** en commit `96c2373` replicando el patrón del detalle `/evento/[slug]`: `location` (`VirtualLocation`), `endDate` (start + 2h), `eventAttendanceMode`, `offers`, `organizer`, `performer`, `url`. Nota: `image` no se agregó porque sólo existe el logo SVG (no soportado por Google en datos estructurados, hallazgo H3); es opcional.

### Revalidación

- Usuario re-corrió Rich Results Test sobre el preview en las 5 páginas solicitadas (home, Hub, una sede, un detalle de partido y una noticia): **ya no aparecen errores**.
- Validaciones locales tras los cambios: `npm run test` 33/33, `npx tsc --noEmit` 0 errores, `npm run lint` 0/0, `git diff --check` limpio.
- Commits en `staging`: `dbf080e` (schema Hub/partido) y `96c2373` (schema home); ambos pusheados y redeployados.

### Pendientes

- Registrar aquí (paso 7 de Vercel) la fecha/hora de **reactivación de la Deployment Protection** tras terminar la validación externa.
- Search Console: validación pendiente (requiere propiedad del dominio y acceso; puede requerir la URL de producción).
- No cerrar el plan ni desplegar a producción con la protección desactivada.

## Continuación del ciclo de staging — 19/08/2026

Estado: **ciclo de staging activo en la rama `staging`; preview Ready; validación externa Rich Results superada sin errores; pendientes manuales del cierre sin ejecutar**.

Registro de esta sesión:

- Confirmado que `staging` está sincronizada con `origin/staging` (`HEAD` = `origin/staging` = `2a4a1e2`), working tree limpio al inicio.
- Re-verificado el preview `agenda-deportiva-git-staging-rauls-projects-5e98afa6.vercel.app`: HTTP 200 en `/`, `/mundial-2026`, `/admin/login`, `/sitemap.xml` y `/robots.txt`. La Deployment Protection sigue desactivada (el preview responde sin SSO), tal como se dejó para la validación externa.
- **Item C avanzado:** se agregó `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` a `agenda-web/.env.example` (era la única variable cargada en el preview que no estaba documentada en el ejemplo; se usa en `src/app/layout.tsx`). El archivo ya estaba versionado desde el baseline; este cambio completa el inventario de variables documentadas. Sin valores reales.
- Validaciones al cierre: `npm run test` 33/33, `npx tsc --noEmit` 0 errores, `npm run lint` 0/0, `git diff --check` limpio.

Pendientes manuales que permanecen (ninguno puede ejecutarse desde esta sesión por requerir acceso a la consola del proveedor):

1. **Reactivar Deployment Protection** (paso 7 de la sección Vercel): volver a `Settings → Deployment Protection → Vercel Authentication` y activar (o limitar a usuarios del equipo). Registrar aquí fecha/hora. Obligatorio antes de cerrar el plan o desplegar a producción.
2. **Search Console:** en curso — se eligió verificación por DNS. El usuario agregó el registro TXT `google-site-verification=BWGHM0bI1nfjhdFBW2LCetaahVbUTEQgrQimxgyXDvA` en el apex `guiasports.com` (DNS de Vercel, `ns1/ns2.vercel-dns.com`); confirmado publicado con `dig`. Verificación por tipo **Dominio** (`guiasports.com`, sin `www`), que cubre apex y `www`. Nota: el valor cargado como `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` en el Preview quedó en formato TXT (con prefijo `google-site-verification=`), no válido como meta tag; irrelevante para la vía DNS, pero corregir si algún día se usa el método de meta tag.
3. **Item A — rotación de credenciales** (sección Pendientes manuales).
4. **Item B — RLS:** requiere backup de Supabase confirmado y documentado antes de ejecutar el SQL.
5. **Item C — `.env.example`:** completado en esta sesión (variable faltante documentada); no se versionan valores reales.
6. **Dominio de staging:** sigue vigente la recomendación de conservar la URL `.vercel.app` por defecto; si se decide un dominio dedicado, documentarlo aquí antes de cualquier SQL/RLS.

No se tocó `main`; la reversión continúa disponible en la sección de contingencia (`git checkout main && git branch -D staging`).

## Regla de no deploy

No publicar los cambios locales mientras falte cualquiera de estos puntos:

- lint sin errores;
- TypeScript sin errores;
- build confirmado;
- pruebas críticas automatizadas;
- revisión de schemas, sitemap y robots;
- staging aprobado;
- backup de Supabase confirmado;
- credenciales rotadas y actualizadas en el proveedor;
- RLS aplicado y verificado;
- rollback documentado.

## Pendientes manuales para el cierre del plan

### A. Rotación de credenciales

Realizar sólo cuando el código local esté aprobado y exista staging:

1. En Supabase abrir `Project Settings → API Keys`.
2. Crear una Publishable Key para cliente y una Secret Key para servidor, si el proyecto ya está listo para migrar de las claves heredadas.
3. En el proveedor de deploy actualizar, sin pegar valores en Git:
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`;
   - `SUPABASE_SERVICE_ROLE_KEY` — o adaptar el nombre a la Secret Key en una fase posterior;
   - `ADMIN_PASSWORD`;
   - `ADMIN_API_SECRET`;
   - `ADMIN_SESSION_SECRET`;
   - `GEMINI_API_KEY`, si estuvo expuesta.
4. Generar secretos administrativos diferentes con `openssl rand -hex 32`.
5. Desplegar primero a staging y probar login, lectura, edición, publicación y generación de noticias.
6. Actualizar producción y verificar la aplicación.
7. Revocar las claves antiguas sólo después de confirmar que ningún entorno las usa.
8. Revisar historial Git y activar secret scanning.

No regenerar el JWT secret heredado como primer paso: puede invalidar inmediatamente las claves antiguas y provocar caída. Supabase recomienda migrar primero a claves nuevas cuando sea posible.

### B. Aplicación y verificación de RLS

Archivo: `agenda-web/supabase/rls_fase7.sql`.

1. Confirmar un backup reciente en `Database → Backups`.
2. Ejecutar en SQL Editor el diagnóstico de políticas:

```sql
select schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'public' and tablename in ('eventos', 'noticias')
order by tablename, policyname;
```

3. Copiar y ejecutar el archivo SQL completo.
4. Confirmar que RLS está activo:

```sql
select n.nspname as schema_name, c.relname as table_name,
       c.relrowsecurity as rls_enabled, c.relforcerowsecurity as force_rls
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relname in ('eventos', 'noticias');
```

5. Confirmar que sólo existen políticas públicas de lectura:

```sql
select tablename, policyname, roles, cmd
from pg_policies
where schemaname = 'public' and tablename in ('eventos', 'noticias')
order by tablename, policyname;
```

6. Probar desde la web que la lectura pública funciona.
7. Probar que una llamada anónima de escritura falla.
8. Probar que las APIs administrativas sin cookie devuelven `401`.
9. Probar que el panel autenticado escribe mediante sus APIs.

No usar la service key en navegador. No ejecutar el SQL contra producción sin backup.

### C. Versionado de `.env.example`

El archivo no contiene secretos reales y ya está permitido por `.gitignore`. Versionarlo sólo cuando se vaya a registrar la configuración base:

```bash
git add agenda-web/.env.example agenda-web/.gitignore
git diff --cached --check
git diff --cached -- agenda-web/.env.example agenda-web/.gitignore
```

Crear, preferentemente, un commit separado de configuración y seguridad. Nunca agregar `.env`, `.env.local` ni valores reales.

### D. Confirmación segura del build local — Fase 3.1

Pendiente de Fase 3.1 y obligatorio antes del cierre de QA/release. No bloquea la continuidad de implementación local mientras TypeScript y lint permanezcan limpios.

1. En una sesión dedicada, confirmar los PID, padre, ruta del proyecto, estado, tiempo y actividad de `next build` y `next dev`.
2. Conservar la salida disponible y verificar que no haya otro build concurrente.
3. Si el build terminó, registrar el resultado. Si sigue activo sin avance confirmado, solicitar/usar la autorización local acordada para terminar sólo `npm run build` y su hijo mediante terminación normal; nunca usar `kill -9`.
4. Esperar y confirmar que ambos procesos del build desaparecieron. No borrar `.next`, locks ni archivos fuente.
5. Detener temporalmente `next dev` sólo si es necesario para evitar competencia sobre `.next`, conservando su PID y verificando que pertenece a este proyecto.
6. Ejecutar un único `npm run build` y conservar la salida completa.
7. Si el build termina correctamente, iniciar nuevamente `npm run dev`, recargar el navegador y repetir el QA de la versión actual.
8. Registrar en este documento el resultado y cualquier error sin limpiar artefactos de forma destructiva.

Riesgo aceptado y límites: esta intervención sólo reinicia procesos locales. No modifica producción, Supabase, credenciales, deploy, staging ni el código fuente. El impacto local esperado es una pausa del servidor, pérdida del estado temporal del navegador y recompilación de `.next`.

No ejecutar `rm -rf .next`, no borrar locks manualmente y no hacer deploy como forma de validar el build.

## Fase 2 — lint global

Estado: **completada localmente**. Se eliminaron las advertencias de lint sin modificar la lógica funcional. Las imágenes locales usan `next/image`; las banderas e imágenes editoriales externas conservan `<img>` con una excepción explícita porque sus URLs se generan en runtime y requerirían allowlisting adicional.

Ejecutar en sesiones separadas para no saturar contexto:

1. Panel y páginas deportivas: `src/app/admin/page.tsx`, `src/app/envivo/page.tsx`, `src/app/f1/page.tsx`, `src/app/nba/page.tsx`, `src/app/mlb/page.tsx`, `src/app/noticias/page.tsx`.
2. Mundial y hooks: `src/components/mundial/`, `src/hooks/useFavorites.ts`.
3. Configuración y limpieza: `tailwind.config.js`, `AdPlacement.tsx`, imports y advertencias restantes.

Validación obligatoria:

```bash
npx tsc --noEmit
npm run lint
git diff --check
```

El build se valida después de cerrar cualquier proceso `next build` previo. No borrar locks ni `.next` de forma destructiva.

## Estrategia de sesiones y contexto

- Usar una sesión nueva por fase o por grupo de lint.
- En la sesión nueva pegar sólo el bloque de handoff de la fase anterior y el prompt de la fase actual.
- No pedir al agente que lea todo el repositorio.
- No mezclar lint con SEO, sincronización o deploy.
- Mantener una sola sesión cuando sólo se corrige una validación de la misma fase.
- Si la ventana de contexto supera aproximadamente 70–75%, cerrar la sesión después del handoff y abrir una nueva.

## Prompt de continuidad para la siguiente sesión

```text
Continuamos GuíaSports en la rama staging del ciclo de staging/validación externa. No tocar main; no hacer deploy a producción, ni SQL/RLS en Supabase sin backup confirmado y documentado.

Lee primero:
- PLAN-REMEDIACION-UX-SEGURIDAD-SEO-CALIDAD.md
- agenda-web/AGENTS.md
- agenda-web/CLAUDE.md

Estado heredado:
- Fases 0 y 1 implementadas; Fase 2 validada.
- Fase 3: implementación cerrada administrativamente en local.
- Fase 3.1 completada en local el 18/08/2026: recorrido de Tab y VoiceOver validados manualmente; `npm run build` concluyente con éxito (salida en `/tmp/guidasports-build-20260818.log`); `next dev` reiniciado. Se agregó `ADMIN_SESSION_SECRET` a `agenda-web/.env.local` (incidencia local de login resuelta; no se tocó código fuente).
- Fase 4 en progreso local: identidad estable y sincronización segura; favoritos locales operativos, sin sincronización remota ni cambios en Supabase.
- Fase 6 — SEO histórico del Mundial: intervención local completada el 14/08/2026 (Hub + 16 sedes + 104 partidos, EventCompleted, FAQ histórica, canonical/OG, sitemap 121 URLs, señales de archivo). H1–H6 remediados; H7–H9 quedan como observaciones sin acción requerida.
- Pruebas críticas automatizadas: Vitest implementado en `staging` (4 archivos, 33 tests, commits `9a3a07f`, `6681cf3`).
- Ciclo de staging: rama `staging` pusheada (`2a4a1e2` HEAD/origin), preview Ready en `agenda-deportiva-git-staging-rauls-projects-5e98afa6.vercel.app`, env vars del Preview cargadas, HTTP 200 en `/`, `/mundial-2026`, `/admin/login`, `/sitemap.xml` y `/robots.txt`. Rich Results Test re-corrido por el usuario en 5 páginas sin errores (commits `dbf080e` schemas Hub/partido, `96c2373` ItemList home). `agenda-web/vercel.json` draft (framework nextjs, buildCommand, installCommand).
- Baseline y contingencia: tag `baseline-pre-staging` (f0c1b5b), backup `.env.local` en `/tmp/backup-env-20260818/`, sección de contingencia en el plan.
- Item C avanzado el 19/08/2026: `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` agregada a `agenda-web/.env.example`.
- IMPORTANTE: la Deployment Protection de Vercel está DESACTIVADA temporalmente para la validación externa. El paso 7 de la sección Vercel del plan obliga a reactivarla al terminar; registrar fecha/hora. No cerrar el plan ni desplegar a producción con la protección desactivada.
- npx tsc --noEmit, npm run lint, git diff --check y npm run test pasan al cierre de cada sesión.

Tarea:
1. Continuar el ciclo de staging/validación externa en la rama staging. Los pendientes manuales (reactivar Deployment Protection, Search Console, rotación de credenciales A, RLS B, dominio de staging) requieren consola del proveedor y no se ejecutan desde una sesión de código.
2. Si hay una tarea nueva de código, confirmar su alcance con el usuario antes de tocar archivos.
3. No modificar contenido histórico del Hub, sitemap, robots, scripts de sincronización ni datos fuente auto-generados salvo tarea explícita.
4. Actualizar el plan con evidencias y pendientes, manteniendo visibles los pendientes del cierre del plan (staging, QA, release).
5. No leer `.env`, `.env.local`, `.next` ni `node_modules`.

Ejecuta al final:
- npx tsc --noEmit
- npm run lint
- git diff --check
- npm run test

Entrega un handoff con estado actual, archivos modificados, validaciones, errores, pendientes, riesgos o decisiones, siguiente sesión recomendada y prompt de continuidad para siguiente paso.
```
