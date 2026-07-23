"use client";

import { useState } from "react";
import type { CreateClientInput } from "@features/client";
import { FORM_ID } from "./FormLayout";

interface ClientFormProps {
  initialData?: CreateClientInput;
  onSubmit: (data: CreateClientInput) => Promise<void>;
  loading?: boolean;
}

export default function ClientForm({ initialData, onSubmit, loading = false }: ClientFormProps) {
  const [form, setForm] = useState<CreateClientInput>(
    initialData ?? {
      document_id: "",
      name: "",
      last_name: "",
      email: "",
      phone: "",
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value || undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    await onSubmit(form);
  };

  const inputStyle = {
    backgroundColor: "var(--background)",
    border: "1px solid var(--border-color)",
    color: "var(--foreground)",
  };

  return (
    <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>
            Nombre <span style={{ color: "#DC2626" }}>*</span>
          </label>
          <input
            name="name"
            value={form.name ?? ""}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg outline-none transition-colors"
            style={inputStyle}
            placeholder="Nombre del cliente"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>
            Apellido
          </label>
          <input
            name="last_name"
            value={form.last_name ?? ""}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg outline-none transition-colors"
            style={inputStyle}
            placeholder="Apellido del cliente"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>
            Documento de Identidad
          </label>
          <input
            name="document_id"
            value={form.document_id ?? ""}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg outline-none transition-colors"
            style={inputStyle}
            placeholder="Cedula, NIT, etc."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>
            Email
          </label>
          <input
            name="email"
            type="email"
            value={form.email ?? ""}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg outline-none transition-colors"
            style={inputStyle}
            placeholder="correo@ejemplo.com"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>
            Telefono
          </label>
          <input
            name="phone"
            value={form.phone ?? ""}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg outline-colors"
            style={inputStyle}
            placeholder="300 123 4567"
          />
        </div>
      </div>
    </form>
  );
}
