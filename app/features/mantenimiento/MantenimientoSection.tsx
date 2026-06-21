"use client";

import { useTheme } from "../../shared/hooks/useTheme";

export default function MantenimientoSection() {
  const { theme } = useTheme();
  const servicios = [
    {
      titulo: "Mantenimiento Preventivo",
      descripcion:
        "Inspecciones periódicas de sistemas eléctricos, hidráulicos, estructurales y de climatización para prevenir averías.",
      icono: "🔧",
    },
    {
      titulo: "Mantenimiento Correctivo",
      descripcion:
        "Reparación de averías en plomería, electricidad, pintura, carpintería y acabados generales.",
      icono: "🛠️",
    },
    {
      titulo: "Remodelación",
      descripcion:
        "Proyectos de renovación de espacios interiores y exteriores, ampliaciones y modernización de inmuebles.",
      icono: "🏗️",
    },
    {
      titulo: "Jardinería y Aseo",
      descripcion:
        "Mantenimiento de áreas verdes, limpieza profesional de fachadas, pisos y áreas comunes.",
      icono: "🌿",
    },
  ];

  return (
    <section id="mantenimiento" className="py-20 px-4" style={{ backgroundColor: theme === "dark" ? "var(--background)" : "var(--surface)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span
            className="text-sm font-bold uppercase tracking-widest"
            style={{ color: "var(--primary)" }}
          >
            Servicios
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold mt-2"
            style={{ color: "var(--foreground)" }}
          >
            Mantenimiento
          </h2>
          <p className="mt-4 max-w-2xl mx-auto" style={{ color: "var(--muted)" }}>
            Mantenga su propiedad en óptimas condiciones con nuestro equipo de
            profesionales calificados. Servicio garantizado.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicios.map((servicio) => (
            <div
              key={servicio.titulo}
              className="rounded-2xl p-6 text-center transition-all hover:shadow-xl hover:-translate-y-1 border"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border-color)",
              }}
            >
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
          ))}
        </div>
      </div>
    </section>
  );
}
