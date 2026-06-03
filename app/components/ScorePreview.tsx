import Badge from "./Badge";
import Donut from "./Donut";
import CheckIcon from "@mui/icons-material/Check";
import AddIcon from "@mui/icons-material/Add";
import { BadgeColor } from "../config/badge.config";

interface Skill {
  label: string;
  color: BadgeColor;
}

const skills: Skill[] = [
  { label: "React", color: "green" },
  { label: "TypeScript", color: "green" },
  { label: "GraphQL", color: "red" },
  { label: "AWS", color: "red" },
];

const ScorePreview = () => {
  return (
    <div className="flex flex-col items-center gap-6 border border-border rounded-lg p-6 bg-surface w-full max-w-lg">
      <div className="flex items-center justify-between w-full text-sm">
        <span>Your report</span>
        <Badge color="green" className="ml-2">
          <CheckIcon fontSize="small" />
          Strong
        </Badge>
      </div>
      <Donut
        percentage={74}
        size="large"
        text="Strong match"
        color={{
          labelColor: "green",
        }}
      />
      <div className="flex gap-2 flex-wrap">
        {skills.map(({ label, color }) => (
          <Badge key={label} color={color}>
            {color === "green" ? (
              <CheckIcon fontSize="small" />
            ) : (
              <AddIcon fontSize="small" />
            )}
            {label}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default ScorePreview;
