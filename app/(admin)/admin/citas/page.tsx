"use client";

import { useCallback, useEffect, useState } from "react";
import { createBrowserClient } from "@shared/utils/supabase";
import { AppointmentList, ConfirmDialog, AppointmentFilters } from "@features/admin";
import type { AppointmentFiltersValue } from "@features/admin/components/AppointmentFilters";
import { fetchPropertiesForClients } from "@features/appointments/utils/propertyLookup";
import type { AppointmentWithClient, AppointmentStatus } from "@features/appointments";

export default function CitasPage() {
  const supabase = createBrowserClient();
  const [appointments, setAppointments] = useState<AppointmentWithClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [filters, setFilters] = useState<AppointmentFiltersValue>({
    status: "",
    startDate: "",
    endDate: "",
  });

  const loadAppointments = useCallback(async () => {
    let query = supabase
      .from("appointment")
      .select("*, client:client_id(*)")
      .order("visit_date", { ascending: false });

    if (filters.status) {
      query = query.eq("status", filters.status as AppointmentStatus);
    }
    if (filters.startDate) {
      query = query.gte("visit_date", `${filters.startDate}T00:00:00`);
    }
    if (filters.endDate) {
      query = query.lte("visit_date", `${filters.endDate}T23:59:59`);
    }

    const { data } = await query;
    const raw = (data as unknown as Omit<AppointmentWithClient, "properties">[]) ?? [];

    const clientIds = Array.from(new Set(raw.map((a) => a.client_id)));
    const propertiesByClient = await fetchPropertiesForClients(clientIds);

    return raw.map((apt) => ({
      ...apt,
      properties: propertiesByClient.get(apt.client_id) ?? [],
    }));
  }, [supabase, filters]);

  useEffect(() => {
    let ignore = false;

    async function fetchAppointments() {
      setLoading(true);
      const enriched = await loadAppointments();
      if (!ignore) {
        setAppointments(enriched);
        setLoading(false);
      }
    }

    fetchAppointments();

    return () => {
      ignore = true;
    };
  }, [loadAppointments]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    await supabase.from("appointment").delete().eq("appointment_id", deleteId);
    setDeleteId(null);
    const enriched = await loadAppointments();
    setAppointments(enriched);
    setDeleting(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
        Citas
      </h1>

      <AppointmentFilters value={filters} onChange={setFilters} />

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div
            className="animate-spin rounded-full h-8 w-8 border-b-2"
            style={{ borderColor: "var(--primary)" }}
          />
        </div>
      ) : (
        <AppointmentList appointments={appointments} onDelete={setDeleteId} />
      )}

      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Eliminar cita"
        message="Esta accion eliminara la cita permanentemente. No se puede deshacer."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  );
}
