# Plan de diseño, UX visual y navegación — GuíaSports

> Documento activo para la nueva etapa de diseño visual, experiencia de usuario y navegación. Mantiene el contexto necesario para trabajar por sesiones sin mezclarlo con la remediación técnica ya cerrada.

## Estado actual

- Fecha de inicio: 2026-09-01.
- Estado: **Fase 0 — Brief visual y dirección de producto, pendiente de iniciar**.
- Fase de cierre pre-diseño visual: completada el 27/08/2026.
- A8: cerrado y documentado en el plan de remediación anterior.
- Rama local: `main`, limpia y alineada con `origin/main` al crear este documento.
- No se hará push ni deploy sin autorización explícita.
- Este plan es la fuente activa para el trabajo visual.

## Referencias operativas

- Plan técnico cerrado: `PLAN-REMEDIACION-UX-SEGURIDAD-SEO-CALIDAD.md`.
- Instrucciones del proyecto: `agenda-web/AGENTS.md` y `agenda-web/CLAUDE.md`.
- No es necesario releer el plan técnico completo en cada sesión. Sólo debe consultarse si aparece una regresión relacionada con seguridad, SEO, Supabase, RLS, sincronización o QA ya cerrado.

## Objetivo de esta etapa

Convertir GuíaSports en una experiencia deportiva visualmente atractiva, rápida y fácil de explorar, donde el usuario pueda responder en segundos:

1. Qué eventos deportivos hay.
2. Cuándo ocurren.
3. Dónde puede verlos.
4. Qué puede guardar, compartir o consultar después.

La meta no es añadir más información, sino mejorar la jerarquía, el descubrimiento, la claridad y la sensación de fluidez.

## Alcance

Incluye:

- Dirección visual y sistema de diseño.
- Portada y agenda principal.
- Header, navegación móvil y footer.
- Búsqueda, filtros y accesos rápidos.
- Tarjetas, modal y detalle de evento.
- Noticias, hubs deportivos y archivo del Mundial.
- Microinteracciones, estados de carga y rendimiento percibido.
- QA visual, accesibilidad y preparación de release.

No incluye:

- Cambios en datos, tablas, contenido fuente o IDs públicos.
- Cambios en Supabase, RLS, políticas o permisos.
- Cambios en scripts de sincronización.
- Nuevas funciones administrativas.
- Limpieza de historial Git, rotación de credenciales o investigación histórica de A8.
- Push, deploy o configuración de proveedores sin autorización explícita.

## Guardrails permanentes

- Trabajar primero en local.
- No exponer secretos, tokens, JWT, variables de entorno ni rutas sensibles.
- No modificar `agenda-web/src/data/` salvo autorización específica.
- No cambiar URLs públicas, canonical, sitemap o schemas como parte de una mejora puramente visual.
- Mantener IDs, rutas, datos y comportamiento funcional existente.
- Mantener accesibilidad: teclado, foco visible, VoiceOver, contraste, touch targets y `prefers-reduced-motion`.
- Mantener compatibilidad móvil desde 320 px.
- Reutilizar las dependencias existentes; cualquier dependencia nueva requiere justificación y aprobación.
- No ejecutar agentes en paralelo sobre la misma rama o los mismos componentes.
- Si una sesión descubre una regresión técnica fuera del alcance visual, documentarla y detener ese bloque antes de mezclar correcciones.

## Dirección visual inicial

La recomendación es evolucionar la identidad existente, no sustituirla:

- Fondo oscuro profundo como base.
- Lima como color de acción y energía.
- Azul como color de navegación, información y enlaces.
- Tipografía fuerte para titulares, pero con mejor equilibrio entre mayúsculas, itálicas y legibilidad.
- Tarjetas con profundidad y contraste, evitando que todos los elementos compitan visualmente.
- Diseño mobile-first y adaptable a pantallas grandes.
- Interacciones breves, útiles y con propósito.

### Principios UX

- **Claridad antes que decoración:** hora y canal deben dominar la tarjeta.
- **Descubrimiento inmediato:** el usuario debe encontrar lo relevante sin configurar demasiados filtros.
- **Una acción primaria por superficie:** ver detalle, guardar o explorar, según el contexto.
- **Estado siempre visible:** próximo, en vivo, finalizado o transmisión no confirmada.
- **Continuidad:** modal, detalle, navegación y regreso deben conservar el contexto del usuario.
- **Confianza:** ningún mensaje visual debe prometer una transmisión o estado que los datos no respalden.

## Superficies visuales principales

- Portada y agenda: `agenda-web/src/components/HomeClient.tsx`, `HomeHero.tsx`, `HomeDestacados.tsx`.
- Navegación: `Header.tsx`, `NavMobile.tsx`, `Footer.tsx` y `layout.tsx`.
- Búsqueda y filtros: `agenda/AgendaSearch.tsx`, `AgendaQuickActions.tsx`, `AgendaFilters.tsx`, `AgendaResults.tsx`.
- Eventos: `agenda/EventCard.tsx`, `SportEventCard.tsx`, `SportEventModal.tsx` y `evento/[slug]/page.tsx`.
- Noticias: `noticias/page.tsx`, `noticias/[slug]/page.tsx`.
- Hubs: `futbol/`, `nba/`, `mlb/`, `f1/` y `mundial-2026/`.
- Estilos globales: `agenda-web/src/app/globals.css`.

## Roadmap de fases

### Fase 0 — Brief visual y dirección de producto

Estado: **pendiente**.

Objetivo: fijar la dirección antes de modificar componentes.

Actividades:

- Auditar visualmente las superficies principales.
- Definir personalidad, jerarquía y lenguaje visual.
- Confirmar qué componentes se conservan, evolucionan o reemplazan.
- Definir estados visuales y prioridades de interacción.
- Elegir una dirección recomendada, no una colección abierta de alternativas.

Entregables:

- Brief visual breve.
- Principios UX.
- Mapa de superficies prioritarias.
- Sistema inicial de estados.
- Criterios de aceptación para la Fase 1.

Regla: esta fase no modifica código de aplicación. Sólo puede actualizarse este documento con el resultado aprobado.

### Fase 1 — Sistema visual base

Estado: **pendiente**.

Archivos principales:

- `agenda-web/src/app/globals.css`.
- `agenda-web/src/app/layout.tsx`.
- Componentes visuales compartidos.

Actividades:

- Centralizar colores, fondos, bordes, sombras, radios y espaciado.
- Definir escala tipográfica y jerarquía de textos.
- Crear patrones consistentes para botones, chips, badges, tarjetas, paneles, modales y estados vacíos.
- Revisar contraste y legibilidad de textos pequeños.
- Evitar estilos repetidos o decisiones visuales aisladas.

Criterio de salida: los nuevos componentes pueden construirse con reglas visuales compartidas.

### Fase 2 — Header y navegación fluida

Estado: **pendiente**.

Archivos principales:

- `Header.tsx`.
- `NavMobile.tsx`.
- `Footer.tsx`.
- `layout.tsx`.

Actividades:

- Mejorar navegación desktop y móvil.
- Dar protagonismo a Agenda, En vivo, Noticias, deportes y favoritos.
- Hacer evidente la ruta activa.
- Revisar sticky navigation, safe areas y retorno al contexto anterior.
- Integrar el menú móvil con la experiencia general.
- Mantener foco, teclado, Escape y movimiento reducido.

Criterio de salida: el usuario llega a las superficies principales sin perder contexto.

### Fase 3 — Rediseño de la portada

Estado: **pendiente**.

Archivos principales:

- `HomeClient.tsx`.
- `HomeHero.tsx`.
- `HomeDestacados.tsx`.
- Componentes de agenda y búsqueda.

Actividades:

- Reforzar la jerarquía inicial.
- Rediseñar el hero para comunicar evento, hora, canal y acción.
- Simplificar filtros y accesos rápidos.
- Separar visualmente En vivo, Próximos, Imperdibles y Noticias.
- Mejorar carga, vacío, error y ausencia de resultados.
- Revisar video, LCP y movimiento del hero.

Criterio de salida: la portada funciona como guía rápida y no como listado abrumador.

### Fase 4 — Tarjetas, estados y detalle de evento

Estado: **pendiente**.

Archivos principales:

- `EventCard.tsx`.
- `SportEventCard.tsx`.
- `SportEventModal.tsx`.
- `evento/[slug]/page.tsx`.

Actividades:

- Hacer hora y canal más visibles.
- Diferenciar Próximo, En vivo, Finalizado y transmisión no confirmada.
- Reducir ruido de badges y texto secundario.
- Mejorar acciones primarias y favoritos.
- Hacer más natural la apertura, cierre y retorno del modal.
- Conservar IDs, URLs y lógica existente.

Criterio de salida: el usuario puede comparar tarjetas rápidamente y elegir una con confianza.

### Fase 5 — Noticias, deportes y hubs

Estado: **pendiente**.

Archivos principales:

- `noticias/`.
- `futbol/`.
- `nba/`.
- `mlb/`.
- `f1/`.
- `mundial-2026/`.

Actividades:

- Compartir patrones de encabezado, breadcrumbs y módulos destacados.
- Mejorar jerarquía de la portada de noticias.
- Unificar presentación de hubs sin borrar su personalidad.
- Mantener el Mundial como archivo histórico visualmente claro.
- Mejorar enlazado interno sin cambiar URLs.

Criterio de salida: las secciones pertenecen al mismo producto y conservan sus diferencias útiles.

### Fase 6 — Microinteracciones y rendimiento percibido

Estado: **pendiente**.

Actividades:

- Añadir transiciones breves para filtros, modales, navegación y favoritos.
- Crear estados de carga y feedback inmediato.
- Revisar `next/image`, dimensiones, LCP y advertencias de scroll.
- Mantener animaciones reducidas cuando corresponda.
- Evitar que Framer Motion o efectos visuales perjudiquen rendimiento o accesibilidad.

Criterio de salida: la interfaz se siente rápida y viva, sin distraer.

### Fase 7 — QA visual, accesibilidad y regresión

Estado: **pendiente**.

Viewports mínimos:

- 320 px.
- 375 px.
- 768 px.
- 1024 px.
- 1280 px.

Revisar:

- Overflow horizontal.
- Contraste y legibilidad.
- Focus visible y recorrido con Tab.
- VoiceOver.
- Touch targets.
- Estados de carga, vacío y error.
- Modales, filtros, favoritos y navegación rápida.
- Consola del navegador.

Criterio de salida: no hay regresiones visuales, funcionales ni de accesibilidad en las rutas prioritarias.

### Fase 8 — Consolidación y release controlado

Estado: **pendiente**.

Actividades:

- Comparar visualmente las rutas críticas.
- Confirmar que no hubo cambios fuera de alcance.
- Preparar checklist de staging.
- Revisar rollback y estado de la rama.
- Solicitar autorización explícita antes de cualquier push o deploy.

Criterio de salida: existe un paquete visual local aprobado y listo para revisión de release.

## Protocolo de trabajo por sesión

Cada sesión debe tener:

1. Un único objetivo.
2. Un conjunto pequeño de archivos.
3. Una validación visual concreta.
4. Una validación técnica proporcional al cambio.
5. Un reporte y handoff.

Antes de trabajar, el agente debe leer sólo:

1. Este plan.
2. `agenda-web/AGENTS.md`.
3. `agenda-web/CLAUDE.md`.
4. El handoff de la sesión anterior, si existe.

No debe pedir que se lea todo el repositorio. Si el contexto supera aproximadamente 70–75 %, debe cerrar el bloque con un handoff antes de continuar.

Al cerrar una fase, se debe consolidar su resultado en este archivo y evitar repetir detalles ya registrados. El historial de sesiones será breve y sólo conservará decisiones, archivos y resultados relevantes.

## Validaciones

### Sesión de análisis o brief sin cambios de código

- Revisar que no haya modificaciones accidentales.
- Ejecutar `git diff --check` si el plan fue actualizado.
- Reportar como no aplicables las pruebas de aplicación si no se modificó código.

### Sesión con cambios visuales o de código

Ejecutar desde `agenda-web/`:

```text
npm run test
npx tsc --noEmit
npm run lint
npm run build
git diff --check
```

El build no debe resolverse borrando `.next`, locks o archivos fuente. Si requiere red autorizada, debe registrarse esa condición.

## Formato de reporte

```text
Reporte de sesión — GuíaSports

Fase:
Objetivo:
Estado: completado / parcial / bloqueado

Cambios realizados:
- ...

Archivos modificados:
- ...

Decisiones visuales:
- ...

Validación visual:
- Viewports:
- Navegación:
- Teclado:
- Modal:
- Estados revisados:

Validaciones técnicas:
- npm run test:
- npx tsc --noEmit:
- npm run lint:
- npm run build:
- git diff --check:

Riesgos o regresiones:
- ...

Fuera de alcance confirmado:
- Datos:
- Supabase/RLS:
- Scripts de sincronización:
- Push/deploy:

Siguiente sesión recomendada:
- ...
```

## Handoff activo

### Fase 0 — Brief visual y dirección de producto

Estado: **pendiente de iniciar**.

Siguiente objetivo: producir el brief visual recomendado y dejar definidos los criterios para comenzar la Fase 1.

No modificar código de aplicación en esta fase. Se permite actualizar únicamente este documento con el brief resultante, siempre marcado como `propuesto` hasta que el usuario lo apruebe.

## Registro breve de decisiones

| Fecha | Decisión |
|---|---|
| 2026-09-01 | Se crea este plan separado para mantener la remediación técnica cerrada y reducir contexto en sesiones futuras. |
| 2026-09-01 | El plan de remediación anterior queda como referencia histórica; no se copiarán sus instrucciones ni se reabrirá A8 sin nueva evidencia. |
| 2026-09-01 | El kickoff se integra en este archivo para evitar duplicar un segundo documento activo. |

## Registro de sesiones

| Fecha | Fase | Resultado | Referencia |
|---|---|---|---|
| 2026-09-01 | Preparación | Plan creado; sin cambios de código | Este documento |

## Prompt de kickoff para la siguiente sesión

```text
Continuamos GuíaSports en la nueva etapa de diseño visual y UX.

Lee primero:
- PLAN-DISENO-UX-VISUAL-GUIASPORTS.md
- agenda-web/AGENTS.md
- agenda-web/CLAUDE.md

El plan técnico de remediación está cerrado. A8 está cerrado. Producción está operativa. La rama local main está limpia y no se debe hacer push ni deploy sin autorización explícita.

Objetivo de esta sesión:
Ejecutar únicamente la Fase 0 — Brief visual y dirección de producto.

Restricciones:
- No modificar código de aplicación.
- No modificar datos, IDs, URLs ni contenido fuente.
- No tocar Supabase, RLS ni scripts de sincronización.
- No exponer secretos ni reabrir A8 o la investigación histórica.
- No ejecutar agentes en paralelo sobre la misma rama.

Superficies a revisar:
- agenda-web/src/app/globals.css
- agenda-web/src/app/layout.tsx
- agenda-web/src/components/Header.tsx
- agenda-web/src/components/NavMobile.tsx
- agenda-web/src/components/HomeClient.tsx
- agenda-web/src/components/HomeHero.tsx
- agenda-web/src/components/HomeDestacados.tsx
- agenda-web/src/components/agenda/
- agenda-web/src/components/EventCard.tsx
- agenda-web/src/components/SportEventCard.tsx
- agenda-web/src/components/SportEventModal.tsx
- agenda-web/src/app/noticias/
- agenda-web/src/app/futbol/
- agenda-web/src/app/nba/page.tsx
- agenda-web/src/app/mlb/page.tsx
- agenda-web/src/app/f1/page.tsx
- agenda-web/src/app/mundial-2026/

Entrega esperada:
1. Diagnóstico visual breve de fortalezas y oportunidades.
2. Recomendación de dirección visual única para GuíaSports.
3. Principios UX y jerarquía de información.
4. Mapa de superficies prioritarias.
5. Estados visuales que deben normalizarse.
6. Criterios de aceptación para la Fase 1.
7. Reporte y handoff para la siguiente sesión.

Puedes actualizar únicamente este plan con una propuesta marcada como “propuesta”. No marques la Fase 0 como aprobada ni inicies la Fase 1 sin confirmación del usuario.

Como no se modificará código de aplicación, no ejecutes el build completo. Si actualizas este documento, ejecuta git diff --check y reporta el resultado.
```
