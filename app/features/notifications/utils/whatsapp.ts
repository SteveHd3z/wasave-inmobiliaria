import type { NotificationData } from "../types";

export function generateWhatsAppMessage(data: NotificationData): string {
  const { appointment, client, action } = data;
  const clientName = `${client.name} ${client.last_name || ""}`.trim();
  const visitDate = new Date(appointment.visit_date).toLocaleDateString("es-CO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  switch (action) {
    case "created":
      return [
        `¡Hola ${clientName}!`,
        "",
        "Tu cita ha sido agendada exitosamente:",
        `📅 Fecha: ${visitDate}`,
        `📋 Estado: Pendiente`,
        "",
        "Te esperamos. Si necesitas reprogramar o cancelar, contáctanos.",
        "",
        "Saludos,",
        "Wasave Inmobiliaria",
      ].join("\n");

    case "updated":
      return [
        `¡Hola ${clientName}!`,
        "",
        "Tu cita ha sido actualizada:",
        `📅 Nueva fecha: ${visitDate}`,
        "",
        "Si tienes alguna duda, contáctanos.",
        "",
        "Saludos,",
        "Wasave Inmobiliaria",
      ].join("\n");

    case "cancelled":
      return [
        `¡Hola ${clientName}!`,
        "",
        "Tu cita ha sido cancelada.",
        "",
        "Si deseas reagendar, contáctanos para ayudarte.",
        "",
        "Saludos,",
        "Wasave Inmobiliaria",
      ].join("\n");

    case "reminder":
      return [
        `¡Hola ${clientName}!`,
        "",
        "Te recordamos tu cita programada:",
        `📅 Fecha: ${visitDate}`,
        "",
        "Te esperamos. Si necesitas reprogramar, avísanos con anticipación.",
        "",
        "Saludos,",
        "Wasave Inmobiliaria",
      ].join("\n");

    default:
      return `Hola ${clientName}, tenemos una actualización sobre tu cita. Contáctanos para más información.`;
  }
}

export function getWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = phone.replace(/\D/g, "");
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}
