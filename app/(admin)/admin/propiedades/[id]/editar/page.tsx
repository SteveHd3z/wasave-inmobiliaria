"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createBrowserClient } from "@shared/utils/supabase";
import { validateMediaFiles } from "@shared/utils";
import {
  PropertyForm,
  FormLayout,
  UploadProgressOverlay,
  uploadPropertyMedia,
  type SaveProgress,
} from "@features/admin";
import type { CreatePropertyInput, PropertyMedia } from "@features/properties";

interface PropertyRow {
  property_id: string;
  title: string;
  description: string | null;
  area: number | null;
  base_price: number | null;
  sale_price: number | null;
  address: string | null;
  type: string | null;
  owner_id: string;
}

export default function EditarPropiedadPage() {
  const supabase = createBrowserClient();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [property, setProperty] = useState<PropertyRow | null>(null);
  const [media, setMedia] = useState<PropertyMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState<SaveProgress | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      const { data: prop } = await supabase
        .from("property")
        .select("*")
        .eq("property_id", id)
        .single();

      const { data: mediaData } = await supabase
        .from("property_media")
        .select("*")
        .eq("property_id", id)
        .order("display_order");

      if (prop) setProperty(prop as unknown as PropertyRow);
      if (mediaData) setMedia(mediaData as unknown as PropertyMedia[]);
      setLoading(false);
    };

    fetchProperty();
  }, [id, supabase]);

  const handleSubmit = async (
    data: CreatePropertyInput,
    files: File[],
    coverFile: File | null,
    removedMediaIds: string[],
    coverMediaId: string | null
  ) => {
    setSaving(true);

    const mediaValidation = validateMediaFiles(files);
    if (!mediaValidation.valid) {
      alert(mediaValidation.error);
      setSaving(false);
      return;
    }

    setProgress({ phase: "saving", percent: 0, current: 0, total: files.length, fileName: "" });

    const { error: updateError } = await supabase
      .from("property")
      .update({
        title: data.title,
        description: data.description || null,
        area: data.area || null,
        base_price: data.base_price || null,
        sale_price: data.sale_price || null,
        address: data.address || null,
        type: data.type || null,
        owner_id: data.owner_id,
      })
      .eq("property_id", id);

    if (updateError) {
      console.error("Error al actualizar propiedad:", updateError);
      setProgress(null);
      alert("Error al guardar los cambios de la propiedad");
      setSaving(false);
      return;
    }

    if (removedMediaIds.length > 0) {
      const { error: deleteError } = await supabase
        .from("property_media")
        .delete()
        .in("media_id", removedMediaIds);

      if (deleteError) {
        console.error("Error al eliminar medios:", deleteError);
        alert("Error al eliminar algunos archivos multimedia");
      }
    }

    // Una sola portada por propiedad: se limpia la anterior antes de marcar la nueva.
    if (coverMediaId || coverFile) {
      const { error: resetError } = await supabase
        .from("property_media")
        .update({ cover_image: false })
        .eq("property_id", id);

      if (resetError) {
        console.error("Error al limpiar portada anterior:", resetError);
        setProgress(null);
        alert("No se pudo actualizar la portada");
        setSaving(false);
        return;
      }

      if (coverMediaId) {
        const { error: coverError } = await supabase
          .from("property_media")
          .update({ cover_image: true })
          .eq("media_id", coverMediaId);

        if (coverError) {
          console.error("Error al definir portada:", coverError);
          setProgress(null);
          alert("No se pudo actualizar la portada");
          setSaving(false);
          return;
        }
      }
    }

    const remainingMedia = media.filter((m) => !removedMediaIds.includes(m.media_id));
    const nextOrder =
      Math.max(-1, ...remainingMedia.map((m) => m.display_order ?? 0)) + 1;
    const uploadErrors = await uploadPropertyMedia({
      supabase,
      propertyId: id,
      files,
      coverFile,
      startOrder: nextOrder,
      onProgress: (p) => setProgress({ phase: "uploading", ...p }),
    });

    setProgress({ phase: "finishing", percent: 100, current: files.length, total: files.length, fileName: "" });

    if (uploadErrors > 0) {
      alert(`Cambios guardados, pero hubo errores al subir ${uploadErrors} archivo(s). Revisa la consola para más detalles.`);
    }

    router.push("/admin/propiedades");
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

  if (!property) {
    return (
      <div className="text-center py-12">
        <p style={{ color: "var(--muted)" }}>Propiedad no encontrada</p>
      </div>
    );
  }

  return (
    <>
    <FormLayout
      title="Editar Propiedad"
      subtitle={`Modificando: ${property.title}`}
      backHref="/admin/propiedades"
      backLabel="Volver a propiedades"
      cancelHref="/admin/propiedades"
      loading={saving}
      submitLabel="Guardar cambios"
      maxWidth="xl"
    >
      <PropertyForm
        initialData={{
          title: property.title,
          description: property.description ?? undefined,
          area: property.area ?? undefined,
          base_price: property.base_price ?? undefined,
          sale_price: property.sale_price ?? undefined,
          address: property.address ?? undefined,
          type: property.type ?? undefined,
          owner_id: property.owner_id,
          property_id: property.property_id,
        }}
        existingMedia={media}
        onSubmit={handleSubmit}
        loading={saving}
      />
    </FormLayout>
    <UploadProgressOverlay progress={progress} />
    </>
  );
}
