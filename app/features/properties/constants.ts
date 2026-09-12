export const PROPERTY_TYPES = {
  casa: { label: "Casa Finca", color: "#059669" },
  lote: { label: "Lote", color: "#D97706" },
  cabana: { label: "Cabaña", color: "#7C3AED" },
  local: { label: "Local", color: "#2563EB" },
} as const;

export type PropertyType = keyof typeof PROPERTY_TYPES;

export const PROPERTY_TYPE_OPTIONS = Object.entries(PROPERTY_TYPES).map(
  ([value, { label }]) => ({ value, label })
);
