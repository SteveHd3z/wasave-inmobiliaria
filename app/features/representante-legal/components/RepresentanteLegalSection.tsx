"use client";

import { SectionHeader } from "@shared/components/ui";
import { useTheme } from "@shared/hooks";
import { CONTACT_INFO } from "@shared/constants";
import { REPRESENTANTE_DATA } from "../constants";

export default function RepresentanteLegalSection() {
  const { theme } = useTheme();

  return (
    <section
      id="representante"
      className="py-20 px-4"
      style={{
        backgroundColor:
          theme === "dark" ? "var(--background)" : "var(--surface)",
      }}
    >
      <div className="max-w-4xl mx-auto">
        <SectionHeader label="Nosotros" title="Representante Legal" />

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
              <span className="text-6xl text-white font-bold">
                {REPRESENTANTE_DATA.iniciales}
              </span>
            </div>

            <div className="text-center md:text-left">
              <h3
                className="text-2xl font-bold mb-1"
                style={{ color: "var(--foreground)" }}
              >
                {REPRESENTANTE_DATA.nombre}
              </h3>
              <p
                className="font-semibold mb-4"
                style={{ color: "var(--primary)" }}
              >
                {REPRESENTANTE_DATA.cargo}
              </p>

              <div className="space-y-2" style={{ color: "var(--muted)" }}>
                {REPRESENTANTE_DATA.biografia.map((parrafo, idx) => (
                  <p key={idx}>{parrafo}</p>
                ))}
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <a
                  href={`tel:${CONTACT_INFO.phoneLink}`}
                  className="px-6 py-2 rounded-full font-semibold text-sm border transition-all hover:opacity-80"
                  style={{
                    borderColor: "var(--primary)",
                    color: "var(--primary)",
                  }}
                >
                  📞 {CONTACT_INFO.phone}
                </a>
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
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
