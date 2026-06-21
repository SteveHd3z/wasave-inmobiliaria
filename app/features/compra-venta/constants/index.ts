import { CategoriaPropiedad, CategoriaTab, Propiedad } from "../types";
import { WHATSAPP_LINK } from "@shared/constants";

export const CATEGORIAS_TABS: CategoriaTab[] = [
  { key: "comercial", label: "Comercial" },
  { key: "rural", label: "Rural" },
  { key: "urbano", label: "Urbano" },
];

export const PROPIEDADES_DATA: Record<CategoriaPropiedad, Propiedad[]> = {
  comercial: [
    {
      titulo: "Local Comercial Zona Centro",
      precio: "$350.000.000",
      ubicacion: "Centro Histórico, Cali",
      descripcion:
        "Local de 80m² en zona de alto tráfico peatonal. Ideal para restaurante o tienda.",
    },
    {
      titulo: "Oficina Torre Empresarial",
      precio: "$280.000.000",
      ubicacion: "Granada, Cali",
      descripcion:
        "Oficina de 60m² con vista panorámica, parqueadero y sala de juntas.",
    },
  ],
  rural: [
    {
      titulo: "Finca Productiva",
      precio: "$650.000.000",
      ubicacion: "Jamundí, Valle del Cauca",
      descripcion:
        "Finca de 5 hectáreas con casa habitación, bodega y cultivo de café.",
    },
    {
      titulo: "Terreno Agrícola",
      precio: "$180.000.000",
      ubicacion: "Candelaria, Valle del Cauca",
      descripcion:
        "Terreno de 3 hectáreas con acceso a agua y vía principal pavimentada.",
    },
  ],
  urbano: [
    {
      titulo: "Apartamento Moderno",
      precio: "$420.000.000",
      ubicacion: "Ciudad Jardín, Cali",
      descripcion:
        "Apartamento de 3 habitaciones, 2 baños, 95m² con balcón y zona social.",
    },
    {
      titulo: "Casa Campestre",
      precio: "$780.000.000",
      ubicacion: "Pance, Cali",
      descripcion:
        "Casa de 250m² con piscina, zona BBQ, 4 habitaciones y jardín amplio.",
    },
  ],
};

export const COMPRA_VENTA_WHATSAPP_LINK = `${WHATSAPP_LINK}?text=${encodeURIComponent("Hola, quiero información sobre esta propiedad")}`;
