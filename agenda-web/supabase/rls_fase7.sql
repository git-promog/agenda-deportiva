-- ============================================================
-- FASE 7 — Row Level Security (RLS) para GuíaSports
-- Ejecutar en: Supabase Dashboard > SQL Editor
--
-- Modelo resultante:
--   • anon / authenticated  → SOLO lectura (SELECT)
--   • service_role          → acceso total (bypasa RLS por diseño)
--
-- Toda escritura pasa por las API Routes de Next.js que verifican
-- la cookie de sesión administrativa firmada (HMAC) y usan la
-- SUPABASE_SERVICE_ROLE_KEY, que nunca sale del servidor.
-- ============================================================

-- 1) Eliminar políticas permisivas heredadas (ajusta los nombres si difieren;
--    puedes listar las existentes con:
--    SELECT schemaname, tablename, policyname FROM pg_policies;)
DROP POLICY IF EXISTS "Enable all access" ON public.eventos;
DROP POLICY IF EXISTS "Enable all access" ON public.noticias;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.eventos;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.noticias;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.eventos;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.noticias;
DROP POLICY IF EXISTS "Enable update for all users" ON public.eventos;
DROP POLICY IF EXISTS "Enable update for all users" ON public.noticias;
DROP POLICY IF EXISTS "Enable delete for all users" ON public.eventos;
DROP POLICY IF EXISTS "Enable delete for all users" ON public.noticias;
DROP POLICY IF EXISTS "eventos_select_public" ON public.eventos;
DROP POLICY IF EXISTS "noticias_select_public" ON public.noticias;

-- 2) Activar RLS (obligatorio; sin esto las políticas no aplican)
ALTER TABLE public.eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.noticias ENABLE ROW LEVEL SECURITY;

-- 3) Lectura pública general (la web pública y el panel leen con la anon key)
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

-- 4) Escrituras: NO se crea ninguna política de INSERT/UPDATE/DELETE para
--    anon ni authenticated → RLS las deniega por defecto (default deny).
--    Las API Routes del servidor usan SERVICE_ROLE_KEY, que bypassa RLS,
--    por lo que el panel administrativo sigue funcionando con sesión válida.
--
--    ⚠️ IMPORTANTE: cualquier automatización externa (n8n, scripts, cron)
--    que escriba en estas tablas DEBE usar la SERVICE_ROLE_KEY o llamar a
--    las API Routes con "Authorization: Bearer $ADMIN_API_SECRET".
--    Si usaban la anon key para escribir, dejarán de funcionar (es el objetivo).

-- 5) Verificación rápida (opcional):
--    SELECT tablename, policyname, cmd, roles FROM pg_policies
--    WHERE schemaname = 'public' ORDER BY tablename;
