"use client";

import type { AppointmentFormData } from "./AppointmentForm";

interface AppointmentConfirmationProps {
  data: AppointmentFormData;
  whatsappLink: string;
  onNewAppointment: () => void;
}

export default function AppointmentConfirmation({
  data,
  whatsappLink,
  onNewAppointment,
}: AppointmentConfirmationProps) {
  const visitDate = data.visit_date
    ? new Date(data.visit_date).toLocaleString("es-CO", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div className="text-center space-y-6">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
        style={{ backgroundColor: "#D1FAE5" }}
      >
        <span className="text-4xl">✅</span>
      </div>

      <div>
        <h3
          className="text-2xl font-bold mb-2"
          style={{ color: "var(--foreground)" }}
        >
          ¡Cita agendada exitosamente!
        </h3>
        <p style={{ color: "var(--muted)" }}>
          Hemos registrado tu solicitud. Te contactaremos pronto para confirmar.
        </p>
      </div>

      <div
        className="rounded-2xl p-5 text-left space-y-3"
        style={{
          backgroundColor: "var(--background)",
          border: "1px solid var(--border-color)",
        }}
      >
        <div>
          <p className="text-xs font-medium mb-1" style={{ color: "var(--muted)" }}>
            Nombre
          </p>
          <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
            {`${data.name} ${data.last_name}`}
          </p>
        </div>
        {data.document_id && (
          <div>
            <p className="text-xs font-medium mb-1" style={{ color: "var(--muted)" }}>
              Documento
            </p>
            <p className="text-sm" style={{ color: "var(--foreground)" }}>
              {data.document_id}
            </p>
          </div>
        )}
        <div>
          <p className="text-xs font-medium mb-1" style={{ color: "var(--muted)" }}>
            Contacto
          </p>
          <p className="text-sm" style={{ color: "var(--foreground)" }}>
            {data.email} · {data.phone}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium mb-1" style={{ color: "var(--muted)" }}>
            Fecha y hora
          </p>
          <p className="text-sm font-medium capitalize" style={{ color: "var(--foreground)" }}>
            {visitDate}
          </p>
        </div>
        {data.observations && (
          <div>
            <p className="text-xs font-medium mb-1" style={{ color: "var(--muted)" }}>
              Observaciones
            </p>
            <p className="text-sm" style={{ color: "var(--foreground)" }}>
              {data.observations}
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 text-sm rounded-full font-semibold transition-all hover:opacity-90"
          style={{
            backgroundColor: "#25D366",
            color: "white",
            border: "none",
          }}
        >
          Notificar por WhatsApp
        </a>
        <button
          onClick={onNewAppointment}
          className="px-5 py-2.5 text-sm rounded-full font-semibold transition-all hover:opacity-90"
          style={{
            backgroundColor: "transparent",
            color: "var(--foreground)",
            border: "1px solid var(--border-color)",
          }}
        >
          Agendar otra cita
        </button>
      </div>
    </div>
  );
}
