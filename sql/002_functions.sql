-- ============================================================
-- FUNCIONES RPC PARA WASAVE INMOBILIA
-- Ejecutar despues de 001_initial_schema.sql
-- ============================================================

-- 1. get_appointments_by_property: citas de una propiedad con datos del cliente
CREATE OR REPLACE FUNCTION get_appointments_by_property(p_property_id UUID)
RETURNS TABLE (
    appointment_id UUID,
    visit_date TIMESTAMP,
    status VARCHAR,
    observations TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    client_id UUID,
    client_name VARCHAR,
    client_last_name VARCHAR,
    client_email VARCHAR,
    client_phone VARCHAR
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        a.appointment_id,
        a.visit_date,
        a.status,
        a.observations,
        a.created_at,
        a.updated_at,
        a.client_id,
        c.name AS client_name,
        c.last_name AS client_last_name,
        c.email AS client_email,
        c.phone AS client_phone
    FROM appointment a
    INNER JOIN client c ON c.client_id = a.client_id
    WHERE a.client_id IN (
        SELECT pc.client_id
        FROM property_client pc
        WHERE pc.property_id = p_property_id
    )
    ORDER BY a.visit_date DESC;
END;
$$;

-- 2. get_appointments_summary: resumen de citas para el admin
CREATE OR REPLACE FUNCTION get_appointments_summary()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'total', COUNT(*),
        'pending', COUNT(*) FILTER (WHERE status = 'pending'),
        'confirmed', COUNT(*) FILTER (WHERE status = 'confirmed'),
        'cancelled', COUNT(*) FILTER (WHERE status = 'cancelled'),
        'completed', COUNT(*) FILTER (WHERE status = 'completed'),
        'upcoming', COUNT(*) FILTER (
            WHERE visit_date >= now()
            AND status IN ('pending', 'confirmed')
        )
    )
    INTO v_result
    FROM appointment;

    RETURN v_result;
END;
$$;

-- 3. cancel_appointment: cancelar una cita
CREATE OR REPLACE FUNCTION cancel_appointment(p_appointment_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM appointment WHERE appointment_id = p_appointment_id
    ) INTO v_exists;

    IF NOT v_exists THEN
        RETURN jsonb_build_object(
            'success', false,
            'message', 'La cita no existe'
        );
    END IF;

    UPDATE appointment
    SET status = 'cancelled',
        updated_at = now()
    WHERE appointment_id = p_appointment_id;

    RETURN jsonb_build_object(
        'success', true,
        'message', 'Cita cancelada correctamente'
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'message', 'Error al cancelar la cita: ' || SQLERRM
        );
END;
$$;

-- 4. get_properties_with_owner: propiedades con datos del propietario
CREATE OR REPLACE FUNCTION get_properties_with_owner()
RETURNS TABLE (
    property_id UUID,
    title VARCHAR,
    description TEXT,
    area NUMERIC,
    base_price NUMERIC,
    sale_price NUMERIC,
    address VARCHAR,
    type VARCHAR,
    owner_id UUID,
    owner_name VARCHAR,
    owner_email VARCHAR,
    owner_phone VARCHAR
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.property_id,
        p.title,
        p.description,
        p.area,
        p.base_price,
        p.sale_price,
        p.address,
        p.type,
        p.owner_id,
        o.name AS owner_name,
        o.email AS owner_email,
        o.phone AS owner_phone
    FROM property p
    INNER JOIN owner o ON o.owner_id = p.owner_id
    ORDER BY p.title;
END;
$$;

-- 5. get_property_clients: clientes interesados en una propiedad
CREATE OR REPLACE FUNCTION get_property_clients(p_property_id UUID)
RETURNS TABLE (
    client_id UUID,
    document_id VARCHAR,
    name VARCHAR,
    last_name VARCHAR,
    email VARCHAR,
    phone VARCHAR
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.client_id,
        c.document_id,
        c.name,
        c.last_name,
        c.email,
        c.phone
    FROM client c
    INNER JOIN property_client pc ON pc.client_id = c.client_id
    WHERE pc.property_id = p_property_id
    ORDER BY c.name;
END;
$$;
