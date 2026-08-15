import type { Client } from "@/app/features/client/types";
import type { Property } from "@features/properties";

export interface Appointment {
  appointment_id: string;
  visit_date: string;
  status: AppointmentStatus;
  observations: string | null;
  created_at: string;
  updated_at: string;
  client_id: string;
}

export interface AppointmentWithClient extends Appointment {
  client: Client;
  properties: Property[];
}

export interface CreateAppointmentInput {
  visit_date: string;
  status?: AppointmentStatus;
  observations?: string;
  client_id: string;
}

export interface UpdateAppointmentInput {
  visit_date?: string;
  status?: AppointmentStatus;
  observations?: string;
}

export type AppointmentStatus = "pending" | "confirmed" | "cancelled" | "completed";

export interface AppointmentsSummary {
  total: number;
  pending: number;
  confirmed: number;
  cancelled: number;
  completed: number;
  upcoming: number;
}
