"use client";

import { useEffect, useState, Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Header, Footer, WhatsAppButton } from "@shared/components/layout";
import { SectionHeader } from "@shared/components/ui";
import { createBrowserClient } from "@shared/utils/supabase";
import { PropertyCard, PropertyFilters } from "@features/properties";
import type { PropertyWithMedia } from "@features/properties";

function PropiedadesContent() {
  const supabase = createBrowserClient();
  const searchParams = useSearchParams();
  const typeFromUrl = searchParams.get("type") ?? "";
  const [filter, setFilter] = useState(typeFromUrl);
  const [allProperties, setAllProperties] = useState<PropertyWithMedia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function fetchProperties() {
      setLoading(true);
      const { data, error } = await supabase
        .from("property")
        .select("*, media:property_media(*)")
        .order("created_at", { ascending: false });

      if (!ignore) {
        if (error) {
          console.error("Error fetching properties:", error);
          setAllProperties([]);
        } else {
          setAllProperties((data as unknown as PropertyWithMedia[]) ?? []);
        }
        setLoading(false);
      }
    }

    fetchProperties();

    return () => {
      ignore = true;
    };
  }, [supabase]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { "": allProperties.length };
    allProperties.forEach((p) => {
      const t = p.type ?? "";
      c[t] = (c[t] ?? 0) + 1;
    });
    return c;
  }, [allProperties]);

  const filteredProperties = useMemo(() => {
    if (!filter) return allProperties;
    return allProperties.filter((p) => p.type === filter);
  }, [allProperties, filter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <SectionHeader
        label="Catalogo"
        title="Nuestras Propiedades"
        description="Explora nuestra seleccion de lotes, casa fincas y cabañas disponibles para ti."
      />

      <PropertyFilters selected={filter} onChange={setFilter} counts={counts} />

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="relative">
            <div
              className="animate-spin rounded-full h-16 w-16 border-4 border-t-transparent"
              style={{ borderColor: "var(--border-color)", borderTopColor: "var(--primary)" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: "var(--primary)" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21"
                />
              </svg>
            </div>
          </div>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="text-center py-20">
          <div
            className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: "var(--surface)" }}
          >
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ color: "var(--muted)" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </div>
          <p className="text-xl font-semibold mb-2" style={{ color: "var(--foreground)" }}>
            No hay propiedades disponibles
          </p>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            {filter
              ? `No se encontraron propiedades de tipo "${filter}". Intenta con otra categoría.`
              : "Vuelve pronto para nuevas publicaciones."}
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm font-medium" style={{ color: "var(--muted)" }}>
              {filteredProperties.length}{" "}
              {filteredProperties.length === 1 ? "propiedad" : "propiedades"}{" "}
              encontrada{filteredProperties.length === 1 ? "" : "s"}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.property_id} property={property} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function PropiedadesPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-16">
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-64">
              <div
                className="animate-spin rounded-full h-12 w-12 border-b-2"
                style={{ borderColor: "var(--primary)" }}
              />
            </div>
          }
        >
          <PropiedadesContent />
        </Suspense>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
