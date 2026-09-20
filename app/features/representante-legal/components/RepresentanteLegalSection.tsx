"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "@shared/hooks";
import { CONTACT_INFO } from "@shared/constants";
import { REPRESENTANTE_DATA } from "../constants";

const CARROUSEL_IMAGES = [
  "/images/chicago.jpg",
  "/images/carrousel-img/chicago1.jpg",
  "/images/carrousel-img/libertad.jpg",
  "/images/carrousel-img/medellin.jpg",
];
const CARROUSEL_INTERVAL_MS = 10000;

export default function RepresentanteLegalSection() {
  const [showLicencia, setShowLicencia] = useState(false);
  const [current, setCurrent] = useState(0);
  const { theme } = useTheme();

  useEffect(() => {
    const timer = setInterval(
      () => setCurrent((prev) => (prev + 1) % CARROUSEL_IMAGES.length),
      CARROUSEL_INTERVAL_MS
    );
    return () => clearInterval(timer);
  }, [current]);

  return (
    <section
      id="representante"
      className="relative overflow-hidden min-h-[640px] md:min-h-[720px] flex items-end justify-center md:justify-end px-4 py-10 md:px-10 md:pt-14 md:pb-4"
      style={{ backgroundColor: "var(--background)" }}
    >
      <div className="absolute inset-0 z-0" aria-hidden="true">
        {CARROUSEL_IMAGES.map((src, idx) => (
          <div
            key={src}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{ opacity: idx === current ? 1 : 0 }}
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="100vw"
              className="object-cover blur-2xl scale-110"
            />
            <Image
              src={src}
              alt=""
              fill
              sizes="100vw"
              priority={idx === 0}
              className="object-contain"
            />
          </div>
        ))}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top left, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0.05) 100%)",
          }}
        />
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 md:left-10 md:translate-x-0 z-10 flex gap-2">
        {CARROUSEL_IMAGES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            aria-label={`Ir a la imagen ${idx + 1}`}
            className="h-2 rounded-full transition-all duration-300 cursor-pointer"
            style={{
              width: idx === current ? 28 : 8,
              backgroundColor:
                idx === current ? "var(--primary)" : "rgba(255,255,255,0.6)",
            }}
          />
        ))}
      </div>

      <div
        className="relative z-10 w-full max-w-3xl rounded-2xl p-6 md:p-8 border shadow-2xl backdrop-blur-md mb-8 md:mb-0"
        style={{
          backgroundColor:
            theme === "dark" ? "rgba(17,17,17,0.82)" : "rgba(255,255,255,0.88)",
          borderColor: "var(--border-color)",
        }}
      >
        <p
          className="text-xs font-semibold uppercase tracking-[0.2em] mb-4"
          style={{ color: "var(--primary)" }}
        >
          Nosotros · Representante Legal
        </p>

        <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-center sm:items-start">
          <div
            className="relative w-28 h-36 rounded-xl overflow-hidden shrink-0 shadow-lg"
            style={{ border: "3px solid var(--primary)" }}
          >
            <Image
              src={REPRESENTANTE_DATA.imagen}
              alt={REPRESENTANTE_DATA.nombre}
              fill
              className="object-contain"
            />
          </div>

          <div className="text-center sm:text-left flex-1">
            <h3
              className="text-xl md:text-2xl font-bold mb-1"
              style={{ color: "var(--foreground)" }}
            >
              {REPRESENTANTE_DATA.nombre}
            </h3>
            <p
              className="font-semibold mb-3"
              style={{ color: "var(--primary)" }}
            >
              {REPRESENTANTE_DATA.cargo}
            </p>

            <div
              className="space-y-2 text-sm leading-relaxed"
              style={{ color: "var(--muted)" }}
            >
              {REPRESENTANTE_DATA.biografia.map((parrafo, idx) => (
                <p key={idx}>{parrafo}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3 justify-center sm:justify-start">
          <a
            href={`tel:${CONTACT_INFO.phoneLink}`}
            className="px-5 py-2.5 rounded-full font-semibold text-sm transition-all hover:opacity-90"
            style={{ backgroundColor: "var(--primary)", color: "#ffffff" }}
          >
            📞 {CONTACT_INFO.phone}
          </a>
          <a
            href={`mailto:${CONTACT_INFO.email}`}
            className="px-5 py-2.5 rounded-full font-semibold text-sm border transition-all hover:opacity-80"
            style={{ borderColor: "var(--primary)", color: "var(--primary)" }}
          >
            ✉️ Enviar Email
          </a>
          <button
            onClick={() => setShowLicencia(true)}
            className="px-5 py-2.5 rounded-full font-semibold text-sm border transition-all hover:opacity-80 cursor-pointer"
            style={{ borderColor: "var(--primary)", color: "var(--primary)" }}
          >
            📜 Ver Licencia
          </button>
        </div>
      </div>

      {showLicencia && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center p-4"
          onClick={() => setShowLicencia(false)}
          style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
        >
          <div
            className="relative w-full max-w-3xl max-h-[90vh] rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: "var(--background)" }}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b"
              style={{ backgroundColor: "var(--surface)", borderColor: "var(--border-color)" }}
            >
              <h3 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>
                Licencias Profesionales
              </h3>
              <button
                onClick={() => setShowLicencia(false)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold cursor-pointer hover:opacity-80 transition-opacity"
                style={{ backgroundColor: "var(--border-color)", color: "var(--foreground)" }}
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-72px)] p-4">
              {REPRESENTANTE_DATA.licencias.map((licencia, idx) => (
                <div key={idx} className={`relative w-full mb-4 rounded-lg overflow-hidden shadow-md ${idx === 0 ? 'h-[28rem]' : 'h-84'}`}>
                  <Image
                    src={licencia}
                    alt={`Licencia profesional ${idx + 1}`}
                    fill
                    className="object-fill"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
