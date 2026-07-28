"use client";

import Link from "next/link";
import Image from "next/image";
import type { PropertyWithMedia } from "@features/properties";

interface PropertyCardProps {
  property: PropertyWithMedia;
}

const typeConfig: Record<string, { label: string; color: string }> = {
  casa: { label: "Casa Finca", color: "#059669" },
  lote: { label: "Lote", color: "#D97706" },
  cabana: { label: "Cabaña", color: "#7C3AED" },
};

export default function PropertyCard({ property }: PropertyCardProps) {
  const cover = property.media?.find((m) => m.cover_image) ?? property.media?.[0];
  const imageUrl = cover?.file_url ?? null;
  const config = typeConfig[property.type ?? ""] ?? { label: "Propiedad", color: "var(--primary)" };

  return (
    <Link
      href={`/propiedades/${property.property_id}`}
      className="group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border-color)",
      }}
    >
      <div className="relative h-64 overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center gap-3"
            style={{
              background: "linear-gradient(135deg, var(--background) 0%, var(--surface) 100%)",
            }}
          >
            <svg
              className="w-16 h-16 opacity-30"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ color: "var(--muted)" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
              />
            </svg>
            <span className="text-sm font-medium opacity-40" style={{ color: "var(--muted)" }}>
              Sin imagen
            </span>
          </div>
        )}

        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 40%, transparent 70%)",
          }}
        />

        <div className="absolute top-4 left-4">
          <span
            className="px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide uppercase shadow-lg"
            style={{ backgroundColor: config.color, color: "white" }}
          >
            {config.label}
          </span>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5 gap-3">
        <h3
          className="text-lg font-bold line-clamp-2 leading-tight group-hover:text-[var(--primary)] transition-colors duration-300"
          style={{ color: "var(--foreground)" }}
        >
          {property.title}
        </h3>

        {property.address && (
          <div className="flex items-start gap-2">
            <svg
              className="w-4 h-4 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ color: "var(--muted)" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
              />
            </svg>
            <p
              className="text-sm line-clamp-1"
              style={{ color: "var(--muted)" }}
            >
              {property.address}
            </p>
          </div>
        )}

        {property.area !== null && (
          <div className="flex items-center gap-1.5">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ color: "var(--muted)" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
              />
            </svg>
            <span className="text-sm font-medium" style={{ color: "var(--muted)" }}>
              {`${property.area} m²`}
            </span>
          </div>
        )}

        <div
          className="pt-3 mt-auto border-t flex items-center justify-between"
          style={{ borderColor: "var(--border-color)" }}
        >
          <span
            className="text-sm font-semibold transition-all duration-300 group-hover:gap-3 flex items-center gap-2"
            style={{ color: "var(--primary)" }}
          >
            Ver detalles
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
