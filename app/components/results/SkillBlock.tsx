import * as Icons from "@mui/icons-material";
import Badge from "../Badge";
import { BadgeColor } from "@/app/config/badge.config";
import clsx from "clsx";

type SkillType = "missing" | "matched";
export type MuiIconName = keyof typeof Icons;

interface SkillContent {
  title: string;
  subtext: string;
  icon: MuiIconName;
  color: BadgeColor;
}

interface Props {
  type: SkillType;
  skills: string[];
}

const SkillBlock = ({ skills, type }: Props) => {
  const skillContent: Record<SkillType, SkillContent> = {
    missing: {
      title: "Missing Skills",
      subtext: "Required skills not yet found. Add these if they apply to you.",
      icon: "Add",
      color: "red",
    },
    matched: {
      title: "Matched Skills",
      subtext:
        "Skills from the job description already present in your resume.",
      icon: "Check",
      color: "green",
    },
  };
  const IconComponent = Icons[skillContent[type].icon];

  return (
    <div className="space-y-3 border border-border rounded-lg p-6 bg-surface">
      <div className="flex w-full justify-between">
        <div className="flex gap-2 items-center">
          <div className="icon">
            <IconComponent sx={{ fontSize: 18 }} />
          </div>
          <h2 className="font-semibold text-white">
            {skillContent[type].title}
          </h2>
        </div>
        <span
          className={clsx(
            "font-semibold",
            type === "matched" ? "text-success" : "text-danger-100",
          )}
        >
          {skills.length}
        </span>
      </div>
      <p className="text-xs w-full text-text mb-4">
        {skillContent[type].subtext}
      </p>
      <div className=" flex flex-wrap gap-2">
        {skills.map((skill) => (
          <Badge
            key={skill}
            color={skillContent[type].color}
            className="text-xs"
          >
            <IconComponent sx={{ fontSize: 14 }} />
            {skill}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default SkillBlock;
