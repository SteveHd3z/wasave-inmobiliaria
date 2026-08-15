-- ============================================================
-- POLITICAS RLS PARA STORAGE - BUCKET property-media
-- Ejecutar despues de crear el bucket manualmente en Supabase Dashboard > Storage
-- ============================================================

-- SELECT publico: cualquier persona puede ver/descargar archivos del bucket
CREATE POLICY "property_media_select_public" ON storage.objects
    FOR SELECT TO anon, authenticated
    USING (bucket_id = 'property-media');

-- INSERT solo para usuarios autenticados
CREATE POLICY "property_media_insert_auth" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'property-media');

-- UPDATE solo para usuarios autenticados
CREATE POLICY "property_media_update_auth" ON storage.objects
    FOR UPDATE TO authenticated
    USING (bucket_id = 'property-media')
    WITH CHECK (bucket_id = 'property-media');

-- DELETE solo para usuarios autenticados
CREATE POLICY "property_media_delete_auth" ON storage.objects
    FOR DELETE TO authenticated
    USING (bucket_id = 'property-media');
