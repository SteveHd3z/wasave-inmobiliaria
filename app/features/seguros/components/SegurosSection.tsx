"use client";

import { SectionHeader, Card } from "@shared/components/ui";
import { useTheme } from "@shared/hooks";
import { SEGUROS_DATA, SEGUROS_WHATSAPP_LINK } from "../constants";

export default function SegurosSection() {
  const { theme } = useTheme();

  return (
    <section
      id="seguros"
      className="py-20 px-4"
      style={{
        backgroundColor:
          theme === "dark" ? "var(--background)" : "var(--surface)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          label="Protección"
          title="Seguros Inmobiliarios"
          description="Protegemos su patrimonio con las mejores coberturas del mercado. Trabajamos con las aseguradoras más confiables del país."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SEGUROS_DATA.map((seguro) => (
            <Card key={seguro.titulo} padding="lg">
              <div className="text-5xl mb-4">{seguro.icono}</div>
              <h3
                className="text-xl font-bold mb-3"
                style={{ color: "var(--foreground)" }}
              >
                {seguro.titulo}
              </h3>
              <p style={{ color: "var(--muted)" }}>{seguro.descripcion}</p>
              <a
                href={SEGUROS_WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 font-semibold transition-colors hover:opacity-80"
                style={{ color: "var(--primary)" }}
              >
                Solicitar información →
              </a>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
