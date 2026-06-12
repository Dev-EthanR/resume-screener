import { BadgeColor } from "@/app/config/badge.config";
import { DonutColor } from "@/app/config/donut.config";

export function scoreLabel(score: number): string {
  if (score >= 81) return "Strong match";
  if (score >= 61) return "Good match";
  if (score >= 31) return "Needs work";
  return "Bad match";
}

export function scoreBadgeColor(score: number): BadgeColor {
  if (score >= 81) return "green";
  if (score >= 61) return "blue";
  if (score >= 31) return "yellow";
  return "red";
}

export function scoreDonutColor(score: number): DonutColor {
  if (score >= 81) return "green";
  if (score >= 61) return "blue";
  if (score >= 31) return "yellow";
  return "red";
}
