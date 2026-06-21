"use client";

import { useTheme } from "../../shared/hooks/useTheme";

export default function SegurosSection() {
  const { theme } = useTheme();
  const seguros = [
    {
      titulo: "Seguro de Vivienda",
      descripcion:
        "Protección completa contra daños por incendio, robo, desastres naturales y responsabilidad civil.",
      icono: "🏠",
    },
    {
      titulo: "Seguro de Arrendamiento",
      descripcion:
        "Cobertura para arrendadores y arrendatarios ante impagos, daños al inmueble y desalojos.",
      icono: "📋",
    },
    {
      titulo: "Seguro de Título",
      descripcion:
        "Garantía jurídica que protege su inversión ante vicios ocultos o problemas de titularidad.",
      icono: "🔒",
    },
  ];

  return (
    <section id="seguros" className="py-20 px-4" style={{ backgroundColor: theme === "dark" ? "var(--background)" : "var(--surface)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span
            className="text-sm font-bold uppercase tracking-widest"
            style={{ color: "var(--primary)" }}
          >
            Protección
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold mt-2"
            style={{ color: "var(--foreground)" }}
          >
            Seguros Inmobiliarios
          </h2>
          <p className="mt-4 max-w-2xl mx-auto" style={{ color: "var(--muted)" }}>
            Protegemos su patrimonio con las mejores coberturas del mercado.
            Trabajamos con las aseguradoras más confiables del país.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {seguros.map((seguro) => (
            <div
              key={seguro.titulo}
              className="rounded-2xl p-8 transition-all hover:shadow-xl hover:-translate-y-1 border"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border-color)",
              }}
            >
              <div className="text-5xl mb-4">{seguro.icono}</div>
              <h3
                className="text-xl font-bold mb-3"
                style={{ color: "var(--foreground)" }}
              >
                {seguro.titulo}
              </h3>
              <p style={{ color: "var(--muted)" }}>{seguro.descripcion}</p>
              <a
                href="https://wa.me/573147448237?text=Hola%2C%20quiero%20información%20sobre%20seguros"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 font-semibold transition-colors hover:opacity-80"
                style={{ color: "var(--primary)" }}
              >
                Solicitar información →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
