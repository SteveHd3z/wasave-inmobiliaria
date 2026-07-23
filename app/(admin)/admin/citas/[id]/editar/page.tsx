"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { createBrowserClient } from "@shared/utils/supabase";
import { StatusBadge } from "@features/admin";
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
      <div className="text-center py-12 space-y-4">
        <p style={{ color: "var(--muted)" }}>Cita no encontrada</p>
        <Link
          href="/admin/citas"
          className="inline-block px-5 py-2.5 text-sm rounded-full font-semibold transition-all hover:opacity-90"
          style={{
            backgroundColor: "var(--primary)",
            color: "white",
            border: "none",
          }}
        >
          Volver a citas
        </Link>
      </div>
    );
  }

  const inputStyle = {
    backgroundColor: "var(--background)",
    border: "1px solid var(--border-color)",
    color: "var(--foreground)",
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link
          href={`/admin/citas/${id}`}
          className="text-sm hover:opacity-80"
          style={{ color: "var(--muted)" }}
        >
          ← Volver al detalle
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
          Editar Cita
        </h1>
        <StatusBadge status={status} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div
          className="rounded-2xl p-6 space-y-6"
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border-color)",
          }}
        >
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--foreground)" }}
            >
              Fecha y hora de visita *
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

        <div className="flex justify-end gap-3">
          <Link href={`/admin/citas/${id}`}>
            <button
              type="button"
              className="px-5 py-2.5 text-sm rounded-full font-semibold transition-all hover:opacity-90"
              style={{
                backgroundColor: "transparent",
                color: "var(--foreground)",
                border: "1px solid var(--border-color)",
              }}
            >
              Cancelar
            </button>
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 text-base rounded-full font-semibold transition-all hover:opacity-90 disabled:opacity-50"
            style={{
              backgroundColor: "var(--primary)",
              color: "white",
              border: "none",
            }}
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}
