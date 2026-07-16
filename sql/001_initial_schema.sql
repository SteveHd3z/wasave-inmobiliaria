-- ============================================================
-- ESQUEMA INICIAL PARA WASAVE INMOBILIA
-- Ejecutar en Supabase > SQL Editor
-- ============================================================

-- 0. Habilitar extension para UUIDs
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Tabla owner
CREATE TABLE owner (
    owner_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id VARCHAR(50),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50)
);

-- 2. Tabla client
CREATE TABLE client (
    client_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id VARCHAR(50),
    name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50)
);

-- 3. Tabla property
CREATE TABLE property (
    property_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    area NUMERIC,
    base_price NUMERIC,
    sale_price NUMERIC,
    address VARCHAR(255),
    type VARCHAR(100),
    owner_id UUID NOT NULL REFERENCES owner(owner_id)
);

-- 4. Tabla property_media
CREATE TABLE property_media (
    media_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_url TEXT NOT NULL,
    cover_image BOOLEAN DEFAULT FALSE,
    display_order INTEGER,
    created_at TIMESTAMP DEFAULT now(),
    property_id UUID NOT NULL REFERENCES property(property_id)
);

-- 5. Tabla property_client (relacion N:M entre property y client)
CREATE TABLE property_client (
    property_id UUID NOT NULL REFERENCES property(property_id),
    client_id UUID NOT NULL REFERENCES client(client_id),
    PRIMARY KEY (property_id, client_id)
);

-- 6. Tabla appointment
CREATE TABLE appointment (
    appointment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_date TIMESTAMP,
    status VARCHAR(50),
    observations TEXT,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    client_id UUID NOT NULL REFERENCES client(client_id)
);

-- 7. Indices
CREATE INDEX idx_property_owner ON property(owner_id);
CREATE INDEX idx_property_media_property ON property_media(property_id);
CREATE INDEX idx_property_client_property ON property_client(property_id);
CREATE INDEX idx_property_client_client ON property_client(client_id);
CREATE INDEX idx_appointment_client ON appointment(client_id);
CREATE INDEX idx_appointment_visit_date ON appointment(visit_date);
CREATE INDEX idx_appointment_status ON appointment(status);

-- 8. Trigger para actualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON appointment
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 9. Habilitar Row Level Security (RLS)
ALTER TABLE owner ENABLE ROW LEVEL SECURITY;
ALTER TABLE client ENABLE ROW LEVEL SECURITY;
ALTER TABLE property ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_client ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment ENABLE ROW LEVEL SECURITY;

-- 10. Politicas RLS

-- owner: lectura publica, escritura autenticados
CREATE POLICY "owner_select_anon" ON owner
    FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "owner_insert_auth" ON owner
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "owner_update_auth" ON owner
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "owner_delete_auth" ON owner
    FOR DELETE TO authenticated USING (true);

-- client: lectura publica, escritura autenticados
CREATE POLICY "client_select_anon" ON client
    FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "client_insert_auth" ON client
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "client_update_auth" ON client
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "client_delete_auth" ON client
    FOR DELETE TO authenticated USING (true);

-- property: lectura publica, escritura autenticados
CREATE POLICY "property_select_anon" ON property
    FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "property_insert_auth" ON property
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "property_update_auth" ON property
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "property_delete_auth" ON property
    FOR DELETE TO authenticated USING (true);

-- property_media: lectura publica, escritura autenticados
CREATE POLICY "property_media_select_anon" ON property_media
    FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "property_media_insert_auth" ON property_media
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "property_media_update_auth" ON property_media
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "property_media_delete_auth" ON property_media
    FOR DELETE TO authenticated USING (true);

-- property_client: lectura publica, escritura autenticados
CREATE POLICY "property_client_select_anon" ON property_client
    FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "property_client_insert_auth" ON property_client
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "property_client_delete_auth" ON property_client
    FOR DELETE TO authenticated USING (true);

-- appointment: lectura e insercion publica, edicion/eliminacion autenticados
CREATE POLICY "appointment_select_anon" ON appointment
    FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "appointment_insert_anon" ON appointment
    FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "appointment_update_auth" ON appointment
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "appointment_delete_auth" ON appointment
    FOR DELETE TO authenticated USING (true);
