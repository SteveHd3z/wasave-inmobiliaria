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
  name?: string;
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
      if (errors.phone) {
        setErrors((prev) => ({ ...prev, phone: undefined }));
      }
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value || undefined }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.name?.trim()) {
      newErrors.name = "El nombre es obligatorio";
    }

    if (!form.phone?.trim()) {
      newErrors.phone = "El telefono es obligatorio";
    } else {
      const phoneError = validatePhone(form.phone);
      if (phoneError) newErrors.phone = phoneError;
    }

    if (form.email?.trim()) {
      const emailError = validateEmail(form.email);
      if (emailError) newErrors.email = emailError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!validate()) return;

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
            className="w-full px-4 py-3 rounded-lg outline-none transition-colors"
            style={{
              ...inputStyle,
              borderColor: errors.name ? "#DC2626" : inputStyle.border,
            }}
            placeholder="Nombre del propietario"
          />
          {errors.name && (
            <p className="text-sm mt-1" style={{ color: "#DC2626" }}>{errors.name}</p>
          )}
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
            value={form.email ?? ""}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg outline-none transition-colors"
            style={{
              ...inputStyle,
              borderColor: errors.email ? "#DC2626" : inputStyle.border,
            }}
            placeholder="correo@ejemplo.com"
          />
          {errors.email && (
            <p className="text-sm mt-1" style={{ color: "#DC2626" }}>{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>
            Telefono <span style={{ color: "#DC2626" }}>*</span>
          </label>
          <input
            name="phone"
            value={form.phone ?? ""}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg outline-none transition-colors"
            style={{
              ...inputStyle,
              borderColor: errors.phone ? "#DC2626" : inputStyle.border,
            }}
            placeholder="3001234567"
            inputMode="numeric"
          />
          {errors.phone && (
            <p className="text-sm mt-1" style={{ color: "#DC2626" }}>{errors.phone}</p>
          )}
        </div>
      </div>
    </form>
  );
}
