# Fase 0: Congelamiento de zonas sensibles

** Estado: COMPLETADA **

## Objetivo
Proteger el sistema actual de scraping y transmisiones de canales.

## Acciones realizadas

### 1. Rama creada
```bash
git checkout -b codex/liga-mx-official-stats
```

### 2. Archivos sensibles verificados (NINGÚN CAMBIO)
- `agenda-deportiva/scraper.py` - SIN CAMBIOS
- `agenda-deportiva/subir_agenda.py` - SIN CAMBIOS
- `.github/workflows/scraper_auto.yml` - SIN CAMBIOS

### 3. Verificación con git diff
```
git diff -- agenda-deportiva/scraper.py agenda-deportiva/subir_agenda.py .github/workflows/scraper_auto.yml
```
Salida: `(no output)` - Confirmado 0 cambios

## Principio fundamental
**Liga MX oficial no escribe en `eventos`**

Todos los datos oficiales deben ir a tablas nuevas con prefijo `ligamx_*`.

---

# Fase 1: Base de datos nueva

** Estado: COMPLETADA **

## Objetivo
Crear almacenamiento aislado para datos oficiales de Liga MX.

## Archivos creados

### 1. Script principal
- `agenda-web/scripts/sync-ligamx.mjs` - Script de sincronización con soporte `--dry-run`

### 2. Módulo de normalización
- `agenda-web/scripts/lib/ligamx-normalize.mjs` - Funciones de slugify, alias de equipos, validación

### 3. Cliente Supabase servidor
- `agenda-web/src/lib/supabaseServer.ts` - Wrapper para crear cliente Supabase

### 4. Workflow GitHub Actions
- `.github/workflows/sync_ligamx.yml` - Ejecución cada 2 horas

### 5. Script package.json
- Agregado: `"sync-ligamx": "node scripts/sync-ligamx.mjs"`

## Tablas SQL a crear en Supabase
Ver documentación en `AUDITORIA-CONFIRMADA-LIGA-MX.md` sección 6.

## Verificaciones realizadas
- ✅ `npm run lint` - Sin errores nuevos
- ✅ `npm run build` - Build exitoso
- ✅ `git diff` - 0 cambios en archivos sensibles

## Próxima fase
Fase 2: Parser y bot Liga MX - Implementar parser completo y probar con datos reales.