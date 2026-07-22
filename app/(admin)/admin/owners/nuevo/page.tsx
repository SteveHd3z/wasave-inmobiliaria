"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@shared/utils/supabase";
import { OwnerForm } from "@features/admin";
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
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
        Nuevo Propietario
      </h1>
      <OwnerForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}
