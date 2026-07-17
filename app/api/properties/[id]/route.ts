import { NextRequest, NextResponse } from "next/server";
import {
  getPropertyById,
  updateProperty,
  deleteProperty,
} from "@/app/features/properties/services";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const property = await getPropertyById(id);

    if (!property) {
      return NextResponse.json(
        { error: "Propiedad no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(property);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener propiedad" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await getPropertyById(id);
    if (!existing) {
      return NextResponse.json(
        { error: "Propiedad no encontrada" },
        { status: 404 }
      );
    }

    const property = await updateProperty(id, {
      title: body.title?.trim(),
      description: body.description?.trim(),
      area: body.area ? Number(body.area) : undefined,
      base_price: body.base_price ? Number(body.base_price) : undefined,
      sale_price: body.sale_price ? Number(body.sale_price) : undefined,
      address: body.address?.trim(),
      type: body.type?.trim(),
      owner_id: body.owner_id,
    });

    return NextResponse.json(property);
  } catch {
    return NextResponse.json(
      { error: "Error al actualizar propiedad" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await getPropertyById(id);
    if (!existing) {
      return NextResponse.json(
        { error: "Propiedad no encontrada" },
        { status: 404 }
      );
    }

    await deleteProperty(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Error al eliminar propiedad" },
      { status: 500 }
    );
  }
}
