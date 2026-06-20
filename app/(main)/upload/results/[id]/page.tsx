"use client";
import AnalysisResults from "@/app/components/results/AnalysisResults";
import PhaseTracker from "@/app/components/results/PhaseTracker";
import ResultsLoading from "@/app/components/results/ResultsLoading";
import { useProcess } from "@/app/hooks/useProcess";
import { AnalyzeResult } from "@/entities/AnalyzeResult";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const ResultsPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const stepParam = searchParams.get("step");
  const inFlow = stepParam !== null;
  const alreadyDone = stepParam === "3";

  const { data, isError, error, isLoading } = useProcess(id);
  const isDone = data?.generatingStatus === "done";

  useEffect(() => {
    if (isDone && inFlow && !alreadyDone) {
      router.replace(`/upload/results/${id}?step=3`);
    }
  }, [isDone, inFlow, alreadyDone, id, router]);

  if (isError)
    return (
      <div className="text-danger-100">
        Something went wrong. Please try again.
        {error.message}
      </div>
    );

  const loadingProcess = {
    parsingStatus: "generating" as const,
    readingStatus: "pending" as const,
    comparingStatus: "pending" as const,
    generatingStatus: "pending" as const,
  };

  return (
    <div>
      {isDone && inFlow && (
        <p className="uppercase text-accent text-xs">Analysis complete</p>
      )}

      {!isDone && inFlow && !alreadyDone && (
        <PhaseTracker
          process={data ?? loadingProcess}
          fileName={data?.fileName}
          jobTitle={data?.jobTitle}
        />
      )}

      {!isDone && !inFlow && isLoading && <ResultsLoading />}

      {isDone && data && "score" in data.result && (
        <AnalysisResults
          id={id}
          result={data.result as AnalyzeResult}
          fileName={data.fileName}
          jobTitle={data.jobTitle}
          companyName={data.companyName}
        />
      )}
    </div>
  );
};

export default ResultsPage;
