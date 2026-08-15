-- ============================================================
-- MIGRACION: Agregar columna created_at a la tabla property
-- Ejecutar en Supabase > SQL Editor
-- ============================================================
--
-- Motivo: la pagina publica /propiedades ordena las propiedades
-- por created_at desc, pero la tabla property no tenia esa
-- columna, lo que provocaba que la consulta fallara con
-- "column property.created_at does not exist" y la lista
-- apareciera vacia.

ALTER TABLE property
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT now();

-- Si en algun momento agregas la columna sin DEFAULT, asegurate
-- de poblar primero los registros existentes antes de marcar NOT NULL:
--   UPDATE property SET created_at = now() WHERE created_at IS NULL;
