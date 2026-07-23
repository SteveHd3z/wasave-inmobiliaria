import { Propiedad } from "../types";
import { WHATSAPP_LINK } from "@shared/constants";

export const PROPIEDADES_RESIDENCIALES: Propiedad[] = [
  {
    titulo: "Lotes",
    descripcion: "Terrenos urbanos y suburbanos ideales para construir su vivienda o proyecto inmobiliario.",
    icono: "🏗️",
    imagen: "/images/lote.jpg",
    slug: "lote",
  },
  {
    titulo: "Casa Fincas",
    descripcion: "Propiedades campestres con zonas verdes, perfectas para descanso y recreación.",
    icono: "🏡",
    imagen: "/images/casafinca.jpg",
    slug: "casa",
  },
  {
    titulo: "Cabañas",
    descripcion: "Acogedoras cabañas en entornos naturales, ideales para invertir o disfrutar en familia.",
    icono: "🪵",
    imagen: "/images/cabañas.jpg",
    slug: "cabana",
  },
];

export const COMPRA_VENTA_WHATSAPP_LINK = `${WHATSAPP_LINK}?text=${encodeURIComponent("Hola, quiero información sobre propiedades residenciales")}`;
