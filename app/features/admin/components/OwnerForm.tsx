"use client";

import { useState } from "react";
import { Button } from "@shared/components/ui";
import type { CreateOwnerInput } from "@features/owner";

interface OwnerFormProps {
  initialData?: CreateOwnerInput;
  onSubmit: (data: CreateOwnerInput) => Promise<void>;
  loading?: boolean;
}

export default function OwnerForm({ initialData, onSubmit, loading = false }: OwnerFormProps) {
  const [form, setForm] = useState<CreateOwnerInput>(
    initialData ?? {
      document_id: "",
      name: "",
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
    await onSubmit(form);
  };

  const inputStyle = {
    backgroundColor: "var(--background)",
    border: "1px solid var(--border-color)",
    color: "var(--foreground)",
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>
            Nombre *
          </label>
          <input
            name="name"
            value={form.name ?? ""}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg outline-none"
            style={inputStyle}
            placeholder="Nombre del propietario"
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
            className="w-full px-4 py-3 rounded-lg outline-none"
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
            className="w-full px-4 py-3 rounded-lg outline-none"
            style={inputStyle}
            placeholder="correo@ejemplo.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>
            Telefono
          </label>
          <input
            name="phone"
            value={form.phone ?? ""}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg outline-none"
            style={inputStyle}
            placeholder="300 123 4567"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="submit" size="lg" disabled={loading}>
          {loading ? "Guardando..." : "Guardar propietario"}
        </Button>
      </div>
    </form>
  );
}
