# Plan de diseño, UX visual y navegación — GuíaSports

> Documento activo para la nueva etapa de diseño visual, experiencia de usuario y navegación. Mantiene el contexto necesario para trabajar por sesiones sin mezclarlo con la remediación técnica ya cerrada.

## Estado actual

- Fecha de inicio: 2026-09-01.
- Estado: **Fases 0 a 8 publicadas el 2026-09-09; Ajustes UX de Agenda y Filtros completados y autorizados para deploy el 2026-09-22; Bloque A y M1–M6 aprobados el 2026-10-27; paquete `11bf3a8` publicado en producción el 2026-10-27 mediante `release/ux-simplificacion` y `main`; deploy verificado**.
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

Estado: **aprobada por el usuario el 2026-09-01**.

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

Regla: esta fase no modifica código de aplicación. El resultado queda documentado en este plan; la implementación comienza únicamente en la fase siguiente y con su alcance aprobado.

#### Brief visual aprobado

> Esta dirección fue presentada como propuesta y queda **aprobada por el usuario** el 2026-09-01. La aprobación habilita preparar la Fase 1, pero no implica que dicha fase ya haya comenzado.

**1. Diagnóstico visual breve**

Fortalezas observadas:

- La identidad ya tiene una base reconocible: fondo azul noche, lima para acción, azul para navegación y rojo para En Vivo.
- La portada comunica la propuesta de valor, ofrece búsqueda y accesos rápidos, agrupa la agenda por fecha y permite abrir detalle, compartir o agendar.
- `SportEventCard`, `AgendaResults` y `SportEventModal` ofrecen una base reutilizable; hay tratamiento responsive, foco visible global y soporte para `prefers-reduced-motion`.
- Noticias, hubs deportivos y el archivo del Mundial cuentan con módulos visualmente atractivos, imágenes, breadcrumbs y navegación temática.

Oportunidades principales:

- La misma tarea aparece con lenguajes distintos: `SportEventCard`, los listados de NBA/MLB/F1, fútbol y Mundial no comparten una tarjeta ni una jerarquía de estado única.
- Hay demasiadas decisiones inline: radios, fondos, bordes, colores por deporte, sombras, blur, gradientes y tamaños de texto. El resultado se siente energético, pero menos preciso y menos editorial.
- La combinación de mayúsculas, itálicas, tracking amplio y textos de 8–12 px hace que metadatos, etiquetas y acciones compitan entre sí; en varias superficies la hora y el canal no dominan con suficiente claridad.
- Emojis, pulsos, hover, video, glow y múltiples acentos cromáticos concentran demasiada atención. El hero y En Vivo deben ser protagonistas puntuales, no ruido constante.
- La navegación móvil tiene buenas áreas táctiles y retorno de foco, pero mezcla cuatro destinos con un menú inferior sin hacer igual de evidente la ruta activa ni el contexto de búsqueda/live en todas las páginas.
- Noticias y hubs repiten patrones parecidos con proporciones, radios y densidades diferentes. El Mundial funciona como una experiencia rica de archivo, pero hoy se percibe como un producto visual separado.
- Se observa `En vivo` como estado destacado, pero no un sistema igualmente explícito y consistente para próximo, finalizado, transmisión no confirmada, carga, error y ausencia de resultados.

**2. Dirección visual única recomendada: “guía de transmisión nocturna”**

GuíaSports debe sentirse como una guía editorial deportiva de consulta rápida: intensa cuando hay acción, silenciosa cuando el usuario compara horarios. Se conserva la identidad actual y se ordena bajo estas reglas:

- **Base:** azul noche profundo, superficies elevadas en slate y bordes sutiles; la profundidad debe separar niveles de información, no decorar cada módulo.
- **Acentos:** lima para acción/selección y confirmación; rojo sólo para En Vivo; azul para navegación, enlaces e información; amarillo reservado para destacados o archivo Mundial. Los deportes no necesitan una paleta independiente en cada tarjeta.
- **Tipografía:** Inter como base existente; titulares con peso e inclinación controlados, pero cuerpo, hora, canal y ayudas en caja normal y tamaños legibles. Mayúsculas y tracking quedan para etiquetas cortas.
- **Composición:** una columna principal de lectura cómoda para la agenda; tarjetas con una estructura repetible y un solo foco. El hero es una excepción editorial para el evento prioritario.
- **Materialidad:** radios moderados, sombras discretas y blur sólo donde ayude a separar capas. La interfaz debe parecer rápida y confiable antes que futurista.
- **Movimiento:** transición breve para cambios de estado, filtros, menú y modal; pulso limitado a En Vivo; video y efectos del hero sujetos a rendimiento y movimiento reducido.
- **Personalidad:** “clara, nocturna, directa y mexicana”; deportiva por ritmo y contraste, no por saturación de efectos.

**3. Principios UX y jerarquía de información**

Orden recomendado en toda superficie de evento:

1. Estado y momento: En Vivo, Próximo o Finalizado; fecha y hora local de México.
2. Qué ocurre: nombre del partido, carrera o evento y, cuando aplique, los dos equipos.
3. Dónde verlo: canal o plataforma, con una señal clara cuando la transmisión no esté confirmada.
4. Contexto: deporte, competición y fecha agrupadora.
5. Acción secundaria: ver detalle, abrir página, compartir o agendar según el contexto.

Principios:

- **Consulta en segundos:** la primera pantalla debe responder qué hay, cuándo ocurre y dónde verlo sin abrir un modal.
- **Una acción primaria:** cada módulo debe tener una acción dominante; el resto no debe competir visualmente.
- **Comparación fácil:** hora, estado, evento y canal ocupan posiciones estables entre portada, hubs y archivo.
- **Estado honesto:** no usar color o copy que sugiera que un evento está en vivo o que una señal está confirmada si los datos no lo respaldan.
- **Continuidad:** abrir/cerrar modal, volver de detalle y usar filtros debe conservar posición, criterio y contexto del usuario.
- **Mobile-first real:** prioridad a lectura vertical, controles accesibles con pulgar, sin overflow horizontal accidental y con scroll horizontal sólo en colecciones explícitas.
- **Accesibilidad como lenguaje visual:** contraste, foco, estados no dependientes sólo del color, nombres de controles y movimiento reducido forman parte del sistema.

**4. Mapa de superficies prioritarias**

| Prioridad | Superficie | Papel de producto | Decisión propuesta |
|---|---|---|---|
| P0 | `globals.css`, `layout.tsx` | Capa común | Conservar la base oscura y centralizar tokens, tipografía, foco, radios, espaciado y motion. |
| P0 | `Header.tsx`, `NavMobile.tsx`, `Footer.tsx` | Orientación y retorno | Evolucionar a un shell compartido: Agenda, En Vivo, Noticias y contexto activo visibles sin competir con el contenido. |
| P0 | `HomeClient.tsx`, `HomeHero.tsx`, `HomeDestacados.tsx` | Entrada y descubrimiento | Reducir ruido del hero, fijar el orden búsqueda → accesos → agenda y reservar destacados para decisiones editoriales reales. |
| P0 | `agenda/` | Tarea principal de consulta | Convertir búsqueda, quick actions, filtros, resultados y vacío en un único flujo visual; mantener agrupación por fecha. |
| P0 | `EventCard.tsx`, `SportEventCard.tsx`, `SportEventModal.tsx` | Unidad de decisión | Tomar `SportEventCard` como contrato visual único; normalizar estados, canal, acciones, modal y retorno. |
| P1 | `noticias/` | Contexto editorial | Compartir shell, encabezado, proporción de tarjetas, metadatos y estados con el producto sin convertir noticias en agenda. |
| P1 | `futbol/`, `nba/`, `mlb/`, `f1/` | Hubs de deporte | Mantener personalidad por deporte en iconografía/contenido, pero compartir cabecera, tarjeta de evento, live state, noticias y enlaces cruzados. |
| P1 | `mundial-2026/` | Archivo especial | Conservar su riqueza de calendario, grupos, sedes y eliminatorias como skin de campaña dentro del mismo sistema de navegación, estados y accesibilidad. |

Regla de evolución: conservar comportamiento, datos, IDs y URLs; evolucionar presentación y composición; reemplazar sólo patrones visuales duplicados cuando exista un equivalente compartido aprobado.

**5. Estados visuales a normalizar**

Estados de contenido:

- **Próximo:** estado neutro con hora protagonista y canal claramente asociado.
- **En Vivo:** rojo reservado, etiqueta textual y señal de actividad; el pulso debe ser opcional y respetar movimiento reducido.
- **Finalizado:** tratamiento de baja prioridad, pero legible; no debe parecer un evento próximo.
- **Transmisión no confirmada:** estado explícito y prudente, sin color de confirmación ni promesa de disponibilidad.
- **Sin resultados:** explicar el criterio actual y ofrecer limpiar filtros; distinguir búsqueda sin coincidencias de agenda vacía.
- **Carga:** skeleton o placeholder con la misma geometría de tarjeta, sin saltos de layout.
- **Error/actualización parcial:** mensaje breve, accionable y diferenciado de “no hay eventos”.

Estados de interacción:

- Default, hover, focus-visible, pressed y disabled con diferencias perceptibles y consistentes.
- Filtro activo, filtro con contador, filtros combinados y limpieza completa.
- Modal abierto/cerrado, backdrop, foco inicial, foco atrapado, Escape, cierre por gesto y retorno al disparador.
- Menú móvil abierto/cerrado y ruta activa, incluida la navegación desde subpáginas.
- Favorito guardado/no guardado donde ya exista la función, sin introducirla en esta fase.

**6. Criterios de aceptación para la Fase 1**

La Fase 1 podrá comenzar sólo después de aprobación explícita de esta propuesta. Su salida deberá cumplir, como mínimo:

- Existe una capa visual compartida para color, superficie, borde, radio, sombra, tipografía, espaciado, foco y movimiento; se reducen decisiones aisladas en las superficies P0.
- En portada, agenda, hubs y modal la lectura de un evento sigue el mismo orden: estado/momento → evento → canal → contexto → acciones.
- A 320, 375, 768, 1024 y 1280 px no hay overflow horizontal accidental, controles truncados de forma crítica ni pérdida de la acción primaria.
- Un usuario puede identificar en la primera pantalla la búsqueda, el acceso a En Vivo, el día/criterio activo y la información esencial de una tarjeta.
- Los estados próximo, En Vivo, finalizado, transmisión no confirmada, carga, error y sin resultados son distinguibles por texto, estructura y color; no dependen sólo del color.
- Header, navegación móvil, modal, filtros y tarjetas conservan foco visible, teclado, nombres accesibles, touch targets y `prefers-reduced-motion`.
- El hero no empeora LCP, CLS, consumo móvil ni legibilidad; cualquier video o efecto tiene una alternativa estática y una degradación razonable.
- Noticias, hubs y Mundial se reconocen como partes del mismo producto, aunque el Mundial conserve su carácter de archivo especial.
- No cambian datos, IDs, URLs, canonical, schemas, Supabase, RLS, scripts de sincronización ni lógica fuera del alcance visual aprobado.
- La revisión se entrega con capturas comparables por viewport, `git diff --check` y las validaciones técnicas proporcionales al código modificado.

**7. Reporte y handoff de esta sesión**

- Estado: **Fase 0 aprobada por el usuario; Fase 1 aún no iniciada**.
- Auditoría estática realizada sobre estilos globales, shell, portada, agenda, eventos, modal, noticias, hubs y archivo Mundial.
- No se modificó código de aplicación, datos, contenido fuente, URLs, IDs, Supabase, RLS ni scripts de sincronización.
- No se ejecutó build ni pruebas de aplicación: esta sesión no modifica código y el plan lo marca como no aplicable.
- Se ejecutó `git diff --check` para validar únicamente el cambio documental.
- Siguiente paso recomendado: iniciar en una sesión separada la Fase 1 — Sistema visual base, respetando su alcance y validaciones. No se deben tocar todavía las superficies de Fases 2–5.

### Fase 1 — Sistema visual base

Estado: **completada localmente y aprobada por el usuario el 2026-09-04**.

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

#### Reporte de implementación Fase 1 — aprobada

- **Cambios realizados:** se creó una base de tokens `--gs-*` para color, superficies, bordes, radios, espaciado, sombras, tipografía, foco y motion; se añadieron patrones globales para superficies, tarjetas, botones, chips, badges, campos, modal, títulos, tiempos, divisores y estados; se alineó el fondo del layout con la variable global.
- **Adopción visible realizada:** `SportEventCard` consume `gs-card`, `gs-card-interactive`, `gs-chip` y `gs-time`; `ShareButton` consume `gs-button-icon`/`gs-button`; `SportEventModal` consume `gs-modal`. Son componentes compartidos y el cambio conserva datos, rutas, acciones y contratos existentes.
- **Archivos modificados:** `agenda-web/src/app/globals.css`, `agenda-web/src/app/layout.tsx`, `agenda-web/src/components/SportEventCard.tsx`, `agenda-web/src/components/ShareButton.tsx` y `agenda-web/src/components/SportEventModal.tsx`.
- **Fuera de alcance confirmado:** no se modificaron Header/NavMobile, portada, agenda, hubs, noticias, Mundial, datos, IDs, URLs, contenido fuente, Supabase, RLS ni scripts de sincronización.
- **Revisión renderizada:** 320, 375, 768, 1024 y 1280 px sin overflow horizontal accidental; en 375 px la portada mostró 371 tarjetas y ningún estado vacío. Se guardaron capturas de 375, 1280 y modal de 375 px: `/Users/iturralde/.codex/visualizations/2026/09/02/01a06055-aba1-7203-af93-2e17c1a6f017/guiasports-f1-adoption-375.png`, `/Users/iturralde/.codex/visualizations/2026/09/02/01a06055-aba1-7203-af93-2e17c1a6f017/guiasports-f1-adoption-1280.png` y `/Users/iturralde/.codex/visualizations/2026/09/02/01a06055-aba1-7203-af93-2e17c1a6f017/guiasports-f1-adoption-modal-375.png`.
- **Datos y cobertura visual:** la configuración local corregida por el usuario permitió validar eventos reales; se confirmó que la lectura pública funciona y que la adopción visual es perceptible en tarjetas, chips, compartir y modal. La configuración permanece fuera del diff.
- **Validaciones:** `npm run test` pasó con 5 archivos y 38 pruebas; `npx tsc --noEmit` pasó; `npm run lint` pasó; `npm run build` completó correctamente con 173/173 páginas; `git diff --check` pasa tras esta actualización.
- **Build:** el bloqueo anterior no se reprodujo al detener el servidor `next dev` del proyecto; no se borraron `.next`, locks ni archivos fuente. Persistió únicamente el aviso informativo de Browserslist sobre datos `caniuse-lite` antiguos.
- **Observaciones de consola:** el entorno reportó advertencias existentes de `next/image` sobre dimensiones modificadas en logos de hubs; no se corrigieron porque pertenecen a fases posteriores y no fueron introducidas por este cambio.
- **Estado de fase:** la base y su primera adopción visible están implementadas localmente; la lectura de eventos funciona, las validaciones pasaron y el usuario aprobó la Fase 1 el 2026-09-04.

**Incidencias detectadas durante la revisión local**

- **Eventos ausentes:** `agenda-web/src/app/page.tsx` usa `NEXT_PUBLIC_SUPABASE_ANON_KEY` para leer `eventos`. La lectura de sólo consulta contra la configuración local devolvió `Legacy API keys are disabled`. El código no captura el `error` de la consulta de eventos; al quedar `evData` vacío, conserva `eventos = []` y la interfaz muestra “Sin resultados / Limpiar filtros”.
- **Causa confirmada y acotada:** `agenda-web/.env.local` existe, está ignorado por Git y fue modificado el 2026-08-27. Su `NEXT_PUBLIC_SUPABASE_ANON_KEY` local conserva formato JWT legacy (208 caracteres), mientras `SUPABASE_SERVICE_ROLE_KEY` local tiene formato Secret key nueva (41 caracteres). Una lectura de sólo consulta con la Secret key confirmó que la base está operativa: 2,141 eventos totales y 372 eventos entre `2026-09-03` y `2026-09-06`. Esto descarta pérdida de datos, rango vacío, RLS bloqueando lecturas o una regresión de la consulta como causa del síntoma local. Producción puede seguir funcionando porque su build recibió variables de entorno distintas y válidas; no se debe inferir ni copiar ningún valor desde el proveedor al repositorio.
- **Resolución confirmada por el usuario:** se verificó que `NEXT_PUBLIC_SUPABASE_URL` corresponde al mismo proyecto de producción y se sustituyó únicamente el valor local de `NEXT_PUBLIC_SUPABASE_ANON_KEY` por la Publishable key vigente `guidasports_staging`. Tras reiniciar `next dev`, los eventos volvieron a aparecer. No se cambiaron Supabase, Vercel, RLS, políticas, datos ni scripts.
- **Impacto en futuros deploys:** `agenda-web/.env.local` está ignorado por Git y no se incluye en commits ni deployments. Los deployments de Vercel usan sus propias variables del entorno seleccionado; por tanto, este ajuste local no altera producción ni cambia la configuración futura de deploy. La variable debe conservar su nombre histórico `NEXT_PUBLIC_SUPABASE_ANON_KEY`; sólo su valor local fue actualizado.
- **Rango adicional de portada:** aun resuelta la autenticación, la portada consulta sólo desde la fecha actual en México hasta hoy + 3 días (`.gte('fecha', hoyStr)` / `.lte('fecha', maxDateStr)`). Esto debe verificarse contra la disponibilidad esperada, pero no es la causa primaria observada en esta revisión.
- **Base visual inicialmente no visible:** durante la primera revisión los patrones `gs-*` estaban definidos, pero todavía no eran consumidos por componentes existentes. La adopción visible P0 quedó resuelta en la misma Fase 1 mediante los componentes compartidos reportados arriba.
- **Alcance:** el bloqueo de datos quedó resuelto sin cambios de aplicación ni configuración versionada. Los componentes de Fases 2–5 permanecen sin rediseñar y pasan al alcance de sus respectivas fases.

### Fase 2 — Header y navegación fluida

Estado: **completada localmente y aprobada por el usuario el 2026-09-04**.

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

#### Reporte de implementación Fase 2 — aprobada

- **Cambios realizados:** se normalizó el shell con los tokens visuales aprobados para barra de progreso, header, navegación desktop, menú móvil y Footer; se redujo el blur/glow permanente y se mantuvo el pulso únicamente en el contexto de En Vivo.
- **Contexto activo:** Header y menú móvil exponen `aria-current="page"` en las rutas existentes de Agenda, En Vivo, Noticias, Plataformas, Nosotros y Contacto donde se renderiza el shell. En Vivo conserva el desplazamiento desde la portada y ahora lleva a `/envivo` cuando se activa desde una subpágina.
- **Navegación móvil:** el menú conserva las cuatro acciones del dock, agrega contexto activo en el panel, cierre por backdrop, retorno de foco al disparador, navegación circular con Tab y cierre con Escape. La búsqueda desde una subpágina retorna a `/#buscar`.
- **Accesibilidad y responsive:** se conservaron los mínimos táctiles de 44 px, foco visible global, safe area inferior y `prefers-reduced-motion`; el desktop mantiene navegación horizontal sin overflow accidental.
- **Archivos modificados:** `agenda-web/src/components/Header.tsx`, `agenda-web/src/components/NavMobile.tsx`, `agenda-web/src/components/Footer.tsx` y `agenda-web/src/app/globals.css`. `layout.tsx` no requirió cambios.
- **Fuera de alcance confirmado:** no se modificaron portada, agenda, tarjetas, modal, noticias, hubs, Mundial, datos, IDs, URLs, contenido fuente, `.env.local`, Supabase, RLS, scripts de sincronización ni dependencias.
- **Revisión renderizada:** la portada local cargó 384 eventos a 1280 px, Agenda quedó activa y la ruta `/envivo` marcó En Vivo. El entorno del navegador no expuso control de viewport para emular 320, 375, 768 y 1024 px; la validación de esos anchos queda pendiente de revisión manual o de un entorno con emulación disponible.
- **Validaciones:** `npm run test` pasó con 5 archivos y 38 pruebas; `npx tsc --noEmit` pasó; `npm run lint` pasó; `git diff --check` pasa. `npm run build` quedó bloqueado en `Creating an optimized production build ...` manteniendo el lock de `.next`; no se borraron `.next`, locks ni archivos fuente.
- **Estado de fase:** Fase 2 implementada localmente y aprobada por el usuario el 2026-09-04. No se hizo push ni deploy.

#### Incidencia recurrente de build local

- **Diagnóstico confirmado por el mensaje de la terminal:** `Another next dev server is already running` significa que ya existía un servidor `next dev` para este proyecto; el PID reportado fue `43645`. El segundo `npm run dev` no inicia otro servidor y devuelve el prompt.
- **Precisión de Next.js 16.2.1:** la documentación oficial indica que `next dev` usa `.next/dev` y que `isolatedDevBuild` está activo por defecto, por lo que `next dev` y `next build` pueden ejecutarse de forma concurrente sin asumir automáticamente una colisión de salida. La configuración local no sobrescribe esta opción.
- **Evidencia del build de esta sesión:** `npm run build` permaneció en `Creating an optimized production build ...`; `.next/diagnostics/build-diagnostics.json` reportó `buildStage: "compile"` y `useBuildWorker: "true"`. El proceso se detuvo limpiamente después de varios minutos, sin borrar `.next`, locks ni archivos fuente. No se modificaron datos ni configuración de Supabase.
- **Procedimiento acordado:** usar un solo `next dev`; antes de un build, detenerlo de forma conservadora con `Ctrl+C` y confirmar que el puerto 3000 quedó libre; confirmar también que no exista otro `next dev` o `next build`; ejecutar un solo `npm run build`; si vuelve a quedarse en `compile`, revisar proceso, lock y diagnóstico antes de atribuirlo al servidor dev. No borrar `.next`, locks de paquetes ni archivos fuente como solución rutinaria.
- **Investigación adicional autorizada para una sesión futura:** si el build sigue detenido sin colisión de procesos, revisar específicamente conectividad/descarga de `next/font/google`, memoria y trazas de Turbopack, sin tocar credenciales, Supabase, datos ni configuración local protegida.
- **Confirmación del usuario (2026-09-04):** se realizó el flujo acordado: detener el servidor local, verificar puerto/procesos y continuar con la revisión. La Fase 3 Visual queda aprobada y el handoff a Fase 4 preparado; Fase 4 permanece pendiente de inicio.

### Fase 3 — Rediseño de la portada

Estado: **completada localmente y aprobada por el usuario el 2026-09-04**.

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

#### Reporte de implementación Fase 3 — aprobada

- **Cambios realizados:** se reforzó la jerarquía inicial con resumen de agenda, búsqueda y accesos rápidos; el hero ahora comunica estado, evento, hora, fecha, canal y acción principal; `AgendaResults` separa En Vivo y Próximos; Imperdibles y Noticias tienen bloques visuales diferenciados; vacío, carga y error cuentan con tratamientos explícitos o reutilizables.
- **Responsive y accesibilidad:** se corrigió un overflow causado por el ancho intrínseco del buscador; la portada y el panel de filtros fueron revisados a 320, 375, 768, 1024 y 1280 px sin overflow horizontal accidental. Se conservaron foco visible, teclado, `aria-pressed`, nombres accesibles, touch targets y movimiento reducido.
- **Archivos modificados:** `HomeClient.tsx`, `HomeHero.tsx`, `HomeDestacados.tsx`, `agenda/AgendaSearch.tsx`, `agenda/AgendaQuickActions.tsx`, `agenda/AgendaFilters.tsx`, `agenda/AgendaResults.tsx` y `globals.css`.
- **Fuera de alcance confirmado:** no se modificaron datos, IDs, URLs, contenido fuente, `.env.local`, Supabase, RLS, scripts de sincronización, hubs, Mundial ni dependencias nuevas. No se hizo push ni deploy.
- **Validaciones:** `npm run test` pasó con 5 archivos y 38 pruebas; `npx tsc --noEmit`, `npm run lint` y `git diff --check` pasan. `npm run build` quedó detenido en `compile` tras varios minutos; se interrumpió limpiamente sin borrar `.next`, locks ni archivos fuente. La consola sólo mostró advertencias preexistentes de dimensiones de imágenes en hubs fuera de esta fase.

#### Handoff a Fase 4

- **Siguiente alcance:** tarjetas, estados y detalle de evento en `EventCard.tsx`, `SportEventCard.tsx`, `SportEventModal.tsx` y `evento/[slug]/page.tsx`.
- **Condición:** Fase 4 aún no inicia; debe conservar datos, IDs, URLs y lógica existente, y comenzar sólo después de este cierre aprobado.

### Fase 4 — Tarjetas, estados y detalle de evento

Estado: **completada localmente y aprobada por el usuario el 2026-09-06**.

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

#### Reporte de implementación Fase 4 — aprobada

- **Cambios realizados:** se normalizó `SportEventCard` bajo el orden estado/momento → evento → canal → contexto → acciones; hora y fecha tienen mayor jerarquía, los canales usan tratamiento informativo común y la transmisión no confirmada se muestra como “Por confirmar” sin prometer disponibilidad. Se eliminaron colores específicos por plataforma/deporte en la tarjeta para reducir ruido.
- **Estados:** las tarjetas, el modal y el detalle distinguen Próximo, En vivo y Finalizado mediante texto, estructura y color. El estado de transmisión no confirmada se conserva explícito y prudente cuando el campo de canal está vacío o contiene una indicación pendiente.
- **Acciones y continuidad:** se hizo visible “Ver detalle” como acción primaria; se conservaron compartir, enlaces directos, agendar y la ruta canónica existente. `EventCard.tsx` conserva su contrato y delegación a `SportEventCard`; no se alteraron los favoritos del Mundial, que permanecen fuera de esta fase.
- **Modal:** `SportEventModal` mantiene el evento durante la salida para permitir la animación, conserva cierre por botón, backdrop, Escape y gesto móvil, bloquea el scroll sólo mientras corresponde y devuelve el foco al disparador al cerrar.
- **Detalle:** `evento/[slug]/page.tsx` adopta la misma jerarquía de estado, hora, competición y transmisión, con acción primaria de regreso a la agenda y compartir conservado. No se modificaron metadata, JSON-LD, IDs ni URLs.
- **Archivos modificados en la fase:** `agenda-web/src/components/SportEventCard.tsx`, `agenda-web/src/components/SportEventModal.tsx` y `agenda-web/src/app/evento/[slug]/page.tsx`. `EventCard.tsx` fue revisado y no requirió cambios visuales propios.
- **Revisión renderizada:** se revisaron 320, 375, 768, 1024 y 1280 px sin overflow horizontal accidental. Se verificaron apertura, cierre por botón, Escape y retorno de foco; se guardaron capturas temporales de portada, modal y detalle en `/private/tmp/guiasports-fase4-375.png`, `/private/tmp/guiasports-fase4-modal-375.png` y `/private/tmp/guiasports-fase4-detalle-375.png`.
- **Validaciones:** `npm run test` pasó con 5 archivos y 38 pruebas; `npx tsc --noEmit`, `npm run lint` y `git diff --check` pasan. `npm run build` fue ejecutado con el puerto 3000 libre y sin otro listener de Next; permaneció en `Creating an optimized production build ...` / `buildStage: compile` con `useBuildWorker: true` y se detuvo limpiamente. No se observaron errores de red; la enumeración de procesos está limitada por el entorno y no se borraron `.next`, locks ni fuentes.
- **Fuera de alcance confirmado:** no se modificaron datos, contenido fuente, IDs, URLs, `.env.local`, Supabase, RLS, credenciales de producción, scripts de sincronización, noticias, hubs, Mundial, configuración versionada ni dependencias nuevas. No se hizo push ni deploy.
- **Estado de fase:** implementación local revisada y aprobada explícitamente por el usuario el 2026-09-06. El siguiente bloque es Fase 5 — Noticias, deportes y hubs.

### Fase 5 — Noticias, deportes y hubs

Estado: **completada localmente y aprobada por el usuario el 2026-09-06**.

Archivos principales:

- `noticias/` (`page.tsx` y `[slug]/page.tsx`).
- `futbol/` (`page.tsx` y `[competicion]/page.tsx`).
- `nba/` (`page.tsx`).
- `mlb/` (`page.tsx`).
- `f1/` (`page.tsx`).
- `mundial-2026/` (`page.tsx`).
- `components/Breadcrumbs.tsx`.
- `globals.css`.

Actividades:

- Compartir patrones de encabezado, breadcrumbs y módulos destacados.
- Mejorar jerarquía de la portada de noticias.
- Unificar presentación de hubs sin borrar su personalidad.
- Mantener el Mundial como archivo histórico visualmente claro.
- Mejorar enlazado interno sin cambiar URLs.

Criterio de salida: las secciones pertenecen al mismo producto y conservan sus diferencias útiles.

#### Reporte de implementación Fase 5 — aprobada

- **Patrones base compartidos y breadcrumbs:** se introdujeron utilidades reutilizables (`.gs-hub-header`, `.gs-hub-icon-box`, `.gs-hub-title`, `.gs-hub-subtitle`, `.gs-hub-quicklinks`, `.gs-news-hero`, `.gs-news-grid`, `.gs-news-card`, `.gs-sports-nav` y `.gs-breadcrumbs`). `Breadcrumbs.tsx` se normalizó con tipografía sobria, enlaces accesibles en `var(--gs-color-text-subtle)` con hover en azul y elemento activo en blanco sin mayúsculas agresivas.
- **Jerarquía en portada de noticias (`noticias/page.tsx`):** se implementó un artículo destacado (*Hero Editorial*) para el primer resultado con preview amplio, badge semántico, metadatos estructurados y llamada a la acción; los artículos secundarios se ordenan en una cuadrícula responsiva limpia; se integró navegación temática hacia hubs deportivos y paginación estilizada con botones de sistema.
- **Detalle de artículo (`noticias/[slug]/page.tsx`):** se sustituyó el banner inferior ruidoso por un panel nocturno slate con botón de compartir unificado; los bloques de transmisión ("DÓNDE VER / HORARIO") se adaptaron a superficies sobrias con acentos lima y azul; se generó enlazado contextual automático hacia el hub deportivo relevante en las migas de pan y en la cabecera.
- **Unificación de hubs deportivos (`futbol/`, `nba/`, `mlb/`, `f1/`):** NBA, MLB y F1 adoptaron el componente compartido `EventListWithModal` (validado en Fase 4), unificando las tarjetas de eventos, horarios visibles, canales, badges de LIVE semánticos y modal de detalle accesible con retorno de foco; se mantuvieron sus emojis e identidad temática (⚽️, 🏀, ⚾️, 🏎️); se estandarizaron las noticias relacionadas y el módulo de navegación cruzada a otros deportes. En `futbol/[competicion]/page.tsx` se unificó el encabezado y la navegación entre competiciones (Liga MX, Champions, Premier).
- **Archivo histórico Mundial 2026 (`mundial-2026/page.tsx`):** se eliminaron los efectos blur estridentes de fondo; se consolidaron las superficies dark slate con acento amarillo institucional para los destacados del archivo; se unificaron las migas de pan con el estándar del producto y se preservó al 100% la funcionalidad de calendario, llaves, sedes y selector de zonas horarias.
- **Enlazado interno:** se enriqueció la navegación cruzada entre noticias, hubs y archivo histórico sin alterar ninguna ruta ni URL canónica.
- **Revisión responsive y viewport:** diseño responsivo verificado estructuralmente en 320, 375, 768, 1024 y 1280 px (títulos elásticos con `clamp`, flex-wrap en chips y breadcrumbs para evitar overflow horizontal accidental, colapso de rejillas de noticias a 1 columna en móvil y 2 columnas en tablet/desktop, y cuadrícula de otros deportes de 2 columnas en móvil a 4 en desktop).
- **Validaciones:** `npm run test` pasó con 5 archivos y 38 pruebas; `npx tsc --noEmit`, `npm run lint` y `git diff --check` pasaron sin errores ni advertencias. `npm run build` fue ejecutado con el puerto 3000 libre y sin listeners huérfanos; permaneció en etapa de compilación y se canceló limpiamente sin borrar `.next`, locks ni archivos fuente.
- **Fuera de alcance confirmado:** no se modificaron datos, IDs, URLs, esquemas Supabase, RLS, scripts de sincronización, credenciales de producción ni `.env.local`. No se introdujeron dependencias nuevas. No se hizo push ni deploy.
- **Estado de fase:** implementación local revisada y aprobada explícitamente por el usuario el 2026-09-06. El siguiente bloque es Fase 6 — Microinteracciones y rendimiento percibido.

#### Handoff a Fase 6

- **Siguiente alcance:** Fase 6 — Microinteracciones y rendimiento percibido (transiciones breves, feedback inmediato, estados de carga, optimización de imágenes y accesibilidad de animaciones).
- **Condición:** Fase 6 pendiente de iniciar; comenzará en la siguiente sesión tras este cierre aprobado.

### Fase 6 — Microinteracciones y rendimiento percibido

Estado: **completada localmente y aprobada por el usuario el 2026-09-07**.

Archivos principales:

- `SportEventModal.tsx`, `WCMatchModal.tsx`.
- `NavMobile.tsx`, `AgendaFilters.tsx`.
- `WCMatchCard.tsx`, `mundial-2026/page.tsx` (favoritos).
- `app/loading.tsx`, `AgendaResults.tsx` (estados de carga).
- `globals.css`.

Actividades:

- Añadir transiciones breves para filtros, modales, navegación y favoritos.
- Crear estados de carga y feedback inmediato.
- Revisar `next/image`, dimensiones, LCP y advertencias de scroll.
- Mantener animaciones reducidas cuando corresponda.
- Evitar que Framer Motion o efectos visuales perjudiquen rendimiento o accesibilidad.

Criterio de salida: la interfaz se siente rápida y viva, sin distraer.

#### Reporte de implementación Fase 6 — aprobada

- **Transiciones contenidas (160–220 ms, curva estándar `cubic-bezier(0.2,0.8,0.2,1)`):** `SportEventModal` y `WCMatchModal` reemplazan el spring por tween de 200 ms (panel) y 160 ms (backdrop); el panel de filtros (`AgendaFilters`) abre/cierra con `AnimatePresence` en 160 ms; el bottom sheet móvil (`NavMobile`) entra/sale con fade + slide de 160 ms y retira utilidades inertes `animate-in…`. Favoritos y chips/botones añaden feedback de presión (`active:scale-90/0.97`) y transiciones de color/relleno.
- **Movimiento reducido estricto:** los componentes animados consultan `useReducedMotion` y omiten desplazamiento/transformación (sólo fundido instantáneo) cuando aplica; el bloque global de `prefers-reduced-motion` ahora anula también los `transform` decorativos de hover/pressed.
- **Estados de carga esqueletales:** `app/loading.tsx` y el `LoadingState` de `AgendaResults` replican la geometría real de tarjeta (estado → hora/emoji → texto → acciones), usan `min-height` fijo en el hero y mejoran semántica (`role="status"`, `aria-live`, `aria-busy`, `sr-only`, decoración `aria-hidden`) sin saltos de layout.
- **Imágenes y LCP:** no se añadieron imágenes nuevas; los logos conservan `width`/`height` + `h-* w-auto` (sin warning de dimensión) y el logo del header mantiene `priority`. Las advertencias preexistentes de hubs quedan fuera de alcance.
- **Archivos modificados en la fase:** `agenda-web/src/app/globals.css`, `agenda-web/src/app/loading.tsx`, `agenda-web/src/components/SportEventModal.tsx`, `agenda-web/src/components/NavMobile.tsx`, `agenda-web/src/components/agenda/AgendaFilters.tsx`, `agenda-web/src/components/agenda/AgendaResults.tsx`, `agenda-web/src/components/mundial/WCMatchCard.tsx`, `agenda-web/src/components/mundial/WCMatchModal.tsx` y `agenda-web/src/app/mundial-2026/page.tsx` (sólo transición del botón favoritos).
- **Revisión responsive y viewport:** el entorno no expone emulación de navegador (limitación ya registrada en Fases 2 y 4); se realizó auditoría estructural para 320, 375, 768, 1024 y 1280 px sin overflow horizontal añadido (transformaciones compositivas, panel de filtros `w-[min(24rem,calc(100vw-2rem))]`, menú móvil acotado por `left-0 right-0 mx-4`). La validación visual interactiva queda para Fase 7.
- **Validaciones:** `npm run test` pasó con 5 archivos y 38 pruebas; `npx tsc --noEmit`, `npm run lint` y `git diff --check` pasan. `npm run build` completó correctamente con 173/173 páginas tras confirmar puerto 3000 libre y ausencia de otros procesos de Next; no se borraron `.next`, locks ni fuentes. Persistió sólo el aviso informativo de Browserslist/caniuse-lite.
- **Fuera de alcance confirmado:** no se modificaron datos, IDs, URLs, contenido fuente, `.env.local`, Supabase, RLS, credenciales, scripts de sincronización ni dependencias nuevas. No se hizo push ni deploy.
- **Estado de fase:** implementación local revisada y aprobada explícitamente por el usuario el 2026-09-07. El siguiente bloque es Fase 7 — QA visual, accesibilidad y regresión.

#### Handoff a Fase 7

- **Siguiente alcance:** QA visual, accesibilidad y regresión en las rutas prioritarias (viewports 320, 375, 768, 1024 y 1280 px; overflow horizontal, contraste/legibilidad, foco y recorrido Tab, VoiceOver, touch targets, estados de carga/vacío/error, modales/filtros/favoritos/navegación rápida y consola del navegador).
- **Condición:** Fase 7 pendiente de iniciar; conserva datos, IDs, URLs y lógica existente y comenzará tras este cierre aprobado.

### Fase 7 — QA visual, accesibilidad y regresión

Estado: **completada localmente y aprobada por el usuario el 2026-09-08**.

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

#### Reporte de implementación Fase 7 — aprobada

- **Método:** QA automatizado por CDP sobre Chrome 152 headless con un harness Node nativo (WebSocket/fetch, sin dependencias nuevas) contra `next dev` local y datos reales. Se midió DOM (overflow y recorte real), consola, contraste (AA), áreas táctiles y se probó la interacción (modal, filtros, menú móvil, favoritos, movimiento reducido). El modelo no admite inspección de imágenes; la verificación visual se basó en mediciones DOM y las capturas quedan en `/private/tmp/guiasports-fase7/`.
- **Overflow horizontal:** `scrollWidth–clientWidth = 0` en 320/375/768/1024/1280 px en portada, En Vivo, noticias, hubs, Mundial, plataformas, nosotros, contacto y rutas dinámicas (`/evento/*`, `/noticias/*`). Los elementos fuera de viewport restantes pertenecen a carruseles horizontales intencionales o fondos decorativos recortados.
- **Recortes reales corregidos (acotados):** `/plataformas` en 320 px (encabezado `flex` sin `min-w-0` recortaba el título; se añadió `min-w-0` y `break-words`) y paginación de `/noticias` en 320/375 px (desbordaba y quedaba recortada; ahora `flex-wrap` + área táctil de 44 px en los números).
- **Contraste AA:** auditoría inicial encontró 361 textos por debajo de AA (micro-etiquetas de 9–12 px y textos secundarios en `slate-500/600/700` y roles `faint`). Corrección acotada: los roles de texto `faint` (#64748b) subieron a `subtle` (#94a3b8) en `globals.css` (footer, copy, update-status, news-meta, contadores, meta de sección y etiquetas del hero) y las utilidades `text-slate-500/600/700` informativas pasaron a `text-slate-400` en tarjetas, ad-slots, vacíos, tabla de posiciones, goleadores, En Vivo, Mundial, plataformas, nosotros y formulario de contacto. Auditoría final: **0 textos por debajo de AA** en 12 rutas a 1280 px.
- **Interacción y teclado:** modal abre desde el disparador enfocado, mantiene el foco dentro (Tab x12) y tras Escape devuelve el foco exacto al disparador; menú móvil cierra con Escape y devuelve el foco al toggle; panel de filtros cierra por `mousedown` fuera; favoritos del Mundial alternan correctamente (5 → 1 → 5); `prefers-reduced-motion: reduce` verificado (`--gs-motion-fast` = 1 ms).
- **Consola y estados:** sin errores ni excepciones en las rutas probadas; estados vacíos y skeletons renderizan correctamente.
- **Archivos modificados en la fase:** `globals.css`, `plataformas/page.tsx`, `noticias/page.tsx`, `SportEventCard.tsx`, `AdPlacement.tsx`, `StickyAd.tsx`, `EventListWithModal.tsx`, `envivo/page.tsx`, `mundial-2026/page.tsx`, `mundial/WCGroupTable.tsx`, `ligamx/LigaMxStandings.tsx`, `ligamx/LigaMxTopScorers.tsx`, `quienes-somos/page.tsx`, `contacto/ContactoForm.tsx`.
- **Validaciones:** `npm run test` con 5 archivos y 38 pruebas; `npx tsc --noEmit`, `npm run lint` y `git diff --check` pasan; `npm run build` completó con la tabla de 173 rutas tras confirmar puerto 3000 libre y sin otros procesos de Next. No se borraron `.next`, locks ni fuentes.
- **Fuera de alcance confirmado:** no se modificaron datos, IDs, URLs, contenido fuente, `.env.local`, Supabase, RLS, credenciales, scripts de sincronización ni dependencias nuevas. No se hizo push ni deploy.
- **Estado de fase:** implementación y QA local revisados y aprobados explícitamente por el usuario el 2026-09-08. El siguiente bloque es Fase 8 — Consolidación y release controlado.

#### Handoff a Fase 8

- **Siguiente alcance:** comparar visualmente las rutas críticas, confirmar que no hubo cambios fuera de alcance, preparar checklist de staging, revisar rollback y estado de la rama, y solicitar autorización explícita antes de cualquier push o deploy.
- **Condición:** Fase 8 pendiente de iniciar; comenzará tras este cierre aprobado.

### Fase 8 — Consolidación y release controlado

Estado: **completada localmente y aprobada por el usuario el 2026-09-09; paquete visual aprobado para release**.

Actividades:

- Comparar visualmente las rutas críticas.
- Confirmar que no hubo cambios fuera de alcance.
- Preparar checklist de staging.
- Revisar rollback y estado de la rama.
- Solicitar autorización explícita antes de cualquier push o deploy.

Criterio de salida: existe un paquete visual local aprobado y listo para revisión de release.

#### Reporte de consolidación Fase 8 — aprobada

- **Estado de rama al consolidar:** `main` estaba alineada con `origin/main` (`21bb298`) antes de crear la rama de release; el paquete se preparó localmente sin push ni deploy.
- **Alcance del paquete:** 39 archivos modificados en el árbol de trabajo, todos del plan y de superficies visuales (`agenda-web/src/components/**` y `src/app/**`); sin archivos añadidos, borrados ni sin seguimiento. Fuera del diff: `src/data`, `src/lib`, `admin`, `api`, scripts, config de Next, `package.json`/lock (sin dependencias nuevas), `.env.local` (ignorado) y Supabase/RLS.
- **Paquete visual:** build de producción completado (173 rutas) sobre el código final y servido con `next start`; auditoría final con **overflow 0** en 320/1280 y sin errores de consola en 12 rutas (incluye detalle de noticia y evento). Capturas finales a 375 y 1280 px en `/private/tmp/guiasports-fase8-release/`.
- **Checklist de staging (propuesto):** revisión visual de capturas por ruta crítica; `git status`/`git diff --check` limitados al alcance; validaciones verdes (`test`, `tsc`, `lint`, `build`); verificación en staging de portada/hero, agenda+filtros+modal, En Vivo, noticias (lista/detalle), hubs (futbol/NBA/MLB/F1), Mundial (partidos/favoritos/sedes), plataformas, foco/teclado y `prefers-reduced-motion`; confirmación de lectura Supabase sin tocar RLS; release mediante rama dedicada con revisión y merge a `main` sólo con autorización explícita, sin deploy automático.
- **Rollback:** producción estaba en `origin/main` (`21bb298`) antes del release; el rollback es revertir el commit `5149559` o redesplegar `21bb298` (cambios visuales reversibles, sin migraciones de datos).
- **Preparación y publicación de release:** se creó la rama `release/visual-v1` con el commit `5149559` del paquete visual, se publicó la rama y se hizo fast-forward de `main` (`21bb298..5149559`) a `origin/main`, disparando el deploy de producción en Vercel. Verificación en producción: HTTP 200 y cambios del release presentes (paginación de noticias, `break-words` en plataformas, `gs-footer-link` en `text-subtle`).
- **Validaciones:** `npm run test` con 5 archivos y 38 pruebas; `npx tsc --noEmit`, `npm run lint`, `npm run build` (173 rutas) y `git diff --check` correctos. Servidor de preview detenido y puerto 3000 libre.
- **Estado de fase:** paquete visual **publicado en producción** el 2026-09-09; rama `main` y `release/visual-v1` publicadas en `origin`. Sin deploy manual adicional.

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

## Handoff final — Release controlado

### Paquete visual GuíaSports (Fases 0–8 + Ajustes UX Agenda & Filtros)

Estado: **publicado en producción el 2026-09-09** (Fases 0–8); **ajustes UX de Agenda y Filtros aprobados y autorizados para deploy el 2026-09-22**.

- **Rama de release:** `release/visual-v1` publicada en `origin`; `main` incluye las Fases 0–8 y los ajustes UX de Agenda y Filtros.
- **Contenido del release de ajustes (2026-09-22):**
  - Helper `isEventPast` y pruebas unitarias (`mexicoTime.ts`, `mexicoTime.test.ts`).
  - Separación cronológica en `AgendaResults.tsx`: "Próximos eventos" inicia desde el momento actual.
  - Bloque colapsable "Eventos anteriores de hoy" con acento y borde azul sutil (`border-blue-500/30`), contador y auto-expansión en búsqueda.
  - Divisor de cambio de día en scroll con salto vertical, borde superior y gradiente luminoso en `AgendaResults.tsx` y `EventListWithModal.tsx`.
  - Reubicación del botón "Filtrar" junto a "En vivo" y "Hoy" en `AgendaQuickActions.tsx` y `HomeClient.tsx`.
  - Panel de filtros responsive con backdrop táctil en móvil y popover anclado en escritorio (`AgendaFilters.tsx`).
- **Validaciones:** 41/41 tests pasando en vitest, TypeScript 0 errores, ESLint 0 errores/warnings, build 173/173 rutas estáticas generadas, git diff check limpio.
- **Rollback:** Revertir el commit de release (cambios puramente de frontend, sin migraciones de datos ni cambios en Supabase).
- **Puerta de autorización:** Autorización explícita otorgada por el usuario para el deploy a producción.

## Registro breve de decisiones

| Fecha | Decisión |
|---|---|
| 2026-09-01 | Se crea este plan separado para mantener la remediación técnica cerrada y reducir contexto en sesiones futuras. |
| 2026-09-01 | El plan de remediación anterior queda como referencia histórica; no se copiarán sus instrucciones ni se reabrirá A8 sin nueva evidencia. |
| 2026-09-01 | El kickoff se integra en este archivo para evitar duplicar un segundo documento activo. |
| 2026-09-01 | Se documenta una propuesta de Fase 0: dirección “guía de transmisión nocturna”, jerarquía, mapa de superficies, estados y criterios para Fase 1; queda pendiente de aprobación. |
| 2026-09-01 | El usuario aprueba la propuesta de Fase 0; se cierra el brief y el handoff pasa a Fase 1, que permanece pendiente de iniciar. |
| 2026-09-01 | Se implementa la base visual de Fase 1 en `globals.css` y `layout.tsx`; queda en revisión del usuario por la limitación del build y la ausencia de datos en la revisión local. |
| 2026-09-03 | Se confirma que la discrepancia era exclusivamente local: se reemplazó en `.env.local` la JWT legacy por la Publishable key `guidasports_staging`, se reinició el servidor y los eventos reaparecieron. El archivo está ignorado por Git y no afecta futuros deploys. Los patrones `gs-*` aún no son consumidos por componentes; la adopción visual queda como siguiente bloque P0. |
| 2026-09-03 | Se implementa la primera adopción visible P0 en componentes compartidos: tarjeta, chips, hora, compartir y modal consumen los patrones base. La revisión con eventos reales pasa en 320/375/768/1024/1280 px sin overflow; la Fase 1 queda pendiente de aprobación visual. |
| 2026-09-04 | El usuario aprueba la Fase 1. Se cierra el handoff de Sistema visual base y se prepara la Fase 2 — Header y navegación fluida; no se inicia todavía la implementación de Fase 2. |
| 2026-09-04 | Se implementa localmente y se aprueba el bloque P0 de Fase 2: shell, rutas activas, navegación desde subpáginas, menú móvil accesible y Footer consumen tokens aprobados. Se documenta la incidencia de procesos duplicados y build detenido; no se borran archivos para resolverla. |
| 2026-09-04 | Se implementa y aprueba la Fase 3 — Rediseño de la portada: jerarquía inicial, hero, búsqueda, accesos, separación de estados y revisión responsive completadas. Se prepara el handoff de Fase 4. |
| 2026-09-06 | Se implementa, revisa y aprueba la Fase 4 — Tarjetas, estados y detalle de evento: hora/canal visibles, estados normalizados, acciones primarias claras, modal con retorno de foco y detalle coherente. Se prepara el handoff de Fase 5. |
| 2026-09-06 | Se implementa, revisa y aprueba la Fase 5 — Noticias, deportes y hubs: encabezados unificados gs-hub-header, migas de pan tokenizadas, jerarquía editorial con hero y cuadrícula en noticias, adopción de EventListWithModal en NBA/MLB/F1, archivo histórico sobrio del Mundial 2026 y enlazado interno cruzado sin cambio de URLs ni dependencias. Se prepara el handoff de Fase 6. |
| 2026-09-07 | Se implementa, revisa y aprueba la Fase 6 — Microinteracciones y rendimiento percibido: transiciones contenidas de 160–220 ms en modales, panel de filtros y menú móvil, feedback de presión en chips y favoritos, skeletons con geometría real y semántica de carga, `prefers-reduced-motion` estricto y revisión de imágenes/LCP sin cambios de datos ni dependencias. Se prepara el handoff de Fase 7. |
| 2026-09-08 | Se implementa, revisa y aprueba la Fase 7 — QA visual, accesibilidad y regresión: auditoría por CDP sin dependenciasGlide, overflow 0 en 320–1280, corrección acotada de dos recortes en móvil (plataformas y paginación de noticias), contraste AA llevado a 0 fallos en 12 rutas y validaciones completas. Se prepara el handoff de Fase 8. |
| 2026-09-09 | Se consolida y aprueba la Fase 8 — Consolidación y release controlado: alcance confirmado (39 archivos visuales + plan), paquete visual con build 173/173 y capturas finales, checklist de staging y rollback definidos. Se crea la rama `release/visual-v1` con el commit del paquete; el push/deploy queda pendiente de autorización explícita. |
| 2026-09-09 | Con autorización explícita del usuario, se publica completamente: push de `release/visual-v1` y fast-forward de `main` (`21bb298..5149559`) a `origin`, disparando el deploy de producción en Vercel. Verificación en producción correcta (HTTP 200 y cambios del release presentes). |
| 2026-09-22 | Se aprueban e implementan ajustes UX de Agenda y Filtros: separación de eventos pasados vs próximos de hoy con botón colapsable 'Eventos anteriores de hoy' destacado en azul sutil, reubicación del botón 'Filtrar' junto a 'En vivo' y 'Hoy', y divisor visual de cambio de día en scroll con gradiente y salto vertical. |
| 2026-09-22 | Con autorización explícita del usuario, se aprueba la publicación y deploy a producción de los ajustes UX. |
| 2026-10-27 | Se documenta el Bloque A: cuatro tareas principales, una acción primaria por superficie, contrato común de evento, límites conservar/simplificar, matriz de rutas con shell actual y criterios de aceptación de M1. Sin cambios de código; pendiente de aprobación. |
| 2026-10-27 | El usuario aprueba el Bloque A y autoriza iniciar M1. Se implementa el shell público único, la ruta activa, el destino único de En Vivo, el menú móvil en paleta, la búsqueda de escritorio y la carga sin header duplicado; validaciones y revisión renderizada correctas. Sin push ni deploy. |
| 2026-10-27 | El usuario aprueba M1 y autoriza iniciar M2. Se convierten En Vivo y Hoy en filtros explícitos, se añaden chips de filtros activos con limpieza individual, estados vacíos específicos, destacados sólo vigentes y hero limitado a la vista editorial. Sin push ni deploy. |
| 2026-10-27 | El usuario aprueba M2 y autoriza iniciar M3. Se endurece la búsqueda con stopwords, palabra completa para consultas cortas y canales, chip de búsqueda activa, limpieza en un paso, Escape en filtros y áreas táctiles de 44 px; se añaden pruebas de relevancia. Sin push ni deploy. |
| 2026-10-27 | El usuario aprueba M3 y autoriza iniciar M4. Se unifica la tarjeta, En Vivo adopta el modal compartido, los hubs priorizan activos y colapsan finalizados, detalle/modal alinean su orden y se corrige el desfase de hidratación con un instante de referencia del servidor. Sin push ni deploy. |
| 2026-10-27 | El usuario aprueba M4 y autoriza iniciar M5. Se normaliza la jerarquía de hubs/noticias, se simplifican titulares y breadcrumbs, se rehacen las superficies de plataformas con tokens y se conserva la piel de archivo del Mundial. Sin push ni deploy. |
| 2026-10-27 | El usuario aprueba M5 y autoriza iniciar M6. La QA de tareas detecta pérdida de contexto al volver del detalle; se corrige con persistencia por pestaña, se enfoca la búsqueda móvil y se eleva el contraste de etiquetas a AA. Sin push ni deploy. |
| 2026-10-27 | El usuario aprueba M6 con un ajuste visual y confirma el resultado. La pastilla queda a la derecha del icono en escritorio y al extremo derecho de la fila en móvil; se elimina la fila superior de la tarjeta para reducir su altura, conservando estado, hora, evento, canal, contexto y acciones. Sin push ni deploy. |
| 2026-10-27 | Con autorización explícita del usuario, se publica el paquete `11bf3a8` en `release/ux-simplificacion` y `main`; el deploy de producción se verificó con HTTP 200 y los marcadores visuales del paquete en `/nba` y `/plataformas`. |

## Registro de sesiones

| Fecha | Fase | Resultado | Referencia |
|---|---|---|---|
| 2026-09-01 | Preparación | Plan creado; sin cambios de código | Este documento |
| 2026-09-01 | Fase 0 | Propuesta visual elaborada; pendiente de aprobación; sin cambios de código | Sección “Propuesta de brief visual” de este documento |
| 2026-09-01 | Fase 0 | Brief aprobado por el usuario; handoff preparado para Fase 1; sin cambios de código | Sección “Brief visual aprobado” de este documento |
| 2026-09-01 | Fase 1 | Base visual implementada localmente; validaciones parciales; pendiente de revisión del usuario | Sección “Reporte de implementación Fase 1” de este documento |
| 2026-09-03 | Fase 1 | Revisión local: datos restaurados tras actualizar sólo la clave pública local; tokens aún sin consumidores; adopción visual pendiente | Sección “Incidencias detectadas durante la revisión local” de este documento |
| 2026-09-03 | Fase 1 | Adopción visible P0 implementada en componentes compartidos; 38 pruebas, TypeScript, lint, build 173/173 y diff check correctos; pendiente de revisión/aprobación del usuario | Sección “Reporte de implementación Fase 1” de este documento |
| 2026-09-04 | Fase 1 | Aprobada por el usuario; handoff preparado para Fase 2 — Header y navegación fluida | Sección “Handoff activo” de este documento |
| 2026-09-04 | Fase 2 | Aprobada por el usuario; 38 pruebas, TypeScript, lint y diff check correctos; build detenido en `compile`, incidencia de procesos documentada y proceso cerrado | Sección “Reporte de implementación Fase 2” de este documento |
| 2026-09-04 | Fase 3 | Aprobada por el usuario; portada implementada localmente, revisión responsive completada y handoff preparado para Fase 4 | Sección “Reporte de implementación Fase 3” de este documento |
| 2026-09-06 | Fase 4 | Aprobada por el usuario; tarjetas, estados, modal y detalle implementados localmente, revisión responsive e interacción completadas; build detenido en `compile` y documentado; handoff preparado para Fase 5 | Sección “Reporte de implementación Fase 4” de este documento |
| 2026-09-06 | Fase 5 | Aprobada por el usuario; noticias, hubs, archivo Mundial unificados con el sistema visual, EventListWithModal adoptado en NBA/MLB/F1; 38 pruebas, TypeScript, lint y diff check correctos; build documentado; handoff preparado para Fase 6 | Sección “Reporte de implementación Fase 5” de este documento |
| 2026-09-07 | Fase 6 | Aprobada por el usuario; transiciones y microinteracciones, skeletons, movimiento reducido e imágenes revisadas; 38 pruebas, TypeScript, lint, diff check y build 173/173 correctos; handoff preparado para Fase 7 | Sección “Reporte de implementación Fase 6” de este documento |
| 2026-09-08 | Fase 7 | Aprobada por el usuario; QA visual/accesibilidad/regresión por CDP sin dependencias nuevas, overflow 0, dos recortes móviles corregidos, contraste AA en 0 fallos y build completado; handoff preparado para Fase 8 | Sección “Reporte de implementación Fase 7” de este documento |
| 2026-09-09 | Fase 8 | Aprobada por el usuario; alcance confirmado (39 archivos visuales + plan), paquete visual con build 173/173, checklist de staging y rollback, y rama `release/visual-v1` con commit local; sin push ni deploy | Sección “Reporte de consolidación Fase 8” de este documento |
| 2026-09-09 | Release | Publicación completa autorizada por el usuario: `release/visual-v1` y `main` (`5149559`) en `origin`; deploy de producción en Vercel verificado con cambios del release en línea | Sección “Reporte de consolidación Fase 8” de este documento |
| 2026-09-22 | Ajustes UX | Aprobados por el usuario (separación de eventos anteriores, botón Filtrar reubicado, divisor de cambio de día); 41 pruebas, TypeScript, lint y build 173/173 correctos; deploy autorizado | Sección “Paquete visual GuíaSports (Fases 0–8 + Ajustes UX Agenda & Filtros)” |
| 2026-10-27 | Bloque A | Contrato de experiencia documentado con auditoría estática verificada; sin cambios de código; pendiente de aprobación para iniciar M1 | Sección “Bloque A — Contrato de experiencia y alcance” |
| 2026-10-27 | M1 | Aprobada por el usuario; shell público único, rutas activas, En Vivo con destino único, menú móvil en paleta y búsqueda de escritorio implementados; 41 pruebas, TypeScript, lint, build 173/173 y revisión 320–1280 sin overflow | Sección “Reporte de implementación M1” |
| 2026-10-27 | M2 | Aprobada por el usuario; En Vivo/Hoy explícitos, chips de filtros activos con limpieza individual, estados vacíos contextuales, destacados vigentes y hero editorial; 41 pruebas, TypeScript, lint, build 173/173 y revisión 320–1280 sin overflow | Sección “Reporte de implementación M2” |
| 2026-10-27 | M3 | Aprobada por el usuario; búsqueda con stopwords y palabra completa, canales sin fragmentos, chip de búsqueda activa, limpieza en un paso, Escape en filtros y 44 pruebas; TypeScript, lint, build 173/173 y revisión 320–1280 sin overflow | Sección “Reporte de implementación M3” |
| 2026-10-27 | M4 | Aprobada por el usuario; contrato único de tarjeta, En Vivo con modal compartido, hubs con activos primero y finalizados colapsados, detalle/modal reordenados y referencia temporal determinista; 44 pruebas, TypeScript, lint, build 173/173 y revisión 320–1280 sin overflow | Sección “Reporte de implementación M4” |
| 2026-10-27 | M5 | Aprobada por el usuario; jerarquía tipográfica compartida, noticias y plataformas simplificadas, breadcrumbs legibles y Mundial conservado como archivo especial; 44 pruebas, TypeScript, lint, build 173/173 y revisión 320–1280 sin overflow | Sección “Reporte de implementación M5” |
| 2026-10-27 | M6 | Aprobada, cerrada y publicada; recorridos de tareas, continuidad, teclado, móvil, movimiento reducido, overflow y contraste AA; se corrigieron contexto, foco de búsqueda móvil y contraste; 44 pruebas, TypeScript, lint, build 173/173 y diff check | Sección “Reporte de QA M6” |
| 2026-10-27 | Ajuste M6 | Confirmado por el usuario; pastilla a la derecha del icono en escritorio y al extremo derecho de la fila en móvil, con fila superior eliminada; tarjeta activa de 150 px en escritorio y 280 px en móvil; revisión 320–1280 sin overflow y validaciones verdes | Sección “Ajuste visual posterior a M6 — ficha de evento” |
| 2026-10-27 | Publicación | Paquete `11bf3a8` publicado en `release/ux-simplificacion` y `main`; deploy verificado con HTTP 200 y marcadores visuales; rollback disponible en `55e66ad` | Sección “Publicación — 2026-10-27” |

## Nueva etapa — Auditoría y simplificación de la experiencia

### Decisión de organización

Esta etapa se mantiene dentro de este mismo documento. No se crea un segundo plan activo: el plan actual ya contiene el historial aprobado, las restricciones operativas y el formato de reporte. Duplicarlo dispersaría el contexto y obligaría a los agentes a reconciliar instrucciones en cada sesión.

Fases 0–8 y el release permanecen cerrados. Esta etapa no los reabre; sólo atiende fricción de uso detectada al evaluar el producto como una persona común.

### Estado y objetivo

- Estado: **Bloque A y M1–M6 aprobados y publicados en producción el 2026-10-27; deploy verificado**.
- Objetivo: que una persona encuentre una transmisión, entienda cuándo es y sepa dónde verla con el menor número de decisiones posible.
- Tipo de trabajo: mantenimiento y ajustes visuales/UX acotados sobre el paquete publicado.
- Siguiente acción recomendada: ninguna pendiente dentro de esta etapa. Cualquier cambio nuevo requiere alcance y autorización explícita.

### Diagnóstico resumido

La base visual publicada es sólida, pero la experiencia todavía se percibe compleja por estos problemas:

- **Navegación fragmentada:** el shell compartido no se percibe igual en todas las rutas públicas.
- **Entrada sobrecargada:** la portada presenta demasiadas capas antes de dejar clara la siguiente acción.
- **Búsqueda poco confiable:** coincidencias amplias pueden mezclar equipos, ligas o deportes irrelevantes.
- **Jerarquía temporal inconsistente:** algunos hubs empiezan con eventos finalizados aunque la intención sea encontrar eventos actuales.
- **Acciones dispersas:** Agenda, En Vivo, hubs y tarjetas no siempre ofrecen la misma acción primaria ni el mismo camino de regreso.

Hallazgos de apoyo: `HomeClient.tsx` concentra decisiones; `envivo/page.tsx` funciona como una mini-experiencia separada; `EventListWithModal.tsx` necesita una jerarquía temporal uniforme; `SportEventCard.tsx` muestra demasiadas acciones en poco espacio; y `Header.tsx`, `NavMobile.tsx` y `layout.tsx` deben resolverse como un solo shell.

Este diagnóstico complementa la QA aprobada de Fases 0–8. No declara una regresión técnica ni reabre el release.

### Resultado de producto esperado

En la primera pantalla el usuario debe poder:

1. Identificar dónde está y qué puede consultar.
2. Ver si hay algo en vivo ahora.
3. Buscar un equipo, liga o canal sin aprender el sistema.
4. Entender hora y canal sin abrir un modal.
5. Abrir un detalle y regresar conservando contexto.

La interfaz debe seguir sintiéndose como una guía de transmisión nocturna: clara, directa, confiable y mexicana; deportiva por ritmo y contraste, no por saturación de efectos.

### Plan de acción

#### Bloque A — Contrato de experiencia y alcance

Estado: **aprobado por el usuario el 2026-10-27; contrato vigente para M1–M6**.

##### A.0 Hallazgos verificados en esta sesión

Auditoría estática de las superficies públicas, sin modificar código:

- `Header` sólo se renderiza en `/` (`HomeClient.tsx`), `/envivo` y `/mundial-2026` (`MundialClient.tsx`). Noticias, hubs, detalle de evento, plataformas, nosotros, contacto y privacidad no tienen navegación superior de escritorio; sólo heredan `Footer` y `NavMobile` desde `layout.tsx`.
- `NavMobile` usa acentos fuera de la paleta aprobada en el menú: azul, esmeralda, naranja, morado y rosa para destinos que no son En Vivo.
- La entrada global “En Vivo” no tiene un destino único: en portada hace scroll interno y en el resto navega a `/envivo`; la ruta activa del shell no siempre refleja esa decisión.
- En Vivo lista eventos en vivo y próximos a iniciar con un diseño propio, pero sus tarjetas no abren detalle ni modal; es una pantalla final, no parte del flujo de consulta.
- Los hubs (`futbol`, `nba`, `mlb`, `f1`) agrupan por fecha desde hoy, pero dentro del día mezclan eventos finalizados con próximos, ordenados sólo por hora; el primer bloque percibido puede ser pasado.
- `SportEventCard` expone hasta cuatro acciones (ver detalle, abrir página, compartir y, fuera de la tarjeta, filtro por liga), lo que compite con la lectura de hora y canal.
- `HomeClient` concentra búsqueda, accesos rápidos, filtros, hero, resultados, destacados, noticias y hubs; antes de buscar ya hay varias capas y criterios posibles.
- La búsqueda por scoring ya desambigua casos como “América” y canales, pero no muestra el criterio activo ni distingue con suficiente claridad “sin coincidencias” de “agenda vacía”.

Estos hallazgos describen fricción de uso; no declaran regresiones de las Fases 0–8 ni reabren el release.

##### A.1 Tareas principales

| # | Tarea del usuario | Pregunta que intenta responder | Entrada natural | Resultado que debe obtener |
|---|---|---|---|---|
| 1 | Ver qué está en vivo | ¿Qué puedo ver ahora? | En Vivo / portada | Evento, hora y canal sin abrir modal. |
| 2 | Ver qué hay hoy y próximos | ¿Qué hay hoy? | Agenda / portada | Agenda agrupada por fecha, con próximos primero. |
| 3 | Saber dónde verlo | ¿En qué canal o plataforma? | Tarjeta / detalle | Canal visible y explícito, o “Por confirmar”. |
| 4 | Buscar un evento | ¿Dónde está mi equipo, liga o canal? | Búsqueda | Resultados pertinentes y criterio activo visible. |

La continuidad (abrir detalle y regresar sin perder contexto) es una condición transversal de las cuatro tareas, no una quinta tarea.

##### A.2 Una acción primaria por superficie

| Superficie | Acción primaria | Acciones secundarias permitidas | No debe competir como primaria |
|---|---|---|---|
| Portada / Agenda | Consultar la agenda (buscar o abrir un evento) | En vivo, Hoy, Filtrar, compartir | Hubs, noticias, destacados |
| En Vivo | Abrir el detalle del evento en vivo | Ver canal, volver a la agenda | Navegación editorial |
| Hub deportivo | Abrir el siguiente evento relevante | Ver agenda completa, noticias del hub | Otras ligas o archivo |
| Noticias (índice) | Leer un artículo | Explorar deportes | Abrir eventos |
| Noticia (detalle) | Leer el contenido | Compartir, volver a noticias | Agenda promocional |
| Evento (detalle) | Identificar canal y regresar a la agenda | Compartir, abrir página canónica | Otras acciones inline |
| Plataformas | Consultar una plataforma | Volver a la agenda | — |
| Nosotros / Contacto / Privacidad | Informarse o contactar | Volver al inicio | — |
| Mundial 2026 | Abrir un partido del archivo | Calendario, sedes, favoritos | Otras campañas |

Regla: una sola acción con tratamiento primario por tarjeta o panel. La acción secundaria se conserva sólo si no desplaza hora, canal o acción principal.

##### A.3 Contrato común de evento

Orden obligatorio en tarjeta, modal, En Vivo, hub y detalle:

1. **Estado y momento** — `En vivo`, `Próximo` o `Finalizado`, más hora local de México y fecha agrupadora. `En vivo` usa rojo y texto; `Próximo` es neutro; `Finalizado` baja prioridad sin perder legibilidad. `isEventLive` define en vivo (inicio −5 min a +125 min); `isEventPast` define finalizado.
2. **Evento** — “Equipo A vs Equipo B” o el título del evento; máximo dos líneas; sin truncar hasta volverlo incomprensible.
3. **Canal** — etiqueta “Dónde verlo” y chips informativos; si el campo está vacío o contiene una indicación pendiente, se muestra `Por confirmar` y no se promete disponibilidad.
4. **Contexto** — deporte y competición en menor jerarquía. En Agenda, la competición puede filtrar; en otros contextos es sólo contexto.
5. **Acción** — primaria `Ver detalle`; la página canónica y compartir son secundarias. No se duplica la misma acción con dos botones equivalentes.

Reglas transversales:

- Mismo orden y mismos nombres de estado en todas las superficies.
- El estado no depende sólo del color: siempre hay texto y estructura.
- Hora y canal se entienden sin abrir modal.
- No se inventan canales, horarios ni estados; los datos y su ausencia se respetan.
- Zona horaria de referencia: `America/Mexico_City`.

##### A.4 Qué se conserva y qué se simplifica

| Se conserva sin cambios | Se simplifica sólo en presentación y flujo |
|---|---|
| Paleta y tokens `gs-*`: azul noche, superficies slate, lima para acción, rojo sólo En Vivo, azul para navegación, amarillo para Mundial. | Capas decorativas, glow, blur, pulsos no semánticos, mayúsculas e itálicas excesivas. |
| Rutas, URLs, canonical, metadata, JSON-LD, sitemap y robots. | Shell: hoy Header sólo en 3 rutas; pasará a un shell público coherente en todas. |
| Consultas, datos, IDs, contenido fuente e imágenes existentes. | Menú móvil: destinos y acentos de color ajenos a la paleta. |
| Contrato de `SportEventCard`, `SportEventModal` y detalle aprobado en Fase 4; foco, Escape y retorno al disparador. | Exceso de acciones inline en la tarjeta y duplicación de botones equivalentes. |
| Búsqueda por scoring, alias y catálogo de canales (M3 podrá ajustar lógica con pruebas). | Orden de entrada de la portada y duplicación entre accesos rápidos, chips y filtros. |
| En Vivo, hubs, noticias, Mundial y plataformas con su contenido y funciones actuales. | Jerarquía temporal de hubs y la En Vivo como pantalla aislada sin detalle. |
| Dock móvil de cuatro acciones, foco atrapado, touch targets y `prefers-reduced-motion`. | Colores por destino y competencia entre dock y panel del menú. |
| Analítica existente y eventos de tracking. | Repetición de micro-etiquetas y textos que no ayudan a decidir. |

No se modifican en esta etapa: datos, IDs, URLs, SEO, Supabase, RLS, `.env.local`, scripts de sincronización, admin, API ni dependencias.

##### A.5 Matriz de rutas, navegación, estado temporal y acción primaria

| Ruta | Superficie | Shell previo a M1 (2026-10-27) | Ruta activa propuesta | Estado temporal | Acción primaria |
|---|---|---|---|---|---|
| `/` | Portada / Agenda | Header propio + Footer/NavMobile global | Agenda | Hoy + 3 días; live separado; anteriores de hoy colapsados | Consultar / abrir detalle |
| `/envivo` | En Vivo | Header propio + shell global | En Vivo | Sólo hoy: live y próximos a 60 min | Abrir detalle (brecha actual) |
| `/noticias` | Noticias | Sólo shell global | Noticias | Editorial, sin estado temporal | Leer artículo |
| `/noticias/[slug]` | Noticia | Sólo shell global; breadcrumbs | Noticias | Editorial | Leer / compartir |
| `/futbol`, `/futbol/[competicion]` | Hub | Sólo shell global; breadcrumbs | Agenda | Hoy en adelante; finalizados de hoy mezclados | Abrir detalle |
| `/nba`, `/mlb`, `/f1` | Hub | Sólo shell global; breadcrumbs | Agenda | Hoy en adelante; finalizados de hoy mezclados | Abrir detalle |
| `/mundial-2026` | Archivo especial | Header propio + shell global | Agenda | Archivo y calendario | Abrir partido |
| `/evento/[slug]` | Detalle de evento | Sólo shell global; BackButton y breadcrumbs | Agenda | Estado individual del evento | Ver canal / volver |
| `/plataformas` | Plataformas | Sólo shell global; breadcrumbs | Plataformas | No aplica | Consultar plataforma |
| `/quienes-somos` | Nosotros | Sólo shell global | Nosotros | No aplica | Informarse |
| `/contacto` | Contacto | Sólo shell global | Contacto | No aplica | Contactar |
| `/privacidad` | Legal | Sólo shell global | Sin entrada primaria | No aplica | Leer |

Decisiones de navegación asociadas:

- La entrada global **En Vivo** apunta siempre a `/envivo`. El atajo “En vivo” de la portada filtra o desplaza dentro de la agenda y debe distinguirse como atajo de superficie, no como destino global.
- Mapa de ruta activa: `/` y `/evento/*` y los hubs ⇒ Agenda; `/envivo` ⇒ En Vivo; `/noticias/*` ⇒ Noticias; `/plataformas` ⇒ Plataformas; `/quienes-somos` ⇒ Nosotros; `/contacto` ⇒ Contacto; `/privacidad` sin entrada activa.
- Regreso: detalle de evento usa historial y cae a `/`; detalle de noticia vuelve a `/noticias`; hub vuelve a Agenda vía breadcrumb; En Vivo vuelve a Agenda.
- Búsqueda desde una subpágina regresa a la búsqueda de portada (`/#buscar`) sin perder el término cuando exista.
- Un solo shell público montado una vez; ninguna página monta un segundo Header. La última actualización de portada se conserva sin añadir consultas nuevas a todas las rutas.
- Dock móvil: Inicio, Buscar, En Vivo y Menú. El panel conserva los seis destinos actuales, agrupados como tres principales (Agenda, En Vivo, Noticias) y tres de apoyo (Plataformas, Nosotros, Contacto), con color sólo cuando aporte significado (rojo En Vivo; azul/lima para el resto).

##### A.6 Criterios de aceptación para M1

- Todas las rutas públicas muestran el mismo Header de escritorio, Footer y NavMobile; no hay doble navegación ni páginas sin orientación superior.
- La ruta activa es correcta según el mapa anterior, incluidos hubs y detalle de evento.
- En Vivo llega a `/envivo` desde cualquier ruta; el atajo de portada sigue siendo un filtro local inequívoco.
- El menú móvil usa sólo la paleta aprobada, conserva 44 px, foco, Escape, retorno al disparador y movimiento reducido.
- Buscar es visible y conduce a la búsqueda de portada desde subpáginas.
- Sin overflow horizontal en 320, 375, 768, 1024 y 1280 px.
- Sin cambios en rutas, URLs, datos, contenido fuente, IDs, Supabase, RLS, scripts ni dependencias.

##### A.7 Fuera de alcance de este bloque

Bloque A no modifica código de aplicación. Sólo fija el contrato. Fue aprobado el 2026-10-27; M1 se implementó después con ese contrato como referencia y fue aprobada el mismo día.

#### Fase M1 — Shell y navegación coherentes

Estado: **aprobada por el usuario el 2026-10-27**.

Archivos guía: `agenda-web/src/app/layout.tsx`, `agenda-web/src/components/Header.tsx`, `agenda-web/src/components/NavMobile.tsx`, `agenda-web/src/components/Footer.tsx` y páginas públicas que no consumen el shell compartido.

Objetivo: que portada, En Vivo, noticias, hubs y detalle se sientan parte del mismo producto.

Acciones:

- Definir un shell público único para desktop y móvil.
- Hacer evidente la ruta activa y mantener una ruta clara de regreso.
- Conservar contexto al pasar de búsqueda a En Vivo, hub, detalle y regreso.
- Reducir destinos y colores ajenos a la paleta en el menú móvil.
- Mantener Mundial 2026 como skin especial, integrado a la orientación general.

Salida: navegación consistente, sin overflow crítico en 320/375/768/1024/1280 px y sin cambiar rutas, URLs, datos ni contenido fuente.

##### Reporte de implementación M1 — aprobada

- **Shell público único:** `Header` se monta una vez en `layout.tsx` para todas las rutas públicas y se retiró de `HomeClient.tsx`, `envivo/page.tsx` y `MundialClient.tsx`. El Header se oculta en `/admin` para no invadir la superficie administrativa. `Footer` y `NavMobile` siguen siendo globales.
- **Ruta activa:** Agenda queda activa en `/`, `/evento/*`, `/futbol*`, `/nba`, `/mlb`, `/f1` y `/mundial-2026`; En Vivo en `/envivo`; Noticias en `/noticias*`; Plataformas, Nosotros y Contacto en sus rutas; `/privacidad` no activa ninguna entrada principal. En portada Agenda usa `aria-current="page"`; en hubs y detalle usa `aria-current="true"` para no anunciar una página distinta. El menú móvil refleja la misma correspondencia.
- **En Vivo con destino único:** la entrada global de Header y el dock móvil navegan siempre a `/envivo`; se retiró el evento `scroll-to-live` y su listener. El atajo “En vivo” de la portada conserva su comportamiento local de desplazamiento/filtro y no se confunde con la navegación global.
- **Menú móvil:** seis destinos agrupados como tres principales (Agenda, En Vivo, Noticias) y tres de apoyo (Plataformas, Nosotros, Contacto), con separador. Se eliminaron los acentos esmeralda, naranja, morado y rosa; sólo En Vivo conserva rojo y el resto usa azul/lima. Se mantienen 44 px, foco atrapado, Escape y retorno al disparador. El menú abierto eleva su capa para que el aviso de cookies no tape la última fila.
- **Búsqueda visible:** se añadió acceso de búsqueda en Header para escritorio (`md+`) que lleva a `/#buscar` y enfoca el campo en portada; el dock móvil conserva su búsqueda y regresa a la búsqueda de portada. Se retiró el bloque de búsqueda muerto de Header.
- **Carga y continuidad:** se eliminó el header esqueletal de `app/loading.tsx` para evitar dos headers durante el fallback de renderizado en cliente. La información de “última actualización” de portada se conserva en el resumen de `HomeClient`, sin añadir consultas nuevas a todas las rutas.
- **Navegación intermedia:** se añadió padding compacto a los enlaces de navegación entre 768 y 1023 px para que los seis destinos no se recorten en tablet.
- **Archivos modificados:** `agenda-web/src/app/layout.tsx`, `agenda-web/src/components/Header.tsx`, `agenda-web/src/components/NavMobile.tsx`, `agenda-web/src/components/HomeClient.tsx`, `agenda-web/src/app/envivo/page.tsx`, `agenda-web/src/app/mundial-2026/MundialClient.tsx`, `agenda-web/src/app/loading.tsx` y `agenda-web/src/app/globals.css`. `Footer.tsx` fue revisado y no requirió cambios.
- **Validación renderizada:** 13 rutas × 5 viewports (320×812, 375×812, 768×900, 1024×900, 1280×900), detalle de evento a 1280 px y 25 casos adicionales de rutas dinámicas (noticia, plataforma, partido del Mundial, autor y `admin/login`): exactamente un `Header` por ruta pública, cero en admin, overflow horizontal 0 y sin errores de consola en la compilación final. Portada hidratada con 162 tarjetas. Menú móvil verificado a 320 y 375 px sin overflow, con áreas de 44 px, sin colores fuera de paleta y cerrando con Escape con retorno de foco. En Vivo navega a `/envivo` y marca la ruta activa. Búsqueda de Header y dock llega a `/#buscar` y enfoca el campo. Nav de escritorio sin recorte en 768, 1024 y 1280 px. Capturas en `/private/tmp/guiasports-m1/`.
- **Hallazgo fuera de M1:** en una compilación intermedia apareció un aviso de hidratación en `/mlb` cuando un evento cruzó la ventana de “En vivo” entre el render estático y el cliente. La compilación final no lo reprodujo. Es un comportamiento dependiente del tiempo en `EventListWithModal`/`SportEventCard` y queda para el alcance de M4; no se modificó en M1.
- **Validaciones:** `npm run test` (5 archivos, 41 pruebas), `npx tsc --noEmit`, `npm run lint`, `npm run build` (173/173 rutas) y `git diff --check` correctos. Puerto 3000 libre al iniciar y detener la revisión; sin borrar `.next`, locks ni archivos fuente.
- **Fuera de alcance confirmado:** no se modificaron datos, IDs, URLs, canonical, schemas, contenido fuente, `.env.local`, Supabase, RLS, scripts de sincronización, admin ni dependencias. Sin push ni deploy.
- **Estado de fase:** implementación local aprobada por el usuario el 2026-10-27. El siguiente bloque es Fase M2 — Portada y agenda orientadas a la tarea.

#### Fase M2 — Portada y agenda orientadas a la tarea

Estado: **aprobada por el usuario el 2026-10-27**.

Archivos guía: `HomeClient.tsx`, `HomeHero.tsx`, `HomeDestacados.tsx`, `agenda/AgendaSearch.tsx`, `AgendaQuickActions.tsx`, `AgendaFilters.tsx` y `AgendaResults.tsx`.

Acciones:

- Ordenar la experiencia como buscar → elegir criterio → consultar resultados.
- Reducir duplicación entre botones rápidos, chips y filtros.
- Hacer que En Vivo y Hoy tengan un comportamiento inequívoco.
- Reservar destacados para eventos vigentes y realmente relevantes.
- Mantener el hero atractivo, pero no necesario para entender la agenda.
- Mejorar filtros activos, limpieza y estados vacíos.

Salida: la primera pantalla deja clara la siguiente acción; En Vivo, próximos y finalizados se distinguen; la información esencial aparece sin abrir modal.

##### Reporte de implementación M2 — aprobada

- **En Vivo y Hoy inequívocos:** ambos son ahora filtros locales con `aria-pressed` y estado visual claro. En Vivo alterna el filtro, limpia la fecha incompatible y lleva a resultados; Hoy alterna la fecha de hoy y desactiva En Vivo al activarse. Elegir una fecha distinta desde el panel desactiva En Vivo para evitar combinaciones imposibles. El desplazamiento a resultados respeta `prefers-reduced-motion`.
- **Filtros activos manejables:** los chips de filtros activos son botones de 44 px con acción individual de quitar (deporte, fecha, competición, TV abierta y En vivo); “Limpiar” sigue disponible para restablecer todo.
- **Estados vacíos específicos:** se distinguen “Sin coincidencias”, “No hay eventos en vivo ahora”, “No hay eventos para hoy”, “No hay eventos con estos filtros”, “No hay eventos próximos” y “Agenda en actualización”, con icono y acción contextual (limpiar búsqueda, quitar filtro En vivo, quitar fecha o limpiar filtros). No se ofrece “Limpiar filtros” cuando no hay eventos.
- **Destacados vigentes:** “Imperdibles de hoy” excluye eventos finalizados, ordena primero los que están en vivo y luego por hora. El hero sólo toma eventos en vivo o destacados vigentes; deja de mostrar un evento ya concluido como prioridad.
- **Flujo de portada:** se conserva el orden buscar → criterios → hero editorial → resultados. El hero permanece como excepción editorial, pero desaparece cuando hay búsqueda o filtros activos, por lo que no bloquea la consulta; búsqueda, resultados y agenda siguen siendo la ruta principal.
- **Normalización de búsqueda:** el estado de búsqueda usa el término sin espacios para alternar hero, resultados y estados vacíos de forma consistente.
- **Archivos modificados:** `agenda-web/src/components/HomeClient.tsx`, `agenda-web/src/components/agenda/AgendaQuickActions.tsx` y `agenda-web/src/components/agenda/AgendaResults.tsx`. `HomeHero.tsx`, `HomeDestacados.tsx`, `AgendaSearch.tsx` y `AgendaFilters.tsx` fueron revisados; no requirieron cambios propios.
- **Validación renderizada:** 320, 375, 768, 1024 y 1280 px en estado inicial, con filtros activos y con vacío: overflow horizontal 0, chips de 44 px, resultados a 100 px de scroll y sin errores de consola. Se verificaron los filtros En vivo (26 eventos), Hoy (106), Fútbol (141), el vacío de búsqueda y el vacío de En vivo con Béisbol. Capturas en `/private/tmp/guiasports-m2/`.
- **Validaciones:** `npm run test` (5 archivos, 41 pruebas), `npx tsc --noEmit`, `npm run lint`, `npm run build` (173/173 rutas) y `git diff --check` correctos. Puerto 3000 libre al iniciar y detener la revisión; sin borrar `.next`, locks ni archivos fuente.
- **Fuera de alcance confirmado:** no se modificaron datos, IDs, URLs, canonical, schemas, contenido fuente, `.env.local`, Supabase, RLS, scripts de sincronización ni dependencias. Sin push ni deploy.
- **Estado de fase:** implementación local aprobada por el usuario el 2026-10-27. El siguiente bloque es Fase M3 — Búsqueda y filtros confiables.

#### Fase M3 — Búsqueda y filtros confiables

Estado: **aprobada por el usuario el 2026-10-27**.

Archivos guía: `agenda-web/src/lib/eventSearch.ts`, `AgendaSearch.tsx`, `AgendaFilters.tsx` y `AgendaResults.tsx`.

Acciones:

- Revisar coincidencias por equipo, competición, deporte y canal sin añadir fuentes nuevas.
- Evitar coincidencias parciales engañosas.
- Mostrar el criterio activo y limpiarlo en un paso.
- Diferenciar “sin coincidencias” de “agenda vacía”.
- Mantener teclado, foco, touch targets y responsive.

Salida: consultas representativas no mezclan resultados irrelevantes de forma evidente. Si se modifica lógica, se documenta como ajuste funcional acotado y se agregan pruebas unitarias; no se tocan datos, IDs ni scripts.

##### Reporte de implementación M3 — aprobada

- **Relevancia de búsqueda:** se añadieron stopwords y una longitud mínima de coincidencia parcial. Las consultas de una letra o conectores como “a” y “vs” ya no devuelven toda la agenda; las consultas cortas (“5”, “tv”, “f1”) sólo coinciden por palabra completa. Canales y plataformas usan coincidencia de palabra completa, evitando que “5” encuentre “Canal 50” o que “canal 5” mezcle “Canal 50”. La expansión por alias queda acotada para no dispararse con fragmentos genéricos.
- **Casos preservados:** siguen funcionando Apple TV, TV abierta, América frente a “American”, Chivas por alias, Liga MX, canales ESPN/Fox/TUDN y las consultas por equipo, competición, deporte y canal existentes. Se añadieron tres pruebas unitarias para consultas cortas, conectores y canales por palabra completa.
- **Criterio activo y limpieza:** la búsqueda aparece como chip “Búsqueda: …” junto a los filtros activos, con eliminación en un paso y 44 px; el botón de limpiar del campo también mide 44 px. Los estados vacíos siguen distinguiendo búsqueda, En Vivo, Hoy, filtros y agenda vacía.
- **Teclado y foco:** el panel de filtros cierra con Escape y devuelve el foco al botón “Filtrar”. Las fechas y competiciones del panel usan áreas de 44 px. El campo declara `aria-controls` hacia los resultados y `enterKeyHint="search"`.
- **Archivos modificados:** `agenda-web/src/lib/eventSearch.ts`, `agenda-web/src/lib/eventSearch.test.ts`, `agenda-web/src/components/agenda/AgendaSearch.tsx`, `agenda-web/src/components/agenda/AgendaFilters.tsx` y `agenda-web/src/components/HomeClient.tsx` (chip de búsqueda). `AgendaResults.tsx` fue revisado; no requirió cambios en M3.
- **Validación renderizada:** 320, 375, 768, 1024 y 1280 px con búsqueda “liga”, búsqueda sin coincidencias y panel de filtros abierto: overflow horizontal 0, chips y controles de 44 px, 53 resultados para “liga”, estado “Sin coincidencias” con “Limpiar búsqueda” y sin errores de consola. Consultas “a” y “vs” devuelven vacío; “5” y “canal 5” sólo devuelven el canal correcto. Capturas en `/private/tmp/guiasports-m3/`.
- **Validaciones:** `npm run test` (5 archivos, 44 pruebas), `npx tsc --noEmit`, `npm run lint`, `npm run build` (173/173 rutas) y `git diff --check` correctos. Puerto 3000 libre al iniciar y detener la revisión; sin borrar `.next`, locks ni archivos fuente.
- **Fuera de alcance confirmado:** no se modificaron datos, IDs, URLs, canonical, schemas, contenido fuente, `.env.local`, Supabase, RLS, scripts de sincronización ni dependencias. Sin push ni deploy.
- **Estado de fase:** implementación local aprobada por el usuario el 2026-10-27. El siguiente bloque es Fase M4 — Contrato único de evento y En Vivo.

#### Fase M4 — Contrato único de evento y En Vivo

Estado: **aprobada por el usuario el 2026-10-27**.

Archivos guía: `SportEventCard.tsx`, `EventListWithModal.tsx`, `SportEventModal.tsx`, `envivo/page.tsx`, `evento/[slug]/page.tsx` y hubs de fútbol, NBA, MLB y F1.

Acciones:

- Alinear estado, hora, evento, canal, contexto y acción primaria.
- Hacer que En Vivo ofrezca detalle y canal sin ser una pantalla aislada.
- Priorizar en vivo y próximos en hubs; diferenciar finalizados.
- Reducir acciones inline y conservar las secundarias donde correspondan.
- Mantener modal, Escape, foco y retorno al disparador.

Salida: tarjeta, En Vivo, hub y detalle responden la misma pregunta en el mismo orden; los estados se distinguen por texto, estructura y color.

##### Reporte de implementación M4 — aprobada

- **Contrato de tarjeta:** `SportEventCard` quedó en el orden estado → hora/fecha → evento → canal → contexto → acción. La competición salió del encabezado y ahora aparece como contexto después del canal, junto al deporte. Se retiró el icono de enlace externo duplicado; quedan la acción primaria “Ver detalle” y compartir como secundaria.
- **Hubs orientados a actualidad:** `EventListWithModal` separa eventos activos y finalizados. Los activos se ordenan primero por en vivo y luego por fecha/hora; los finalizados del día quedan en un bloque colapsable de 44 px. Así NBA, MLB, F1, fútbol y competiciones dejan de abrir con un evento finalizado.
- **En Vivo integrado:** la página abandonó sus tarjetas propias y ahora usa `EventListWithModal`, por lo que cada evento en vivo ofrece canal visible, detalle en modal y página canónica sin ser una pantalla aislada. Se conservaron su encabezado, conteo, estado vacío y enlaces de regreso.
- **Detalle y modal alineados:** el detalle muestra estado, fecha y hora antes del título; después el canal y luego la competición con el deporte. El modal replica ese orden en su encabezado y cuerpo. Se conservaron Escape, foco atrapado, retorno al disparador, agendar, página del evento y compartir.
- **Tiempo de referencia determinista:** se añadió `src/lib/serverNow.ts` para entregar un instante de referencia del servidor a las tarjetas y evitar que el estado cambie entre el HTML estático y la hidratación. Esto corrige el aviso de hidratación detectado en `/mlb` durante M1. No se añadieron dependencias.
- **Archivos modificados:** `SportEventCard.tsx`, `EventListWithModal.tsx`, `SportEventModal.tsx`, `envivo/page.tsx`, `evento/[slug]/page.tsx`, los hubs `nba`, `mlb`, `f1`, `futbol` y `futbol/[competicion]`, además de `HomeClient.tsx`, `agenda/AgendaResults.tsx`, `agenda/EventCard.tsx`, `app/page.tsx` y `src/lib/serverNow.ts` para propagar el instante de referencia.
- **Validación renderizada:** siete rutas (NBA, MLB, F1, fútbol, Liga MX, En Vivo y detalle) en 320, 375, 768, 1024 y 1280 px: overflow horizontal 0, primera tarjeta siempre En vivo o Próximo, finalizados colapsados, dos acciones por tarjeta y contexto visible; sin errores de consola. En 375 y 1280 px se verificó que canal aparece antes de competición en modal y detalle, que el modal abre con foco dentro, se cierra con Escape y devuelve el foco al disparador. `/mlb` se cargó dos veces sin el aviso de hidratación anterior. Capturas en `/private/tmp/guiasports-m4/`.
- **Validaciones:** `npm run test` (5 archivos, 44 pruebas), `npx tsc --noEmit`, `npm run lint`, `npm run build` (173/173 rutas) y `git diff --check` correctos. Puerto 3000 libre al iniciar y detener la revisión; sin borrar `.next`, locks ni archivos fuente.
- **Fuera de alcance confirmado:** no se modificaron datos, IDs, URLs, canonical, schemas, contenido fuente, `.env.local`, Supabase, RLS, scripts de sincronización ni dependencias. Sin push ni deploy.
- **Estado de fase:** implementación local aprobada por el usuario el 2026-10-27. El siguiente bloque es Fase M5 — Noticias, hubs y superficies de apoyo.

#### Fase M5 — Noticias, hubs y superficies de apoyo

Estado: **aprobada por el usuario el 2026-10-27**.

Archivos guía: `noticias/`, `plataformas/`, `futbol/`, `nba/`, `mlb/`, `f1/` y `mundial-2026/`.

Acciones:

- Compartir shell, encabezado, breadcrumbs y jerarquía.
- Separar contenido editorial, agenda y promociones.
- Conservar la personalidad del Mundial sin desconectarlo del producto.
- Revisar densidad, mayúsculas, itálicas, glow y bloques promocionales.
- Conservar URLs, contenido fuente e imágenes existentes.

Salida: el usuario distingue si está leyendo, explorando un deporte o consultando transmisiones; los hubs no empiezan por eventos finalizados cuando buscan actualidad.

##### Reporte de implementación M5 — aprobada

- **Jerarquía compartida:** los títulos de hubs y noticias dejaron mayúsculas e itálicas sostenidas y ahora usan caja normal con peso alto; los subtítulos de hub pasaron a texto legible sin tracking amplio. Las migas de pan también usan caja normal, son más legibles y permiten partir títulos largos sin overflow.
- **Noticias:** el índice conserva hero editorial, navegación temática y cuadrícula, ahora con títulos de hero y tarjeta en caja normal. El detalle normalizó el titular, los encabezados del contenido, FAQ, noticias relacionadas y llamado de compartir; las etiquetas cortas y metadatos conservan mayúsculas.
- **Plataformas (índice):** el encabezado adopta `gs-hub-header` con breadcrumbs y título compartido; las tarjetas usan `gs-card`, se retiraron el glow de fondo, los radios de 32–40 px y las sombras fuertes. Nombres de plataforma en caja normal, precios y contenido con menor tracking, y aviso legal legible sin mayúsculas sostenidas.
- **Plataformas (detalle):** hero simplificado sin blur, rotación ni sombras pesadas; breadcrumbs visibles; títulos de sección y CTA en caja normal. La tarjeta promocional blanca se reemplazó por un panel nocturno con borde azul, manteniendo el enlace oficial, el contenido y la URL. Se redujeron radios y sombras.
- **Hubs y Mundial:** los hubs heredan la nueva jerarquía y conservan el comportamiento de activos/finalizados de M4. Mundial 2026 conserva deliberadamente su piel de archivo (amarillo, mayúsculas e itálicas de campaña) para no romper calendario, llaves, sedes ni favoritos; se verificó su shell, breadcrumbs, overflow y consola.
- **Separación editorial/promoción:** los anuncios siguen etiquetados como “Publicidad”; la promoción de plataformas quedó claramente en la columna lateral, separada del resumen y los derechos deportivos.
- **Archivos modificados:** `agenda-web/src/app/globals.css`, `agenda-web/src/app/noticias/[slug]/page.tsx`, `agenda-web/src/app/plataformas/page.tsx` y `agenda-web/src/app/plataformas/[slug]/page.tsx`. Los hubs y Mundial se revisaron; heredan el cambio tipográfico sin cambios estructurales.
- **Validación renderizada:** noticias, detalle de noticia, plataformas, detalle de plataforma, NBA, fútbol, F1 y Mundial en 320, 375, 768, 1024 y 1280 px: `Header` único, overflow horizontal 0 y sin errores de consola. Se repitieron seis rutas a 320/375/1280 tras normalizar breadcrumbs sin overflow. Capturas en `/private/tmp/guiasports-m5/`.
- **Validaciones:** `npm run test` (5 archivos, 44 pruebas), `npx tsc --noEmit`, `npm run lint`, `npm run build` (173/173 rutas) y `git diff --check` correctos. Puerto 3000 libre al iniciar y detener la revisión; sin borrar `.next`, locks ni archivos fuente.
- **Fuera de alcance confirmado:** no se modificaron datos, IDs, URLs, canonical, schemas, contenido fuente, imágenes, `.env.local`, Supabase, RLS, scripts de sincronización ni dependencias. Sin push ni deploy.
- **Estado de fase:** implementación local aprobada por el usuario el 2026-10-27. El siguiente bloque es Fase M6 — QA de tareas y cierre.

#### Fase M6 — QA de tareas y cierre

Estado: **M6 aprobada, cerrada y publicada en producción el 2026-10-27; ajuste visual de ficha confirmado por el usuario; deploy verificado**.

Recorridos mínimos:

1. Entrar y encontrar qué está en vivo.
2. Buscar un equipo/competición representativo y comprobar pertinencia.
3. Consultar hoy y distinguir próximos de finalizados.
4. Abrir un evento, identificar canal y regresar conservando contexto.
5. Entrar directamente a un hub y encontrar el siguiente evento relevante.
6. Navegar en móvil entre Agenda, En Vivo, Noticias y detalle.
7. Repetir con teclado y movimiento reducido cuando aplique.

Viewports: 320×812, 375×812, 768×900, 1024×900 y 1280×900.

Salida: cada recorrido tiene una acción primaria evidente, sin bloqueo de navegación, pérdida de contexto u overflow crítico; los estados, horas y canales son legibles sin depender sólo del color.

##### Reporte de QA M6 — aprobada con ajustes

- **Método:** QA por CDP sobre Chrome headless contra `next start` local y datos reales, sin dependencias nuevas. Se combinaron recorridos funcionales, teclado, movimiento reducido, medición de overflow y contraste AA por DOM.
- **Recorridos verificados:** portada → En Vivo (sólo eventos en vivo) → Hoy (eventos de hoy y distinción de finalizados); búsqueda de Chivas con un resultado pertinente; modal de evento con canal, foco atrapado, Escape y retorno al disparador; detalle con canal visible; hub NBA con activos primero y finalizados colapsados; móvil entre Agenda, En Vivo, Noticias, detalle y regreso; búsqueda móvil con foco directo en el campo.
- **Continuidad corregida:** al abrir un evento, ir a su página y volver, la búsqueda y filtros de la portada se conservaban en el modal pero se perdían al regresar del detalle. Se añadió persistencia de criterios en `sessionStorage` por pestaña, sin cambiar URLs ni datos. Verificado: “Chivas” sigue activo y muestra el mismo resultado al volver; una URL con `?envivo=1` tiene prioridad sobre el estado guardado.
- **Teclado y movimiento reducido:** el panel de filtros cierra con Escape y devuelve el foco a “Filtrar”; el modal mantiene el foco dentro, cierra con Escape y vuelve al disparador; el menú móvil conserva su trampa de foco. Con `prefers-reduced-motion: reduce`, `--gs-motion-fast` vale 1 ms y el modal abre/cierra sin bloqueo.
- **Accesibilidad:** se corrigieron etiquetas y metadatos con `slate-500/600` que quedaban por debajo de AA en tarjetas, contexto, modal, detalle, plataformas y biografía de autor; el pie del menú móvil subió a `text-subtle`. Auditoría final: **0 textos por debajo de AA** en diez rutas de escritorio y diez rutas móviles, incluido el menú abierto.
- **Overflow y consola:** diez rutas × cinco viewports (320, 375, 768, 1024 y 1280 px): `Header` único, overflow horizontal 0 y sin errores de consola. Los estados, horas y canales se leen por texto además del color.
- **Archivos modificados en M6:** `HomeClient.tsx` (persistencia de contexto), `NavMobile.tsx` (foco de búsqueda), `SportEventCard.tsx`, `SportEventModal.tsx`, `evento/[slug]/page.tsx`, `noticias/[slug]/page.tsx`, `plataformas/[slug]/page.tsx`, `AuthorBio.tsx` y `globals.css` (ajustes de contraste del pie del menú). No se tocaron datos, IDs, URLs, contenido fuente, imágenes, Supabase, RLS, `.env.local`, scripts ni dependencias.
- **Validaciones:** `npm run test` (5 archivos, 44 pruebas), `npx tsc --noEmit`, `npm run lint`, `npm run build` (173/173 rutas) y `git diff --check` correctos. Puerto 3000 libre al iniciar y detener la revisión; sin borrar `.next`, locks ni archivos fuente.
- **Estado:** QA completada, sin bloqueos funcionales ni regresiones conocidas dentro del alcance. El usuario aprobó M6 con un ajuste visual solicitado. El paquete queda listo para decisión de cierre/publicación, que requiere autorización explícita. Sin push ni deploy.

##### Ajuste visual posterior a M6 — ficha de evento

Estado: **confirmado por el usuario el 2026-10-27; implementado en local**.

- **Cambio:** se retiró la fila superior de `SportEventCard` que contenía la pastilla de estado. En escritorio la pastilla aparece a la derecha del icono del deporte; en móvil queda al extremo derecho de la fila icono/hora/fecha. Se eliminó el padding superior que separaba el encabezado del cuerpo. La tarjeta conserva estado, hora, fecha, evento, canal, contexto y acciones, pero ocupa menos altura vertical.
- **Resultado:** en escritorio la tarjeta activa mide 150 px de alto y en móvil 280 px; la pastilla “Finalizado” mide 75×28 px y no se parte. Se mantiene el foco, el modal, la acción primaria y compartir.
- **Validación:** 320, 375, 768, 1024 y 1280 px sin overflow; estado visible, icono/pastilla alineados y sin errores de consola. `npm run test` (44 pruebas), `npx tsc --noEmit`, `npm run lint`, `npm run build` (173/173 rutas) y `git diff --check` correctos. Capturas en `/private/tmp/guiasports-card3/`.
- **Fuera de alcance:** no se modificaron datos, IDs, URLs, contenido fuente, Supabase, RLS, `.env.local`, scripts ni dependencias. Sin push ni deploy.

##### Publicación — 2026-10-27

Estado: **publicado en producción; deploy verificado**.

- **Commit del paquete:** `11bf3a8` (`feat(ux): simplificar navegación, búsqueda y fichas de eventos`).
- **Ramas:** `release/ux-simplificacion` y `main` publicadas en `origin`; `main` avanzó por fast-forward `55e66ad..11bf3a8`.
- **Verificación en producción:** HTTP 200 en `/`, `/envivo`, `/noticias`, `/nba`, `/plataformas`, `/plataformas/vix` y `/mundial-2026`. `/nba` contiene la nueva ficha (`md:min-w-[150px]`); `/plataformas` contiene `gs-hub-title-blue`; `/plataformas/vix` ya no contiene la tarjeta blanca (`bg-white` = 0).
- **Validaciones previas:** `npm run test` (44 pruebas), `npx tsc --noEmit`, `npm run lint`, `npm run build` (173/173 rutas) y `git diff --check` correctos.
- **Rollback:** revertir `11bf3a8` o redesplegar `55e66ad`; no hay migraciones de datos ni cambios en Supabase/RLS.
- **Documentación:** este registro se publica después en `main` y `release/ux-simplificacion`; no cambia el código de aplicación.

### Regla de tamaño de sesión

Cada sesión de implementación debe tener:

- Un objetivo principal.
- Un conjunto pequeño de archivos.
- Una revisión visual concreta.
- Validaciones técnicas proporcionales.
- Un reporte y un handoff.

Si aparece trabajo de otra fase, se registra como hallazgo y no se implementa en la sesión actual. Si el contexto llega aproximadamente al 70–75 %, se cierra con handoff.

### Handoff de esta etapa

Estado: **Bloque A y M1–M6 aprobados y publicados en producción el 2026-10-27; deploy verificado**.

No se modificaron datos, contenido fuente, IDs, URLs, `.env.local`, Supabase, RLS ni scripts de sincronización. El contrato está en “Bloque A — Contrato de experiencia y alcance”; los resultados aprobados en los reportes M1–M5; la QA final en “Reporte de QA M6”; el ajuste de ficha en su sección posterior; y la publicación en “Publicación — 2026-10-27”. No hay trabajo pendiente dentro de esta etapa. Cualquier cambio nuevo requiere alcance y autorización explícita.

Siguiente sesión recomendada: iniciar sólo un alcance nuevo autorizado. La publicación ya fue ejecutada y verificada.

## Prompt de continuidad para la siguiente sesión

```text
Continuamos GuíaSports en la implementación visual y UX.

Lee primero:
- PLAN-DISENO-UX-VISUAL-GUIASPORTS.md
- agenda-web/AGENTS.md
- agenda-web/CLAUDE.md

Las Fases 0 a 8 están aprobadas por el usuario: Fase 0 el 2026-09-01, Fases 1–3 el 2026-09-04, Fases 4 y 5 el 2026-09-06, Fase 6 el 2026-09-07, Fase 7 el 2026-09-08 y Fase 8 el 2026-09-09. El paquete visual fue **publicado en producción** el 2026-09-09: `release/visual-v1` y `main` (`5149559`) están en `origin` y el deploy de Vercel está verificado. La incidencia recurrente del build local quedó documentada: usar un solo `next dev`, detenerlo antes de que el agente ejecute `npm run build`, confirmar que no haya otro proceso de Next y no borrar `.next`, locks ni archivos fuente para resolver una espera. En Next.js 16.2.1 `next dev` usa `.next/dev` por defecto, por lo que un build detenido no debe atribuirse automáticamente a una colisión con dev. El plan técnico de remediación está cerrado. A8 está cerrado. Producción está operativa.

Objetivo de esta sesión:
La etapa de auditoría y simplificación UX (Bloque A y M1–M6) está cerrada y publicada. No hay trabajo pendiente dentro de ella; cualquier sesión nueva debe partir de un alcance autorizado explícitamente y no reabrir Fases 0–8.

Secuencia recomendada de esta nueva etapa:
- Bloque A — Contrato de experiencia y alcance: aprobado el 2026-10-27.
- Fase M1 — Shell y navegación coherentes: aprobada el 2026-10-27.
- Fase M2 — Portada y agenda orientadas a la tarea: aprobada el 2026-10-27.
- Fase M3 — Búsqueda y filtros confiables: aprobada el 2026-10-27.
- Fase M4 — Contrato único de evento y En Vivo: aprobada el 2026-10-27.
- Fase M5 — Noticias, hubs y superficies de apoyo: aprobada el 2026-10-27.
- Fase M6 — QA de tareas y cierre: aprobada, cerrada y publicada; ajuste visual de ficha confirmado.
- Publicación del paquete: ejecutada y verificada el 2026-10-27 (`11bf3a8`).

Restricciones:
- Trabajar sólo en local y dentro del alcance de los ajustes solicitados.
- No reabrir Fases 0–8 salvo una regresión directamente causada por el trabajo actual.
- No modificar `.env.local`, Supabase, RLS, credenciales de producción, datos ni scripts de sincronización. La configuración local ya fue corregida por el usuario y debe permanecer fuera del diff.
- No modificar datos, IDs, URLs ni contenido fuente.
- No exponer secretos ni reabrir A8 o la investigación histórica.
- No ejecutar agentes en paralelo sobre la misma rama.
- No introducir dependencias nuevas.
- No hacer push ni deploy sin autorización explícita (cualquier cambio nuevo vuelve a requerir autorización).

Alcance:
- Mantenimiento o ajustes acotados sobre el paquete visual ya publicado.
- Simplificación progresiva de navegación, portada, búsqueda, filtros, tarjetas, En Vivo y hubs según las Fases M1–M6 de este plan.
- Confirmar que no hay cambios fuera de alcance.
- Solicitar autorización explícita antes de cualquier push o deploy nuevo.
- Si el usuario autoriza, publicar los ajustes mediante la rama de release y `main`, y documentar el resultado.

La dirección aprobada es “guía de transmisión nocturna”:
- Azul noche como base y superficies slate para separar niveles.
- Lima para acción/selección, rojo sólo para En Vivo, azul para navegación/información y amarillo para destacados o Mundial.
- Menos ruido de blur, glow, gradientes, pulsos y mayúsculas; más jerarquía y legibilidad.
- Transiciones rápidas y contenidas (160ms a 220ms con curva estándar).
- La interfaz debe sentirse clara, nocturna, directa y mexicana.

Si vas a escribir código, consulta antes la guía Next.js relevante indicada por agenda-web/AGENTS.md.

Validaciones si se realizan ajustes:
- npm run test
- npx tsc --noEmit
- npm run lint
- npm run build
- git diff --check

Ejecuta las validaciones desde agenda-web, registra cualquier limitación de red o entorno y no resuelvas fallos borrando .next, locks o archivos fuente.

La incidencia de datos quedó resuelta localmente y no debe reabrirse como trabajo de Supabase. Antes de ejecutar `npm run build`, confirma que el puerto 3000 esté libre y que no exista otro `next dev`, `next start` o `next build`. Si persiste una espera en `compile`, documenta procesos, lock, diagnóstico, red y entorno sin borrar `.next`, locks ni archivos fuente.

Si el usuario solicita ajustes, mantente dentro del paquete publicado. Cualquier push o deploy nuevo requiere autorización explícita.
```
