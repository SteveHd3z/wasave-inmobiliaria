import { createClient as createSupabaseClient } from "@/app/shared/utils/supabase/client";
import type {
  Property,
  PropertyMedia,
  PropertyWithMedia,
  CreatePropertyInput,
  UpdatePropertyInput,
} from "../types";

const supabase = createSupabaseClient();

export async function getProperties(
  filters?: { type?: string; owner_id?: string }
): Promise<Property[]> {
  let query = supabase.from("property").select("*").order("title");

  if (filters?.type) {
    query = query.eq("type", filters.type);
  }
  if (filters?.owner_id) {
    query = query.eq("owner_id", filters.owner_id);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getPropertyById(id: string): Promise<PropertyWithMedia | null> {
  const { data: property, error } = await supabase
    .from("property")
    .select("*, owner:owner_id(*)")
    .eq("property_id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }

  const { data: media, error: mediaError } = await supabase
    .from("property_media")
    .select("*")
    .eq("property_id", id)
    .order("display_order");

  if (mediaError) throw mediaError;

  return {
    ...property,
    media: media ?? [],
  };
}

export async function createProperty(input: CreatePropertyInput): Promise<Property> {
  const { data, error } = await supabase
    .from("property")
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProperty(
  id: string,
  input: UpdatePropertyInput
): Promise<Property> {
  const { data, error } = await supabase
    .from("property")
    .update(input)
    .eq("property_id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProperty(id: string): Promise<void> {
  const { error } = await supabase
    .from("property")
    .delete()
    .eq("property_id", id);

  if (error) throw error;
}

export async function addPropertyMedia(data: {
  property_id: string;
  file_url: string;
  cover_image?: boolean;
  display_order?: number;
}): Promise<PropertyMedia> {
  const { data: media, error } = await supabase
    .from("property_media")
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return media;
}

export async function removePropertyMedia(id: string): Promise<void> {
  const { error } = await supabase
    .from("property_media")
    .delete()
    .eq("media_id", id);

  if (error) throw error;
}
