import { WHATSAPP_LINK, WHATSAPP_MESSAGE_DEFAULT } from "../constants";

export { createBrowserClient } from "./supabase";
export {
  parseAppointmentDate,
  appointmentToDatetimeLocal,
  datetimeLocalToISO,
  formatAppointmentDateTime,
} from "./date";

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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): string | undefined {
  if (!email.trim()) return undefined;
  if (!EMAIL_REGEX.test(email)) return "Ingresa un correo valido";
  return undefined;
}

const PHONE_REGEX = /^\d+$/;

export function validatePhone(phone: string): string | undefined {
  if (!phone.trim()) return undefined;
  if (!PHONE_REGEX.test(phone.replace(/\s/g, ""))) return "El telefono solo debe contener numeros";
  return undefined;
}

export function formatPhoneInput(value: string): string {
  return value.replace(/\D/g, "");
}

const ALLOWED_MEDIA_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/webm",
];

const MB = 1024 * 1024;

// El limite por archivo (50 MB) debe coincidir con "File size limit" del bucket
// property-media y con el limite global de Supabase (Storage > Settings).
// El resto son limites de negocio: ajustelos aqui si cambian las necesidades.
export const MEDIA_LIMITS = {
  maxFileSize: 50 * MB,
  maxFiles: 20,
  maxVideos: 5,
  maxBatchSize: 200 * MB,
} as const;

const MAX_FILE_SIZE = MEDIA_LIMITS.maxFileSize;

export function isVideoUrl(url: string): boolean {
  return /\.(mp4|webm)(\?.*)?$/i.test(url);
}

export function formatFileSize(bytes: number): string {
  if (bytes >= MB) return `${(bytes / MB).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/**
 * Valida los archivos que se intentan agregar contra tipo, tamano y cantidad.
 * `existingUrls` son los archivos que la propiedad ya conserva (para contar el total).
 * Devuelve los archivos aceptados y un mensaje por cada rechazo.
 */
export function validateMediaSelection(
  newFiles: File[],
  currentNewFiles: File[],
  existingUrls: string[]
): { accepted: File[]; errors: string[] } {
  const accepted: File[] = [];
  const errors: string[] = [];

  let count = existingUrls.length + currentNewFiles.length;
  let videos =
    existingUrls.filter(isVideoUrl).length +
    currentNewFiles.filter((f) => f.type.startsWith("video/")).length;
  let batchSize = currentNewFiles.reduce((sum, f) => sum + f.size, 0);

  for (const file of newFiles) {
    const single = validateMediaFile(file);
    if (!single.valid) {
      errors.push(single.error!);
      continue;
    }
    if (count >= MEDIA_LIMITS.maxFiles) {
      errors.push(`"${file.name}" no se agrego: maximo ${MEDIA_LIMITS.maxFiles} archivos por propiedad.`);
      continue;
    }
    const isVideo = file.type.startsWith("video/");
    if (isVideo && videos >= MEDIA_LIMITS.maxVideos) {
      errors.push(`"${file.name}" no se agrego: maximo ${MEDIA_LIMITS.maxVideos} videos por propiedad.`);
      continue;
    }
    if (batchSize + file.size > MEDIA_LIMITS.maxBatchSize) {
      errors.push(
        `"${file.name}" no se agrego: los archivos nuevos no pueden superar ${MEDIA_LIMITS.maxBatchSize / MB} MB por guardado. Guarde y luego agregue mas.`
      );
      continue;
    }
    accepted.push(file);
    count++;
    if (isVideo) videos++;
    batchSize += file.size;
  }

  return { accepted, errors };
}

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
