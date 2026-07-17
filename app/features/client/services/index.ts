import { createClient as createSupabaseClient } from "@/app/shared/utils/supabase/client";
import type { Client, CreateClientInput, UpdateClientInput } from "../types";

const supabase = createSupabaseClient();

export async function getClients(): Promise<Client[]> {
  const { data, error } = await supabase
    .from("client")
    .select("*")
    .order("name");

  if (error) throw error;
  return data ?? [];
}

export async function getClientById(id: string): Promise<Client | null> {
  const { data, error } = await supabase
    .from("client")
    .select("*")
    .eq("client_id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data;
}

export async function createClient(input: CreateClientInput): Promise<Client> {
  const { data, error } = await supabase
    .from("client")
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateClient(
  id: string,
  input: UpdateClientInput
): Promise<Client> {
  const { data, error } = await supabase
    .from("client")
    .update(input)
    .eq("client_id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteClient(id: string): Promise<void> {
  const { error } = await supabase
    .from("client")
    .delete()
    .eq("client_id", id);

  if (error) throw error;
}
