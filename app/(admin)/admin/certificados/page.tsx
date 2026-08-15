import { CertificateCard, StatsCard } from "@features/admin";

export default function CertificadosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
          Certificados de Libertad y Tradicion
        </h1>
        <p className="text-sm mt-2" style={{ color: "var(--muted)" }}>
          Gestion de certificados emitidos por la Superintendencia de Notariado y Registro (SNR) de Colombia.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="Documento oficial"
          value="SNR"
          icon="📜"
          description="Emitido por la SNR"
        />
        <StatsCard
          title="Validez legal"
          value="30 dias"
          icon="⏱️"
          description="Para tramites juridicos"
        />
        <StatsCard
          title="Plataforma"
          value="100%"
          icon="🌐"
          description="En linea desde cualquier lugar"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CertificateCard
          icon="📋"
          title="Ventanilla Unica de la SNR"
          description="Plataforma oficial para la compra y consulta de certificados de libertad y tradicion de inmuebles registrados en Colombia. Acceda desde la ventanilla virtual de la Superintendencia de Notariado y Registro."
          url="https://ventanilla.supernotariado.gov.co/"
          buttonLabel="Ir a la Ventanilla SNR"
        />
        <CertificateCard
          icon="🏛️"
          title="Superintendencia de Notariado y Registro"
          description="Sitio institucional de la SNR donde encontrara informacion sobre requisitos, tarifas y procedimientos para la expedicion de certificados de tradicion y libertad de inmuebles."
          url="https://www.supernotariado.gov.co/"
          buttonLabel="Visitar sitio de la SNR"
        />
      </div>

      <div
        className="rounded-2xl p-6"
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border-color)",
        }}
      >
        <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--foreground)" }}>
          ¿Que es un Certificado de Libertad y Tradicion?
        </h2>
        <div className="space-y-3 text-sm" style={{ color: "var(--muted)" }}>
          <p>
            Es un documento publico que registra la historia juridica de un inmueble (propiedad): propietarios
            anteriores y actuales, gravamenes, embargos, limitaciones, servidumbres y demas actos
            inscritos en la Oficina de Registro de Instrumentos Publicos.
          </p>
          <p>
            Es un requisito indispensable para procesos de compraventa, tramites hipotecarios, embargos,
            sucesiones y cualquier gestion juridica sobre un bien raiz en Colombia.
          </p>
        </div>
      </div>

      <div
        className="rounded-2xl p-6"
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border-color)",
        }}
      >
        <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--foreground)" }}>
          Informacion de contacto
        </h2>
        <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
          Si requiere asistencia personalizada con la compra o consulta de certificados, no dude en
          contactarnos.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-xs font-medium mb-1" style={{ color: "var(--muted)" }}>
              Telefono
            </p>
            <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
              +57 (601) 742 8973
            </p>
          </div>
          <div>
            <p className="text-xs font-medium mb-1" style={{ color: "var(--muted)" }}>
              WhatsApp
            </p>
            <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
              +57 311 456 7890
            </p>
          </div>
          <div>
            <p className="text-xs font-medium mb-1" style={{ color: "var(--muted)" }}>
              Email
            </p>
            <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
              contacto@wasave.co
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
