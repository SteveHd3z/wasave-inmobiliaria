"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { createBrowserClient } from "@shared/utils/supabase";
import { PropertyList, ConfirmDialog } from "@features/admin";
import { Button } from "@shared/components/ui";
import type { PropertyWithMedia } from "@features/properties";

export default function PropiedadesPage() {
  const supabase = createBrowserClient();
  const [properties, setProperties] = useState<PropertyWithMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadProperties = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("property")
      .select("*, owner:owner_id(*), media:property_media(*)")
      .order("title");

    if (filter) {
      query = query.eq("type", filter);
    }

    const { data } = await query;
    setProperties((data as unknown as PropertyWithMedia[]) ?? []);
    setLoading(false);
  }, [supabase, filter]);

  useEffect(() => {
    let ignore = false;

    async function fetchProperties() {
      let query = supabase
        .from("property")
        .select("*, owner:owner_id(*), media:property_media(*)")
        .order("title");

      if (filter) {
        query = query.eq("type", filter);
      }

      const { data } = await query;

      if (!ignore) {
        setProperties((data as unknown as PropertyWithMedia[]) ?? []);
        setLoading(false);
      }
    }

    fetchProperties();

    return () => {
      ignore = true;
    };
  }, [supabase, filter]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    await supabase.from("property_media").delete().eq("property_id", deleteId);
    await supabase.from("property").delete().eq("property_id", deleteId);
    setDeleteId(null);
    setDeleting(false);
    loadProperties();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
          Propiedades
        </h1>
        <Link href="/admin/propiedades/nueva">
          <Button>Nueva Propiedad</Button>
        </Link>
      </div>

      <div className="flex gap-3 flex-wrap">
        {["", "apartamento", "casa", "local", "oficina", "lote", "bodega", "finca"].map(
          (type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              style={{
                backgroundColor: filter === type ? "var(--primary)" : "var(--surface)",
                color: filter === type ? "white" : "var(--foreground)",
                border: "1px solid var(--border-color)",
              }}
            >
              {type === "" ? "Todos" : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          )
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div
            className="animate-spin rounded-full h-8 w-8 border-b-2"
            style={{ borderColor: "var(--primary)" }}
          />
        </div>
      ) : (
        <PropertyList properties={properties} onDelete={setDeleteId} />
      )}

      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Eliminar propiedad"
        message="Esta accion eliminara la propiedad y toda su media asociada. No se puede deshacer."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  );
}
