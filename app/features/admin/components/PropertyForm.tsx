"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@shared/utils/supabase";
import MediaUploader from "./MediaUploader";
import FormSection from "./FormSection";
import { FORM_ID } from "./FormLayout";
import type { Owner } from "@features/owner";
import type { CreatePropertyInput, PropertyMedia } from "@features/properties";

interface PropertyFormProps {
  initialData?: CreatePropertyInput & { property_id?: string };
  existingMedia?: PropertyMedia[];
  onSubmit: (data: CreatePropertyInput, files: File[], coverFile: File | null, removedMediaIds: string[]) => Promise<void>;
  loading?: boolean;
}

export default function PropertyForm({
  initialData,
  existingMedia = [],
  onSubmit,
  loading = false,
}: PropertyFormProps) {
  const supabase = createBrowserClient();
  const [owners, setOwners] = useState<Owner[]>([]);
  const [form, setForm] = useState<CreatePropertyInput>(
    initialData ?? {
      title: "",
      description: "",
      area: undefined,
      base_price: undefined,
      sale_price: undefined,
      address: "",
      type: "",
      owner_id: "",
    }
  );
  const [files, setFiles] = useState<File[]>([]);
  const [removedMediaIds, setRemovedMediaIds] = useState<string[]>([]);
  const [coverSource, setCoverSource] = useState<
    { type: "existing"; id: string } | { type: "new"; index: number } | null
  >(null);
  const [mediaList, setMediaList] = useState(existingMedia);

  useEffect(() => {
    supabase
      .from("owner")
      .select("*")
      .order("name")
      .then(({ data }) => {
        if (data) setOwners(data as Owner[]);
      });
  }, [supabase]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "area" || name === "base_price" || name === "sale_price"
          ? value === ""
            ? undefined
            : Number(value)
          : value,
    }));
  };

  const handleFilesAdd = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveNew = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    if (coverSource?.type === "new") {
      if (coverSource.index === index) setCoverSource(null);
      else if (coverSource.index > index)
        setCoverSource({ type: "new", index: coverSource.index - 1 });
    }
  };

  const handleRemoveExisting = (mediaId: string) => {
    setMediaList((prev) => prev.filter((m) => m.media_id !== mediaId));
    setRemovedMediaIds((prev) => [...prev, mediaId]);
    if (coverSource?.type === "existing" && coverSource.id === mediaId) {
      setCoverSource(null);
    }
  };

  const handleSetCover = (
    mediaId: string | null,
    index: number | null | undefined
  ) => {
    if (mediaId) setCoverSource({ type: "existing", id: mediaId });
    else if (index !== null && index !== undefined)
      setCoverSource({ type: "new", index });
    else setCoverSource(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    const coverFile =
      coverSource?.type === "new" ? files[coverSource.index] : null;
    await onSubmit(form, files, coverFile, removedMediaIds);
  };

  const inputStyle = {
    backgroundColor: "var(--background)",
    border: "1px solid var(--border-color)",
    color: "var(--foreground)",
  };

  return (
    <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-6">
      <FormSection
        title="Informacion principal"
        description="Datos basicos que identifican la propiedad."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>
              Titulo <span style={{ color: "#DC2626" }}>*</span>
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg outline-none"
              style={inputStyle}
              placeholder="Titulo de la propiedad"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>
              Tipo de propiedad
            </label>
            <select
              name="type"
              value={form.type ?? ""}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg outline-none"
              style={inputStyle}
            >
              <option value="">Seleccionar tipo</option>
              <option value="apartamento">Apartamento</option>
              <option value="casa">Casa</option>
              <option value="local">Local comercial</option>
              <option value="oficina">Oficina</option>
              <option value="lote">Lote</option>
              <option value="bodega">Bodega</option>
              <option value="finca">Finca</option>
              <option value="cabana">Cabaña</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>
              Propietario <span style={{ color: "#DC2626" }}>*</span>
            </label>
            <select
              name="owner_id"
              value={form.owner_id}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg outline-none"
              style={inputStyle}
            >
              <option value="">Seleccionar propietario</option>
              {owners.map((o) => (
                <option key={o.owner_id} value={o.owner_id}>
                  {o.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Ubicacion y dimensiones"
        description="Direccion fisica y tamano de la propiedad."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>
              Area (m²)
            </label>
            <input
              name="area"
              type="number"
              value={form.area ?? ""}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg outline-none"
              style={inputStyle}
              placeholder="0"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>
              Direccion
            </label>
            <input
              name="address"
              value={form.address ?? ""}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg outline-none"
              style={inputStyle}
              placeholder="Direccion de la propiedad"
            />
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Precios"
        description="Valores de referencia para la propiedad."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>
              Precio base
            </label>
            <input
              name="base_price"
              type="number"
              value={form.base_price ?? ""}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg outline-none"
              style={inputStyle}
              placeholder="0"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>
              Precio de venta
            </label>
            <input
              name="sale_price"
              type="number"
              value={form.sale_price ?? ""}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg outline-none"
              style={inputStyle}
              placeholder="0"
              min="0"
            />
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Descripcion"
        description="Detalla las caracteristicas y atractivos principales."
      >
        <textarea
          name="description"
          value={form.description ?? ""}
          onChange={handleChange}
          rows={5}
          className="w-full px-4 py-3 rounded-lg outline-none resize-none"
          style={inputStyle}
          placeholder="Descripcion detallada de la propiedad"
        />
      </FormSection>

      <FormSection
        title="Multimedia"
        description="Imagenes y videos de la propiedad. Marca una como portada."
      >
        <MediaUploader
          files={files}
          existingMedia={mediaList}
          onFilesAdd={handleFilesAdd}
          onRemoveNew={handleRemoveNew}
          onRemoveExisting={handleRemoveExisting}
          onSetCover={handleSetCover}
          coverSource={coverSource}
        />
      </FormSection>
    </form>
  );
}
