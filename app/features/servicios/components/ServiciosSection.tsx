"use client";

import { SectionHeader, Card } from "@shared/components/ui";
import { useTheme } from "@shared/hooks";
import { SERVICIOS_DATA } from "../constants";

export default function ServiciosSection() {
  const { theme } = useTheme();

  return (
    <section
      id="servicios"
      className="py-20 px-4"
      style={{
        backgroundColor:
          theme === "dark" ? "var(--background)" : "var(--surface)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          label="Servicios"
          title="Servicios Inmobiliarios"
          description="Ofrecemos servicios especializados para la gestión y administración de su propiedad con total transparencia y profesionalismo."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {SERVICIOS_DATA.map((servicio) => (
            <Card key={servicio.titulo} padding="lg">
              <div className="flex gap-4">
                <div className="text-4xl flex-shrink-0">{servicio.icono}</div>
                <div>
                  <h3
                    className="text-xl font-bold mb-2"
                    style={{ color: "var(--foreground)" }}
                  >
                    {servicio.titulo}
                  </h3>
                  <p style={{ color: "var(--muted)" }}>{servicio.descripcion}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
