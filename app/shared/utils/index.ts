import { WHATSAPP_LINK, WHATSAPP_MESSAGE_DEFAULT } from "../constants";

export { createBrowserClient } from "./supabase";

export function getWhatsappLink(message?: string): string {
  const encodedMessage = encodeURIComponent(message || WHATSAPP_MESSAGE_DEFAULT);
  return `${WHATSAPP_LINK}?text=${encodedMessage}`;
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
