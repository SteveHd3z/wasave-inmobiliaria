-- Garantiza una sola portada (cover_image = true) por propiedad.
-- Ejecutar en Supabase > SQL Editor.

-- 1. Normalizar datos existentes: si una propiedad tiene varias portadas,
--    se conserva la mas antigua y se desmarcan las demas.
UPDATE property_media pm
SET cover_image = FALSE
WHERE pm.cover_image = TRUE
  AND pm.media_id <> (
    SELECT m.media_id
    FROM property_media m
    WHERE m.property_id = pm.property_id AND m.cover_image = TRUE
    ORDER BY m.created_at ASC, m.media_id ASC
    LIMIT 1
  );

-- 2. Evitar que vuelva a ocurrir (indice unico parcial)
CREATE UNIQUE INDEX IF NOT EXISTS uq_property_media_one_cover
    ON property_media (property_id)
    WHERE cover_image = TRUE;
