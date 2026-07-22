"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { createBrowserClient } from "@shared/utils/supabase";
import { OwnerList, ConfirmDialog } from "@features/admin";
import { Button } from "@shared/components/ui";
import type { Owner } from "@features/owner";

export default function OwnersPage() {
  const supabase = createBrowserClient();
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadOwners = useCallback(async () => {
    const { data } = await supabase.from("owner").select("*").order("name");
    setOwners((data as unknown as Owner[]) ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    let ignore = false;

    async function fetchOwners() {
      const { data } = await supabase.from("owner").select("*").order("name");

      if (!ignore) {
        setOwners((data as unknown as Owner[]) ?? []);
        setLoading(false);
      }
    }

    fetchOwners();

    return () => {
      ignore = true;
    };
  }, [supabase]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);

    const { count } = await supabase
      .from("property")
      .select("*", { count: "exact", head: true })
      .eq("owner_id", deleteId);

    if (count && count > 0) {
      alert("No se puede eliminar este propietario porque tiene propiedades asociadas.");
      setDeleteId(null);
      setDeleting(false);
      return;
    }

    await supabase.from("owner").delete().eq("owner_id", deleteId);
    setDeleteId(null);
    setDeleting(false);
    loadOwners();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
          Propietarios
        </h1>
        <Link href="/admin/owners/nuevo">
          <Button>Nuevo Propietario</Button>
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
        <OwnerList owners={owners} onDelete={setDeleteId} />
      )}

      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Eliminar propietario"
        message="Esta accion eliminara el propietario permanentemente. No se puede deshacer."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  );
}
