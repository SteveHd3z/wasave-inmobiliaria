import type { AppointmentStatus } from "@features/appointments";

interface StatusBadgeProps {
  status: AppointmentStatus;
}

const statusConfig: Record<AppointmentStatus, { label: string; bg: string; color: string }> = {
  pending: {
    label: "Pendiente",
    bg: "#FEF3C7",
    color: "#92400E",
  },
  confirmed: {
    label: "Confirmada",
    bg: "#D1FAE5",
    color: "#065F46",
  },
  cancelled: {
    label: "Cancelada",
    bg: "#FEE2E2",
    color: "#991B1B",
  },
  completed: {
    label: "Completada",
    bg: "#DBEAFE",
    color: "#1E40AF",
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className="px-2 py-1 rounded-full text-xs font-medium"
      style={{ backgroundColor: config.bg, color: config.color }}
    >
      {config.label}
    </span>
  );
}
