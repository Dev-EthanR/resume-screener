"use client";

import CircularProgress from "@mui/material/CircularProgress";
import { useProgress } from "../hooks/useProgress";
import CountUp from "react-countup";
import clsx from "clsx";
import {
  donutColorMap,
  DonutColors,
  donutSizeConfig,
} from "../config/donut.config";

interface Props {
  percentage: number;
  size: "small" | "medium" | "large";
  text?: string;
  color?: DonutColors;
  percentLabel?: boolean;
  instant?: boolean;
}

const Donut = ({
  percentage,
  text,
  size,
  color,
  percentLabel = true,
  instant = false,
}: Props) => {
  const { progress, durationInMs, durationInSeconds } = useProgress(percentage);
  const { px, thickness, numClass, unitClass, labelClass } =
    donutSizeConfig[size];
  const {
    progressColor = "blue",
    numColor = "white",
    unitColor = "white",
    labelColor = "white",
  } = color || {};

  return (
    <div className="relative flex items-center justify-center">
      <CircularProgress
        enableTrackSlot
        variant="determinate"
        className={donutColorMap[progressColor]}
        value={instant ? percentage : progress}
        size={px}
        thickness={thickness}
        aria-label={`${percentage}% complete`}
        sx={{
          strokeLinecap: "round",
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
            duration={instant ? 0 : durationInSeconds}
            className={clsx(donutColorMap[numColor], numClass)}
          />
          {percentLabel && (
            <span className={clsx(donutColorMap[unitColor], unitClass)}>%</span>
          )}
        </div>
        {text && (
          <div className={clsx(donutColorMap[labelColor], labelClass)}>
            {text}
          </div>
        )}
      </div>
    </div>
  );
};

export default Donut;
