-- Migrar las columnas de timestamp de la tabla appointment a TIMESTAMPTZ
-- para preservar la zona horaria y evitar desfases al guardar/mostrar citas.
--
-- Justificación: la columna era TIMESTAMP (sin zona horaria), por lo que
-- Postgres almacenaba el valor sin información de zona. Supabase devolvía la
-- cadena sin el sufijo "Z" y JavaScript la interpretaba como hora local,
-- causando un desfase de 5 horas con Colombia (UTC-5).
--
-- Esta migración es segura: convierte los valores existentes asumiendo que
-- ya están en hora Colombia (UTC-5), que es como se venían almacenando.

ALTER TABLE appointment
    ALTER COLUMN visit_date TYPE TIMESTAMPTZ USING visit_date AT TIME ZONE 'America/Bogota',
    ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'America/Bogota',
    ALTER COLUMN updated_at TYPE TIMESTAMPTZ USING updated_at AT TIME ZONE 'America/Bogota';
