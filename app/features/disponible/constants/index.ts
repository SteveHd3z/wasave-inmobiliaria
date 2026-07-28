import { WHATSAPP_LINK } from "@shared/constants";

export type DisponibleMediaType = "image" | "video";

export interface DisponibleMedia {
  src: string;
  type: DisponibleMediaType;
  alt: string;
}

export interface Disponible {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  whatsappMessage: string;
  media: DisponibleMedia[];
}

const wa = (text: string) =>
  `${WHATSAPP_LINK}?text=${encodeURIComponent(text)}`;

export const DISPONIBLES: Disponible[] = [
  {
    id: "lote-aldea",
    title: "Lote La Aldea",
    subtitle: "Corregimiento San Sebastián de Palmitas, vereda la Volcana",
    description:
      "Excelente oportunidad! Lote de 24000 metros cuadrados en el Corregimiento San Sebastián de Palmitas, vereda la Volcana",
    whatsappMessage:
      "Hola, estoy interesado en el lote disponible en la Aldea",
    media: [
      {
        src: "/images/lote-aldea/WhatsApp Image 2026-07-21 at 18.11.54.jpeg",
        type: "image",
        alt: "Lote La Aldea - imagen 1",
      },
      {
        src: "/images/lote-aldea/WhatsApp Image 2026-07-21 at 18.11.55.jpeg",
        type: "image",
        alt: "Lote La Aldea - imagen 2",
      },
      {
        src: "/images/lote-aldea/WhatsApp Image 2026-07-21 at 18.11.55 (1).jpeg",
        type: "image",
        alt: "Lote La Aldea - imagen 3",
      },
    ],
  },
  {
    id: "casa-finca-llano-aguirre",
    title: "Casa Finca Vereda Llano de Aguirre",
    subtitle: "San Jerónimo",
    description:
      "Casa finca en la vereda Llano de Aguirre, municipio de San Jerónimo. Rodeada de naturaleza, ideal para descanso en familia.",
    whatsappMessage:
      "Hola, estoy interesado en la casa finca de la vereda Llano de Aguirre, San Jerónimo",
    media: [
      {
        src: "/images/lote-llano/WhatsApp Image 2026-07-26 at 17.58.08.jpeg",
        type: "image",
        alt: "Casa Finca Llano de Aguirre - imagen 1",
      },
      {
        src: "/images/lote-llano/WhatsApp Image 2026-07-26 at 17.58.09.jpeg",
        type: "image",
        alt: "Casa Finca Llano de Aguirre - imagen 2",
      },
      {
        src: "/images/lote-llano/WhatsApp Image 2026-07-26 at 17.58.09 (1).jpeg",
        type: "image",
        alt: "Casa Finca Llano de Aguirre - imagen 3",
      },
      {
        src: "/images/lote-llano/WhatsApp Video 2026-07-26 at 17.58.09.mp4",
        type: "video",
        alt: "Casa Finca Llano de Aguirre - video",
      },
    ],
  },
];

export const getWhatsappLink = (message: string) => wa(message);
