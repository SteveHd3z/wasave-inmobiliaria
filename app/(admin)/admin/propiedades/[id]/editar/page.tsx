"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createBrowserClient } from "@shared/utils/supabase";
import { validateMediaFiles } from "@shared/utils";
import { PropertyForm, FormLayout } from "@features/admin";
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
    removedMediaIds: string[]
  ) => {
    setSaving(true);

    const mediaValidation = validateMediaFiles(files);
    if (!mediaValidation.valid) {
      alert(mediaValidation.error);
      setSaving(false);
      return;
    }

    await supabase
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

    if (removedMediaIds.length > 0) {
      await supabase
        .from("property_media")
        .delete()
        .in("media_id", removedMediaIds);
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.name.split(".").pop();
      const path = `${id}/${Date.now()}-${i}.${ext}`;

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
          display_order: media.length + i,
          property_id: id,
        });
      }
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
  );
}
