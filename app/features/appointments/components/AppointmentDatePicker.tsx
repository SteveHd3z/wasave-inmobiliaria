"use client";

import { useEffect, useMemo, useState } from "react";
import { es } from "date-fns/locale";
import { format } from "date-fns";
import { parseAppointmentDate } from "@shared/utils";
import AppointmentCalendarPanel from "./AppointmentCalendarPanel";

export interface AppointmentDatePickerProps {
  propertyId: string;
  value: string;
  onChange: (iso: string) => void;
  error?: string;
}

export default function AppointmentDatePicker({
  propertyId,
  value,
  onChange,
  error,
}: AppointmentDatePickerProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const valueDate = useMemo(() => parseAppointmentDate(value), [value]);

  const displayDate = valueDate;
  const triggerLabel = displayDate
    ? format(displayDate, "EEEE d 'de' MMMM, yyyy · p", { locale: es })
    : "Selecciona el día y la hora de tu visita";

  const triggerStyle: React.CSSProperties = {
    backgroundColor: "var(--background)",
    border: `1px solid ${error ? "#FECACA" : "var(--border-color)"}`,
    color: displayDate ? "var(--foreground)" : "var(--muted)",
  };

  const handleClear = () => {
    onChange("");
  };

  return (
    <div className="space-y-1">
      <label
        className="block text-sm font-medium mb-2"
        style={{ color: "var(--foreground)" }}
      >
        Fecha y hora de la visita
      </label>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full px-4 py-3 rounded-lg outline-none text-left text-sm flex items-center justify-between transition-all hover:opacity-90"
        style={triggerStyle}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2 min-w-0">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: "var(--primary)", flexShrink: 0 }}
            aria-hidden="true"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span className="truncate">{triggerLabel}</span>
        </span>
        <span
          className="text-xs font-semibold"
          style={{ color: "var(--primary)", flexShrink: 0 }}
        >
          {displayDate ? "Cambiar" : "Elegir"}
        </span>
      </button>

      {displayDate && (
        <button
          type="button"
          onClick={handleClear}
          className="text-xs hover:opacity-80"
          style={{ color: "var(--muted)" }}
        >
          Quitar selección
        </button>
      )}

      {error && (
        <p className="text-xs" style={{ color: "#DC2626" }}>
          {error}
        </p>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.55)" }}
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Selecciona la fecha y hora de tu visita"
        >
          <div
            className="w-full max-w-3xl rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col"
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border-color)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex items-start justify-between px-6 py-4 border-b"
              style={{ borderColor: "var(--border-color)" }}
            >
              <div>
                <h2
                  className="text-lg font-semibold"
                  style={{ color: "var(--foreground)" }}
                >
                  Agenda tu visita
                </h2>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                  Horario de atención: 8:00 AM - 6:00 PM. Duración de 2 horas por cita.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:opacity-70"
                style={{
                  backgroundColor: "transparent",
                  color: "var(--muted)",
                  border: "none",
                  flexShrink: 0,
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

            <div className="px-6 py-5 overflow-y-auto flex-1">
              <AppointmentCalendarPanel
                propertyId={propertyId}
                value={value}
                onChange={onChange}
              />
            </div>

            <div
              className="flex items-center justify-end gap-3 px-6 py-4 border-t"
              style={{ borderColor: "var(--border-color)" }}
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-5 py-2.5 text-sm rounded-full font-semibold transition-all hover:opacity-80"
                style={{
                  backgroundColor: "transparent",
                  color: "var(--foreground)",
                  border: "1px solid var(--border-color)",
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-5 py-2.5 text-sm rounded-full font-semibold transition-all hover:opacity-90"
                style={{
                  backgroundColor: "var(--primary)",
                  color: "white",
                  border: "none",
                }}
              >
                Listo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
