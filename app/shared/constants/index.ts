import { ContactInfo, NavItem } from "../types";

export const CONTACT_INFO: ContactInfo = {
  name: "Walter Salazar",
  phone: "314 744 8237",
  email: "wasaveinmobiliaria@gmail.com",
  phoneLink: "+573147448237",
};

export const WHATSAPP_LINK = `https://wa.me/${CONTACT_INFO.phoneLink.replace("+", "")}`;

export const WHATSAPP_MESSAGE_DEFAULT =
  "Hola, quiero más información sobre sus servicios";

export const NAV_ITEMS: NavItem[] = [
  { label: "Inicio", href: "#inicio" },
  { label: "Seguros", href: "#seguros" },
  { label: "Servicios", href: "#servicios" },
  { label: "Mantenimiento", href: "#mantenimiento" },
  { label: "Compra y Venta", href: "#compra-venta" },
  { label: "Representante", href: "#representante" },
];

export const COMPANY_NAME = "Wasave Inmobiliaria";
export const COMPANY_TAGLINE = "Soluciones inmobiliarias integrales";
