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
