"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@shared/utils/supabase";
import { Button } from "@shared/components/ui";
import MediaUploader from "./MediaUploader";
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>
            Titulo *
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
            Tipo
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
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>
            Owner *
          </label>
          <select
            name="owner_id"
            value={form.owner_id}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg outline-none"
            style={inputStyle}
          >
            <option value="">Seleccionar owner</option>
            {owners.map((o) => (
              <option key={o.owner_id} value={o.owner_id}>
                {o.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>
            Area (m2)
          </label>
          <input
            name="area"
            type="number"
            value={form.area ?? ""}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg outline-none"
            style={inputStyle}
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>
            Precio Base
          </label>
          <input
            name="base_price"
            type="number"
            value={form.base_price ?? ""}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg outline-none"
            style={inputStyle}
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>
            Precio Venta
          </label>
          <input
            name="sale_price"
            type="number"
            value={form.sale_price ?? ""}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg outline-none"
            style={inputStyle}
            placeholder="0"
          />
        </div>

        <div className="md:col-span-2">
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

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>
            Descripcion
          </label>
          <textarea
            name="description"
            value={form.description ?? ""}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 rounded-lg outline-none resize-none"
            style={inputStyle}
            placeholder="Descripcion de la propiedad"
          />
        </div>
      </div>

      <MediaUploader
        files={files}
        existingMedia={mediaList}
        onFilesAdd={handleFilesAdd}
        onRemoveNew={handleRemoveNew}
        onRemoveExisting={handleRemoveExisting}
        onSetCover={handleSetCover}
        coverSource={coverSource}
      />

      <div className="flex justify-end gap-3">
        <Button type="submit" size="lg" disabled={loading}>
          {loading ? "Guardando..." : "Guardar propiedad"}
        </Button>
      </div>
    </form>
  );
}
