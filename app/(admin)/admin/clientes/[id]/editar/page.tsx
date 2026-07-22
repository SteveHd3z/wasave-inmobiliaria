"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createBrowserClient } from "@shared/utils/supabase";
import { ClientForm } from "@features/admin";
import type { CreateClientInput, Client } from "@features/client";

export default function EditarClientePage() {
  const supabase = createBrowserClient();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchClient() {
      const { data } = await supabase
        .from("client")
        .select("*")
        .eq("client_id", id)
        .single();

      if (data) setClient(data as unknown as Client);
      setLoading(false);
    }

    fetchClient();
  }, [id, supabase]);

  const handleSubmit = async (data: CreateClientInput) => {
    setSaving(true);

    const { error } = await supabase
      .from("client")
      .update({
        name: data.name,
        last_name: data.last_name || null,
        document_id: data.document_id || null,
        email: data.email || null,
        phone: data.phone || null,
      })
      .eq("client_id", id);

    if (error) {
      alert("Error al actualizar el cliente");
      setSaving(false);
      return;
    }

    router.push("/admin/clientes");
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

  if (!client) {
    return (
      <div className="text-center py-12">
        <p style={{ color: "var(--muted)" }}>Cliente no encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
        Editar Cliente
      </h1>
      <ClientForm
        initialData={{
          name: client.name,
          last_name: client.last_name ?? undefined,
          document_id: client.document_id ?? undefined,
          email: client.email ?? undefined,
          phone: client.phone ?? undefined,
        }}
        onSubmit={handleSubmit}
        loading={saving}
      />
    </div>
  );
}
