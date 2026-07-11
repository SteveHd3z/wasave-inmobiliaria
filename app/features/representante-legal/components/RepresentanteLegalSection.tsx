"use client";

import { useState } from "react";
import Image from "next/image";
import { SectionHeader } from "@shared/components/ui";
import { useTheme } from "@shared/hooks";
import { CONTACT_INFO } from "@shared/constants";
import { REPRESENTANTE_DATA } from "../constants";

export default function RepresentanteLegalSection() {
  const [showLicencia, setShowLicencia] = useState(false);
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
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
            <div className="relative w-40 h-52 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg"
              style={{
                border: "3px solid var(--primary)",
              }}
            >
              <Image
                src={REPRESENTANTE_DATA.imagen}
                alt={REPRESENTANTE_DATA.nombre}
                fill
                className="object-contain"
              />
            </div>

            <div className="text-center md:text-left flex-1">
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

              <div className="space-y-2 leading-relaxed" style={{ color: "var(--muted)" }}>
                {REPRESENTANTE_DATA.biografia.map((parrafo, idx) => (
                  <p key={idx}>{parrafo}</p>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
                <a
                  href={`tel:${CONTACT_INFO.phoneLink}`}
                  className="px-6 py-2.5 rounded-full font-semibold text-sm transition-all hover:opacity-90"
                  style={{ backgroundColor: "var(--primary)", color: "#ffffff" }}
                >
                  📞 {CONTACT_INFO.phone}
                </a>
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="px-6 py-2.5 rounded-full font-semibold text-sm border transition-all hover:opacity-80"
                  style={{
                    borderColor: "var(--primary)",
                    color: "var(--primary)",
                  }}
                >
                  ✉️ Enviar Email
                </a>
                <button
                  onClick={() => setShowLicencia(true)}
                  className="px-6 py-2.5 rounded-full font-semibold text-sm border transition-all hover:opacity-80 cursor-pointer"
                  style={{
                    borderColor: "var(--primary)",
                    color: "var(--primary)",
                  }}
                >
                  📜 Ver Licencia
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showLicencia && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={() => setShowLicencia(false)}
          style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
        >
          <div
            className="relative w-full max-w-5xl max-h-[95vh] rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: "var(--background)" }}
          >
            <button
              onClick={() => setShowLicencia(false)}
              className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full flex items-center justify-center text-white text-xl font-bold cursor-pointer hover:opacity-80 transition-opacity"
              style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
            >
              ✕
            </button>
            <div className="relative w-full h-[90vh]">
              <Image
                src={REPRESENTANTE_DATA.licencia}
                alt="Licencia profesional"
                fill
                className="object-contain p-6"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
