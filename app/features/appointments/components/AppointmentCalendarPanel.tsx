"use client";

import { useEffect, useMemo, useReducer, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { es } from "date-fns/locale";
import {
  format,
  isAfter,
  isSameDay,
  startOfDay,
  startOfToday,
} from "date-fns";
import { createBrowserClient } from "@shared/utils/supabase";
import { parseAppointmentDate } from "@shared/utils";
import type { AppointmentStatus } from "@features/appointments";

const BUSINESS_START_HOUR = 8;
const BUSINESS_END_HOUR = 18;
const APPOINTMENT_DURATION_HOURS = 2;
const SLOT_STEP_HOURS = 2;

const START_HOURS: number[] = Array.from(
  { length: (BUSINESS_END_HOUR - BUSINESS_START_HOUR) / SLOT_STEP_HOURS },
  (_, i) => BUSINESS_START_HOUR + i * SLOT_STEP_HOURS
);

interface DayOccupancy {
  occupiedHours: Set<number>;
  hasAppointments: boolean;
}

function isActiveStatus(status: string | null | undefined): boolean {
  return status !== "cancelled";
}

function buildOccupancy(
  appointments: { visit_date: string; status: AppointmentStatus }[]
): Map<string, DayOccupancy> {
  const map = new Map<string, DayOccupancy>();
  for (const apt of appointments) {
    if (!isActiveStatus(apt.status)) continue;
    const date = parseAppointmentDate(apt.visit_date);
    if (!date) continue;
    const dayKey = format(startOfDay(date), "yyyy-MM-dd");
    const startHour = date.getHours();
    const entry = map.get(dayKey) ?? {
      occupiedHours: new Set<number>(),
      hasAppointments: false,
    };
    entry.occupiedHours.add(startHour);
    if (startHour + 1 <= BUSINESS_END_HOUR) {
      entry.occupiedHours.add(startHour + 1);
    }
    entry.hasAppointments = true;
    map.set(dayKey, entry);
  }
  return map;
}

function isStartAvailable(
  startHour: number,
  occupancy: DayOccupancy | undefined
): boolean {
  if (startHour + APPOINTMENT_DURATION_HOURS > BUSINESS_END_HOUR) return false;
  if (!occupancy) return true;
  if (occupancy.occupiedHours.has(startHour)) return false;
  if (occupancy.occupiedHours.has(startHour + 1)) return false;
  return true;
}

function hasAnyAvailableSlot(occupancy: DayOccupancy | undefined): boolean {
  return START_HOURS.some((h) => isStartAvailable(h, occupancy));
}

function combineDateAndHour(date: Date, hour: number): Date {
  const result = new Date(date);
  result.setHours(hour, 0, 0, 0);
  return result;
}

function formatHour(hour: number): string {
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:00 ${period}`;
}

function formatHourRange(startHour: number): string {
  const endHour = startHour + APPOINTMENT_DURATION_HOURS;
  return `${formatHour(startHour)} - ${formatHour(endHour)}`;
}

export interface AppointmentCalendarPanelProps {
  propertyId?: string;
  value: string;
  onChange: (iso: string) => void;
  excludeAppointmentId?: string;
  allowPast?: boolean;
}

type PanelState = {
  occupancy: Map<string, DayOccupancy>;
  loading: boolean;
};

type PanelAction =
  | { type: "load"; hasPropertyId: boolean }
  | { type: "success"; occupancy: Map<string, DayOccupancy> }
  | { type: "error" };

function panelReducer(state: PanelState, action: PanelAction): PanelState {
  switch (action.type) {
    case "load":
      return { occupancy: new Map(), loading: action.hasPropertyId };
    case "success":
      return { occupancy: action.occupancy, loading: false };
    case "error":
      return { occupancy: new Map(), loading: false };
    default:
      return state;
  }
}

export default function AppointmentCalendarPanel({
  propertyId,
  value,
  onChange,
  excludeAppointmentId,
  allowPast = false,
}: AppointmentCalendarPanelProps) {
  const supabase = createBrowserClient();
  const [state, dispatch] = useReducer(
    panelReducer,
    undefined,
    () => ({ occupancy: new Map(), loading: !!propertyId })
  );
  const { occupancy, loading } = state;
  const [pendingDate, setPendingDate] = useState<Date | null>(null);

  useEffect(() => {
    dispatch({ type: "load", hasPropertyId: !!propertyId });

    if (!propertyId) return;

    let ignore = false;

    async function fetchOccupancy() {
      const { data: links, error: linksError } = await supabase
        .from("property_client")
        .select("client_id")
        .eq("property_id", propertyId);

      if (ignore) return;

      if (linksError || !links || links.length === 0) {
        if (linksError) console.error("Error loading property clients:", linksError);
        dispatch({ type: "error" });
        return;
      }

      const clientIds = links.map((l) => l.client_id);

      let query = supabase
        .from("appointment")
        .select("appointment_id, visit_date, status")
        .in("client_id", clientIds)
        .neq("status", "cancelled")
        .gte("visit_date", startOfToday().toISOString());

      if (excludeAppointmentId) {
        query = query.neq("appointment_id", excludeAppointmentId);
      }

      const { data, error } = await query;

      if (ignore) return;

      if (error) {
        console.error("Error loading availability:", error);
        dispatch({ type: "error" });
        return;
      }

      dispatch({ type: "success", occupancy: buildOccupancy(data ?? []) });
    }

    fetchOccupancy();

    return () => {
      ignore = true;
    };
  }, [propertyId, excludeAppointmentId, supabase]);

  const valueDate = useMemo(() => parseAppointmentDate(value), [value]);

  const today = startOfToday();
  const selectedDate = pendingDate ?? (valueDate ? startOfDay(valueDate) : null);
  const selectedHour = valueDate ? valueDate.getHours() : null;

  const daysWithAppointments = useMemo(() => {
    const dates: Date[] = [];
    occupancy.forEach((entry, key) => {
      if (entry.hasAppointments) {
        const [y, m, d] = key.split("-").map(Number);
        dates.push(new Date(y, m - 1, d));
      }
    });
    return dates;
  }, [occupancy]);

  const fullyBookedDays = useMemo(() => {
    const dates: Date[] = [];
    occupancy.forEach((entry, key) => {
      if (!hasAnyAvailableSlot(entry)) {
        const [y, m, d] = key.split("-").map(Number);
        dates.push(new Date(y, m - 1, d));
      }
    });
    return dates;
  }, [occupancy]);

  const selectedDayKey = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;
  const selectedOccupancy = selectedDayKey
    ? occupancy.get(selectedDayKey)
    : undefined;
  const now = new Date();
  const slots = START_HOURS.map((hour) => {
    const available = isStartAvailable(hour, selectedOccupancy);
    const slotStart = selectedDate ? combineDateAndHour(selectedDate, hour) : null;
    const isPast = slotStart && !allowPast ? !isAfter(slotStart, now) : false;
    return {
      hour,
      available: available && !isPast,
      reason: !available ? "occupied" : isPast ? "past" : null,
    };
  });

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      setPendingDate(null);
      return;
    }
    setPendingDate(startOfDay(date));
  };

  const handleSlotSelect = (hour: number) => {
    if (!selectedDate) return;
    if (!isStartAvailable(hour, selectedOccupancy)) return;
    const combined = combineDateAndHour(selectedDate, hour);
    if (!allowPast && !isAfter(combined, new Date())) return;
    setPendingDate(null);
    onChange(combined.toISOString());
  };

  const isSelectedDay = (day: Date) =>
    selectedDate ? isSameDay(day, selectedDate) : false;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <p
          className="text-sm font-semibold mb-2"
          style={{ color: "var(--foreground)" }}
        >
          Selecciona el día
        </p>
        <div
          className="rounded-xl p-3"
          style={{
            backgroundColor: "var(--background)",
            border: "1px solid var(--border-color)",
          }}
        >
          <style>{`
            .rdp-root {
              --rdp-accent-color: var(--primary);
              --rdp-accent-background-color: var(--primary-light);
              --rdp-day-height: 40px;
              --rdp-day-width: 40px;
              --rdp-day_button-height: 38px;
              --rdp-day_button-width: 38px;
              --rdp-selected-border: 2px solid var(--primary);
              --rdp-today-color: var(--primary);
              --rdp-weekday-opacity: 0.7;
              margin: 0;
            }
            .rdp-day_button:hover:not([disabled]) {
              background-color: var(--primary-light);
              color: var(--primary-dark);
            }
            .rdp-day--has-appointments .rdp-day_button {
              position: relative;
            }
            .rdp-day--has-appointments .rdp-day_button::after {
              content: "";
              position: absolute;
              bottom: 4px;
              left: 50%;
              transform: translateX(-50%);
              width: 5px;
              height: 5px;
              border-radius: 50%;
              background-color: var(--accent);
            }
            .rdp-day--selected .rdp-day_button {
              background-color: var(--primary);
              color: white;
            }
          `}</style>

          <DayPicker
            mode="single"
            selected={selectedDate ?? undefined}
            onSelect={handleDateSelect}
            locale={es}
            weekStartsOn={1}
            disabled={
              allowPast ? fullyBookedDays : [{ before: today }, ...fullyBookedDays]
            }
            modifiers={{
              hasAppointments: daysWithAppointments,
            }}
            modifiersClassNames={{
              hasAppointments: "rdp-day--has-appointments",
            }}
            components={{
              DayButton: ({ day, modifiers, ...buttonProps }) => (
                <button
                  {...buttonProps}
                  aria-label={format(day.date, "PPP", { locale: es })}
                  aria-pressed={isSelectedDay(day.date)}
                  style={{
                    opacity: modifiers.disabled ? 0.35 : 1,
                    cursor: modifiers.disabled ? "not-allowed" : "pointer",
                  }}
                />
              ),
            }}
          />

          <div
            className="flex flex-wrap items-center gap-3 pt-2 text-xs"
            style={{ color: "var(--muted)" }}
          >
            <span className="inline-flex items-center gap-1.5">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ backgroundColor: "var(--primary)" }}
              />
              Seleccionado
            </span>
            {propertyId && (
              <>
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ backgroundColor: "var(--accent)" }}
                  />
                  Con reservas
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className="inline-block w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: "var(--surface)",
                      border: "1px solid var(--border-color)",
                    }}
                  />
                  Sin disponibilidad
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div>
        <p
          className="text-sm font-semibold mb-2"
          style={{ color: "var(--foreground)" }}
        >
          Selecciona el horario
        </p>

        {selectedDate ? (
          <div className="space-y-3">
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              {format(selectedDate, "EEEE d 'de' MMMM", {
                locale: es,
              })}
            </p>

            {loading ? (
              <div className="flex items-center justify-center py-6">
                <div
                  className="animate-spin rounded-full h-6 w-6 border-b-2"
                  style={{ borderColor: "var(--primary)" }}
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {slots.map(({ hour, available, reason }) => {
                  const isSelected = selectedHour === hour;
                  const isOccupied = reason === "occupied";
                  const isPast = reason === "past";

                  let bg = "var(--background)";
                  let color = "var(--foreground)";
                  let border = "1px solid var(--border-color)";
                  if (isSelected) {
                    bg = "var(--primary)";
                    color = "white";
                    border = "1px solid var(--primary)";
                  } else if (isOccupied) {
                    bg = "#FEE2E2";
                    color = "#991B1B";
                    border = "1px solid #FCA5A5";
                  } else if (isPast) {
                    bg = "var(--surface)";
                    color = "var(--muted)";
                    border = "1px solid var(--border-color)";
                  }
                  const baseStyle: React.CSSProperties = {
                    backgroundColor: bg,
                    color,
                    border,
                    cursor: available ? "pointer" : "not-allowed",
                    opacity: available ? 1 : 0.85,
                  };

                  const statusLabel = isSelected
                    ? "Seleccionado"
                    : available
                      ? "Disponible"
                      : isPast
                        ? "Pasado"
                        : "Reservado";

                  const tooltip = isSelected
                    ? `Hora actual: ${formatHourRange(hour)}`
                    : isOccupied
                      ? `Este horario ya está reservado (${formatHourRange(hour)}). No se puede seleccionar de nuevo.`
                      : isPast
                        ? `Este horario ya pasó`
                        : `Seleccionar ${formatHourRange(hour)}`;

                  return (
                    <button
                      key={hour}
                      type="button"
                      onClick={() => handleSlotSelect(hour)}
                      disabled={!available}
                      aria-disabled={!available}
                      className="px-3 py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-90 disabled:hover:opacity-100 disabled:cursor-not-allowed"
                      style={baseStyle}
                      title={tooltip}
                    >
                      <span className="flex items-center justify-center gap-1.5 text-xs font-semibold">
                        {isOccupied && (
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <rect
                              x="3"
                              y="11"
                              width="18"
                              height="11"
                              rx="2"
                              ry="2"
                            />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                          </svg>
                        )}
                        <span>{formatHourRange(hour)}</span>
                      </span>
                      <span className="block text-[10px] mt-0.5 opacity-90">
                        {statusLabel}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {propertyId &&
              !loading &&
              !hasAnyAvailableSlot(selectedOccupancy) && (
                <p className="text-xs" style={{ color: "#DC2626" }}>
                  Este día no tiene horarios disponibles. Por favor
                  selecciona otra fecha.
                </p>
              )}
          </div>
        ) : (
          <div
            className="rounded-xl p-4 text-sm"
            style={{
              backgroundColor: "var(--background)",
              border: "1px dashed var(--border-color)",
              color: "var(--muted)",
            }}
          >
            Primero elige un día disponible en el calendario para ver
            los horarios.
          </div>
        )}
      </div>
    </div>
  );
}
