"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@shared/utils/supabase";
import { validateMediaFiles } from "@shared/utils";
import { PropertyForm, FormLayout } from "@features/admin";
import type { CreatePropertyInput } from "@features/properties";

export default function NuevaPropiedadPage() {
  const supabase = createBrowserClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
      alert("Error al crear la propiedad");
      setLoading(false);
      return;
    }

    const propertyId = (property as { property_id: string }).property_id;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.name.split(".").pop();
      const path = `${propertyId}/${Date.now()}-${i}.${ext}`;

      const { data: uploadData } = await supabase.storage
        .from("property-media")
        .upload(path, file, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadData) {
        const {
          data: { publicUrl },
        } = supabase.storage.from("property-media").getPublicUrl(uploadData.path);

        const isCover = coverFile === file;
        await supabase.from("property_media").insert({
          file_url: publicUrl,
          cover_image: isCover,
          display_order: i,
          property_id: propertyId,
        });
      }
    }

    router.push("/admin/propiedades");
  };

  return (
    <FormLayout
      title="Nueva Propiedad"
      subtitle="Publica una nueva propiedad con sus detalles y multimedia."
      backHref="/admin/propiedades"
      backLabel="Volver a propiedades"
      cancelHref="/admin/propiedades"
      loading={loading}
      submitLabel="Guardar propiedad"
      maxWidth="xl"
    >
      <PropertyForm onSubmit={handleSubmit} loading={loading} />
    </FormLayout>
  );
}
