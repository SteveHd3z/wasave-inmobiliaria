"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createBrowserClient } from "@shared/utils/supabase";
import { FormLayout, FormSection, StatusBadge } from "@features/admin";
import { FORM_ID } from "@features/admin/components/FormLayout";
import type { Appointment, AppointmentStatus } from "@features/appointments";

export default function EditarCitaPage() {
  const supabase = createBrowserClient();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [visitDate, setVisitDate] = useState("");
  const [status, setStatus] = useState<AppointmentStatus>("pending");
  const [observations, setObservations] = useState("");

  useEffect(() => {
    let ignore = false;

    async function fetchAppointment() {
      setLoading(true);

      const { data, error } = await supabase
        .from("appointment")
        .select("*")
        .eq("appointment_id", id)
        .single();

      if (!ignore) {
        if (!error && data) {
          const apt = data as unknown as Appointment;
          setAppointment(apt);
          setVisitDate(apt.visit_date ? apt.visit_date.slice(0, 16) : "");
          setStatus(apt.status);
          setObservations(apt.observations ?? "");
        }
        setLoading(false);
      }
    }

    fetchAppointment();

    return () => {
      ignore = true;
    };
  }, [id, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!visitDate) {
      alert("La fecha de visita es requerida");
      return;
    }

    const visitDateISO = new Date(visitDate).toISOString();

    if (new Date(visitDateISO) < new Date()) {
      const confirmed = window.confirm(
        "La fecha seleccionada es en el pasado. ¿Deseas continuar?"
      );
      if (!confirmed) return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("appointment")
      .update({
        visit_date: visitDateISO,
        status,
        observations: observations || null,
      })
      .eq("appointment_id", id);

    if (error) {
      alert("Error al actualizar la cita");
      setSaving(false);
      return;
    }

    router.push(`/admin/citas/${id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div
          className="animate-spin rounded-full h-8 w-8 border-b-2"
          style={{ borderColor: "var(--primary)" }}
        />
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="text-center py-12">
        <p style={{ color: "var(--muted)" }}>Cita no encontrada</p>
      </div>
    );
  }

  const inputStyle = {
    backgroundColor: "var(--background)",
    border: "1px solid var(--border-color)",
    color: "var(--foreground)",
  };

  return (
    <FormLayout
      title="Editar Cita"
      subtitle="Modifica la fecha, estado u observaciones de la cita."
      backHref={`/admin/citas/${id}`}
      backLabel="Volver al detalle"
      cancelHref={`/admin/citas/${id}`}
      loading={saving}
      submitLabel="Guardar cambios"
      maxWidth="md"
    >
      <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-6">
        <FormSection
          title="Estado actual"
          description="Visualiza el estado actual de la cita."
        >
          <div className="flex items-center gap-3">
            <span className="text-sm" style={{ color: "var(--muted)" }}>
              Estado:
            </span>
            <StatusBadge status={status} />
          </div>
        </FormSection>

        <FormSection
          title="Detalles de la cita"
          description="Actualiza la fecha, estado u observaciones."
        >
          <div className="space-y-5">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--foreground)" }}
              >
                Fecha y hora de visita <span style={{ color: "#DC2626" }}>*</span>
              </label>
              <input
                type="datetime-local"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg outline-none"
                style={inputStyle}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--foreground)" }}
              >
                Estado
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as AppointmentStatus)}
                className="w-full px-4 py-3 rounded-lg outline-none"
                style={inputStyle}
              >
                <option value="pending">Pendiente</option>
                <option value="confirmed">Confirmada</option>
                <option value="cancelled">Cancelada</option>
                <option value="completed">Completada</option>
              </select>
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--foreground)" }}
              >
                Observaciones
              </label>
              <textarea
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                rows={5}
                className="w-full px-4 py-3 rounded-lg outline-none resize-none"
                style={inputStyle}
                placeholder="Notas, comentarios o detalles relevantes sobre la cita"
              />
            </div>
          </div>
        </FormSection>
      </form>
    </FormLayout>
  );
}
