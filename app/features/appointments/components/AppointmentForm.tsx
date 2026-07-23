"use client";

import { useState } from "react";

export interface AppointmentFormData {
  name: string;
  last_name: string;
  document_id: string;
  phone: string;
  email: string;
  visit_date: string;
  observations: string;
}

interface AppointmentFormProps {
  onSubmit: (data: AppointmentFormData) => Promise<void>;
  loading?: boolean;
}

const initialData: AppointmentFormData = {
  name: "",
  last_name: "",
  document_id: "",
  phone: "",
  email: "",
  visit_date: "",
  observations: "",
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[\d\s+\-()]{7,20}$/;

export default function AppointmentForm({ onSubmit, loading = false }: AppointmentFormProps) {
  const [form, setForm] = useState<AppointmentFormData>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof AppointmentFormData, string>>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof AppointmentFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof AppointmentFormData, string>> = {};

    if (!form.name.trim()) newErrors.name = "El nombre es requerido";
    if (!form.last_name.trim()) newErrors.last_name = "El apellido es requerido";
    if (!form.document_id.trim()) newErrors.document_id = "El documento es requerido";
    if (!form.phone.trim()) {
      newErrors.phone = "El telefono es requerido";
    } else if (!phoneRegex.test(form.phone)) {
      newErrors.phone = "Telefono invalido";
    }
    if (!form.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Email invalido";
    }
    if (!form.visit_date) {
      newErrors.visit_date = "La fecha es requerida";
    } else {
      const visitDate = new Date(form.visit_date);
      if (visitDate < new Date()) {
        newErrors.visit_date = "La fecha debe ser futura";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(form);
  };

  const inputStyle = {
    backgroundColor: "var(--background)",
    border: "1px solid var(--border-color)",
    color: "var(--foreground)",
  };

  const errorStyle = {
    backgroundColor: "var(--background)",
    border: "1px solid #FECACA",
    color: "var(--foreground)",
  };

  const renderField = (
    name: keyof AppointmentFormData,
    label: string,
    type: string = "text",
    placeholder: string = "",
    required: boolean = true
  ) => {
    const hasError = !!errors[name];
    return (
      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: "var(--foreground)" }}
        >
          {label}{required ? " *" : ""}
        </label>
        <input
          name={name}
          type={type}
          value={form[name]}
          onChange={handleChange}
          required={required}
          className="w-full px-4 py-3 rounded-lg outline-none"
          style={hasError ? errorStyle : inputStyle}
          placeholder={placeholder}
        />
        {hasError && (
          <p className="text-xs mt-1" style={{ color: "#DC2626" }}>
            {errors[name]}
          </p>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {renderField("name", "Nombre", "text", "Tu nombre")}
        {renderField("last_name", "Apellido", "text", "Tu apellido")}
        {renderField("document_id", "Documento", "text", "Cedula")}
        {renderField("phone", "Telefono", "tel", "300 123 4567")}
        {renderField("email", "Email", "email", "correo@ejemplo.com")}
        {renderField("visit_date", "Fecha y hora", "datetime-local", "", true)}
      </div>

      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: "var(--foreground)" }}
        >
          Observaciones (opcional)
        </label>
        <textarea
          name="observations"
          value={form.observations}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-3 rounded-lg outline-none resize-none"
          style={inputStyle}
          placeholder="Detalles adicionales sobre la cita..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full px-8 py-3 text-base rounded-full font-semibold transition-all hover:opacity-90 disabled:opacity-50"
        style={{
          backgroundColor: "var(--primary)",
          color: "white",
          border: "none",
        }}
      >
        {loading ? "Agendando..." : "Agendar Cita"}
      </button>
    </form>
  );
}
