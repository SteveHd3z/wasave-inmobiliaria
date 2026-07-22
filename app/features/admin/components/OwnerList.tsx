"use client";

import Link from "next/link";
import { Button } from "@shared/components/ui";
import type { Owner } from "@features/owner";

interface OwnerListProps {
  owners: Owner[];
  onDelete: (id: string) => void;
}

export default function OwnerList({ owners, onDelete }: OwnerListProps) {
  if (owners.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg" style={{ color: "var(--muted)" }}>
          No hay propietarios registrados
        </p>
        <Link href="/admin/owners/nuevo">
          <Button className="mt-4">Crear primer propietario</Button>
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
              Nombre
            </th>
            <th className="text-left py-3 px-2 font-medium" style={{ color: "var(--muted)" }}>
              Documento
            </th>
            <th className="text-left py-3 px-2 font-medium" style={{ color: "var(--muted)" }}>
              Email
            </th>
            <th className="text-left py-3 px-2 font-medium" style={{ color: "var(--muted)" }}>
              Telefono
            </th>
            <th className="text-right py-3 px-2 font-medium" style={{ color: "var(--muted)" }}>
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {owners.map((owner) => (
            <tr key={owner.owner_id} style={{ borderBottom: "1px solid var(--border-color)" }}>
              <td className="py-3 px-2 font-medium" style={{ color: "var(--foreground)" }}>
                {owner.name}
              </td>
              <td className="py-3 px-2" style={{ color: "var(--foreground)" }}>
                {owner.document_id ?? "-"}
              </td>
              <td className="py-3 px-2" style={{ color: "var(--foreground)" }}>
                {owner.email ?? "-"}
              </td>
              <td className="py-3 px-2" style={{ color: "var(--foreground)" }}>
                {owner.phone ?? "-"}
              </td>
              <td className="py-3 px-2">
                <div className="flex justify-end gap-2">
                  <Link href={`/admin/owners/${owner.owner_id}/editar`}>
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(owner.owner_id)}>
                    Eliminar
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
