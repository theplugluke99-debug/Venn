export function getHealthColour(score: number): string {
  if (score >= 80) return "#4CAF50";
  if (score >= 50) return "#C4973F";
  return "#C0392B";
}

export function getHealthBorderColour(score: number): string {
  if (score >= 80) return "#4CAF50";
  if (score >= 50) return "#C4973F";
  return "#C0392B";
}

export function getHealthNarrative(score: number, name: string): string {
  if (score >= 80) return `${name} is healthy and engaged.`;
  if (score >= 60) return `${name} needs a check-in soon.`;
  if (score >= 40) return `${name} is showing warning signs. Act this week.`;
  return `${name} is at risk. Prioritise immediately.`;
}

export function getHealthNarrativeColour(score: number): string {
  if (score >= 80) return "#4CAF50";
  if (score >= 60) return "#888580";
  if (score >= 40) return "#C4973F";
  return "#C0392B";
}
