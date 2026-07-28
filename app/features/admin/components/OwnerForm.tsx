"use client";

import { useState } from "react";
import type { CreateOwnerInput } from "@features/owner";
import { validateEmail, validatePhone, formatPhoneInput } from "@shared/utils";
import { FORM_ID } from "./FormLayout";

interface OwnerFormProps {
  initialData?: CreateOwnerInput;
  onSubmit: (data: CreateOwnerInput) => Promise<void>;
  loading?: boolean;
}

interface FormErrors {
  email?: string;
  phone?: string;
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
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const digitsOnly = formatPhoneInput(value);
      setForm((prev) => ({ ...prev, phone: digitsOnly || undefined }));
      setErrors((prev) => ({ ...prev, phone: validatePhone(digitsOnly) }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value || undefined }));

    if (name === "email") {
      setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const emailError = form.email ? validateEmail(form.email) : undefined;
    const phoneError = form.phone ? validatePhone(form.phone) : undefined;

    if (emailError || phoneError) {
      setErrors({ email: emailError, phone: phoneError });
      return;
    }

    await onSubmit(form);
  };

  const inputStyle = {
    backgroundColor: "var(--background)",
    border: "1px solid var(--border-color)",
    color: "var(--foreground)",
  };

  const errorInputStyle = {
    ...inputStyle,
    border: "1px solid #DC2626",
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
            style={errors.email ? errorInputStyle : inputStyle}
            placeholder="correo@ejemplo.com"
          />
          {errors.email && (
            <p className="text-sm mt-1" style={{ color: "#DC2626" }}>
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>
            Telefono
          </label>
          <input
            name="phone"
            value={form.phone ?? ""}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg outline-none transition-colors"
            style={errors.phone ? errorInputStyle : inputStyle}
            placeholder="3001234567"
            inputMode="numeric"
          />
          {errors.phone && (
            <p className="text-sm mt-1" style={{ color: "#DC2626" }}>
              {errors.phone}
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
