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

        <div className="grid grid-cols-1 gap-8 w-full mx-auto">
          {SEGUROS_DATA.map((seguro) => (
            <Card key={seguro.titulo} padding="lg" hover={false}>
              <div className="flex items-center gap-4 mb-6">
                <div className="text-5xl">{seguro.icono}</div>
                <div>
                  <h3
                    className="text-2xl font-bold"
                    style={{ color: "var(--foreground)" }}
                  >
                    {seguro.titulo}
                  </h3>
                  <p className="mt-1" style={{ color: "var(--muted)" }}>
                    {seguro.descripcion}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {seguro.coberturas.map((cobertura) => (
                  <Card
                    key={cobertura.titulo}
                    padding="sm"
                    hover={false}
                    className="flex items-center gap-3"
                  >
                    <span className="text-2xl">{cobertura.icono}</span>
                    <div>
                      <p
                        className="font-semibold text-sm"
                        style={{ color: "var(--foreground)" }}
                      >
                        {cobertura.titulo}
                      </p>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: "var(--muted)" }}
                      >
                        {cobertura.descripcion}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>

              <a
                href={SEGUROS_WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block font-semibold transition-colors hover:opacity-80"
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
