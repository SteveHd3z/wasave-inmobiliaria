"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@shared/utils/supabase";
import { ClientForm, FormLayout, FormSection } from "@features/admin";
import type { CreateClientInput } from "@features/client";

export default function NuevoClientePage() {
  const supabase = createBrowserClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: CreateClientInput) => {
    setLoading(true);

    const { error } = await supabase.from("client").insert({
      name: data.name,
      last_name: data.last_name || null,
      document_id: data.document_id || null,
      email: data.email || null,
      phone: data.phone || null,
    });

    if (error) {
      alert("Error al crear el cliente");
      setLoading(false);
      return;
    }

    router.push("/admin/clientes");
  };

  return (
    <FormLayout
      title="Nuevo Cliente"
      subtitle="Registra un nuevo cliente en el sistema."
      backHref="/admin/clientes"
      backLabel="Volver a clientes"
      cancelHref="/admin/clientes"
      loading={loading}
      submitLabel="Guardar cliente"
      maxWidth="sm"
    >
      <FormSection
        title="Datos del cliente"
        description="Informacion basica de contacto e identificacion."
      >
        <ClientForm onSubmit={handleSubmit} loading={loading} />
      </FormSection>
    </FormLayout>
  );
}
