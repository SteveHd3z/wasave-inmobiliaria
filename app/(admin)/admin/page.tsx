"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@shared/utils/supabase";
import { StatsCard } from "@features/admin";
import { Card } from "@shared/components/ui";

interface DashboardStats {
  totalProperties: number;
  totalOwners: number;
  totalClients: number;
  pendingAppointments: number;
  todayAppointments: number;
}

interface AppointmentRow {
  appointment_id: string;
  visit_date: string;
  status: string;
  client: { name: string } | null;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    totalOwners: 0,
    totalClients: 0,
    pendingAppointments: 0,
    todayAppointments: 0,
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState<AppointmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserClient();

  useEffect(() => {
    async function fetchDashboardData() {
      const today = new Date().toISOString().split("T")[0];

      const [propertiesRes, ownersRes, clientsRes, pendingRes, todayRes, upcomingRes] =
        await Promise.all([
          supabase.from("properties").select("*", { count: "exact", head: true }),
          supabase.from("owner").select("*", { count: "exact", head: true }),
          supabase.from("client").select("*", { count: "exact", head: true }),
          supabase
            .from("appointments")
            .select("*", { count: "exact", head: true })
            .eq("status", "pending"),
          supabase
            .from("appointments")
            .select("*", { count: "exact", head: true })
            .gte("visit_date", today)
            .lt("visit_date", `${today}T23:59:59`),
          supabase
            .from("appointments")
            .select("appointment_id, visit_date, status, client(name)")
            .gte("visit_date", today)
            .order("visit_date", { ascending: true })
            .limit(5),
        ]);

      setStats({
        totalProperties: propertiesRes.count ?? 0,
        totalOwners: ownersRes.count ?? 0,
        totalClients: clientsRes.count ?? 0,
        pendingAppointments: pendingRes.count ?? 0,
        todayAppointments: todayRes.count ?? 0,
      });

      setUpcomingAppointments((upcomingRes.data as unknown as AppointmentRow[]) ?? []);
      setLoading(false);
    }

    fetchDashboardData();
  }, [supabase]);

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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
        Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard title="Propiedades activas" value={stats.totalProperties} icon="🏠" />
        <StatsCard title="Citas pendientes" value={stats.pendingAppointments} icon="⏳" />
        <StatsCard title="Citas hoy" value={stats.todayAppointments} icon="📅" />
        <StatsCard title="Total owners" value={stats.totalOwners} icon="👤" />
        <StatsCard title="Total clientes" value={stats.totalClients} icon="👥" />
      </div>

      <Card hover={false}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--foreground)" }}>
          Proximas citas
        </h2>
        {upcomingAppointments.length === 0 ? (
          <p style={{ color: "var(--muted)" }}>No hay citas proximas</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <th className="text-left py-3 px-2 font-medium" style={{ color: "var(--muted)" }}>
                    Fecha
                  </th>
                  <th className="text-left py-3 px-2 font-medium" style={{ color: "var(--muted)" }}>
                    Cliente
                  </th>
                  <th className="text-left py-3 px-2 font-medium" style={{ color: "var(--muted)" }}>
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody>
                {upcomingAppointments.map((apt) => (
                  <tr key={apt.appointment_id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <td className="py-3 px-2" style={{ color: "var(--foreground)" }}>
                      {new Date(apt.visit_date).toLocaleString("es-CO")}
                    </td>
                    <td className="py-3 px-2" style={{ color: "var(--foreground)" }}>
                      {apt.client?.name ?? "Sin cliente"}
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor:
                            apt.status === "confirmed"
                              ? "#D1FAE5"
                              : apt.status === "pending"
                                ? "#FEF3C7"
                                : "#FEE2E2",
                          color:
                            apt.status === "confirmed"
                              ? "#065F46"
                              : apt.status === "pending"
                                ? "#92400E"
                                : "#991B1B",
                        }}
                      >
                        {apt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
