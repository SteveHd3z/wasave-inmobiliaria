"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@shared/utils/supabase";
import { OwnerForm, FormLayout, FormSection } from "@features/admin";
import type { CreateOwnerInput } from "@features/owner";

export default function NuevoOwnerPage() {
  const supabase = createBrowserClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: CreateOwnerInput) => {
    setLoading(true);

    const { error } = await supabase.from("owner").insert({
      name: data.name,
      document_id: data.document_id || null,
      email: data.email || null,
      phone: data.phone || null,
    });

    if (error) {
      alert("Error al crear el propietario");
      setLoading(false);
      return;
    }

    router.push("/admin/owners");
  };

  return (
    <FormLayout
      title="Nuevo Propietario"
      subtitle="Registra un nuevo propietario en el sistema."
      backHref="/admin/owners"
      backLabel="Volver a propietarios"
      cancelHref="/admin/owners"
      loading={loading}
      submitLabel="Guardar propietario"
      maxWidth="sm"
    >
      <FormSection
        title="Datos del propietario"
        description="Informacion basica de contacto e identificacion."
      >
        <OwnerForm onSubmit={handleSubmit} loading={loading} />
      </FormSection>
    </FormLayout>
  );
}
