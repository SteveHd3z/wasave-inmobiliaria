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

    const { data: media, error: mediaQueryError } = await supabase
      .from("property_media")
      .select("file_url")
      .eq("property_id", deleteId);

    if (mediaQueryError) {
      console.error("Error al consultar las imagenes de la propiedad:", mediaQueryError);
      alert("No se pudo eliminar la propiedad");
      setDeleting(false);
      return;
    }

    const storagePaths = (media ?? [])
      .map(({ file_url }) => {
        const marker = "/storage/v1/object/public/property-media/";
        const markerIndex = file_url.indexOf(marker);
        return markerIndex === -1
          ? null
          : decodeURIComponent(file_url.slice(markerIndex + marker.length));
      })
      .filter((path): path is string => path !== null);

    if (storagePaths.length > 0) {
      const { error: storageError } = await supabase.storage
        .from("property-media")
        .remove(storagePaths);

      if (storageError) {
        console.error("Error al eliminar imagenes del storage:", storageError);
      }
    }

    const { error: mediaDeleteError } = await supabase
      .from("property_media")
      .delete()
      .eq("property_id", deleteId);

    const { error: clientsDeleteError } = await supabase
      .from("property_client")
      .delete()
      .eq("property_id", deleteId);

    if (mediaDeleteError || clientsDeleteError) {
      console.error("Error al eliminar relaciones de la propiedad:", {
        mediaDeleteError,
        clientsDeleteError,
      });
      alert("No se pudo eliminar completamente la propiedad");
      setDeleting(false);
      return;
    }

    const { error: propertyDeleteError } = await supabase
      .from("property")
      .delete()
      .eq("property_id", deleteId);

    if (propertyDeleteError) {
      console.error("Error al eliminar la propiedad:", propertyDeleteError);
      alert("No se pudo eliminar la propiedad");
      setDeleting(false);
      return;
    }

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
        {[
          { value: "", label: "Todos" },
          { value: "casa", label: "Casa Fincas" },
          { value: "lote", label: "Lotes" },
          { value: "cabana", label: "Cabañas" },
        ].map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
            style={{
              backgroundColor: filter === value ? "var(--primary)" : "var(--surface)",
              color: filter === value ? "white" : "var(--foreground)",
              border: "1px solid var(--border-color)",
            }}
          >
            {label}
          </button>
        ))}
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
