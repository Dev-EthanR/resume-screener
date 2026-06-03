export const donutColorMap = {
  blue: "text-accent!",
  green: "text-success!",
  red: "text-danger-500!",
  yellow: "text-warning!",
  white: "text-white!",
  gray: "text-text!",
};

export interface DonutColors {
  progressColor?: DonutColor;
  numColor?: DonutColor;
  unitColor?: DonutColor;
  labelColor?: DonutColor;
}

export type DonutColor = keyof typeof donutColorMap;

export const donutSizeConfig = {
  small: {
    px: 80,
    thickness: 3,
    numClass: "text-2xl",
    unitClass: "text-sm",
    labelClass: "text-[0.575rem]",
  },
  medium: {
    px: 120,
    thickness: 4,
    numClass: "text-4xl",
    unitClass: "text-xl",
    labelClass: "text-xs",
  },
  large: {
    px: 160,
    thickness: 4,
    numClass: "text-5xl",
    unitClass: "text-2xl",
    labelClass: "text-sm",
  },
};
