"use client";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import GeneratingTokensIcon from "@mui/icons-material/GeneratingTokens";
import clsx from "clsx";
import { JSX } from "react";
import Donut from "../Donut";
type Status = "pending" | "generating" | "done";
interface Phase {
  label: {
    title: string;
    subText: string;
  };
  status: Status;
  icon: JSX.Element;
}

interface ProcessStatus {
  parsingStatus: Status;
  readingStatus: Status;
  comparingStatus: Status;
  generatingStatus: Status;
}

interface Props {
  process: ProcessStatus;
}

const PhaseTracker = ({ process }: Props) => {
  const phases: Phase[] = [
    {
      label: {
        title: "Parsing resume",
        subText: "Extracting text and structure",
      },
      status: process.parsingStatus,
      icon: (
        <FileUploadIcon
          className={
            process.parsingStatus === "generating" ? "animate-bounce " : ""
          }
        />
      ),
    },
    {
      label: {
        title: "Reading job description",
        subText: "Identifying required skills",
      },
      status: process.readingStatus,
      icon: (
        <DocumentScannerIcon
          className={
            process.readingStatus === "generating" ? "animate-ping " : ""
          }
        />
      ),
    },
    {
      label: {
        title: "Comparing skills",
        subText: "Scoring keyword and skill overlap",
      },
      status: process.comparingStatus,
      icon: (
        <AutorenewIcon
          className={
            process.comparingStatus === "generating" ? "animate-spin" : ""
          }
        />
      ),
    },
    {
      label: {
        title: "Generating suggestions",
        subText: "Drafting tailored bullet points",
      },
      status: process.generatingStatus,
      icon: (
        <GeneratingTokensIcon
          className={
            process.generatingStatus === "generating"
              ? "animate-pulse text-yellow-400"
              : ""
          }
        />
      ),
    },
  ];

  const completedCount = phases.reduce((acc, phase) => {
    if (phase.status === "done") return acc + 1;
    if (phase.status === "generating") return acc + 0.5;
    return acc;
  }, 0);

  const percentage = Math.round((completedCount / phases.length) * 100);

  return (
    <div className="p-6 w-full  space-y-4">
      <Donut
        percentage={percentage}
        size="large"
        color={{ labelColor: "gray", numColor: "white", progressColor: "blue" }}
        text="analyzing"
      />
      <h2 className="text-white font-semibold text-3xl text-center py-4">
        Analyzing your resume
      </h2>
      <div className="space-y-3 mb-6">
        {phases.map((phase, i) => (
          <PhaseRow key={i} phase={phase} />
        ))}
      </div>
      <p className="text-gray-300 text-sm text-center">
        This usually takes a few seconds · your file stays private
      </p>
    </div>
  );
};

const PhaseRow = ({ phase }: { phase: Phase }) => (
  <div
    className={clsx(
      "flex items-center gap-3 border p-2 rounded-2xl max-w-xl mx-auto",
      phase.status === "pending" && "border-border bg-transparent",
      phase.status === "generating" && "border-accent bg-accent/30",
      phase.status === "done" && "border-success bg-success/30",
    )}
  >
    <div
      className={clsx(
        "rounded-lg p-2 text-white",
        phase.status === "pending" && "bg-transparent",
        phase.status === "generating" && " bg-accent",
        phase.status === "done" && " bg-success",
      )}
    >
      {phase.icon}
    </div>
    <div className="flex flex-col">
      <span
        className={clsx(
          "font-bold text-lg",
          phase.status === "pending" ? "text-white/50" : "text-white",
        )}
      >
        {phase.label.title}
      </span>
      <span
        className={clsx(
          "text-sm",
          phase.status === "pending" ? "text-text/60" : "text-text",
        )}
      >
        {phase.label.subText}
      </span>
    </div>
  </div>
);

export default PhaseTracker;
