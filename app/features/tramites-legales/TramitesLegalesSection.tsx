"use client";

import { useTheme } from "../../shared/hooks/useTheme";

export default function TramitesLegalesSection() {
  const { theme } = useTheme();
  const tramites = [
    {
      titulo: "Escrituración",
      descripcion:
        "Elaboración y revisión de escrituras públicas, protocolización ante notaría y registro en la Oficina de Instrumentos Públicos.",
      icono: "📜",
    },
    {
      titulo: "Certificados de Libertad y Tradición",
      descripcion:
        "Consulta y obtención de certificados actualizados para verificar el estado jurídico de cualquier inmueble.",
      icono: "🔍",
    },
    {
      titulo: "Sucesiones y Adjudicaciones",
      descripcion:
        "Trámites de sucesión intestada o testamentaria, adjudicaciones y partición de bienes inmuebles.",
      icono: "⚖️",
    },
    {
      titulo: "Regularización de Propiedades",
      descripcion:
        "Procesos de saneamiento, desenglobe, segregación y unificación de predios ante entidades públicas.",
      icono: "📐",
    },
  ];

  return (
    <section id="tramites" className="py-20 px-4" style={{ backgroundColor: theme === "dark" ? "var(--background)" : "var(--surface)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span
            className="text-sm font-bold uppercase tracking-widest"
            style={{ color: "var(--primary)" }}
          >
            Legal
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold mt-2"
            style={{ color: "var(--foreground)" }}
          >
            Trámites Legales
          </h2>
          <p className="mt-4 max-w-2xl mx-auto" style={{ color: "var(--muted)" }}>
            Equipo jurídico especializado en derecho inmobiliario. Nos encargamos
            de todos los procesos legales para su tranquilidad.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {tramites.map((tramite) => (
            <div
              key={tramite.titulo}
              className="rounded-2xl p-8 transition-all hover:shadow-xl border flex gap-4"
              style={{
                backgroundColor: "var(--background)",
                borderColor: "var(--border-color)",
              }}
            >
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
          ))}
        </div>
      </div>
    </section>
  );
}
