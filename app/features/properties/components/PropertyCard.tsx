"use client";

import Link from "next/link";
import Image from "next/image";
import type { PropertyWithMedia } from "@features/properties";

interface PropertyCardProps {
  property: PropertyWithMedia;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const cover = property.media?.find((m) => m.cover_image);
  const fallback = property.media?.[0];

  const imageUrl = cover?.file_url ?? fallback?.file_url ?? null;
  const typeLabel = property.type
    ? property.type.charAt(0).toUpperCase() + property.type.slice(1)
    : "Propiedad";

  return (
    <Link
      href={`/propiedades/${property.property_id}`}
      className="group rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 block"
      style={{
        backgroundColor: "var(--surface)",
        borderColor: "var(--border-color)",
      }}
    >
      <div className="relative h-56 overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, var(--background) 0%, var(--surface) 100%)",
            }}
          >
            <span className="text-5xl opacity-50">🏠</span>
          </div>
        )}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)",
          }}
        />
        <div className="absolute top-3 left-3">
          <span
            className="px-3 py-1 rounded-full text-xs font-semibold"
            style={{
              backgroundColor: "var(--primary)",
              color: "white",
            }}
          >
            {typeLabel}
          </span>
        </div>
        {property.sale_price !== null && (
          <div className="absolute bottom-3 left-3 right-3">
            <p className="text-xl font-bold text-white drop-shadow-lg">
              {`$${Number(property.sale_price).toLocaleString("es-CO")}`}
            </p>
          </div>
        )}
      </div>

      <div className="p-5 space-y-2">
        <h3
          className="text-lg font-bold line-clamp-1"
          style={{ color: "var(--foreground)" }}
        >
          {property.title}
        </h3>

        {property.address && (
          <p
            className="text-sm flex items-center gap-1"
            style={{ color: "var(--muted)" }}
          >
            <span>📍</span>
            <span className="line-clamp-1">{property.address}</span>
          </p>
        )}

        {property.area !== null && (
          <p
            className="text-sm flex items-center gap-1"
            style={{ color: "var(--muted)" }}
          >
            <span>📐</span>
            <span>{`${property.area} m²`}</span>
          </p>
        )}

        <div
          className="pt-3 mt-3 border-t flex items-center justify-between"
          style={{ borderColor: "var(--border-color)" }}
        >
          <span
            className="text-sm font-semibold transition-all group-hover:gap-3 flex items-center gap-1"
            style={{ color: "var(--primary)" }}
          >
            Ver detalles
            <span>→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
