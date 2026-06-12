"use client";
import Donut from "@/app/components/Donut";
import { AnalyzeResult } from "@/entities/AnalyzeResult";
import { scoreDonutColor, scoreLabel } from "@/util/score";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CopyButton from "../CopyButton";
import SkillBlock from "./SkillBlock";

interface Props {
  result: AnalyzeResult;
}

const AnalysisResults = ({ result }: Props) => {
  const { score, skills, improvementBullets, summary } = result;
  const label = scoreLabel(score);

  return (
    <div className="w-full space-y-6">
      <h1 className="text-white text-3xl font-bold">Your match report</h1>
      <div className="border border-border rounded-lg p-6 bg-surface space-y-6">
        <div className="flex flex-col items-center lg:flex-row lg:items-stretch gap-10">
          <Donut
            percentage={score}
            size="large"
            text={label}
            color={{
              progressColor: scoreDonutColor(score),
              labelColor: scoreDonutColor(score),
            }}
          />
          <div className="flex flex-col justify-between w-full">
            <div>
              <p className="text-gray-500 uppercase text-sm mb-1 text-center lg:text-left">
                Overall match score
              </p>
              <p className="text-white font-semibold max-w-md lg:text-xl mb-3 text-center lg:text-left">
                {summary}
              </p>
            </div>
            <div className="flex justify-between lg:justify-start gap-6">
              <div>
                <p className="font-semibold text-success text-xl">
                  {skills.matched.length} of{" "}
                  {skills.matched.length + skills.missing.length}
                </p>
                <p className="text-xs">skills matched</p>
              </div>
              <div>
                <p className="font-semibold text-danger-500 text-xl">
                  {skills.missing.length}
                </p>
                <p className="text-xs">skills missing</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkillBlock type="matched" skills={skills.matched} />
        <SkillBlock type="missing" skills={skills.missing} />
      </div>

      <div className="lg:border border-border rounded-lg lg:p-6 lg:bg-surface space-y-4">
        <div className="flex items-center gap-2 text-white font-semibold">
          <div className="icon border-none">
            <AutoAwesomeIcon sx={{ fontSize: 18 }} />
          </div>
          Suggested resume improvements
        </div>
        <ul className="space-y-3">
          {improvementBullets.map((bullet, index) => (
            <li
              key={index}
              className="grid grid-cols-2 md:flex gap-3 text-sm group border border-border rounded-lg p-3 bg-surface"
            >
              <div className="text-accent font-bold shrink-0 mt-0.5 order-1">
                <div className="icon border-none select-none">{index + 1}</div>
              </div>
              <span className="col-span-2  order-3 md:order-2 flex-1">
                {bullet}
              </span>
              <CopyButton text={bullet} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AnalysisResults;
