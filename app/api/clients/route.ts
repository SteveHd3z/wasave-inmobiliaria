import { NextRequest, NextResponse } from "next/server";
import { getClients, createClient } from "@/app/features/client/services";

export async function GET() {
  try {
    const clients = await getClients();
    return NextResponse.json(clients);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener clientes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || typeof body.name !== "string" || body.name.trim() === "") {
      return NextResponse.json(
        { error: "El nombre es obligatorio" },
        { status: 400 }
      );
    }

    const client = await createClient({
      name: body.name.trim(),
      document_id: body.document_id?.trim() || undefined,
      last_name: body.last_name?.trim() || undefined,
      email: body.email?.trim() || undefined,
      phone: body.phone?.trim() || undefined,
    });

    return NextResponse.json(client, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Error al crear cliente" },
      { status: 500 }
    );
  }
}
