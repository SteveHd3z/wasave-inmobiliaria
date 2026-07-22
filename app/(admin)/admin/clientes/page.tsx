"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { createBrowserClient } from "@shared/utils/supabase";
import { ClientList, ConfirmDialog } from "@features/admin";
import { Button } from "@shared/components/ui";
import type { Client } from "@features/client";

export default function ClientesPage() {
  const supabase = createBrowserClient();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadClients = useCallback(async () => {
    const { data } = await supabase.from("client").select("*").order("name");
    setClients((data as unknown as Client[]) ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    let ignore = false;

    async function fetchClients() {
      const { data } = await supabase.from("client").select("*").order("name");

      if (!ignore) {
        setClients((data as unknown as Client[]) ?? []);
        setLoading(false);
      }
    }

    fetchClients();

    return () => {
      ignore = true;
    };
  }, [supabase]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);

    const { count: appointmentCount } = await supabase
      .from("appointment")
      .select("*", { count: "exact", head: true })
      .eq("client_id", deleteId);

    if (appointmentCount && appointmentCount > 0) {
      alert("No se puede eliminar este cliente porque tiene citas asociadas.");
      setDeleteId(null);
      setDeleting(false);
      return;
    }

    await supabase.from("property_client").delete().eq("client_id", deleteId);
    await supabase.from("client").delete().eq("client_id", deleteId);
    setDeleteId(null);
    setDeleting(false);
    loadClients();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
          Clientes
        </h1>
        <Link href="/admin/clientes/nuevo">
          <Button>Nuevo Cliente</Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div
            className="animate-spin rounded-full h-8 w-8 border-b-2"
            style={{ borderColor: "var(--primary)" }}
          />
        </div>
      ) : (
        <ClientList clients={clients} onDelete={setDeleteId} />
      )}

      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Eliminar cliente"
        message="Esta accion eliminara el cliente permanentemente. No se puede deshacer."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  );
}
