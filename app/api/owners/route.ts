import { NextRequest, NextResponse } from "next/server";
import { getOwners, createOwner } from "@/app/features/owner/services";

export async function GET() {
  try {
    const owners = await getOwners();
    return NextResponse.json(owners);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener propietarios" },
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

    const owner = await createOwner({
      name: body.name.trim(),
      document_id: body.document_id?.trim() || undefined,
      email: body.email?.trim() || undefined,
      phone: body.phone?.trim() || undefined,
    });

    return NextResponse.json(owner, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Error al crear propietario" },
      { status: 500 }
    );
  }
}
