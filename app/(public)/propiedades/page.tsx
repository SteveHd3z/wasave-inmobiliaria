"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Header, Footer, WhatsAppButton } from "@shared/components/layout";
import { SectionHeader } from "@shared/components/ui";
import { createBrowserClient } from "@shared/utils/supabase";
import { PropertyCard, PropertyFilters } from "@features/properties";
import type { PropertyWithMedia } from "@features/properties";

function PropiedadesContent() {
  const supabase = createBrowserClient();
  const searchParams = useSearchParams();
  const initialType = searchParams.get("type") ?? "";
  const [filter, setFilter] = useState(initialType);
  const [properties, setProperties] = useState<PropertyWithMedia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function fetchProperties() {
      setLoading(true);
      let query = supabase
        .from("property")
        .select("*, media:property_media(*)")
        .order("created_at", { ascending: false });

      if (filter) {
        query = query.eq("type", filter);
      }

      const { data } = await query;

      if (!ignore) {
        setProperties((data as unknown as PropertyWithMedia[]) ?? []);
        setLoading(false);
      }
    }

    fetchProperties();

    return () => {
      ignore = true;
    };
  }, [filter, supabase]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SectionHeader
        label="Catalogo"
        title="Nuestras Propiedades"
        description="Explora nuestra seleccion de lotes, casa fincas y cabañas disponibles para ti."
      />

      <PropertyFilters selected={filter} onChange={setFilter} />

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2"
            style={{ borderColor: "var(--primary)" }}
          />
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg" style={{ color: "var(--muted)" }}>
            No hay propiedades disponibles en este momento.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.property_id} property={property} />
          ))}
        </div>
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
