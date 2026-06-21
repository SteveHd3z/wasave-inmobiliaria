"use client";

import { useState } from "react";
import { SectionHeader } from "@shared/components/ui";
import { useTheme } from "@shared/hooks";
import { CategoriaPropiedad } from "../types";
import { CATEGORIAS_TABS, PROPIEDADES_DATA, COMPRA_VENTA_WHATSAPP_LINK } from "../constants";

export default function CompraVentaSection() {
  const [activeTab, setActiveTab] = useState<CategoriaPropiedad>("urbano");
  const { theme } = useTheme();

  return (
    <section
      id="compra-venta"
      className="py-20 px-4"
      style={{
        backgroundColor:
          theme === "dark" ? "var(--background)" : "var(--surface)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          label="Propiedades"
          title="Compra y Venta"
          description="Encuentre la propiedad perfecta. Contamos con un amplio portafolio en las categorías comercial, rural y urbana."
        />

        <div className="flex justify-center gap-2 mb-10">
          {CATEGORIAS_TABS.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveTab(cat.key)}
              className="px-6 py-2 rounded-full font-semibold text-sm transition-all cursor-pointer"
              style={{
                backgroundColor:
                  activeTab === cat.key
                    ? "var(--primary)"
                    : "var(--background)",
                color: activeTab === cat.key ? "white" : "var(--foreground)",
                border: "1px solid var(--border-color)",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PROPIEDADES_DATA[activeTab].map((prop) => (
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
                  href={COMPRA_VENTA_WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 px-6 py-2 rounded-full font-semibold text-sm transition-all hover:opacity-90"
                  style={{ backgroundColor: "var(--primary)", color: "#ffffff" }}
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
