"use client";

import { SectionHeader, Card } from "@shared/components/ui";
import { useTheme } from "@shared/hooks";
import { MANTENIMIENTO_DATA } from "../constants";

export default function MantenimientoSection() {
  const { theme } = useTheme();

  return (
    <section
      id="mantenimiento"
      className="py-20 px-4"
      style={{
        backgroundColor:
          theme === "dark" ? "var(--background)" : "var(--surface)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          label="Servicios"
          title="Mantenimiento"
          description="Mantenga su propiedad en óptimas condiciones con nuestro equipo de profesionales calificados. Servicio garantizado."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MANTENIMIENTO_DATA.map((servicio) => (
            <Card key={servicio.titulo} padding="md">
              <div className="text-center">
                <div className="text-5xl mb-4">{servicio.icono}</div>
                <h3
                  className="text-lg font-bold mb-2"
                  style={{ color: "var(--foreground)" }}
                >
                  {servicio.titulo}
                </h3>
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  {servicio.descripcion}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
