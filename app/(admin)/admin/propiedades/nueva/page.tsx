"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@shared/utils/supabase";
import { validateMediaFiles } from "@shared/utils";
import {
  PropertyForm,
  FormLayout,
  UploadProgressOverlay,
  uploadPropertyMedia,
  type SaveProgress,
} from "@features/admin";
import type { CreatePropertyInput } from "@features/properties";

export default function NuevaPropiedadPage() {
  const supabase = createBrowserClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<SaveProgress | null>(null);

  const handleSubmit = async (
    data: CreatePropertyInput,
    files: File[],
    coverFile: File | null
  ) => {
    setLoading(true);

    const mediaValidation = validateMediaFiles(files);
    if (!mediaValidation.valid) {
      alert(mediaValidation.error);
      setLoading(false);
      return;
    }

    setProgress({ phase: "saving", percent: 0, current: 0, total: files.length, fileName: "" });

    const { data: property, error } = await supabase
      .from("property")
      .insert({
        title: data.title,
        description: data.description || null,
        area: data.area || null,
        base_price: data.base_price || null,
        sale_price: data.sale_price || null,
        address: data.address || null,
        type: data.type || null,
        owner_id: data.owner_id,
      })
      .select()
      .single();

    if (error || !property) {
      console.error("Error al crear propiedad:", error);
      setProgress(null);
      alert("Error al crear la propiedad");
      setLoading(false);
      return;
    }

    const propertyId = (property as { property_id: string }).property_id;

    const uploadErrors = await uploadPropertyMedia({
      supabase,
      propertyId,
      files,
      coverFile,
      startOrder: 0,
      onProgress: (p) => setProgress({ phase: "uploading", ...p }),
    });

    setProgress({ phase: "finishing", percent: 100, current: files.length, total: files.length, fileName: "" });

    if (uploadErrors > 0) {
      alert(`Propiedad creada, pero hubo errores al subir ${uploadErrors} archivo(s). Revisa la consola para más detalles.`);
    }

    router.push("/admin/propiedades");
  };

  return (
    <>
      <FormLayout
        title="Nueva Propiedad"
        subtitle="Publica una nueva propiedad con sus detalles y multimedia."
        backHref="/admin/propiedades"
        backLabel="Volver a propiedades"
        cancelHref="/admin/propiedades"
        loading={loading}
        submitLabel="Publicar propiedad"
        maxWidth="xl"
      >
        <PropertyForm onSubmit={handleSubmit} loading={loading} />
      </FormLayout>
      <UploadProgressOverlay progress={progress} />
    </>
  );
}
