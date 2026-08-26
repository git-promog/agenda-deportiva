-- ============================================================
-- FASE 7 — Row Level Security (RLS) para GuíaSports
-- Ejecutado y verificado en Supabase el 25/08/2026
--
-- Modelo resultante:
--   • anon / authenticated  → SOLO lectura (SELECT) en eventos, noticias, status
--   • service_role          → acceso total (bypasa RLS por diseño)
--
-- Toda escritura pasa por las API Routes de Next.js que verifican
-- la cookie de sesión administrativa firmada (HMAC) y usan la
-- SUPABASE_SERVICE_ROLE_KEY, que nunca sale del servidor.
-- ============================================================


-- 1) Eliminar políticas heredadas en 'eventos'
DROP POLICY IF EXISTS "Permitir borrado en eventos" ON public.eventos;
DROP POLICY IF EXISTS "Permitir escritura en eventos" ON public.eventos;
DROP POLICY IF EXISTS "Permitir actualización en eventos" ON public.eventos;
DROP POLICY IF EXISTS "Permitir lectura pública en eventos" ON public.eventos;
DROP POLICY IF EXISTS "eventos_select_public" ON public.eventos;
DROP POLICY IF EXISTS "Enable all access" ON public.eventos;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.eventos;

-- 2) Eliminar políticas heredadas en 'noticias'
DROP POLICY IF EXISTS "Solo admin puede borrar noticias" ON public.noticias;
DROP POLICY IF EXISTS "Solo admin puede insertar noticias" ON public.noticias;
DROP POLICY IF EXISTS "Solo admin puede actualizar noticias" ON public.noticias;
DROP POLICY IF EXISTS "Permitir lectura pública en noticias" ON public.noticias;
DROP POLICY IF EXISTS "noticias_select_public" ON public.noticias;
DROP POLICY IF EXISTS "Enable all access" ON public.noticias;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.noticias;

-- 3) Eliminar políticas heredadas en 'status' y 'mkt_social_posts'
DROP POLICY IF EXISTS "Allow all on status" ON public.status;
DROP POLICY IF EXISTS "Solo admin puede actualizar status" ON public.status;
DROP POLICY IF EXISTS "Permitir lectura pública en status" ON public.status;
DROP POLICY IF EXISTS "status_select_public" ON public.status;
DROP POLICY IF EXISTS "Permitir todo a todos (solo para desarrollo)" ON public.mkt_social_posts;

-- 4) Activar RLS en todas las tablas
ALTER TABLE public.eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.noticias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mkt_social_posts ENABLE ROW LEVEL SECURITY;

-- 5) Crear ÚNICAMENTE políticas de lectura pública (SELECT)
CREATE POLICY "eventos_select_public"
  ON public.eventos
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "noticias_select_public"
  ON public.noticias
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "status_select_public"
  ON public.status
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- 6) Verificación rápida:
--    SELECT tablename, policyname, cmd, roles FROM pg_policies
--    WHERE schemaname = 'public' ORDER BY tablename;
