"use server";

import { createAdminClient } from "@shared/utils/supabase/admin";
import { datetimeLocalToISO, parseAppointmentDate } from "@shared/utils";
import type { AppointmentFormData } from "./components/AppointmentForm";

interface ActionResult {
  success: boolean;
  error?: string;
  data?: {
    clientId: string;
    appointmentId: string;
  };
}

export async function createAppointmentAction(
  formData: AppointmentFormData,
  propertyId: string
): Promise<ActionResult> {
  try {
    const supabase = createAdminClient();

    console.log("SUPABASE_SERVICE_ROLE_KEY exists:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);

    // Buscar cliente existente por email
    const { data: existingClient } = await supabase
      .from("client")
      .select("client_id")
      .eq("email", formData.email)
      .maybeSingle();

    let clientId: string;

    if (existingClient) {
      clientId = existingClient.client_id;
    } else {
      // Crear nuevo cliente
      const { data: newClient, error: createError } = await supabase
        .from("client")
        .insert({
          name: formData.name,
          last_name: formData.last_name || null,
          document_id: formData.document_id || null,
          phone: formData.phone,
          email: formData.email,
        })
        .select("client_id")
        .single();

      if (createError || !newClient) {
        console.error("Error creating client:", createError);
        return { success: false, error: `Error al registrar el cliente: ${createError?.message || "desconocido"}` };
      }
      clientId = newClient.client_id;
    }

    // Crear la cita
    const visitDateISO = datetimeLocalToISO(formData.visit_date);
    const visitDateObj = parseAppointmentDate(visitDateISO);
    if (!visitDateObj) {
      return { success: false, error: "La fecha de la cita no es válida." };
    }
    const slotStart = new Date(visitDateObj);
    slotStart.setMinutes(0, 0, 0);
    const slotEnd = new Date(slotStart);
    slotEnd.setHours(slotEnd.getHours() + 2);

    // Verificar que la propiedad no tenga ya una cita que se solape con este horario
    const { data: conflicting } = await supabase
      .from("appointment")
      .select("appointment_id, visit_date, status, client_id, property_client!inner(property_id)")
      .eq("property_client.property_id", propertyId)
      .neq("status", "cancelled")
      .lt("visit_date", slotEnd.toISOString())
      .gte("visit_date", new Date(slotStart.getTime() - 2 * 60 * 60 * 1000).toISOString());

    const hasConflict = (conflicting ?? []).some((apt) => {
      const aptDate = parseAppointmentDate(apt.visit_date);
      if (!aptDate) return false;
      const aptStart = new Date(aptDate);
      aptStart.setMinutes(0, 0, 0);
      const aptEnd = new Date(aptStart);
      aptEnd.setHours(aptEnd.getHours() + 2);
      return slotStart < aptEnd && slotEnd > aptStart;
    });

    if (hasConflict) {
      return {
        success: false,
        error: "Este horario ya está reservado. Por favor selecciona otro.",
      };
    }

    const { data: newAppointment, error: appointmentError } = await supabase
      .from("appointment")
      .insert({
        visit_date: visitDateISO,
        status: "pending",
        observations: formData.observations || null,
        client_id: clientId,
      })
      .select("appointment_id")
      .single();

    if (appointmentError || !newAppointment) {
      return { success: false, error: "Error al agendar la cita." };
    }

    // Crear relacion property_client
    await supabase
      .from("property_client")
      .upsert(
        { property_id: propertyId, client_id: clientId },
        { onConflict: "property_id,client_id" }
      );

    return {
      success: true,
      data: {
        clientId,
        appointmentId: newAppointment.appointment_id,
      },
    };
  } catch {
    return { success: false, error: "Error inesperado. Intenta de nuevo." };
  }
}
