"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { createBrowserClient } from "@shared/utils/supabase";
import { AppointmentDetail } from "@features/admin";
import { fetchPropertiesForClients } from "@features/appointments/utils/propertyLookup";
import type { AppointmentWithClient } from "@features/appointments";

export default function CitaDetailPage() {
  const supabase = createBrowserClient();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [appointment, setAppointment] = useState<AppointmentWithClient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function fetchAppointment() {
      setLoading(true);

      const { data, error } = await supabase
        .from("appointment")
        .select("*, client:client_id(*)")
        .eq("appointment_id", id)
        .single();

      if (ignore) return;

      if (!error && data) {
        const raw = data as unknown as Omit<AppointmentWithClient, "properties">;
        const propertiesByClient = await fetchPropertiesForClients([raw.client_id]);
        setAppointment({
          ...raw,
          properties: propertiesByClient.get(raw.client_id) ?? [],
        });
      }
      setLoading(false);
    }

    fetchAppointment();

    return () => {
      ignore = true;
    };
  }, [id, supabase]);

  const refetch = async () => {
    const { data, error } = await supabase
      .from("appointment")
      .select("*, client:client_id(*)")
      .eq("appointment_id", id)
      .single();

    if (!error && data) {
      const raw = data as unknown as Omit<AppointmentWithClient, "properties">;
      const propertiesByClient = await fetchPropertiesForClients([raw.client_id]);
      setAppointment({
        ...raw,
        properties: propertiesByClient.get(raw.client_id) ?? [],
      });
    }
  };

  const updateStatus = async (newStatus: "pending" | "confirmed" | "cancelled" | "completed") => {
    const { error } = await supabase
      .from("appointment")
      .update({ status: newStatus })
      .eq("appointment_id", id);

    if (error) {
      alert(`Error al actualizar el estado a ${newStatus}`);
      return;
    }

    await refetch();
  };

  const handleConfirm = async () => {
    await updateStatus("confirmed");
  };

  const handleCancel = async () => {
    await updateStatus("cancelled");
  };

  const handleComplete = async () => {
    await updateStatus("completed");
  };

  const handleDelete = async () => {
    const { error } = await supabase.from("appointment").delete().eq("appointment_id", id);

    if (error) {
      alert("Error al eliminar la cita");
      return;
    }

    router.push("/admin/citas");
  };

  const handleUpdate = async (values: {
    visit_date: string;
    status: "pending" | "confirmed" | "cancelled" | "completed";
    observations: string | null;
  }) => {
    const { error } = await supabase
      .from("appointment")
      .update({
        visit_date: values.visit_date,
        status: values.status,
      })
      .eq("appointment_id", id);

    if (error) {
      alert("Error al actualizar la cita");
      throw error;
    }

    await refetch();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div
          className="animate-spin rounded-full h-8 w-8 border-b-2"
          style={{ borderColor: "var(--primary)" }}
        />
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="text-center py-12 space-y-4">
        <p style={{ color: "var(--muted)" }}>Cita no encontrada</p>
        <Link
          href="/admin/citas"
          className="inline-block px-5 py-2.5 text-sm rounded-full font-semibold transition-all hover:opacity-90"
          style={{
            backgroundColor: "var(--primary)",
            color: "white",
            border: "none",
          }}
        >
          Volver a citas
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/citas"
          className="text-sm hover:opacity-80"
          style={{ color: "var(--muted)" }}
        >
          ← Volver a citas
        </Link>
      </div>

      <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
        Cita
      </h1>

      <AppointmentDetail
        appointment={appointment}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        onComplete={handleComplete}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
