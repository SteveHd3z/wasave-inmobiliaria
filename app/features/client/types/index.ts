export interface Client {
  client_id: string;
  document_id: string | null;
  name: string;
  last_name: string | null;
  email: string | null;
  phone: string | null;
}

//test comment

export interface CreateClientInput {
  document_id?: string;
  name: string;
  last_name?: string;
  email?: string;
  phone?: string;
}

export interface UpdateClientInput {
  document_id?: string;
  name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
}
