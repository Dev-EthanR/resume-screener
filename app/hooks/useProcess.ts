import { AnalyzeResult } from "@/entities/AnalyzeResult";
import { Status } from "@/lib/generated/prisma/enums";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface ProcessData {
  id: string;
  result: AnalyzeResult | Record<string, never>;
  fileName: string | null;
  jobTitle: string | null;
  companyName: string | null;
  parsingStatus: Status;
  readingStatus: Status;
  comparingStatus: Status;
  generatingStatus: Status;
}

async function fetchProcess(id: string): Promise<ProcessData> {
  const res = await axios.get(`/api/process/${id}`);
  return res.data;
}

export function useProcess(id: string) {
  return useQuery({
    queryKey: ["process", id],
    queryFn: () => fetchProcess(id),
    refetchInterval: (query) => {
      if (query.state.data?.generatingStatus === "done") return false;
      return 2000;
    },
  });
}
