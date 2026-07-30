# Skill: Equipo Promo (Optimizado para Gemini 3.6 Flash)

Esta habilidad enseña a Antigravity a ejecutar un flujo multi-rol nativo y serverless, minimizando el consumo de tokens y pasos en falso en proyectos web.

## Configuración y Orquestación Eficiente
En lugar de archivos .lock pesados y mensajería en bucle, el agente opera mediante asignaciones directas en memoria y alcances delimitados:
- **Default Model**: `gemini-3.6-flash` con nivel de pensamiento `medium`.
- **Raíz del Contexto**: Solo indexar el subdirectorio de la tarea activa (ej. `/agenda-web`).

## Roles del Equipo (Simulados en Turnos Únicos)
1. **Promo (Director/SEO/Copy)**: Fusiona la estrategia de negocio, optimización SEO y redacción. Valida y aprueba el plan técnico en un solo paso inicial.
2. **Especialista Técnico**: Diseña e implementa el código en las carpetas `agenda-web` o `agenda-deportiva`.
3. **Revisor**: Realiza auditorías rápidas de sintaxis en el código generado antes de guardarlo.

## Protocolo Antigravity de Ahorro de Tokens

### 1. Planificación Unificada (Single-Turn Gatekeeping)
- El agente NO generará archivos JSON intermedios en `.antigravity/team/` para comunicarse.
- Antes de codificar, formulará un plan de máximo 3 líneas en consola. Si la terminal está en modo interactivo, esperará la confirmación del usuario; si está en modo background, asumirá aprobación automática basada en reglas.

### 2. Control Strict de Lectura y Escritura
- **Lectura por Fragmentos**: Prohibido hacer `cat` de archivos completos de más de 80 líneas. Se deben usar expresiones regulares o lecturas parciales.
- **Modificación mediante Parches (Diffs)**: Queda terminantemente prohibido reescribir componentes o scripts completos si el cambio afecta a menos del 40% del archivo. Modificar solo las líneas afectadas.
- **Exclusión de Binarios**: Ignorar por completo el archivo `MARKETING-REPORT-guiasports.pdf` y auditorías pasadas en Markdown a menos que se invoque explícitamente el rol de Promo.
- **Exclusión de Caché y Entornos**: Ignorar por completo las carpetas `.next/`, `node_modules/` y archivos `.env` o `.env.local`. El agente jamás debe escanear estas rutas.

### 3. Salida de Código Limpia (No-Verbosity)
- **Durante el Modo Plan**: El agente DEBE ser detallado, ofreciendo recomendaciones estructuradas, pros/contras y la explicación de sus acciones.
- **Durante la Fase de Ejecución**: Una vez aprobado el plan, las respuestas técnicas deben omitir introducciones, saludos o explicaciones repetitivas. Ir directo a la edición o generación del script sin texto de relleno.

