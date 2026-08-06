## Resultado ejecutivo

La aplicación, Supabase y la fuente del scraper están operativos. No hice cambios en archivos ni datos; el servidor local ya fue cerrado.

Confirmé con datos reales:

- Supabase: 1,054 eventos y 66 noticias.
- Agenda vigente: 193 eventos desde el 4 de agosto; 74 eventos el día auditado.
- Scraper: la fuente respondió `200`, con 193 filas de programación y cuatro encabezados de fecha.
- Home, detalle de evento y `/envivo` cargan datos reales.
- El chequeo de calidad actual falla: `npm run lint` reporta **55 errores y 69 advertencias**.

La prioridad no debe ser un rediseño visual aislado. Primero hay que resolver los bloqueos funcionales de búsqueda, filtro, seguridad y rendimiento; después aplicar la nueva experiencia.

## Auditoría completa

### 1. La propuesta de valor funciona, pero la ruta para llegar a ella es pesada

La home muestra 193 eventos vigentes en un solo flujo muy largo. Durante la auditoría, el DOM de la agenda superó 28,000 px de alto y aproximadamente 748 KB de HTML interno. Para un usuario que sólo quiere saber dónde ver un partido, esto obliga a leer demasiado y filtrar manualmente.

Además, el orden inicial incluye programación internacional de baja relevancia local antes de eventos de mayor interés mexicano. La selección de destacados ayuda, pero no sustituye una búsqueda y una priorización claras.

Archivos principales:

- [Carga de agenda y Supabase](/Users/iturralde/pgweb/proyecto-agenda-final/agenda-web/src/app/page.tsx:36)
- [Lógica de búsqueda, filtros y renderizado](/Users/iturralde/pgweb/proyecto-agenda-final/agenda-web/src/components/HomeClient.tsx:51)
- [Tarjeta de evento](/Users/iturralde/pgweb/proyecto-agenda-final/agenda-web/src/components/SportEventCard.tsx:70)

### 2. Búsqueda: falla el caso de uso más importante

Probé búsquedas reales:

- “América” devolvió un único resultado: “América del Sud”, no un resultado prioritario de Club América.
- “Apple TV” devolvió “Sin resultados”, aunque Supabase tiene **23 eventos próximos** con Apple TV.
- La causa es que la búsqueda actual consulta sólo `evento` y `competicion`; no busca en `canales`, deporte ni plataforma.

Esto contradice directamente el propósito: “¿Dónde puedo ver mi partido?”.

### 4. Móvil: hay demasiadas capas de navegación

La experiencia móvil combina:

- Menú hamburguesa en el encabezado.
- Barra inferior fija.
- Menú desplegable de la barra inferior.
- Barra de filtros fija.
- Anuncio fijo.
- Consentimiento de cookies fijo.

El resultado probable es solapamiento y competencia por el espacio útil. Adicionalmente, muchos botones miden alrededor de 32–33 px de alto, por debajo de una experiencia táctil cómoda.

Hay que consolidar la navegación móvil en una sola estructura persistente y asegurar que publicidad/cookies no tapen acciones importantes. WCAG 2.2 recomienda objetivos táctiles suficientes, foco visible y no oculto. [W3C WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)

Archivos involucrados:

- [Menú superior](/Users/iturralde/pgweb/proyecto-agenda-final/agenda-web/src/components/Header.tsx:16)
- [Navegación inferior móvil](/Users/iturralde/pgweb/proyecto-agenda-final/agenda-web/src/components/NavMobile.tsx:9)
- [Anuncio fijo](/Users/iturralde/pgweb/proyecto-agenda-final/agenda-web/src/components/StickyAd.tsx:1)

### 5. Diseño visual: atractivo, pero con exceso de estímulo

La identidad deportiva oscura es buena. Lo que genera monotonía y dificultad es la repetición de:

- Mayúsculas extensas.
- Textos pequeños.
- Bordes, brillos y colores simultáneos.
- Animaciones permanentes.
- Carruseles horizontales.
- Publicidad intercalada cada ocho eventos.
- Tarjetas “imperdibles” con análisis genéricos que no corresponden necesariamente a cada encuentro.

Recomiendo conservar el tono visual, pero convertirlo en una interfaz editorial más clara: menos decoración, más jerarquía y una respuesta visible en menos de cinco segundos.

### 6. Integridad de datos: el mayor riesgo no está en el frontend

El scraping funciona y la salida actual coincide razonablemente con la agenda futura disponible. Sin embargo, el sincronizador hace lo siguiente:

1. Lee y trata de preservar configuraciones manuales.
2. Borra todos los eventos.
3. Vuelve a insertar los eventos.

Eso puede cambiar IDs, romper URLs de eventos compartidas/indexadas y crear una ventana momentánea sin agenda. Aunque el script intente preservar datos manuales, no preserva necesariamente la identidad de cada fila.

Archivo crítico:

- [Sincronización destructiva](/Users/iturralde/pgweb/proyecto-agenda-final/agenda-deportiva/subir_agenda.py:176)

No debe tocarse en el rediseño visual. Debe convertirse en un proyecto independiente, con staging, respaldos y reversión.

### 7. Seguridad: requiere una fase urgente separada

No probé credenciales ni realicé acciones de escritura. La revisión estática encontró riesgos importantes:

- `/admin` protege la interfaz con una contraseña fija comprobada en el navegador; no es un control de acceso robusto.
- El panel usa la clave anónima de Supabase para leer y modificar eventos.
- Las rutas de publicación/edición de noticias usan una clave de servicio y tienen una clave compartida de respaldo dentro del código.
- Existen archivos de prueba que contienen material sensible y llamadas de escritura.

Acciones necesarias:

- Rotar credenciales expuestas.
- Eliminar claves y contraseñas del repositorio y su historial, si aplica.
- Quitar valores de respaldo para secretos.
- Mover autenticación administrativa a Supabase Auth o a autenticación de servidor.
- Verificar RLS con políticas explícitas: lectura pública sólo donde corresponda; escritura únicamente desde servidor autenticado.

Archivos prioritarios:

- [Panel administrativo](/Users/iturralde/pgweb/proyecto-agenda-final/agenda-web/src/app/admin/page.tsx:9)
- [Autenticación actual del panel](/Users/iturralde/pgweb/proyecto-agenda-final/agenda-web/src/app/admin/page.tsx:81)
- [Generación de noticias](/Users/iturralde/pgweb/proyecto-agenda-final/agenda-web/src/app/api/noticias/generar/route.ts:5)
- [Publicación de noticias](/Users/iturralde/pgweb/proyecto-agenda-final/agenda-web/src/app/api/noticias/publicar/route.ts:4)

### 8. SEO: buena base, pero hay que evitar promesas de rich results

Fortalezas actuales:

- Metadata y canonical por página.
- Sitemap dinámico.
- Hubs por deporte/competición.
- Páginas individuales por evento.
- Datos estructurados.
- Breadcrumbs.
- News y autores ya integrados.

Riesgos:

- El H1 de home existe, pero está oculto visualmente; la promesa principal debe ser visible.
- Las páginas de evento dependen de IDs que pueden variar después de cada sincronización.
- El markup `SportsEvent` declara un evento virtual con oferta; Google aclara que la experiencia enriquecida de eventos requiere páginas individuales de eventos públicos y no admite experiencias solamente virtuales. No debe asumirse que estos resultados aparecerán. [Guía de Event de Google](https://developers.google.com/search/docs/appearance/structured-data/event)
- Los datos estructurados deben reflejar contenido visible y verificable; Google no garantiza rich results incluso con marcado válido. [Políticas de datos estructurados](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)

### 9. Calidad técnica

`npm run lint` falla con 55 errores. Los grupos principales son:

- Tipos `any` en páginas y panel administrativo.
- Componentes creados durante el render de Mundial.
- Estados cambiados dentro de efectos.
- Imports sin usar.
- Uso de `<img>` donde conviene `next/image`.
- Configuración CommonJS incompatible con las reglas actuales.
- Texto JSX sin escapar.

Antes de una evolución visual grande, hay que restablecer una base de calidad mínima para que CI pueda detectar regresiones.