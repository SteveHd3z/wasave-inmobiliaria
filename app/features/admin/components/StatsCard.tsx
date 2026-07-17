import { Card } from "@shared/components/ui";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  description?: string;
}

export default function StatsCard({ title, value, icon, description }: StatsCardProps) {
  return (
    <Card hover={false} padding="md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium" style={{ color: "var(--muted)" }}>
            {title}
          </p>
          <p className="text-3xl font-bold mt-2" style={{ color: "var(--foreground)" }}>
            {value}
          </p>
          {description && (
            <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
              {description}
            </p>
          )}
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </Card>
  );
}
