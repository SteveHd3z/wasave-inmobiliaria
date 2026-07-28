import { WHATSAPP_LINK, WHATSAPP_MESSAGE_DEFAULT } from "../constants";

export { createBrowserClient } from "./supabase";

export function getWhatsappLink(message?: string): string {
  const encodedMessage = encodeURIComponent(message || WHATSAPP_MESSAGE_DEFAULT);
  return `${WHATSAPP_LINK}?text=${encodedMessage}`;
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

const copFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatCop(value: number | null | undefined): string {
  if (value === null || value === undefined) return "-";
  return copFormatter.format(value);
}

export function parseCopInput(value: string): number | undefined {
  const digits = value.replace(/\D/g, "");
  if (digits === "") return undefined;
  return Number(digits);
}

const ALLOWED_MEDIA_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/webm",
];

const MAX_FILE_SIZE = 50 * 1024 * 1024;

export function validateMediaFile(file: File): { valid: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `El archivo "${file.name}" excede el tamano maximo de 50MB.` };
  }

  if (!ALLOWED_MEDIA_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Tipo de archivo no permitido: ${file.type || "desconocido"}. Solo se permiten imagenes (JPEG, PNG, WebP) y videos (MP4, WebM).`,
    };
  }

  return { valid: true };
}

export function validateMediaFiles(files: File[]): { valid: boolean; error?: string } {
  for (const file of files) {
    const result = validateMediaFile(file);
    if (!result.valid) return result;
  }
  return { valid: true };
}
