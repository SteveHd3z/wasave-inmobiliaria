"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { SectionHeader } from "@shared/components/ui";
import { useTheme } from "@shared/hooks";
import { DISPONIBLES, getWhatsappLink } from "../constants";
import type { DisponibleMedia } from "../constants";

interface LightboxState {
  propertyIndex: number;
  mediaIndex: number;
}

export default function DisponibleSection() {
  const { theme } = useTheme();
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  const openLightbox = (propertyIndex: number, mediaIndex: number) =>
    setLightbox({ propertyIndex, mediaIndex });
  const closeLightbox = () => setLightbox(null);

  const goToPrevious = useCallback(() => {
    setLightbox((prev) => {
      if (!prev) return prev;
      const prop = DISPONIBLES[prev.propertyIndex];
      if (!prop) return prev;
      const next =
        (prev.mediaIndex - 1 + prop.media.length) % prop.media.length;
      return { propertyIndex: prev.propertyIndex, mediaIndex: next };
    });
  }, []);

  const goToNext = useCallback(() => {
    setLightbox((prev) => {
      if (!prev) return prev;
      const prop = DISPONIBLES[prev.propertyIndex];
      if (!prop) return prev;
      const next = (prev.mediaIndex + 1) % prop.media.length;
      return { propertyIndex: prev.propertyIndex, mediaIndex: next };
    });
  }, []);

  useEffect(() => {
    if (!lightbox) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [lightbox, goToPrevious, goToNext]);

  const activeProperty =
    lightbox !== null ? DISPONIBLES[lightbox.propertyIndex] : null;
  const activeMedia: DisponibleMedia | null =
    activeProperty && lightbox
      ? activeProperty.media[lightbox.mediaIndex]
      : null;

  return (
    <>
      <section
        id="disponible"
        className="py-20 px-4"
        style={{
          backgroundColor:
            theme === "dark" ? "var(--background)" : "var(--surface)",
        }}
      >
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            label="Terreno"
            title="Disponible"
            description="Propiedades destacadas disponibles para tu próximo proyecto."
          />

          <div className="space-y-20">
            {DISPONIBLES.map((prop, propertyIndex) => (
              <div key={prop.id}>
                <div className="text-center mb-8">
                  <h3
                    className="text-2xl sm:text-3xl font-bold mb-2"
                    style={{ color: "var(--foreground)" }}
                  >
                    {prop.title}
                  </h3>
                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--muted)" }}
                  >
                    {prop.subtitle}
                  </p>
                </div>

                <div
                  className={`grid gap-4 ${
                    prop.media.length === 4
                      ? "grid-cols-2 md:grid-cols-4"
                      : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
                  }`}
                >
                  {prop.media.map((item, mediaIndex) => (
                    <button
                      key={`${prop.id}-${mediaIndex}`}
                      type="button"
                      onClick={() => openLightbox(propertyIndex, mediaIndex)}
                      className="relative h-64 rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group cursor-pointer"
                      style={{ borderColor: "var(--border-color)" }}
                      aria-label={`Ver ${item.type === "video" ? "video" : "imagen"} ${mediaIndex + 1} de ${prop.title}`}
                    >
                      {item.type === "video" ? (
                        <>
                          <video
                            src={item.src}
                            className="w-full h-full object-cover"
                            muted
                            playsInline
                            preload="metadata"
                          />
                          <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                              background:
                                "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 60%)",
                            }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div
                              className="w-14 h-14 rounded-full flex items-center justify-center"
                              style={{
                                backgroundColor: "rgba(255,255,255,0.9)",
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-6 h-6 ml-1"
                                style={{ color: "var(--primary)" }}
                              >
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                          <span
                            className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase"
                            style={{
                              backgroundColor: "rgba(0,0,0,0.65)",
                              color: "#ffffff",
                            }}
                          >
                            Video
                          </span>
                        </>
                      ) : (
                        <>
                          <Image
                            src={item.src}
                            alt={item.alt}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                          <div
                            className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-0 pointer-events-none"
                            style={{
                              background:
                                "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)",
                            }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            <div
                              className="w-14 h-14 rounded-full flex items-center justify-center"
                              style={{
                                backgroundColor: "rgba(255,255,255,0.9)",
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                className="w-6 h-6"
                                style={{ color: "var(--primary)" }}
                              >
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.3-4.3" />
                                <path d="M11 8v6" />
                                <path d="M8 11h6" />
                              </svg>
                            </div>
                          </div>
                        </>
                      )}
                    </button>
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <p
                    className="text-lg leading-relaxed max-w-3xl mx-auto mb-6 whitespace-pre-line"
                    style={{ color: "var(--muted)" }}
                  >
                    {prop.description}
                  </p>

                  <a
                    href={getWhatsappLink(prop.whatsappMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-base transition-all duration-300 hover:gap-3 hover:opacity-90"
                    style={{ backgroundColor: "var(--primary)", color: "#ffffff" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.37 0-4.567-.814-6.3-2.18l-.44-.352-3.242 1.087 1.087-3.242-.352-.44A9.96 9.96 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
                    </svg>
                    Contactar por WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {lightbox && activeProperty && activeMedia && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          onClick={closeLightbox}
        >
          <div
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(0,0,0,0.9)" }}
          />

          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
            style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
            aria-label="Cerrar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth={2}
              className="w-6 h-6"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>

          {activeProperty.media.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-4 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
                style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                aria-label="Anterior"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth={2}
                  className="w-6 h-6"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
                style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                aria-label="Siguiente"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth={2}
                  className="w-6 h-6"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </>
          )}

          <div
            className="relative w-full h-full max-w-5xl max-h-[85vh] mx-4 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {activeMedia.type === "video" ? (
              <video
                key={activeMedia.src}
                src={activeMedia.src}
                controls
                autoPlay
                className="max-w-full max-h-full object-contain"
                style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
              />
            ) : (
              <Image
                src={activeMedia.src}
                alt={activeMedia.alt}
                fill
                className="object-contain"
                priority
                sizes="100vw"
              />
            )}
          </div>

          {activeProperty.media.length > 1 && (
            <div
              className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3"
              onClick={(e) => e.stopPropagation()}
            >
              {activeProperty.media.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() =>
                    setLightbox({
                      propertyIndex: lightbox.propertyIndex,
                      mediaIndex: idx,
                    })
                  }
                  className="w-3 h-3 rounded-full transition-all duration-300 cursor-pointer"
                  style={{
                    backgroundColor:
                      idx === lightbox.mediaIndex
                        ? "var(--primary)"
                        : "rgba(255,255,255,0.4)",
                    transform:
                      idx === lightbox.mediaIndex ? "scale(1.3)" : "scale(1)",
                  }}
                  aria-label={`Ir a ${idx + 1}`}
                />
              ))}
            </div>
          )}

          {activeProperty.media.length > 1 && (
            <div
              className="absolute bottom-6 right-6 text-white text-sm"
              style={{ opacity: 0.7 }}
            >
              {lightbox.mediaIndex + 1} / {activeProperty.media.length}
            </div>
          )}
        </div>
      )}
    </>
  );
}
