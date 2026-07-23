"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@shared/components/ui";
import type { PropertyWithMedia } from "@features/properties";

interface PropertyListProps {
  properties: PropertyWithMedia[];
  onDelete: (id: string) => void;
}

export default function PropertyList({ properties, onDelete }: PropertyListProps) {
  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg" style={{ color: "var(--muted)" }}>
          No hay propiedades registradas
        </p>
        <Link href="/admin/propiedades/nueva">
          <Button className="mt-4">Crear primera propiedad</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <th className="text-left py-3 px-2 font-medium" style={{ color: "var(--muted)" }}>
              Imagen
            </th>
            <th className="text-left py-3 px-2 font-medium" style={{ color: "var(--muted)" }}>
              Titulo
            </th>
            <th className="text-left py-3 px-2 font-medium" style={{ color: "var(--muted)" }}>
              Tipo
            </th>
            <th className="text-left py-3 px-2 font-medium" style={{ color: "var(--muted)" }}>
              Precio Base
            </th>
            <th className="text-left py-3 px-2 font-medium" style={{ color: "var(--muted)" }}>
              Precio Venta
            </th>
            <th className="text-left py-3 px-2 font-medium" style={{ color: "var(--muted)" }}>
              Owner
            </th>
            <th className="text-right py-3 px-2 font-medium" style={{ color: "var(--muted)" }}>
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {properties.map((prop) => {
            const cover = prop.media?.find((m) => m.cover_image);
            return (
              <tr key={prop.property_id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                <td className="py-3 px-2">
                  {cover ? (
                    <div className="relative w-16 h-12 rounded-lg overflow-hidden">
                      <Image
                        src={cover.file_url}
                        alt={prop.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div
                      className="w-16 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: "var(--background)" }}
                    >
                      <span style={{ color: "var(--muted)" }}>Sin img</span>
                    </div>
                  )}
                </td>
                <td className="py-3 px-2 font-medium" style={{ color: "var(--foreground)" }}>
                  {prop.title}
                </td>
                <td className="py-3 px-2" style={{ color: "var(--foreground)" }}>
                  {prop.type ?? "-"}
                </td>
                <td className="py-3 px-2" style={{ color: "var(--foreground)" }}>
                  {prop.base_price ? `$${prop.base_price.toLocaleString()}` : "-"}
                </td>
                <td className="py-3 px-2" style={{ color: "var(--foreground)" }}>
                  {prop.sale_price ? `$${prop.sale_price.toLocaleString()}` : "-"}
                </td>
                <td className="py-3 px-2" style={{ color: "var(--foreground)" }}>
                  {prop.owner?.name ?? "-"}
                </td>
                <td className="py-3 px-2">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/propiedades/${prop.property_id}/editar`}>
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(prop.property_id)}>
                      Eliminar
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
