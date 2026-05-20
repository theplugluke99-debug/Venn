import { Badge } from "@/components/ui/Badge";
import type { IntentScore } from "@/types";

interface IntentBadgeProps {
  score: IntentScore;
}

const config: Record<IntentScore, { label: string; variant: "red" | "gold" | "green" }> = {
  high: { label: "High Intent", variant: "red" },
  medium: { label: "Medium Intent", variant: "gold" },
  low: { label: "Low Intent", variant: "green" },
};

export function IntentBadge({ score }: IntentBadgeProps) {
  const { label, variant } = config[score] ?? config.medium;
  return (
    <Badge variant={variant}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {label}
    </Badge>
  );
}
