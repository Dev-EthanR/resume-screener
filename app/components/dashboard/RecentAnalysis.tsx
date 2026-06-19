import { AnalyseProcess } from "@/lib/generated/prisma/client";
import Link from "next/link";
import Donut from "../Donut";
import { AnalyzeResult } from "@/entities/AnalyzeResult";
import { scoreDonutColor } from "@/util/score";
import { formatDate } from "@/util/formatDate";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface Props {
  data: AnalyseProcess[];
}
const RecentAnalysis = ({ data }: Props) => {
  return (
    <div className="border border-border rounded-lg p-6 bg-surface">
      <div className="flex gap-2 items-center justify-between mb-2">
        <h2 className="font-semibold text-white">Recent Analyses</h2>
        <Link
          href="/history"
          className="text-accent font-medium text-sm hover:text-accent/70 group"
        >
          View All{" "}
          <ArrowForwardIcon
            className="group-hover:translate-x-1 transition-transform duration-600 ease-in-out"
            sx={{ fontSize: 14 }}
          />
        </Link>
      </div>
      {data.map((d) => {
        const { score } = d.result as unknown as AnalyzeResult;

        return (
          <Link
            href={`/upload/results/${d.id}`}
            key={d.id}
            className="flex justify-between items-center group hover:bg-background w-full rounded-xl p-2 cursor-pointer"
          >
            <div className="flex gap-2 items-center">
              <Donut
                percentage={score}
                size="extrasmall"
                removePercentLabel
                instant
                color={{
                  progressColor: scoreDonutColor(score),
                  numColor: scoreDonutColor(score),
                }}
              />
              <div className="">
                <h3 className="text-white font-semibold text-sm">
                  {d.jobTitle}
                </h3>
                <p className="text-xs">
                  {d.companyName} - {formatDate(d.createdAt)}
                </p>
              </div>
            </div>
            <ArrowForwardIcon
              className="group-hover:text-accent "
              sx={{ fontSize: 20 }}
            />
          </Link>
        );
      })}
    </div>
  );
};

export default RecentAnalysis;
