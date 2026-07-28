"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Header, Footer, WhatsAppButton } from "@shared/components/layout";
import { createBrowserClient } from "@shared/utils/supabase";
import { PropertyGallery } from "@features/properties";
import { AppointmentForm, AppointmentConfirmation } from "@features/appointments";
import { generateWhatsAppMessage, getWhatsAppLink } from "@features/notifications";
import type { AppointmentFormData } from "@features/appointments";
import type { PropertyWithMedia } from "@features/properties";
import type { Client } from "@/app/features/client";

export default function PropertyDetailPage() {
  const supabase = createBrowserClient();
  const params = useParams();
  const id = params.id as string;

  const [property, setProperty] = useState<PropertyWithMedia | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<{
    data: AppointmentFormData;
    whatsappLink: string;
  } | null>(null);

  useEffect(() => {
    let ignore = false;

    async function fetchProperty() {
      setLoading(true);

      const { data, error } = await supabase
        .from("property")
        .select("*, media:property_media(*)")
        .eq("property_id", id)
        .single();

      if (!ignore) {
        if (!error && data) {
          setProperty(data as unknown as PropertyWithMedia);
        }
        setLoading(false);
      }
    }

    fetchProperty();

    return () => {
      ignore = true;
    };
  }, [id, supabase]);

  const handleAppointmentSubmit = async (formData: AppointmentFormData) => {
    if (!property) return;
    setSubmitting(true);

    let clientId: string;

    const { data: existingClient } = await supabase
      .from("client")
      .select("*")
      .eq("email", formData.email)
      .maybeSingle();

    if (existingClient) {
      clientId = (existingClient as unknown as Client).client_id;
    } else {
      const { data: newClient, error: createError } = await supabase
        .from("client")
        .insert({
          name: formData.name,
          last_name: formData.last_name || null,
          document_id: formData.document_id || null,
          phone: formData.phone,
          email: formData.email,
        })
        .select()
        .single();

      if (createError || !newClient) {
        alert("Error al registrar el cliente. Intentalo de nuevo.");
        setSubmitting(false);
        return;
      }
      clientId = (newClient as unknown as Client).client_id;
    }

    const visitDateISO = new Date(formData.visit_date).toISOString();

    const { data: newAppointment, error: appointmentError } = await supabase
      .from("appointment")
      .insert({
        visit_date: visitDateISO,
        status: "pending",
        observations: formData.observations || null,
        client_id: clientId,
      })
      .select()
      .single();

    if (appointmentError || !newAppointment) {
      alert("Error al agendar la cita. Intentalo de nuevo.");
      setSubmitting(false);
      return;
    }

    await supabase
      .from("property_client")
      .upsert(
        { property_id: property.property_id, client_id: clientId },
        { onConflict: "property_id,client_id" }
      );

    const clientForMessage: Client = {
      client_id: clientId,
      name: formData.name,
      last_name: formData.last_name || null,
      document_id: formData.document_id || null,
      email: formData.email,
      phone: formData.phone,
    };

    const message = generateWhatsAppMessage({
      appointment: {
        appointment_id: (newAppointment as unknown as { appointment_id: string }).appointment_id,
        visit_date: visitDateISO,
        status: "pending",
        observations: formData.observations || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        client_id: clientId,
      },
      client: clientForMessage,
      action: "created",
    });

    const whatsappLink = getWhatsAppLink(formData.phone, message);

    setConfirmation({ data: formData, whatsappLink });
    setSubmitting(false);
  };

  const handleNewAppointment = () => {
    setConfirmation(null);
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="flex-1 pt-24 flex items-center justify-center min-h-[60vh]">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2"
            style={{ borderColor: "var(--primary)" }}
          />
        </main>
        <Footer />
      </>
    );
  }

  if (!property) {
    return (
      <>
        <Header />
        <main className="flex-1 pt-24 max-w-7xl mx-auto px-4 py-12 text-center">
          <h1
            className="text-2xl font-bold mb-4"
            style={{ color: "var(--foreground)" }}
          >
            Propiedad no encontrada
          </h1>
          <Link
            href="/propiedades"
            className="inline-block px-5 py-2.5 text-sm rounded-full font-semibold transition-all hover:opacity-90"
            style={{
              backgroundColor: "var(--primary)",
              color: "white",
            }}
          >
            Volver al catalogo
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/propiedades"
            className="text-sm hover:opacity-80 inline-flex items-center gap-1 mb-4"
            style={{ color: "var(--muted)" }}
          >
            ← Volver al catalogo
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <PropertyGallery
                media={property.media ?? []}
                title={property.title}
              />

              <div>
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    {property.type && (
                      <span
                        className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2"
                        style={{
                          backgroundColor: "var(--primary)",
                          color: "white",
                        }}
                      >
                        {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
                      </span>
                    )}
                    <h1
                      className="text-3xl sm:text-4xl font-bold"
                      style={{ color: "var(--foreground)" }}
                    >
                      {property.title}
                    </h1>
                  </div>
                </div>

                {property.address && (
                  <p
                    className="text-base flex items-center gap-2 mb-6"
                    style={{ color: "var(--muted)" }}
                  >
                    <span>📍</span>
                    {property.address}
                  </p>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 mb-6">
                  {property.area !== null && (
                    <div
                      className="rounded-xl p-4"
                      style={{
                        backgroundColor: "var(--surface)",
                        border: "1px solid var(--border-color)",
                      }}
                    >
                      <p
                        className="text-xs mb-1"
                        style={{ color: "var(--muted)" }}
                      >
                        Area
                      </p>
                      <p
                        className="text-lg font-semibold"
                        style={{ color: "var(--foreground)" }}
                      >
                        {`${property.area} m²`}
                      </p>
                    </div>
                  )}
                  {property.type && (
                    <div
                      className="rounded-xl p-4"
                      style={{
                        backgroundColor: "var(--surface)",
                        border: "1px solid var(--border-color)",
                      }}
                    >
                      <p
                        className="text-xs mb-1"
                        style={{ color: "var(--muted)" }}
                      >
                        Tipo
                      </p>
                      <p
                        className="text-lg font-semibold capitalize"
                        style={{ color: "var(--foreground)" }}
                      >
                        {property.type}
                      </p>
                    </div>
                  )}
                </div>

                {property.description && (
                  <div className="mb-6">
                    <h2
                      className="text-xl font-semibold mb-3"
                      style={{ color: "var(--foreground)" }}
                    >
                      Descripcion
                    </h2>
                    <p
                      className="text-base leading-relaxed whitespace-pre-line"
                      style={{ color: "var(--muted)" }}
                    >
                      {property.description}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div
                className="rounded-2xl p-6 sticky top-20"
                style={{
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border-color)",
                }}
              >
                {confirmation ? (
                  <AppointmentConfirmation
                    data={confirmation.data}
                    whatsappLink={confirmation.whatsappLink}
                    onNewAppointment={handleNewAppointment}
                  />
                ) : (
                  <>
                    <h2
                      className="text-xl font-bold mb-2"
                      style={{ color: "var(--foreground)" }}
                    >
                      Agenda tu visita
                    </h2>
                    <p
                      className="text-sm mb-6"
                      style={{ color: "var(--muted)" }}
                    >
                      Completa el formulario y nos pondremos en contacto para confirmar tu cita.
                    </p>
                    <AppointmentForm onSubmit={handleAppointmentSubmit} loading={submitting} />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
