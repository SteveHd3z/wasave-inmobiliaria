"use client";

import { SectionHeader, Card } from "@shared/components/ui";
import { useTheme } from "@shared/hooks";
import { TRAMITES_DATA } from "../constants";

export default function TramitesLegalesSection() {
  const { theme } = useTheme();

  return (
    <section
      id="tramites"
      className="py-20 px-4"
      style={{
        backgroundColor:
          theme === "dark" ? "var(--background)" : "var(--surface)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          label="Legal"
          title="Trámites Legales"
          description="Equipo jurídico especializado en derecho inmobiliario. Nos encargamos de todos los procesos legales para su tranquilidad."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {TRAMITES_DATA.map((tramite) => (
            <Card key={tramite.titulo} padding="lg">
              <div className="flex gap-4">
                <div className="text-4xl flex-shrink-0">{tramite.icono}</div>
                <div>
                  <h3
                    className="text-xl font-bold mb-2"
                    style={{ color: "var(--foreground)" }}
                  >
                    {tramite.titulo}
                  </h3>
                  <p style={{ color: "var(--muted)" }}>{tramite.descripcion}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
