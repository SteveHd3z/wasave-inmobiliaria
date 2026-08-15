"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createBrowserClient } from "@shared/utils/supabase";
import { OwnerForm, FormLayout, FormSection } from "@features/admin";
import type { CreateOwnerInput, Owner } from "@features/owner";

export default function EditarOwnerPage() {
  const supabase = createBrowserClient();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [owner, setOwner] = useState<Owner | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchOwner() {
      const { data } = await supabase
        .from("owner")
        .select("*")
        .eq("owner_id", id)
        .single();

      if (data) setOwner(data as unknown as Owner);
      setLoading(false);
    }

    fetchOwner();
  }, [id, supabase]);

  const handleSubmit = async (data: CreateOwnerInput) => {
    setSaving(true);

    const { error } = await supabase
      .from("owner")
      .update({
        name: data.name,
        document_id: data.document_id || null,
        email: data.email || null,
        phone: data.phone || null,
      })
      .eq("owner_id", id);

    if (error) {
      alert("Error al actualizar el propietario");
      setSaving(false);
      return;
    }

    router.push("/admin/owners");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div
          className="animate-spin rounded-full h-8 w-8 border-b-2"
          style={{ borderColor: "var(--primary)" }}
        />
      </div>
    );
  }

  if (!owner) {
    return (
      <div className="text-center py-12">
        <p style={{ color: "var(--muted)" }}>Propietario no encontrado</p>
      </div>
    );
  }

  return (
    <FormLayout
      title="Editar Propietario"
      subtitle={`Modificando: ${owner.name}`}
      backHref="/admin/owners"
      backLabel="Volver a propietarios"
      cancelHref="/admin/owners"
      loading={saving}
      submitLabel="Guardar cambios"
      maxWidth="sm"
    >
      <FormSection
        title="Datos del propietario"
        description="Informacion basica de contacto e identificacion."
      >
        <OwnerForm
          initialData={{
            name: owner.name,
            document_id: owner.document_id ?? undefined,
            email: owner.email ?? undefined,
            phone: owner.phone ?? undefined,
          }}
          onSubmit={handleSubmit}
          loading={saving}
        />
      </FormSection>
    </FormLayout>
  );
}
