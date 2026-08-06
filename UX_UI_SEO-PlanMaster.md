
# Plan de Acción MASTER

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
- `agenda-web/src/lib/mexicoTime.ts`

Definir formalmente el contrato:

```ts
type Evento = {
  id: string;
  fecha: string;
  hora: string;
  evento: string;
  competicion: string;
  deporte: string;
  canales: string;
  destacado?: boolean | null;
};
```

Criterio de salida: ningún componente visual debe redefinir este tipo con `any`.

### 0.3 Línea base y comandos

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

Esta fase debe correr en paralelo al diseño, pero en una rama y responsable separados.

### 1.1 Eliminar secretos del código

Archivos a revisar:

- `agenda-web/test_supabase.py`
- `agenda-web/test_gemini.py`
- `agenda-web/src/app/admin/page.tsx`
- `agenda-web/src/app/api/noticias/*`

Pasos:

1. Revocar/rotar las credenciales actualmente expuestas.
2. Eliminar valores de respaldo de secretos.
3. Dejar sólo variables de entorno obligatorias.
4. Añadir `.env.example` sin valores reales.
5. Revisar historial Git antes de considerar el incidente cerrado.

### 1.2 Reemplazar autenticación de admin

- Implementar Supabase Auth o sesión de servidor.
- Proteger `/admin` en servidor, no sólo mediante estado de React.
- Eliminar contraseña fija del bundle del navegador.
- Restringir escrituras de `eventos` y `noticias` por RLS.

Criterio de salida: un visitante no autenticado no puede leer datos administrativos ni ejecutar escrituras, incluso llamando directamente a Supabase o APIs.

---

## Fase 2 — Fundamentos de UX y datos de presentación

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
5. Botón único “Filtrar”.
6. Resultados.
7. Imperdibles.
8. Noticias y hubs.

No mostrar noticias antes de que el usuario pueda resolver su búsqueda.

### 3.2 Reducir los datos enviados al navegador

La home no necesita enviar los 1,054 eventos históricos.

Modificar la consulta de [page.tsx](/Users/iturralde/pgweb/proyecto-agenda-final/agenda-web/src/app/page.tsx:48) para cargar únicamente:

- Hoy.
- Próximos 2–4 días.
- Los eventos destacados necesarios.

Conservar páginas individuales, sitemap y archivo histórico como responsabilidades separadas.

Criterio de salida: menor DOM, mejor respuesta de filtros y menor carga móvil.

### 3.3 Componentizar la interfaz

Crear:

- `src/components/agenda/AgendaSearch.tsx`
- `src/components/agenda/AgendaQuickActions.tsx`
- `src/components/agenda/AgendaFilters.tsx`
- `src/components/agenda/AgendaResults.tsx`
- `src/components/agenda/EventCard.tsx`
- `src/components/agenda/EmptyState.tsx`

No reescribir todo de una vez. Migrar cada bloque de la home manteniendo el contrato de `Evento`.

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