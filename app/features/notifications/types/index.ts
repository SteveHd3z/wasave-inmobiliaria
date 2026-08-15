import type { Appointment } from "@/app/features/appointments/types";
import type { Client } from "@/app/features/client/types";

export interface NotificationData {
  appointment: Appointment;
  client: Client;
  action: "created" | "updated" | "cancelled" | "reminder";
}
