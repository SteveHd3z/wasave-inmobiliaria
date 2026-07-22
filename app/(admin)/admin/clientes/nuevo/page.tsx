"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@shared/utils/supabase";
import { ClientForm } from "@features/admin";
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
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
        Nuevo Cliente
      </h1>
      <ClientForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}
