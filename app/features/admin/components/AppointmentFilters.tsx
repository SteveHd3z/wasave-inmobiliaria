"use client";

import type { AppointmentStatus } from "@features/appointments";

export interface AppointmentFiltersValue {
  status: AppointmentStatus | "";
  startDate: string;
  endDate: string;
}

interface AppointmentFiltersProps {
  value: AppointmentFiltersValue;
  onChange: (value: AppointmentFiltersValue) => void;
}

const statusOptions: { value: AppointmentStatus | ""; label: string }[] = [
  { value: "", label: "Todos" },
  { value: "pending", label: "Pendientes" },
  { value: "confirmed", label: "Confirmadas" },
  { value: "cancelled", label: "Canceladas" },
  { value: "completed", label: "Completadas" },
];

export default function AppointmentFilters({ value, onChange }: AppointmentFiltersProps) {
  const handleStatusChange = (status: AppointmentStatus | "") => {
    onChange({ ...value, status });
  };

  const handleDateChange = (field: "startDate" | "endDate", date: string) => {
    onChange({ ...value, [field]: date });
  };

  const handleClear = () => {
    onChange({ status: "", startDate: "", endDate: "" });
  };

  const inputStyle = {
    backgroundColor: "var(--background)",
    border: "1px solid var(--border-color)",
    color: "var(--foreground)",
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {statusOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleStatusChange(opt.value)}
            className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
            style={{
              backgroundColor: value.status === opt.value ? "var(--primary)" : "var(--surface)",
              color: value.status === opt.value ? "white" : "var(--foreground)",
              border: "1px solid var(--border-color)",
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label
            className="block text-xs font-medium mb-1"
            style={{ color: "var(--muted)" }}
          >
            Desde
          </label>
          <input
            type="date"
            value={value.startDate}
            onChange={(e) => handleDateChange("startDate", e.target.value)}
            className="w-full px-3 py-2 rounded-lg outline-none text-sm"
            style={inputStyle}
          />
        </div>
        <div>
          <label
            className="block text-xs font-medium mb-1"
            style={{ color: "var(--muted)" }}
          >
            Hasta
          </label>
          <input
            type="date"
            value={value.endDate}
            onChange={(e) => handleDateChange("endDate", e.target.value)}
            className="w-full px-3 py-2 rounded-lg outline-none text-sm"
            style={inputStyle}
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={handleClear}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-80"
            style={{
              backgroundColor: "var(--surface)",
              color: "var(--foreground)",
              border: "1px solid var(--border-color)",
            }}
          >
            Limpiar filtros
          </button>
        </div>
      </div>
    </div>
  );
}
