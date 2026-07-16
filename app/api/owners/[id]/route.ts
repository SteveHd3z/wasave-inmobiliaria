import { NextRequest, NextResponse } from "next/server";
import {
  getOwnerById,
  updateOwner,
  deleteOwner,
} from "@/app/features/owner/services";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const owner = await getOwnerById(id);

    if (!owner) {
      return NextResponse.json(
        { error: "Propietario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(owner);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener propietario" },
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

    const existing = await getOwnerById(id);
    if (!existing) {
      return NextResponse.json(
        { error: "Propietario no encontrado" },
        { status: 404 }
      );
    }

    const owner = await updateOwner(id, {
      name: body.name?.trim(),
      document_id: body.document_id?.trim(),
      email: body.email?.trim(),
      phone: body.phone?.trim(),
    });

    return NextResponse.json(owner);
  } catch {
    return NextResponse.json(
      { error: "Error al actualizar propietario" },
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

    const existing = await getOwnerById(id);
    if (!existing) {
      return NextResponse.json(
        { error: "Propietario no encontrado" },
        { status: 404 }
      );
    }

    await deleteOwner(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Error al eliminar propietario" },
      { status: 500 }
    );
  }
}
