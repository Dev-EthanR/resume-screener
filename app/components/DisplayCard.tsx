"use client";
import { AnalyzeResult } from "@/entities/AnalyzeResult";
import { AnalyseProcess } from "@/lib/generated/prisma/client";
import { scoreDonutColor } from "@/util/score";
import Donut from "./Donut";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { formatDate } from "@/util/formatDate";

interface Props {
  data: AnalyseProcess;
}

const DisplayCard = ({ data }: Props) => {
  const result = data.result as AnalyzeResult | null;
  const router = useRouter();

  const { mutate } = useMutation({
    mutationFn: async () => {
      const res = await axios.delete(`/api/analysis/${data.id}`);
      return res.data;
    },
    onSuccess: () => {
      router.refresh();
    },
  });

  const handleDeletion = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    mutate();
  };

  if (!result) return;
  return (
    <Link
      href={`/upload/results/${data.id}`}
      className="group relative border border-border rounded-lg bg-surface p-3 hover:border-accent hover:-translate-y-0.5 transition-transform duration-200 cursor-pointer"
    >
      <div className="flex justify-between items-start border-b border-border pb-3 mb-3">
        <div className="flex gap-3 items-center">
          <Donut
            percentage={result.score ?? 0}
            size="extrasmall"
            color={{
              progressColor: scoreDonutColor(result.score),
              numColor: scoreDonutColor(result.score),
            }}
            instant
            removePercentLabel
          />
          <div>
            <h2 className="font-semibold text-white break-all">
              {data.jobTitle}
            </h2>
            <h3 className="text-medium text-xs break-all">
              {data.companyName}
            </h3>
          </div>
        </div>
        <button
          className="z-20 hover:bg-danger-500/15 size-6 flex items-center justify-center cursor-pointer rounded-sm hover:text-danger-100"
          onClick={handleDeletion}
        >
          <DeleteOutlinedIcon sx={{ fontSize: 16 }} />
        </button>
      </div>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-xs tracking-wide max-w-60">
          <DescriptionOutlinedIcon sx={{ fontSize: 16 }} className="shrink-0" />
          <span className="truncate">{data.fileName}</span>
        </span>
        <div className="text-xs flex items-center justify-center gap-1">
          <span className="inline-block size-1 bg-text rounded-full" />
          {formatDate(data.createdAt)}
        </div>
      </div>
      <div className="hidden absolute inset-0 w-full h-full bg-accent/10 group-hover:block" />
    </Link>
  );
};

export default DisplayCard;
