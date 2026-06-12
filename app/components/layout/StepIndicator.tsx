"use client";
import CheckIcon from "@mui/icons-material/Check";
import clsx from "clsx";
import { usePathname, useSearchParams } from "next/navigation";

const steps = ["Upload", "Processing", "Results"] as const;

function useCurrentStep(): number | null {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (pathname === "/upload") return 1;
  if (pathname.startsWith("/upload/results/")) {
    const step = searchParams.get("step");
    if (step === "2") return 2;
    if (step === "3") return 3;
    return null;
  }
  return null;
}

const StepIndicator = () => {
  const current = useCurrentStep();
  if (current === null) return null;

  return (
    <div className="flex items-center md:gap-0 w-full gap-2">
      {steps.map((label, i) => {
        const step = i + 1;
        const done = step < current;
        const active = step === current;

        return (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
              <div
                className={clsx(
                  "w-full h-1 rounded-full md:size-6 md:rounded-full flex items-center justify-center text-xs font-semibold border transition-colors",
                  done && "bg-success border-success text-white",
                  active && "bg-accent border-accent text-white",
                  !done && !active && "border-border text-text bg-transparent",
                )}
              >
                <span className="hidden md:block">
                  {done ? (
                    <CheckIcon sx={{ fontSize: 13 }} />
                  ) : (
                    <span>{step}</span>
                  )}
                </span>
              </div>
              <span
                className={clsx(
                  "text-xs font-medium",
                  active && "text-white font-bold",
                  done && "text-success",
                  !done && !active && "text-text",
                )}
              >
                {label}
              </span>
            </div>
            {step < steps.length && (
              <div
                className={clsx(
                  "w-8 lg:w-12 h-px mx-2 hidden md:block",
                  done ? "bg-success/50" : "bg-border",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;
