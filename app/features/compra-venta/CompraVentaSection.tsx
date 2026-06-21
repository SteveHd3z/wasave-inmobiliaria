"use client";

import { useState } from "react";
import { useTheme } from "../../shared/hooks/useTheme";

type Categoria = "comercial" | "rural" | "urbano";

const propiedades: Record<
  Categoria,
  { titulo: string; precio: string; ubicacion: string; descripcion: string }[]
> = {
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

const categorias: { key: Categoria; label: string }[] = [
  { key: "comercial", label: "Comercial" },
  { key: "rural", label: "Rural" },
  { key: "urbano", label: "Urbano" },
];

export default function CompraVentaSection() {
  const [activeTab, setActiveTab] = useState<Categoria>("urbano");
  const { theme } = useTheme();

  return (
    <section
      id="compra-venta"
      className="py-20 px-4"
      style={{ backgroundColor: theme === "dark" ? "var(--background)" : "var(--surface)" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span
            className="text-sm font-bold uppercase tracking-widest"
            style={{ color: "var(--primary)" }}
          >
            Propiedades
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold mt-2"
            style={{ color: "var(--foreground)" }}
          >
            Compra y Venta
          </h2>
          <p className="mt-4 max-w-2xl mx-auto" style={{ color: "var(--muted)" }}>
            Encuentre la propiedad perfecta. Contamos con un amplio portafolio
            en las categorías comercial, rural y urbana.
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-10">
          {categorias.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveTab(cat.key)}
              className="px-6 py-2 rounded-full font-semibold text-sm transition-all cursor-pointer"
              style={{
                backgroundColor:
                  activeTab === cat.key
                    ? "var(--primary)"
                    : "var(--background)",
                color:
                  activeTab === cat.key ? "white" : "var(--foreground)",
                border: "1px solid var(--border-color)",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {propiedades[activeTab].map((prop) => (
            <div
              key={prop.titulo}
              className="rounded-2xl overflow-hidden border transition-all hover:shadow-xl"
              style={{
                backgroundColor: "var(--background)",
                borderColor: "var(--border-color)",
              }}
            >
              <div
                className="h-48 flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, var(--primary-light), var(--primary))",
                }}
              >
                <span className="text-6xl opacity-50">🏠</span>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3
                    className="text-xl font-bold"
                    style={{ color: "var(--foreground)" }}
                  >
                    {prop.titulo}
                  </h3>
                  <span
                    className="font-bold text-lg whitespace-nowrap ml-4"
                    style={{ color: "var(--primary)" }}
                  >
                    {prop.precio}
                  </span>
                </div>
                <p className="text-sm mb-2" style={{ color: "var(--muted)" }}>
                  📍 {prop.ubicacion}
                </p>
                <p style={{ color: "var(--muted)" }}>{prop.descripcion}</p>
                <a
                  href="https://wa.me/573147448237?text=Hola%2C%20quiero%20información%20sobre%20esta%20propiedad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 px-6 py-2 rounded-full font-semibold text-sm text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: "var(--primary)" }}
                >
                  Consultar
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
