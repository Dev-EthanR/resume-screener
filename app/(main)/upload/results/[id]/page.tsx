"use client";
import AnalysisResults from "@/app/components/results/AnalysisResults";
import PhaseTracker from "@/app/components/results/PhaseTracker";
import ResultsLoading from "@/app/components/results/ResultsLoading";
import { AnalyzeResult } from "@/entities/AnalyzeResult";
import { Status } from "@/lib/generated/prisma/enums";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

interface ProcessData extends StatusProcess {
  id: string;
  result: AnalyzeResult | Record<string, never>;
}
interface StatusProcess {
  parsingStatus: Status;
  readingStatus: Status;
  comparingStatus: Status;
  generatingStatus: Status;
}
async function fetchProcess(id: string): Promise<ProcessData> {
  const res = await axios.get(`/api/process/${id}`);
  return res.data;
}

const ResultsPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const stepParam = searchParams.get("step");
  const inFlow = stepParam !== null;
  const alreadyDone = stepParam === "3";

  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["process", id],
    queryFn: () => fetchProcess(id),
    refetchInterval: (query) => {
      if (query.state.data?.generatingStatus === "done") return false;
      return 2000;
    },
  });
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

  const loadingProcess: StatusProcess = {
    parsingStatus: "generating",
    readingStatus: "pending",
    comparingStatus: "pending",
    generatingStatus: "pending",
  };

  return (
    <div>
      {isDone && inFlow && (
        <p className="uppercase text-accent text-xs">Analysis complete</p>
      )}

      {!isDone && inFlow && !alreadyDone && (
        <PhaseTracker process={data ?? loadingProcess} />
      )}

      {!isDone && !inFlow && isLoading && <ResultsLoading />}

      {isDone && data && "score" in data.result && (
        <AnalysisResults result={data.result as AnalyzeResult} />
      )}
    </div>
  );
};

export default ResultsPage;
