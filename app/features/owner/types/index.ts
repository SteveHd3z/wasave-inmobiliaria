export interface Owner {
  owner_id: string;
  document_id: string | null;
  name: string;
  email: string | null;
  phone: string | null;
}

export interface CreateOwnerInput {
  document_id?: string;
  name: string;
  email?: string;
  phone?: string;
}

export interface UpdateOwnerInput {
  document_id?: string;
  name?: string;
  email?: string;
  phone?: string;
}
