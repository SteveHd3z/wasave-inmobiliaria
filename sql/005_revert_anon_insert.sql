-- ============================================================
-- REVERTIR insercion anonima (ya no necesaria con Server Actions)
-- Ejecutar SOLO si previamente se ejecuto 005_client_anon_insert.sql
-- ============================================================

-- Eliminar politicas anonimas
DROP POLICY IF EXISTS "client_insert_anon" ON client;
DROP POLICY IF EXISTS "property_client_insert_anon" ON property_client;

-- Revocar permisos anonimos de insercion
REVOKE INSERT ON client FROM anon;
REVOKE INSERT ON property_client FROM anon;
