import { Seguro } from "../types";
import { WHATSAPP_LINK } from "@shared/constants";

export const SEGUROS_DATA: Seguro[] = [
  {
    titulo: "Seguro de Vivienda",
    descripcion:
      "Protección completa contra daños por incendio, robo, desastres naturales y responsabilidad civil.",
    icono: "🏠",
  },
  {
    titulo: "Seguro de Arrendamiento",
    descripcion:
      "Cobertura para arrendadores y arrendatarios ante impagos, daños al inmueble y desalojos.",
    icono: "📋",
  },
  {
    titulo: "Seguro de Título",
    descripcion:
      "Garantía jurídica que protege su inversión ante vicios ocultos o problemas de titularidad.",
    icono: "🔒",
  },
];

export const SEGUROS_WHATSAPP_LINK = `${WHATSAPP_LINK}?text=${encodeURIComponent("Hola, quiero información sobre seguros")}`;
