"use client";

import { useEffect, useRef, useState } from "react";
import StatusBadge from "./StatusBadge";
import ConfirmDialog from "./ConfirmDialog";
import AppointmentEditModal from "./AppointmentEditModal";
import { generateWhatsAppMessage, getWhatsAppLink } from "@features/notifications";
import type {
  Appointment,
  AppointmentStatus,
  AppointmentWithClient,
} from "@features/appointments";

interface AppointmentDetailProps {
  appointment: AppointmentWithClient;
  onConfirm: () => Promise<void>;
  onCancel: () => Promise<void>;
  onComplete: () => Promise<void>;
  onDelete: () => Promise<void>;
  onUpdate: (values: {
    visit_date: string;
    status: AppointmentStatus;
    observations: string | null;
  }) => Promise<void>;
}

type WhatsAppAction = "created" | "updated" | "cancelled" | "reminder";

const cardStyle = {
  backgroundColor: "var(--surface)",
  border: "1px solid var(--border-color)",
};

const actionLabel: Record<WhatsAppAction, string> = {
  created: "Confirmar agendamiento",
  updated: "Notificar cambio",
  cancelled: "Notificar cancelación",
  reminder: "Enviar recordatorio",
};

const actionIcon: Record<WhatsAppAction, string> = {
  created: "🗓️",
  updated: "✏️",
  cancelled: "❌",
  reminder: "⏰",
};

export default function AppointmentDetail({
  appointment,
  onConfirm,
  onCancel,
  onComplete,
  onDelete,
  onUpdate,
}: AppointmentDetailProps) {
  const [loading, setLoading] = useState<AppointmentStatus | "delete" | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [whatsappOpen, setWhatsappOpen] = useState(false);
  const whatsappRef = useRef<HTMLDivElement | null>(null);

  const fullName = appointment.client
    ? `${appointment.client.name}${appointment.client.last_name ? ` ${appointment.client.last_name}` : ""}`
    : "Sin cliente";

  useEffect(() => {
    if (!whatsappOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (whatsappRef.current && !whatsappRef.current.contains(e.target as Node)) {
        setWhatsappOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setWhatsappOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [whatsappOpen]);

  const handleAction = async (
    action: () => Promise<void>,
    key: AppointmentStatus | "delete"
  ) => {
    setLoading(key);
    await action();
    setLoading(null);
  };

  const buildWhatsappLink = (action: WhatsAppAction): string | null => {
    if (!appointment.client?.phone) return null;
    const message = generateWhatsAppMessage({
      appointment: appointment as Appointment,
      client: appointment.client,
      action,
    });
    return getWhatsAppLink(appointment.client.phone, message);
  };

  const primaryWhatsappAction: WhatsAppAction =
    appointment.status === "cancelled"
      ? "cancelled"
      : appointment.status === "completed"
        ? "updated"
        : appointment.status === "confirmed"
          ? "reminder"
          : "created";

  const primaryWhatsappLink = buildWhatsappLink(primaryWhatsappAction);
  const availableWhatsappActions: WhatsAppAction[] = (["created", "reminder", "updated", "cancelled"] as WhatsAppAction[]).filter(
    (a) => a !== primaryWhatsappAction
  );

  return (
    <div className="space-y-6">
      <div className="rounded-2xl p-6" style={cardStyle}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--foreground)" }}>
          Detalle de la cita
        </h2>

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
              Estado de la cita
            </p>
            <div>
              <StatusBadge status={appointment.status} />
            </div>
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
          <button
            onClick={() => setEditOpen(true)}
            className="px-5 py-2.5 text-sm rounded-full font-semibold transition-all hover:opacity-90 inline-flex items-center gap-2"
            style={{
              backgroundColor: "var(--primary)",
              color: "white",
              border: "none",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Editar
          </button>

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

          {primaryWhatsappLink ? (
            <div ref={whatsappRef} className="relative inline-flex">
              <a
                href={primaryWhatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 text-sm rounded-l-full font-semibold transition-all hover:opacity-90 inline-flex items-center gap-2"
                style={{
                  backgroundColor: "#25D366",
                  color: "white",
                  border: "none",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.967-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                </svg>
                {actionLabel[primaryWhatsappAction]}
              </a>
              <button
                type="button"
                onClick={() => setWhatsappOpen((v) => !v)}
                aria-label="Mas opciones de WhatsApp"
                className="px-3 py-2.5 text-sm rounded-r-full font-semibold transition-all hover:opacity-90"
                style={{
                  backgroundColor: "#1DA851",
                  color: "white",
                  border: "none",
                  borderLeft: "1px solid rgba(255,255,255,0.25)",
                }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    transform: whatsappOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 150ms ease",
                  }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {whatsappOpen && availableWhatsappActions.length > 0 && (
                <div
                  className="absolute right-0 top-full mt-2 w-64 rounded-xl shadow-xl z-20 overflow-hidden"
                  style={{
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <p
                    className="px-4 py-2 text-xs font-semibold uppercase tracking-wide"
                    style={{
                      color: "var(--muted)",
                      borderBottom: "1px solid var(--border-color)",
                    }}
                  >
                    Otros mensajes
                  </p>
                  {availableWhatsappActions.map((action) => {
                    const link = buildWhatsappLink(action);
                    if (!link) return null;
                    return (
                      <a
                        key={action}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setWhatsappOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:opacity-80"
                        style={{ color: "var(--foreground)" }}
                      >
                        <span aria-hidden="true">{actionIcon[action]}</span>
                        <span>{actionLabel[action]}</span>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <span
              className="px-5 py-2.5 text-sm rounded-full font-semibold"
              style={{
                backgroundColor: "var(--background)",
                color: "var(--muted)",
                border: "1px solid var(--border-color)",
              }}
            >
              Sin telefono del cliente
            </span>
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

      <AppointmentEditModal
        key={`${appointment.appointment_id}-${editOpen ? "open" : "closed"}`}
        appointment={appointment}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={onUpdate}
      />
    </div>
  );
}
