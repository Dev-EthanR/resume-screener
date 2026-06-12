import clsx from "clsx";
import { ReactNode } from "react";
import { BadgeColor, badgeColorStyles } from "../config/badge.config";

interface Props {
  color: BadgeColor;
  children: ReactNode;
  className?: string;
}

const Badge = ({ children, color, className }: Props) => {
  return (
    <div
      className={clsx(
        className,
        "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium border",
        badgeColorStyles[color],
      )}
    >
      <span className="flex items-center gap-2">{children}</span>
    </div>
  );
};

export default Badge;
