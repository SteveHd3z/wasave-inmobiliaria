"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@shared/utils/supabase";
import { CurrencyInput } from "@shared/components/ui";
import MediaUploader from "./MediaUploader";
import FormSection from "./FormSection";
import { FORM_ID } from "./FormLayout";
import type { Owner } from "@features/owner";
import type { CreatePropertyInput, PropertyMedia } from "@features/properties";
import { PROPERTY_TYPE_OPTIONS } from "@features/properties";

interface PropertyFormProps {
  initialData?: CreatePropertyInput & { property_id?: string };
  existingMedia?: PropertyMedia[];
  onSubmit: (data: CreatePropertyInput, files: File[], coverFile: File | null, removedMediaIds: string[]) => Promise<void>;
  loading?: boolean;
}

interface FormErrors {
  title?: string;
  type?: string;
  owner_id?: string;
  area?: string;
  address?: string;
  base_price?: string;
  sale_price?: string;
  description?: string;
  media?: string;
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
  const [errors, setErrors] = useState<FormErrors>({});

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
      [name]: name === "area" ? (value === "" ? undefined : Number(value)) : value,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCurrencyChange = (name: string, value: number | undefined) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFilesAdd = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
    if (errors.media) {
      setErrors((prev) => ({ ...prev, media: undefined }));
    }
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

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.title?.trim()) {
      newErrors.title = "El titulo es obligatorio";
    }

    if (!form.type?.trim()) {
      newErrors.type = "Seleccione un tipo de propiedad";
    }

    if (!form.owner_id?.trim()) {
      newErrors.owner_id = "Seleccione un propietario";
    }

    if (form.area === undefined || form.area === null || form.area <= 0) {
      newErrors.area = "El area es obligatoria y debe ser mayor a 0";
    }

    if (!form.address?.trim()) {
      newErrors.address = "La direccion es obligatoria";
    }

    if (!form.base_price || form.base_price <= 0) {
      newErrors.base_price = "El precio base es obligatorio y debe ser mayor a 0";
    }

    if (!form.sale_price || form.sale_price <= 0) {
      newErrors.sale_price = "El precio de venta es obligatorio y debe ser mayor a 0";
    }

    if (!form.description?.trim()) {
      newErrors.description = "La descripcion es obligatoria";
    }

    const hasMedia = files.length > 0 || (mediaList.length > 0 && mediaList.length - removedMediaIds.length > 0);
    if (!hasMedia) {
      newErrors.media = "Debe agregar al menos una imagen o video";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!validate()) return;

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
              className="w-full px-4 py-3 rounded-lg outline-none"
              style={{
                ...inputStyle,
                borderColor: errors.title ? "#DC2626" : inputStyle.border,
              }}
              placeholder="Titulo de la propiedad"
            />
            {errors.title && (
              <p className="mt-1 text-sm" style={{ color: "#DC2626" }}>{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>
              Tipo de propiedad <span style={{ color: "#DC2626" }}>*</span>
            </label>
            <select
              name="type"
              value={form.type ?? ""}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg outline-none"
              style={{
                ...inputStyle,
                borderColor: errors.type ? "#DC2626" : inputStyle.border,
              }}
            >
              <option value="">Seleccionar tipo</option>
              {PROPERTY_TYPE_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            {errors.type && (
              <p className="mt-1 text-sm" style={{ color: "#DC2626" }}>{errors.type}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>
              Propietario <span style={{ color: "#DC2626" }}>*</span>
            </label>
            <select
              name="owner_id"
              value={form.owner_id}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg outline-none"
              style={{
                ...inputStyle,
                borderColor: errors.owner_id ? "#DC2626" : inputStyle.border,
              }}
            >
              <option value="">Seleccionar propietario</option>
              {owners.map((o) => (
                <option key={o.owner_id} value={o.owner_id}>
                  {o.name}
                </option>
              ))}
            </select>
            {errors.owner_id && (
              <p className="mt-1 text-sm" style={{ color: "#DC2626" }}>{errors.owner_id}</p>
            )}
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
              Area (m²) <span style={{ color: "#DC2626" }}>*</span>
            </label>
            <input
              name="area"
              type="number"
              value={form.area ?? ""}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg outline-none"
              style={{
                ...inputStyle,
                borderColor: errors.area ? "#DC2626" : inputStyle.border,
              }}
              placeholder="0"
            />
            {errors.area && (
              <p className="mt-1 text-sm" style={{ color: "#DC2626" }}>{errors.area}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>
              Direccion <span style={{ color: "#DC2626" }}>*</span>
            </label>
            <input
              name="address"
              value={form.address ?? ""}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg outline-none"
              style={{
                ...inputStyle,
                borderColor: errors.address ? "#DC2626" : inputStyle.border,
              }}
              placeholder="Direccion de la propiedad"
            />
            {errors.address && (
              <p className="mt-1 text-sm" style={{ color: "#DC2626" }}>{errors.address}</p>
            )}
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
              Precio base <span style={{ color: "#DC2626" }}>*</span>
            </label>
            <CurrencyInput
              name="base_price"
              value={form.base_price}
              onChange={handleCurrencyChange}
              className="w-full"
              style={{
                ...inputStyle,
                borderColor: errors.base_price ? "#DC2626" : inputStyle.border,
              }}
            />
            {errors.base_price && (
              <p className="mt-1 text-sm" style={{ color: "#DC2626" }}>{errors.base_price}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>
              Precio de venta <span style={{ color: "#DC2626" }}>*</span>
            </label>
            <CurrencyInput
              name="sale_price"
              value={form.sale_price}
              onChange={handleCurrencyChange}
              className="w-full"
              style={{
                ...inputStyle,
                borderColor: errors.sale_price ? "#DC2626" : inputStyle.border,
              }}
            />
            {errors.sale_price && (
              <p className="mt-1 text-sm" style={{ color: "#DC2626" }}>{errors.sale_price}</p>
            )}
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Descripcion"
        description="Detalla las caracteristicas y atractivos principales."
      >
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>
            Descripcion <span style={{ color: "#DC2626" }}>*</span>
          </label>
          <textarea
            name="description"
            value={form.description ?? ""}
            onChange={handleChange}
            rows={5}
            className="w-full px-4 py-3 rounded-lg outline-none resize-none"
            style={{
              ...inputStyle,
              borderColor: errors.description ? "#DC2626" : inputStyle.border,
            }}
            placeholder="Descripcion detallada de la propiedad"
          />
          {errors.description && (
            <p className="mt-1 text-sm" style={{ color: "#DC2626" }}>{errors.description}</p>
          )}
        </div>
      </FormSection>

      <FormSection
        title="Multimedia"
        description="Imagenes y videos de la propiedad. Marca una como portada."
      >
        <div>
          <MediaUploader
            files={files}
            existingMedia={mediaList}
            onFilesAdd={handleFilesAdd}
            onRemoveNew={handleRemoveNew}
            onRemoveExisting={handleRemoveExisting}
            onSetCover={handleSetCover}
            coverSource={coverSource}
          />
          {errors.media && (
            <p className="mt-2 text-sm" style={{ color: "#DC2626" }}>{errors.media}</p>
          )}
        </div>
      </FormSection>
    </form>
  );
}
