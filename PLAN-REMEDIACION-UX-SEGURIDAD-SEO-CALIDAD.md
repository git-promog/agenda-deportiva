# Plan de remediación UX, seguridad, SEO y calidad

Este documento conserva el estado operativo del plan y evita depender del historial de un chat. Las entradas fechadas mantienen el registro de decisiones tomadas en ese momento; cuando exista una diferencia, prevalece siempre este resumen y la fase activa más reciente. Las nuevas correcciones se realizarán primero en local y cualquier release posterior deberá pasar por la validación definida abajo.

## Estado de ejecución

- Fases 0 y 1: implementadas y verificadas.
- Fase 2 — lint y tipado: completada; errores y advertencias resueltos.
- Fase 3 — móvil y accesibilidad: completada en local y validada manualmente.
- Fase 3.1 — QA final de accesibilidad y build local: **completada el 18/08/2026**. Tab y VoiceOver validados manualmente por el usuario; `npm run build` concluyente con éxito (salida en `/tmp/guidasports-build-20260818.log`). Las tres validaciones finales permanecen limpias.
- Fase 4 — identidad estable y sincronización segura: bloque local completado; la sincronización remota de favoritos queda fuera de este ciclo por decisión documentada.
- `npx tsc --noEmit`: 0 errores.
- `npm run lint`: 0 errores y 0 advertencias.
- `npm run test`: 33/33 pruebas pasando.
- `npm run build`: completado con éxito sobre el estado actual de `main`, generando 173 páginas.
- `git diff --check`: limpio.
- Fase 6 — SEO y contenido histórico del Mundial: completada y validada en local y staging.
- Staging/Vercel Preview, Rich Results, Deployment Protection y Search Console: verificados.
- RLS y backup de Supabase: completados y verificados el 25/08/2026.
- Producción: `main` está sincronizada con `origin/main`; home, rutas SEO, login admin, sitemap, robots, headers y APIs protegidas fueron verificados el 26/08/2026.
- Pendientes reales: script `agenda-web/test_news.js`, cobertura de relevancia de búsqueda, seguimiento del error de hidratación no reproducible y A8 de seguridad histórica.

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

- **Actualizado 25/08/2026:** los artefactos originales en `/tmp` fueron purgados por macOS (ver sección "Revisión del estado del plan — 25/08/2026"). Nueva ubicación persistente: `~/backups-guiasports/` (fuera del repo). Contiene: `.env.local.baseline-20260825` (copia del `.env.local` vigente, sha256 `7c10d14a48cd002ac97b192cec34fcb863288f03d7253f07d2c6c068d01c579d`, chmod 600) y el respaldo de base de datos `~/backups-guiasports/supabase_backup_20260825_213748.sql` (sha256 `934012818056d29124b9204312321c07ad6c89c9ae5c39be202285f9d6d70f23`).
- Backup manual de Supabase confirmado el 25/08/2026: `~/backups-guiasports/supabase_backup_20260825_213748.sql` (sha256 `934012818056d29124b9204312321c07ad6c89c9ae5c39be202285f9d6d70f23`).
- Referencias históricas (ya no vigentes): `agenda-web/.env.local` copiado a `/tmp/backup-env-20260818/.env.local.baseline` (sha256 `69c89e0306e651859e10fe162ac55d511b865e48c8f6e6c8e57c75f24e2659b8`) — archivo perdido; los valores actuales de secretos viven en Vercel.
- Logs: `/tmp/guidasports-dev-20260818.log` (dev server) sobrevive; `/tmp/guidasports-build-20260818.log` perdido (resultado ya registrado en Fase 3.1).


### Criterios de aborto del ciclo de staging (se dispara con cualquiera)

1. Un paso de staging modifica `main` o el baseline de forma no prevista.
2. Un paso requiere SQL/RLS/escritura en Supabase sin backup reciente confirmado y documentado.
3. `npx tsc --noEmit`, `npm run lint` o `git diff --check` dejan de pasar en la rama de staging.
4. El deploy a staging rompe login, lectura, edición, publicación o generación de noticias y no existe reversión del proveedor inmediata.
5. Cualquier decisión de la lista de "Regla de no deploy" se intenta omitir.

### Reversión por capa

- **Código local:** `git checkout main && git branch -D staging` (o `git reset --hard baseline-pre-staging` si se trabaja sobre `main`).
- **Supabase:** restaurar desde el backup documentado; no ejecutar SQL adicional sin confirmarlo.
- **Secreto de sesión admin:** restaurar `~/backups-guiasports/.env.local.baseline-20260825` a `agenda-web/.env.local`.
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
7. **Reversión obligatoria de la exposición pública (riesgo de seguridad):** para permitir la validación externa se desactivó temporalmente `Settings → Deployment Protection → Vercel Authentication` en el proyecto. Esto deja el preview (y cualquier futura URL de preview) accesible públicamente sin autenticación. **Obligatorio revertir al terminar la validación externa:** volver a `Settings → Deployment Protection → Vercel Authentication` y reactivar la protección (o limitarla a los usuarios autorizados del equipo). NO cerrar el plan ni hacer deploy a producción con esta protección desactivada. Registrar aquí la fecha/hora de la reactivación. **REACTIVADO el 19/08/2026 a las 22:35 CST** (Vercel Authentication activada; validación externa Rich Results + Search Console ya completada).

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

1. **Reactivar Deployment Protection** (paso 7 de la sección Vercel): volver a `Settings → Deployment Protection → Vercel Authentication` y activar (o limitar a usuarios del equipo). **Reactivated el 19/08/2026 a las 22:35 CST por el usuario** (Vercel Authentication activada). La validación externa (Rich Results + Search Console) ya había terminado. Con esto queda cerrado el requisito del paso 7 de la sección Vercel.
2. **Search Console:** **verificada el 19/08/2026.** Se eligió verificación por DNS; el usuario agregó el registro TXT `google-site-verification=BWGHM0bI1nfjhdFBW2LCetaahVbUTEQgrQimxgyXDvA` en el apex `guiasports.com` (DNS de Vercel, `ns1/ns2.vercel-dns.com`); confirmado publicado con `dig`. Al agregar la propiedad en GSC (tipo **Dominio**, `guiasports.com`, sin `www`), la consola confirmó que **ya estaba verificada y agregada**. Cubre apex y `www`. Nota: el valor cargado como `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` en el Preview quedó en formato TXT (con prefijo `google-site-verification=`), no válido como meta tag; irrelevante para la vía DNS, pero corregir si algún día se usa el método de meta tag. La validación externa de esquemas también quedó superada sin errores (sección Rich Results).
3. **Item A — rotación de credenciales** (sección Pendientes manuales): **en curso el 19/08/2026**. A1 confirmado: el proyecto de Supabase está en **Free Plan**, que NO incluye backups (`Database → Backups` muestra el aviso "Free Plan does not include project backups"). Esto **bloquea el item B (RLS)** conforme a la regla de no deploy y al criterio 2 de aborto; se necesita decidir entre upgrade a Pro (backups diarios, 7 días) o backup manual (pg_dump/SQL) documentado antes de ejecutar cualquier SQL/RLS. A2 completado: se crearon `guidasports_staging` (Publishable) y `guidasports_staging_secret` (Secret) en Supabase API Keys. A4: secretos admin generados con `openssl rand -hex 32` y guardados fuera del repo en `/var/folders/sc/bhv8d0657sqgl5ppyv67zrmw0000gn/T/opencode/rotacion-a-20260819/` (chmod 600, sin exponer valores). A3 (Preview): completado el 19/08/2026 — el usuario actualizó en Vercel Preview `NEXT_PUBLIC_SUPABASE_ANON_KEY` y `SUPABASE_SERVICE_ROLE_KEY` (claves nuevas), `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` (Production+Preview), y los 3 secretos admin nuevos (`ADMIN_PASSWORD`, `ADMIN_API_SECRET`, `ADMIN_SESSION_SECRET`). A5: **completado** — tras el redeploy, `/admin` pidió contraseña (la cookie vieja quedó invalidada por el cambio de secreto, confirmando la rotación), y el login con la nueva `ADMIN_PASSWORD` funcionó; el panel carga con normalidad. A6: **completado el 19/08/2026** — el usuario aplicó las 5 variables nuevas también en el entorno **Producción** de Vercel (todas en Preview y Producción) y redeployó el staging. NOTA: las variables de Producción sólo tomarán efecto en el **próximo deployment de producción**; el deployment actual de producción (main) sigue sirviendo con las claves legacy horneadas en su build. Riesgo operativo relevante: preview y producción comparten el **mismo proyecto y base de datos de Supabase** (NEXT_PUBLIC_SUPABASE_URL es "All Environments"); cualquier prueba de escritura o RLS afecta los datos reales. Pendiente A7: **NO revocar las claves legacy de Supabase** (`anon`/`service_role` antiguas) hasta que producción haya redeployado con las claves nuevas y se confirme que ningún entorno las usa; revocarlas ahora rompería el sitio en vivo. Pendiente A8: **restaurar/limpiar el JWT `anon` del historial Git** en `agenda-web/test_supabase.py` (versiones anteriores; implica rewrite de historia y force push en GitHub) y activar secret scanning/push protection en GitHub. Pendiente futuro de reversión de esta rotación: los secretos admin nuevos quedan en `/var/folders/sc/bhv8d0657sqgl5ppyv67zrmw0000gn/T/opencode/rotacion-a-20260819/` (chmod 600) junto al backup del `.env.local` original en `/tmp/backup-env-20260818/`; el usuario guarda aparte los valores de las claves Publishable/Secret de Supabase para reconstruir el entorno si hace falta.
4. **Item B — RLS:** **bloqueado por A1** — el proyecto está en Free Plan sin backups de Supabase. No ejecutar `rls_fase7.sql` ni ningún SQL hasta decidir y documentar la estrategia de backup (upgrade a Pro o backup manual).
5. **Item C — `.env.example`:** completado en esta sesión (variable faltante documentada); no se versionan valores reales.
6. **Dominio de staging:** sigue vigente la recomendación de conservar la URL `.vercel.app` por defecto; si se decide un dominio dedicado, documentarlo aquí antes de cualquier SQL/RLS.

No se tocó `main`; la reversión continúa disponible en la sección de contingencia (`git checkout main && git branch -D staging`).

## Revisión del estado del plan — 25/08/2026

Estado: **plan verificado tras ~6 días de pausa; el contenido es correcto y consistente con el repo; se detectó una pérdida de artefactos temporales de `/tmp` y se ajusta la estrategia de backup**.

### Verificaciones de esta sesión

- `staging` sincronizada con `origin/staging` en `9d2786e` (15 commits sobre `main`); working tree sólo tenía la edición de la sección B del 19/08 que no se había commiteado (se commitea en esta sesión).
- Tag `baseline-pre-staging` = `main` = `f0c1b5b` (intacto).
- `agenda-web/.env.local` existe en el working tree y está correctamente ignorado por git.
- `agenda-web/supabase/rls_fase7.sql` existe y su contenido es el esperado (drop de políticas permisivas, enable RLS, SELECT público, default deny de escrituras).
- Validaciones: `npm run test` 33/33, `npx tsc --noEmit` 0 errores, `npm run lint` 0/0, `git diff --check` limpio.
- Salud de producción (25/08): HTTP 200 en `/`, `/mundial-2026`, `/sitemap.xml`; `/admin/login` devuelve 404 (el deploy de producción es el viejo de `main`, anterior a la protección de rutas admin; esperado).

### Hallazgo: artefactos de `/tmp` purgados por macOS

macOS limpia `/tmp` tras ~3 días; han pasado 6. **Se perdieron**:

1. `/tmp/backup-env-20260818/.env.local.baseline` (capa 3 de contingencia). **Mitigación:** el `.env.local` vigente sigue en el working tree; en esta sesión se crea un respaldo nuevo en una ubicación persistente (ver abajo).
2. `/var/folders/.../opencode/rotacion-a-20260819/` con los 3 secretos admin nuevos. **Mitigación:** los valores viven en Vercel (Preview y Producción, "Sensitive"), que es la fuente de verdad. El usuario debe guardarlos en su gestor de contraseñas. Si se pierden, se regeneran con `openssl rand -hex 32` y se actualizan en Vercel (no hay dependencia irreversible).
3. `/tmp/guidasports-build-20260818.log` (log del build concluyente del 18/08). No crítico: el resultado del build quedó registrado en este plan (Fase 3.1).
4. `/tmp/backup-env-20260818/supabase/` (carpeta preparada para el pg_dump). Se recrea en ubicación persistente.
5. `/tmp/guidasports-dev-20260818.log` **sobrevive**.

### Decisión: ubicación persistente de backups

Los backups dejan de vivir en `/tmp`. Nueva ubicación: `~/backups-guiasports/` (fuera del repo, en el home del usuario). En esta sesión se crea y se respalda ahí el `.env.local` vigente con sha256 documentado. El `pg_dump` del item B también irá ahí.

### Estado consolidado de pendientes (al 25/08)

- **B (RLS):** **COMPLETADO Y VERIFICADO el 25/08/2026**. Backup manual confirmado (`supabase_backup_20260825_213748.sql`). Políticas permisivas anteriores eliminadas en `eventos`, `noticias`, `status` y `mkt_social_posts`. Políticas de SELECT público aplicadas (`eventos_select_public`, `noticias_select_public`, `status_select_public`). Escrituras anónimas denegadas por defecto.
- **Release a producción:** Listo para ejecución (checklist de merge `staging` → `main` y deploy en Vercel).
- **A7 (revocar legacy):** Condicionado a verificar el release de producción (mismo código o nuevo código con claves nuevas operando) + verificación.
- **A8 (historial Git + secret scanning):** Pendiente de baja prioridad; sanitización con push protection.
- **Dominio de staging:** Confirmada la decisión de **conservar `.vercel.app` por defecto**.

## Regla de no deploy

No publicar los cambios locales mientras falte cualquiera de estos puntos:

- lint sin errores; (CUMPLIDO)
- TypeScript sin errores; (CUMPLIDO)
- build confirmado; (CUMPLIDO - Fase 3.1)
- pruebas críticas automatizadas; (CUMPLIDO - Vitest 33/33)
- revisión de schemas, sitemap y robots; (CUMPLIDO)
- staging aprobado; (CUMPLIDO - Preview Ready y verificado)
- backup de Supabase confirmado; (CUMPLIDO - pg_dump en ~/backups-guiasports/)
- credenciales rotadas y actualizadas en el proveedor; (CUMPLIDO - Vercel Preview y Prod cargados)
- RLS aplicado y verificado; (CUMPLIDO - 25/08/2026)
- rollback documentado. (CUMPLIDO - Tag baseline-pre-staging)

## Pendientes manuales para el cierre del plan

### A. Rotación de credenciales

Realizar sólo cuando el código local esté aprobado y exista staging:

1. En Supabase abrir `Project Settings → API Keys`. (CUMPLIDO)
2. Crear una Publishable Key para cliente y una Secret Key para servidor, si el proyecto ya está listo para migrar de las claves heredadas. (CUMPLIDO)
3. En el proveedor de deploy actualizar, sin pegar valores en Git:
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`;
   - `SUPABASE_SERVICE_ROLE_KEY`;
   - `ADMIN_PASSWORD`;
   - `ADMIN_API_SECRET`;
   - `ADMIN_SESSION_SECRET`;
   - `GEMINI_API_KEY`. (CUMPLIDO en Preview y Producción)
4. Generar secretos administrativos diferentes con `openssl rand -hex 32`. (CUMPLIDO)
5. Desplegar primero a staging y probar login, lectura, edición, publicación y generación de noticias. (CUMPLIDO)
6. Actualizar producción y verificar la aplicación. (En paso de release)
7. Revocar las claves antiguas sólo después de confirmar que ningún entorno las usa. (Pendiente A7 post-release)
8. Revisar historial Git y activar secret scanning. (Pendiente A8)

### B. Aplicación y verificación de RLS

**Estado:** **COMPLETADO Y VERIFICADO el 25/08/2026**.

1. Backup manual con `pg_dump` ejecutado y archivado: `~/backups-guiasports/supabase_backup_20260825_213748.sql` (sha256 `934012818056d29124b9204312321c07ad6c89c9ae5c39be202285f9d6d70f23`).
2. Script `agenda-web/supabase/rls_fase7.sql` ejecutado en SQL Editor.
3. Se eliminaron las políticas permisivas heredadas (`Permitir escritura...`, `Permitir borrado...`, `Solo admin puede...`, `Allow all...`).
4. RLS activo en `eventos`, `noticias`, `status`, `mkt_social_posts`.
5. Verificación de `pg_policies` confirmada con sólo políticas de `SELECT` para `{anon, authenticated}`:
   - `eventos_select_public` (SELECT)
   - `noticias_select_public` (SELECT)
   - `status_select_public` (SELECT)
   - `ligamx_*` (SELECT público intacto)
6. Default deny activo para escrituras anónimas/autenticadas. Las escrituras de administración operan exclusivamente vía Next.js server con `SUPABASE_SERVICE_ROLE_KEY` y sesión firmada.


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

## Fase de cierre pre-diseño visual

Estado: **pendiente de ejecución**.

Objetivo: resolver los últimos hallazgos técnicos, confirmar la seguridad del repositorio y dejar una base estable antes de iniciar nuevas mejoras visuales, de diseño y navegación.

Esta fase es la única fuente activa para el cierre. No se deben reabrir las fases anteriores salvo que una validación de esta fase encuentre una regresión.

### Prioridad P0 — Seguridad e historial Git (A8)

1. Crear un respaldo completo del repositorio y registrar el commit actual.
2. Identificar todos los secretos, JWT y valores heredados presentes en el historial sin mostrar sus valores en reportes.
3. Confirmar que las credenciales nuevas funcionan en producción y que no existen consumidores activos de las claves antiguas.
4. Revocar las claves API antiguas únicamente después de verificar el release y la salud de producción.
5. Limpiar el historial Git mediante una operación controlada.
6. Hacer `force push` sólo después de una autorización explícita y con el respaldo disponible.
7. Activar secret scanning y push protection en GitHub.

Criterios de aceptación:

- No quedan secretos detectables en el historial activo.
- Las claves antiguas están revocadas.
- Producción continúa funcionando después de la rotación.
- El respaldo y el procedimiento de recuperación están documentados.

Esta actividad debe ejecutarse en una sesión exclusiva. No mezclarla con cambios visuales, SEO ni refactorizaciones.

### Prioridad P1 — Canonical del índice de noticias

Archivo objetivo: `agenda-web/src/app/noticias/page.tsx`.

1. Añadir `alternates.canonical` para `/noticias`.
2. Definir y documentar el tratamiento de `/noticias?pagina=2`, `/noticias?pagina=3`, etcétera.
3. Confirmar que canonical, sitemap y enlaces internos utilicen URLs coherentes.
4. Verificar el HTML real después del despliegue.

Criterios de aceptación:

- `/noticias` publica exactamente un `rel="canonical"` válido.
- Las páginas paginadas tienen una estrategia consistente y no generan canonical ambiguo.
- El sitemap no apunta a URLs distintas de las canónicas.

### Resultado — Documentación y canonical del índice de noticias (26/08/2026)

Estado: **completado localmente**. Sólo se modificaron el índice de noticias y este plan; no se tocaron datos, APIs, estilos, Supabase, scripts, credenciales, RLS ni el historial Git.

Decisión SEO:

- `/noticias` y `/noticias?pagina=1` usan la canonical `https://www.guiasports.com/noticias`.
- Cada página `N >= 2` conserva su contenido diferenciado y usa canonical autorreferencial `https://www.guiasports.com/noticias?pagina=N`.
- La canonical se construye con el número normalizado que utiliza la página; parámetros no soportados no se incorporan a ella.
- El sitemap conserva únicamente `/noticias`, que es la entrada principal del índice. Las páginas paginadas se descubren mediante los enlaces de paginación internos y no se duplican en el sitemap.
- El JSON-LD `CollectionPage.url`, Open Graph y `rel="canonical"` usan la misma URL normalizada para evitar señales contradictorias.

Implementación:

- `agenda-web/src/app/noticias/page.tsx` usa `generateMetadata` porque la canonical depende de `searchParams.pagina`.
- La página 1 no genera una variante con query string; las páginas posteriores sí conservan `?pagina=N`.
- La verificación del HTML real de producción queda pendiente hasta un despliegue autorizado; esta sesión no hace deploy.

### Prioridad P1 — Scripts de prueba sin escrituras accidentales

Archivo objetivo: `agenda-web/test_news.js`.

1. Eliminar la inserción directa de la noticia de prueba o sustituirla por una prueba de solo lectura.
2. Revisar los scripts auxiliares en busca de `insert`, `update` o `delete` contra Supabase.
3. Mantener cualquier prueba de escritura únicamente con mocks o en un entorno aislado.
4. Documentar cualquier script que requiera autorización explícita.

Criterios de aceptación:

- Ningún script exploratorio puede modificar producción accidentalmente.
- Las operaciones administrativas pasan por APIs protegidas.
- Las pruebas automatizadas continúan pasando.

### Prioridad P2 — Relevancia y regresión de búsqueda

Archivo objetivo: `agenda-web/src/lib/eventSearch.ts`.

Añadir cobertura para:

- `Apple TV`.
- `TV abierta`.
- `América`.
- `Chivas`.
- `Liga MX`.

Revisar especialmente las coincidencias accidentales de `América` dentro de nombres como `Central American Cup`.

Criterios de aceptación:

- Apple TV encuentra los eventos correspondientes.
- TV abierta devuelve eventos con canales abiertos.
- América coloca al Club América primero sin llenar la lista de resultados irrelevantes.
- Los criterios de ranking quedan documentados y probados.

### Prioridad P2 — Incidencia de hidratación React

1. Repetir cargas limpias de home, noticias, Mundial y detalle de evento.
2. Probar navegación rápida entre rutas críticas.
3. Revisar la consola del navegador después de cada carga.
4. Si el error React reaparece, aislar el componente responsable y corregir la diferencia servidor/cliente.
5. Si no reaparece, registrarlo como incidencia no reproducible y vigilarlo durante el rediseño.

Criterios de aceptación:

- No hay errores reproducibles de hidratación en las rutas críticas.
- No aparecen diferencias visibles entre HTML inicial y contenido hidratado.
- El resultado de la prueba queda registrado en este plan.

### Validación local de cada bloque

Ejecutar después de cada bloque de cambios:

```bash
npm run test
npx tsc --noEmit
npm run lint
npm run build
git diff --check
```

El build requiere acceso de red para descargar `next/font`; si el entorno aislado bloquea Google Fonts, registrar el motivo y repetirlo en un entorno con red autorizada. No borrar `.next`, locks ni archivos fuente para resolver un build lento.

### Smoke test posterior al despliegue

Verificar en producción:

- `/`
- `/noticias`
- `/admin`
- `/admin/login`
- `/mundial-2026`
- `/robots.txt`
- `/sitemap.xml`

Confirmar también headers de seguridad, rechazo 401 de las APIs administrativas sin sesión, canonical de noticias y ausencia de errores en consola.

### Orden optimizado de sesiones

1. **Documentación y canonical:** plan definitivo + índice de noticias.
2. **Scripts y búsqueda:** script de prueba, motor de búsqueda y tests asociados.
3. **QA de hidratación:** diagnóstico sin cambios iniciales; corregir sólo si se reproduce.
4. **Seguridad A8:** sesión exclusiva para respaldo, historial Git, revocación y GitHub. Requiere autorización antes del `force push`.
5. **Verificación final:** validaciones locales, smoke test de producción y actualización del estado del plan.

Cada sesión debe limitarse a un objetivo, un conjunto pequeño de archivos y una validación final. No ejecutar agentes en paralelo sobre la misma rama de trabajo.

### Regla de contexto para sesiones nuevas

Leer únicamente:

1. `PLAN-REMEDIACION-UX-SEGURIDAD-SEO-CALIDAD.md`.
2. `agenda-web/AGENTS.md`.
3. `agenda-web/CLAUDE.md`.
4. El handoff de la sesión anterior, si existe.

No volver a leer la auditoría ni el PlanMaster salvo que sea necesario recuperar una decisión histórica.

### Estado de salida antes del rediseño

La fase se considera cerrada cuando el canonical esté corregido, los scripts de prueba no puedan escribir accidentalmente, la búsqueda tenga regresiones cubiertas, la hidratación no presente errores reproducibles, A8 tenga una decisión ejecutada o formalmente documentada y este plan refleje un único estado vigente.

## Estrategia de sesiones y contexto

- Usar una sesión nueva por fase o por grupo de lint.
- En la sesión nueva pegar sólo el bloque de handoff de la fase anterior y el prompt de la fase actual.
- No pedir al agente que lea todo el repositorio.
- No mezclar lint con SEO, sincronización o deploy.
- Mantener una sola sesión cuando sólo se corrige una validación de la misma fase.
- Si la ventana de contexto supera aproximadamente 70–75%, cerrar la sesión después del handoff y abrir una nueva.

## Prompt de continuidad para la siguiente sesión

```text
Continuamos GuíaSports con la Fase de cierre pre-diseño visual. El objetivo de esta sesión es completar únicamente el bloque de scripts de prueba y regresión de búsqueda.

Lee primero:
- PLAN-REMEDIACION-UX-SEGURIDAD-SEO-CALIDAD.md
- agenda-web/AGENTS.md
- agenda-web/CLAUDE.md

Estado actual:
- `main` está sincronizada con `origin/main` y producción está operativa.
- Fases 0–4, 3.1 y 6 están completadas y documentadas.
- Staging/Vercel Preview, Rich Results, Deployment Protection, Search Console, backup y RLS fueron verificados.
- Validaciones base actuales: Vitest 33/33, TypeScript 0 errores, ESLint 0/0, build exitoso y `git diff --check` limpio.
- Canonical de `/noticias` y tratamiento de `/noticias?pagina=N`: completados y documentados localmente; no se hizo deploy.
- Pendientes generales: script `agenda-web/test_news.js`, pruebas de búsqueda, incidencia React no reproducible y A8 de seguridad histórica.

Alcance obligatorio de esta sesión:
1. Revisar `agenda-web/test_news.js` y los scripts auxiliares relacionados.
2. Eliminar cualquier escritura accidental contra Supabase o sustituirla por una prueba de sólo lectura/mocks.
3. Revisar `agenda-web/src/lib/eventSearch.ts` y sus pruebas.
4. Añadir regresiones para `Apple TV`, `TV abierta`, `América`, `Chivas` y `Liga MX`, cuidando la coincidencia accidental de `América` en `Central American Cup`.
5. Ejecutar las validaciones locales.
6. Si el cambio es correcto, dejarlo en un commit separado y reportar el hash.

Restricciones:
- No tocar Supabase, scripts de sincronización, credenciales, RLS ni el historial Git.
- No hacer deploy sin autorización explícita.
- No iniciar todavía el rediseño visual.
- Si detectas una operación de escritura cuya intención no sea inequívoca, detén esa parte y reporta la alternativa segura.

Validaciones obligatorias:
- npm run test
- npx tsc --noEmit
- npm run lint
- npm run build
- git diff --check

Entrega:
- Reporte breve de resultado.
- Archivos modificados.
- Validaciones ejecutadas y resultado.
- Pendientes o riesgos.
- Handoff para la siguiente sesión.
- Nuevo prompt de continuidad para el siguiente bloque de la Fase de cierre.
```
