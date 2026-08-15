import { Card } from "@shared/components/ui";

interface CertificateCardProps {
  title: string;
  description: string;
  url: string;
  icon: string;
  buttonLabel: string;
}

export default function CertificateCard({
  title,
  description,
  url,
  icon,
  buttonLabel,
}: CertificateCardProps) {
  return (
    <Card hover={false} padding="lg">
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">{icon}</span>
          <h3 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
            {title}
          </h3>
        </div>
        <p className="text-sm mb-6 flex-1" style={{ color: "var(--muted)" }}>
          {description}
        </p>
        <div>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-5 py-2.5 text-sm rounded-full font-semibold transition-all hover:opacity-90"
            style={{
              backgroundColor: "var(--primary)",
              color: "white",
              border: "none",
            }}
          >
            {buttonLabel}
          </a>
        </div>
      </div>
    </Card>
  );
}
