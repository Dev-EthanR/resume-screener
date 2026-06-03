export const badgeColorStyles = {
  blue: "border-accent bg-accent/10 text-accent",
  green: "border-success bg-success/10 text-success",
  red: "border-danger-100 bg-danger-500/10 text-danger-100",
  yellow: "border-warning bg-warning/10 text-warning",
};

export type BadgeColor = keyof typeof badgeColorStyles;
