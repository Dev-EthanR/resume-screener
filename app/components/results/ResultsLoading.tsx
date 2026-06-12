import { useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Donut from "../Donut";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";

const ResultsLoading = () => {
  return (
    <SkeletonTheme baseColor="#142436" highlightColor="#1e3a52">
      <div className="w-full space-y-6">
        <h1 className="text-white text-3xl font-bold">Your match report</h1>
        <div className="border border-border rounded-lg p-6 bg-surface ">
          <div className="flex flex-col items-center lg:flex-row lg:items-stretch gap-10">
            <Donut
              percentage={0}
              size="large"
              color={{
                progressColor: "blue",
                labelColor: "blue",
              }}
            />
            <div className="flex flex-col justify-between w-full">
              <div>
                <Skeleton height={24} />
                <Skeleton height={74} />
              </div>
              <Skeleton height={48} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border border-border rounded-lg p-4 bg-surface space-y-2">
            <Skeleton count={2} height={20} />
            <Skeleton height={162} borderRadius={8} />
          </div>
          <div className="border border-border rounded-lg p-4 bg-surface space-y-2">
            <Skeleton count={2} height={20} />
            <Skeleton height={162} borderRadius={8} />
          </div>
        </div>

        <div className="lg:border border-border rounded-lg lg:p-6 lg:bg-surface space-y-4">
          <div className="flex items-center gap-2 text-white font-semibold">
            <div className="icon border-none">
              <AutoAwesomeIcon sx={{ fontSize: 18 }} />
            </div>
            Suggested resume improvements
          </div>
          <ul className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <li key={i}>
                <Skeleton height={60} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default ResultsLoading;
