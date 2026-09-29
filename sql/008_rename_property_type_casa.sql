-- Rename property type 'casa' to 'casa finca'
UPDATE properties SET type = 'casa finca' WHERE type IN ('casa', 'casa_finca');
