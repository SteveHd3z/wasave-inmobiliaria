import { NextRequest, NextResponse } from "next/server";
import { getProperties, createProperty } from "@/app/features/properties/services";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || undefined;
    const owner_id = searchParams.get("owner_id") || undefined;

    const properties = await getProperties({ type, owner_id });
    return NextResponse.json(properties);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener propiedades" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.title || typeof body.title !== "string" || body.title.trim() === "") {
      return NextResponse.json(
        { error: "El título es obligatorio" },
        { status: 400 }
      );
    }

    if (!body.owner_id || typeof body.owner_id !== "string") {
      return NextResponse.json(
        { error: "El propietario es obligatorio" },
        { status: 400 }
      );
    }

    const property = await createProperty({
      title: body.title.trim(),
      description: body.description?.trim() || undefined,
      area: body.area ? Number(body.area) : undefined,
      base_price: body.base_price ? Number(body.base_price) : undefined,
      sale_price: body.sale_price ? Number(body.sale_price) : undefined,
      address: body.address?.trim() || undefined,
      type: body.type?.trim() || undefined,
      owner_id: body.owner_id,
    });

    return NextResponse.json(property, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Error al crear propiedad" },
      { status: 500 }
    );
  }
}
