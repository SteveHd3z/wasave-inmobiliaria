import { NextRequest, NextResponse } from "next/server";
import {
  getPropertyById,
  addPropertyMedia,
  removePropertyMedia,
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

    return NextResponse.json(property.media);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener medios" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const property = await getPropertyById(id);
    if (!property) {
      return NextResponse.json(
        { error: "Propiedad no encontrada" },
        { status: 404 }
      );
    }

    if (!body.file_url || typeof body.file_url !== "string") {
      return NextResponse.json(
        { error: "La URL del archivo es obligatoria" },
        { status: 400 }
      );
    }

    const media = await addPropertyMedia({
      property_id: id,
      file_url: body.file_url,
      cover_image: body.cover_image ?? false,
      display_order: body.display_order ? Number(body.display_order) : undefined,
    });

    return NextResponse.json(media, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Error al agregar medio" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mediaId = searchParams.get("media_id");

    if (!mediaId) {
      return NextResponse.json(
        { error: "El ID del medio es obligatorio" },
        { status: 400 }
      );
    }

    await removePropertyMedia(mediaId);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Error al eliminar medio" },
      { status: 500 }
    );
  }
}
