"use client";

import { useEffect, useState } from "react";
import type { Appointment, AppointmentStatus } from "@features/appointments";
import { appointmentToDatetimeLocal, datetimeLocalToISO } from "@shared/utils";

interface AppointmentEditModalProps {
  appointment: Appointment;
  open: boolean;
  onClose: () => void;
  onSave: (values: {
    visit_date: string;
    status: AppointmentStatus;
    observations: string | null;
  }) => Promise<void>;
}

const statusOptions: { value: AppointmentStatus; label: string }[] = [
  { value: "pending", label: "Pendiente" },
  { value: "confirmed", label: "Confirmada" },
  { value: "cancelled", label: "Cancelada" },
  { value: "completed", label: "Completada" },
];

export default function AppointmentEditModal({
  appointment,
  open,
  onClose,
  onSave,
}: AppointmentEditModalProps) {
  const [visitDate, setVisitDate] = useState(() =>
    appointmentToDatetimeLocal(appointment.visit_date)
  );
  const [status, setStatus] = useState<AppointmentStatus>(appointment.status);
  const [observations, setObservations] = useState(appointment.observations ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  if (!open) return null;

  const inputStyle = {
    backgroundColor: "var(--background)",
    border: "1px solid var(--border-color)",
    color: "var(--foreground)",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!visitDate) {
      setError("La fecha de visita es requerida");
      return;
    }

    const visitDateISO = datetimeLocalToISO(visitDate);

    if (new Date(visitDateISO) < new Date()) {
      const confirmed = window.confirm(
        "La fecha seleccionada es en el pasado. ¿Deseas continuar?"
      );
      if (!confirmed) return;
    }

    setSaving(true);
    try {
      await onSave({
        visit_date: visitDateISO,
        status,
        observations: observations.trim() ? observations : null,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar los cambios");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.55)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border-color)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: "var(--border-color)" }}
        >
          <div>
            <h2
              className="text-lg font-semibold"
              style={{ color: "var(--foreground)" }}
            >
              Editar cita
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
              Modifica la fecha o el estado de la cita.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:opacity-70"
            style={{
              backgroundColor: "transparent",
              color: "var(--muted)",
              border: "none",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
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
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
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
              readOnly
              rows={4}
              className="w-full px-4 py-3 rounded-lg outline-none resize-none cursor-not-allowed"
              style={{ ...inputStyle, opacity: 0.7 }}
              placeholder="Notas, comentarios o detalles relevantes sobre la cita"
            />
            <p className="text-xs mt-1.5" style={{ color: "var(--muted)" }}>
              Las observaciones solo pueden ser definidas por el cliente al agendar la cita.
            </p>
          </div>

          {error && (
            <p
              className="text-sm px-3 py-2 rounded-lg"
              style={{
                backgroundColor: "#FEE2E2",
                color: "#991B1B",
              }}
            >
              {error}
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-5 py-2.5 text-sm rounded-full font-semibold transition-all hover:opacity-80 disabled:opacity-50"
              style={{
                backgroundColor: "transparent",
                color: "var(--foreground)",
                border: "1px solid var(--border-color)",
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 text-sm rounded-full font-semibold transition-all hover:opacity-90 disabled:opacity-50"
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
    </div>
  );
}
