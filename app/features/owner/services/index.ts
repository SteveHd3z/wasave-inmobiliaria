import { createClient } from "@/app/shared/utils/supabase/client";
import type { Owner, CreateOwnerInput, UpdateOwnerInput } from "../types";

const supabase = createClient();

export async function getOwners(): Promise<Owner[]> {
  const { data, error } = await supabase
    .from("owner")
    .select("*")
    .order("name");

  if (error) throw error;
  return data ?? [];
}

export async function getOwnerById(id: string): Promise<Owner | null> {
  const { data, error } = await supabase
    .from("owner")
    .select("*")
    .eq("owner_id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data;
}

export async function createOwner(input: CreateOwnerInput): Promise<Owner> {
  const { data, error } = await supabase
    .from("owner")
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateOwner(
  id: string,
  input: UpdateOwnerInput
): Promise<Owner> {
  const { data, error } = await supabase
    .from("owner")
    .update(input)
    .eq("owner_id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteOwner(id: string): Promise<void> {
  const { error } = await supabase
    .from("owner")
    .delete()
    .eq("owner_id", id);

  if (error) throw error;
}
