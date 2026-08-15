const TIMESTAMP_TZ_REGEX = /Z$|[+-]\d{2}:?\d{2}$/;

export function parseAppointmentDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const normalized = TIMESTAMP_TZ_REGEX.test(value) ? value : `${value}Z`;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function appointmentToDatetimeLocal(value: string | null | undefined): string {
  const date = parseAppointmentDate(value);
  if (!date) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function datetimeLocalToISO(value: string): string {
  return new Date(value).toISOString();
}

export function formatAppointmentDateTime(
  value: string | null | undefined,
  locale: string = "es-CO"
): string {
  const date = parseAppointmentDate(value);
  if (!date) return "-";
  return date.toLocaleString(locale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
