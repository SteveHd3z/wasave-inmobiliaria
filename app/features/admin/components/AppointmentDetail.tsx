"use client";

import { useState } from "react";
import StatusBadge from "./StatusBadge";
import ConfirmDialog from "./ConfirmDialog";
import { generateWhatsAppMessage, getWhatsAppLink } from "@features/notifications";
import type { AppointmentWithClient, AppointmentStatus } from "@features/appointments";

interface AppointmentDetailProps {
  appointment: AppointmentWithClient;
  onConfirm: () => Promise<void>;
  onCancel: () => Promise<void>;
  onComplete: () => Promise<void>;
  onDelete: () => Promise<void>;
}

const cardStyle = {
  backgroundColor: "var(--surface)",
  border: "1px solid var(--border-color)",
};

export default function AppointmentDetail({
  appointment,
  onConfirm,
  onCancel,
  onComplete,
  onDelete,
}: AppointmentDetailProps) {
  const [loading, setLoading] = useState<AppointmentStatus | "delete" | null>(null);
  const [showDelete, setShowDelete] = useState(false);

  const fullName = appointment.client
    ? `${appointment.client.name}${appointment.client.last_name ? ` ${appointment.client.last_name}` : ""}`
    : "Sin cliente";

  const handleAction = async (
    action: () => Promise<void>,
    key: AppointmentStatus | "delete"
  ) => {
    setLoading(key);
    await action();
    setLoading(null);
  };

  const whatsappMessage = appointment.client
    ? generateWhatsAppMessage({
        appointment,
        client: appointment.client,
        action: "updated",
      })
    : "";

  const whatsappLink =
    appointment.client?.phone && whatsappMessage
      ? getWhatsAppLink(appointment.client.phone, whatsappMessage)
      : null;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl p-6" style={cardStyle}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
            Detalle de la cita
          </h2>
          <StatusBadge status={appointment.status} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium mb-1" style={{ color: "var(--muted)" }}>
              Fecha de visita
            </p>
            <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
              {new Date(appointment.visit_date).toLocaleString("es-CO", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium mb-1" style={{ color: "var(--muted)" }}>
              ID de cita
            </p>
            <p
              className="text-sm font-mono truncate"
              style={{ color: "var(--foreground)" }}
              title={appointment.appointment_id}
            >
              {appointment.appointment_id}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-xs font-medium mb-1" style={{ color: "var(--muted)" }}>
            Observaciones
          </p>
          <p
            className="text-sm whitespace-pre-wrap"
            style={{ color: "var(--foreground)" }}
          >
            {appointment.observations || "Sin observaciones"}
          </p>
        </div>
      </div>

      <div className="rounded-2xl p-6" style={cardStyle}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--foreground)" }}>
          Informacion del cliente
        </h2>

        {appointment.client ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: "var(--muted)" }}>
                Nombre completo
              </p>
              <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                {fullName}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium mb-1" style={{ color: "var(--muted)" }}>
                Documento
              </p>
              <p className="text-sm" style={{ color: "var(--foreground)" }}>
                {appointment.client.document_id || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium mb-1" style={{ color: "var(--muted)" }}>
                Email
              </p>
              <p className="text-sm" style={{ color: "var(--foreground)" }}>
                {appointment.client.email || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium mb-1" style={{ color: "var(--muted)" }}>
                Telefono
              </p>
              <p className="text-sm" style={{ color: "var(--foreground)" }}>
                {appointment.client.phone || "-"}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            No se encontro informacion del cliente.
          </p>
        )}
      </div>

      <div className="rounded-2xl p-6" style={cardStyle}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--foreground)" }}>
          Acciones
        </h2>

        <div className="flex flex-wrap gap-3">
          {appointment.status === "pending" && (
            <button
              onClick={() => handleAction(onConfirm, "confirmed")}
              disabled={loading !== null}
              className="px-5 py-2.5 text-sm rounded-full font-semibold transition-all hover:opacity-90 disabled:opacity-50"
              style={{
                backgroundColor: "#D1FAE5",
                color: "#065F46",
                border: "none",
              }}
            >
              {loading === "confirmed" ? "Confirmando..." : "Confirmar cita"}
            </button>
          )}

          {(appointment.status === "pending" || appointment.status === "confirmed") && (
            <button
              onClick={() => handleAction(onCancel, "cancelled")}
              disabled={loading !== null}
              className="px-5 py-2.5 text-sm rounded-full font-semibold transition-all hover:opacity-90 disabled:opacity-50"
              style={{
                backgroundColor: "#FEE2E2",
                color: "#991B1B",
                border: "none",
              }}
            >
              {loading === "cancelled" ? "Cancelando..." : "Cancelar cita"}
            </button>
          )}

          {appointment.status === "confirmed" && (
            <button
              onClick={() => handleAction(onComplete, "completed")}
              disabled={loading !== null}
              className="px-5 py-2.5 text-sm rounded-full font-semibold transition-all hover:opacity-90 disabled:opacity-50"
              style={{
                backgroundColor: "#DBEAFE",
                color: "#1E40AF",
                border: "none",
              }}
            >
              {loading === "completed" ? "Completando..." : "Marcar como completada"}
            </button>
          )}

          {whatsappLink && (
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
          )}

          <button
            onClick={() => setShowDelete(true)}
            disabled={loading !== null}
            className="px-5 py-2.5 text-sm rounded-full font-semibold transition-all hover:opacity-90 disabled:opacity-50"
            style={{
              backgroundColor: "transparent",
              color: "#991B1B",
              border: "1px solid #991B1B",
            }}
          >
            Eliminar
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDelete}
        title="Eliminar cita"
        message="Esta accion eliminara la cita permanentemente. No se puede deshacer."
        onConfirm={async () => {
          await handleAction(onDelete, "delete");
          setShowDelete(false);
        }}
        onCancel={() => setShowDelete(false)}
        loading={loading === "delete"}
      />
    </div>
  );
}
