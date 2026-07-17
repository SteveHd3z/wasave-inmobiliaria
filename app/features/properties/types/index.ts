import type { Owner } from "@/app/features/owner/types";

export interface Property {
  property_id: string;
  title: string;
  description: string | null;
  area: number | null;
  base_price: number | null;
  sale_price: number | null;
  address: string | null;
  type: string | null;
  owner_id: string;
}

export interface PropertyMedia {
  media_id: string;
  file_url: string;
  cover_image: boolean;
  display_order: number | null;
  created_at: string;
  property_id: string;
}

export interface PropertyWithMedia extends Property {
  media: PropertyMedia[];
  owner?: Owner;
}

export interface CreatePropertyInput {
  title: string;
  description?: string;
  area?: number;
  base_price?: number;
  sale_price?: number;
  address?: string;
  type?: string;
  owner_id: string;
}

export interface UpdatePropertyInput {
  title?: string;
  description?: string;
  area?: number;
  base_price?: number;
  sale_price?: number;
  address?: string;
  type?: string;
  owner_id?: string;
}
