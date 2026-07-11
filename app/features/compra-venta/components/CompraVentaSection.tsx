"use client";

import Image from "next/image";
import { SectionHeader } from "@shared/components/ui";
import { useTheme } from "@shared/hooks";
import { PROPIEDADES_RESIDENCIALES, COMPRA_VENTA_WHATSAPP_LINK } from "../constants";

export default function CompraVentaSection() {
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
          label="Residencial"
          title="Compra y Venta"
          description="Descubra nuestra oferta de propiedades residenciales: lotes, casa fincas y cabañas en las mejores zonas."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PROPIEDADES_RESIDENCIALES.map((prop) => (
            <div
              key={prop.titulo}
              className="group rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border-color)",
              }}
            >
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={prop.imagen}
                  alt={prop.titulo}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)",
                  }}
                />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3
                    className="text-2xl font-bold text-white drop-shadow-lg"
                  >
                    {prop.titulo}
                  </h3>
                </div>
              </div>

              <div className="p-6">
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                  {prop.descripcion}
                </p>

                <a
                  href={COMPRA_VENTA_WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 hover:gap-3 hover:opacity-90"
                  style={{ backgroundColor: "var(--primary)", color: "#ffffff" }}
                >
                  Consultar disponibilidad
                  <span className="text-lg">→</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
