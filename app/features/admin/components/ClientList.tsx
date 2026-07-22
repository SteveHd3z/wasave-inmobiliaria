"use client";

import Link from "next/link";
import { Button } from "@shared/components/ui";
import type { Client } from "@features/client";

interface ClientListProps {
  clients: Client[];
  onDelete: (id: string) => void;
}

export default function ClientList({ clients, onDelete }: ClientListProps) {
  if (clients.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg" style={{ color: "var(--muted)" }}>
          No hay clientes registrados
        </p>
        <Link href="/admin/clientes/nuevo">
          <Button className="mt-4">Crear primer cliente</Button>
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
              Apellido
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
          {clients.map((client) => (
            <tr key={client.client_id} style={{ borderBottom: "1px solid var(--border-color)" }}>
              <td className="py-3 px-2 font-medium" style={{ color: "var(--foreground)" }}>
                {client.name}
              </td>
              <td className="py-3 px-2" style={{ color: "var(--foreground)" }}>
                {client.last_name ?? "-"}
              </td>
              <td className="py-3 px-2" style={{ color: "var(--foreground)" }}>
                {client.document_id ?? "-"}
              </td>
              <td className="py-3 px-2" style={{ color: "var(--foreground)" }}>
                {client.email ?? "-"}
              </td>
              <td className="py-3 px-2" style={{ color: "var(--foreground)" }}>
                {client.phone ?? "-"}
              </td>
              <td className="py-3 px-2">
                <div className="flex justify-end gap-2">
                  <Link href={`/admin/clientes/${client.client_id}/editar`}>
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(client.client_id)}>
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
