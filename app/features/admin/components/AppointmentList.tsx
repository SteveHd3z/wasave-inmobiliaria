"use client";

import Link from "next/link";
import StatusBadge from "./StatusBadge";
import { formatAppointmentDateTime } from "@shared/utils";
import type { AppointmentWithClient } from "@features/appointments";

interface AppointmentListProps {
  appointments: AppointmentWithClient[];
  onDelete: (id: string) => void;
}

export default function AppointmentList({ appointments, onDelete }: AppointmentListProps) {
  if (appointments.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg" style={{ color: "var(--muted)" }}>
          No hay citas registradas
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <th className="text-left py-3 px-2 font-medium" style={{ color: "var(--muted)" }}>
              Fecha visita
            </th>
            <th className="text-left py-3 px-2 font-medium" style={{ color: "var(--muted)" }}>
              Cliente
            </th>
            <th className="text-left py-3 px-2 font-medium" style={{ color: "var(--muted)" }}>
              Email
            </th>
            <th className="text-left py-3 px-2 font-medium" style={{ color: "var(--muted)" }}>
              Telefono
            </th>
            <th className="text-left py-3 px-2 font-medium" style={{ color: "var(--muted)" }}>
              Estado
            </th>
            <th className="text-left py-3 px-2 font-medium" style={{ color: "var(--muted)" }}>
              Observaciones
            </th>
            <th className="text-right py-3 px-2 font-medium" style={{ color: "var(--muted)" }}>
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((apt) => (
            <tr key={apt.appointment_id} style={{ borderBottom: "1px solid var(--border-color)" }}>
              <td className="py-3 px-2 font-medium" style={{ color: "var(--foreground)" }}>
                {formatAppointmentDateTime(apt.visit_date)}
              </td>
              <td className="py-3 px-2" style={{ color: "var(--foreground)" }}>
                {apt.client
                  ? `${apt.client.name}${apt.client.last_name ? ` ${apt.client.last_name}` : ""}`
                  : "Sin cliente"}
              </td>
              <td className="py-3 px-2" style={{ color: "var(--foreground)" }}>
                {apt.client?.email ?? "-"}
              </td>
              <td className="py-3 px-2" style={{ color: "var(--foreground)" }}>
                {apt.client?.phone ?? "-"}
              </td>
              <td className="py-3 px-2">
                <StatusBadge status={apt.status} />
              </td>
              <td
                className="py-3 px-2 max-w-xs truncate"
                style={{ color: "var(--foreground)" }}
                title={apt.observations ?? ""}
              >
                {apt.observations ?? "-"}
              </td>
              <td className="py-3 px-2">
                <div className="flex justify-end gap-2">
                  <Link href={`/admin/citas/${apt.appointment_id}`}>
                    <button
                      className="px-3 py-1.5 text-sm rounded-full font-semibold transition-all hover:opacity-90"
                      style={{
                        backgroundColor: "transparent",
                        color: "var(--primary)",
                        border: "1px solid var(--primary)",
                      }}
                    >
                      Ver
                    </button>
                  </Link>
                  <button
                    onClick={() => onDelete(apt.appointment_id)}
                    className="px-3 py-1.5 text-sm rounded-full font-semibold transition-all hover:opacity-90"
                    style={{
                      backgroundColor: "transparent",
                      color: "#991B1B",
                      border: "1px solid #991B1B",
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
