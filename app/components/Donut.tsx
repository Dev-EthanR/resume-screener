"use client";

import CircularProgress from "@mui/material/CircularProgress";
import { useProgress } from "../hooks/useProgress";
import CountUp from "react-countup";
import clsx from "clsx";

interface Props {
  percentage: number;
  size: "small" | "medium" | "large";
  text?: string;
  progressColor?: string;
  textColor?: string;
  percentLabel?: boolean;
  instant?: boolean;
}

const sizeConfig = {
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
    thickness: 5,
    numClass: "text-5xl",
    unitClass: "text-2xl",
    labelClass: "text-sm",
  },
};

const Donut = ({
  percentage,
  text,
  size,
  progressColor,
  textColor,
  percentLabel = true,
  instant = false,
}: Props) => {
  const { progress, durationInMs, durationInSeconds } = useProgress(percentage);
  const { px, thickness, numClass, unitClass, labelClass } = sizeConfig[size];

  return (
    <div className="relative flex items-center justify-center">
      <CircularProgress
        enableTrackSlot
        variant="determinate"
        className={clsx(!progressColor && "text-accent!")}
        value={instant ? percentage : progress}
        size={px}
        thickness={thickness}
        aria-label={`${percentage}% complete`}
        sx={{
          strokeLinecap: "round",
          ...(progressColor && { color: progressColor }),
          "& .MuiCircularProgress-circle": {
            transition: `stroke-dashoffset ${durationInMs}ms ease-out`,
          },
        }}
      />
      <div className="absolute flex flex-col items-center justify-center font-bold">
        <div>
          <CountUp
            start={instant ? percentage : 0}
            end={percentage}
            duration={durationInSeconds}
            className={clsx(!textColor && "text-white", numClass)}
            style={textColor ? { color: textColor } : undefined}
          />
          {percentLabel && (
            <span
              className={clsx(!textColor && "text-text", unitClass)}
              style={textColor ? { color: textColor } : undefined}
            >
              %
            </span>
          )}
        </div>
        {text && (
          <div
            className={clsx(!textColor && "text-accent", labelClass)}
            style={textColor ? { color: textColor } : undefined}
          >
            {text}
          </div>
        )}
      </div>
    </div>
  );
};

export default Donut;
