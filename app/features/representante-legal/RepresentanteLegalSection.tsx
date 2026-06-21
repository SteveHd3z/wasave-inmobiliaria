"use client";

import { useTheme } from "../../shared/hooks/useTheme";

export default function RepresentanteLegalSection() {
  const { theme } = useTheme();
  return (
    <section id="representante" className="py-20 px-4" style={{ backgroundColor: theme === "dark" ? "var(--background)" : "var(--surface)" }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span
            className="text-sm font-bold uppercase tracking-widest"
            style={{ color: "var(--primary)" }}
          >
            Nosotros
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold mt-2"
            style={{ color: "var(--foreground)" }}
          >
            Representante Legal
          </h2>
        </div>

        <div
          className="rounded-2xl p-8 md:p-12 border"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border-color)",
          }}
        >
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div
              className="w-40 h-40 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, var(--primary), var(--primary-dark))",
              }}
            >
              <span className="text-6xl text-white font-bold">WS</span>
            </div>

            <div className="text-center md:text-left">
              <h3
                className="text-2xl font-bold mb-1"
                style={{ color: "var(--foreground)" }}
              >
                Walter Salazar
              </h3>
              <p
                className="font-semibold mb-4"
                style={{ color: "var(--primary)" }}
              >
                Representante Legal - Wasave Inmobiliaria
              </p>

              <div className="space-y-2" style={{ color: "var(--muted)" }}>
                <p>
                  Profesional en administración de empresas con especialización
                  en bienes raíces y derecho inmobiliario. Cuenta con más de 15
                  años de experiencia en el sector inmobiliario del suroccidente
                  colombiano.
                </p>
                <p>
                  Bajo su liderazgo, Wasave Inmobiliaria se ha consolidado como
                  una empresa confiable y transparente, brindando soluciones
                  integrales a familias y empresas en la región.
                </p>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <a
                  href="tel:+573147448237"
                  className="px-6 py-2 rounded-full font-semibold text-sm border transition-all hover:opacity-80"
                  style={{
                    borderColor: "var(--primary)",
                    color: "var(--primary)",
                  }}
                >
                  📞 314 744 8237
                </a>
                <a
                  href="mailto:wasaveinmobiliaria@gmail.com"
                  className="px-6 py-2 rounded-full font-semibold text-sm border transition-all hover:opacity-80"
                  style={{
                    borderColor: "var(--primary)",
                    color: "var(--primary)",
                  }}
                >
                  ✉️ Enviar Email
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
