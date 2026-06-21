"use client";

import Image from "next/image";
import { useTheme } from "@shared/hooks";
import { COMPANY_NAME, COMPANY_TAGLINE } from "@shared/constants";
import { HERO_LINKS } from "../constants";

export default function HeroSection() {
  const { theme } = useTheme();

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            theme === "dark"
              ? "linear-gradient(135deg, #004B87 0%, #0D6FB8 50%, #1F6FEB 100%)"
              : "linear-gradient(135deg, #E3F2FD 0%, #90CAF9 50%, #42A5F5 100%)",
        }}
      />

      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-white blur-3xl" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <Image
          src="/images/logo.png"
          alt={`${COMPANY_NAME} Logo`}
          width={120}
          height={120}
          className="mx-auto mb-6 drop-shadow-2xl"
        />

        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight"
          style={{ color: theme === "dark" ? "#ffffff" : "#0F1117" }}
        >
          {COMPANY_NAME}
        </h1>

        <p
          className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto"
          style={{
            color:
              theme === "dark"
                ? "rgba(255, 255, 255, 0.9)"
                : "rgba(15, 17, 23, 0.8)",
          }}
        >
          {COMPANY_TAGLINE} para tu tranquilidad. Seguros, trámites legales,
          mantenimiento y asesoría en compra y venta de propiedades.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {HERO_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="px-8 py-3 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-lg"
              style={{
                backgroundColor:
                  link.variant === "primary"
                    ? theme === "dark"
                      ? "var(--surface)"
                      : "var(--foreground)"
                    : "transparent",
                color:
                  link.variant === "primary"
                    ? theme === "dark"
                      ? "var(--primary)"
                      : "var(--surface)"
                    : theme === "dark"
                      ? "white"
                      : "#0F1117",
                border:
                  link.variant === "outline"
                    ? `2px solid ${theme === "dark" ? "white" : "#0F1117"}`
                    : "none",
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          style={{ color: theme === "dark" ? "white" : "#0F1117" }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
}
