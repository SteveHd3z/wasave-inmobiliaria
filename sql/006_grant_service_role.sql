-- ============================================================
-- Permisos explícitos para service_role
-- Ejecutar en Supabase > SQL Editor
-- ============================================================

GRANT ALL ON client TO service_role;
GRANT ALL ON appointment TO service_role;
GRANT ALL ON property_client TO service_role;
GRANT ALL ON property TO service_role;
GRANT ALL ON property_media TO service_role;
GRANT ALL ON owner TO service_role;
