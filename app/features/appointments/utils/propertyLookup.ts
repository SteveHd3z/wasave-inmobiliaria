import { createBrowserClient } from "@shared/utils/supabase";
import type { Property } from "@features/properties";

export async function fetchPropertiesForClients(
  clientIds: string[]
): Promise<Map<string, Property[]>> {
  const map = new Map<string, Property[]>();
  if (clientIds.length === 0) return map;

  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("property_client")
    .select("client_id, property:property_id(*)")
    .in("client_id", clientIds);

  if (error) {
    console.error("Error loading properties for clients:", error);
    return map;
  }

  for (const link of (data ?? []) as unknown as Array<{
    client_id: string;
    property: Property | Property[] | null;
  }>) {
    const property = Array.isArray(link.property) ? link.property[0] : link.property;
    if (!property) continue;
    const list = map.get(link.client_id) ?? [];
    list.push(property);
    map.set(link.client_id, list);
  }

  return map;
}
