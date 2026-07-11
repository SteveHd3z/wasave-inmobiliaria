import { Seguro } from "../types";
import { WHATSAPP_LINK } from "@shared/constants";

export const SEGUROS_DATA: Seguro[] = [
  {
    titulo: "Seguro de Vivienda",
    descripcion:
      "Protección completa para su hogar con las mejores coberturas del mercado.",
    icono: "🏠",
    coberturas: [
      {
        titulo: "Daños Estructurales",
        descripcion: "Protección ante daños en paredes, techos, columnas y cimientos.",
        icono: "🏗️",
      },
      {
        titulo: "Incendio",
        descripcion: "Cobertura total contra daños por fuego.",
        icono: "🔥",
      },
      {
        titulo: "Inundaciones",
        descripcion: "Respaldo ante daños por lluvias torrenciales y desbordes.",
        icono: "🌊",
      },
      {
        titulo: "Daños Eléctricos",
        descripcion: "Protección contra cortocircuitos, sobrecargas y daños en instalaciones eléctricas.",
        icono: "⚡",
      },
      {
        titulo: "Plomería",
        descripcion: "Cobertura para fugas, roturas de tuberías y daños por agua.",
        icono: "🔧",
      },
    ],
  },
];

export const SEGUROS_WHATSAPP_LINK = `${WHATSAPP_LINK}?text=${encodeURIComponent("Hola, quiero información sobre seguros")}`;
