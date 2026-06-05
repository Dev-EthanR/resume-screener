import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import Badge from "./components/Badge";
import ScorePreview from "./components/ScorePreview";
import Link from "next/link";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SpeedIcon from "@mui/icons-material/Speed";
import InfoCard from "./components/InfoCard";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import StarsIcon from "@mui/icons-material/Stars";

const cardContent = [
  {
    icon: <SpeedIcon fontSize="medium" />,
    title: "Instant match score",
    description:
      "See exactly how well your resume aligns with the role. A single clear percentage backed by keyword analysis.",
  },
  {
    icon: <TrendingUpIcon fontSize="medium" />,
    title: "Skills gap analysis",
    description:
      "Know which required skills you already cover and which ones you're missing, so you can close the gap fast.",
  },
  {
    icon: <StarsIcon fontSize="medium" />,
    title: "Tailored bullet points",
    description:
      "Get rewritten, achievement-focused bullet points crafted to mirror the language of the job description.",
  },
];

export default function Home() {
  return (
    <div className="page-width w-full py-12">
      <Badge color="blue" className="mb-6">
        <AutoAwesomeIcon fontSize="small" />
        AI-powered resume analysis
      </Badge>
      <div className="flex flex-col md:flex-row items-start w-full justify-between gap-6">
        <div className="max-w-xl flex flex-col gap-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white ">
            Tailor your resume to <span className="text-accent">any job</span>{" "}
            in seconds
          </h1>
          <p className="max-w-sm">
            Upload your resume and paste a job description. Resumatch scores
            your fit, finds the skills you&apos;re missing, and rewrites your
            bullet points to match what recruiters are looking for.
          </p>
          <Link
            href="/upload"
            className="btn-primary w-fit group flex items-center gap-1 mb-4"
          >
            <span>Analyze my resume</span>
            <span className="transition-transform duration-200 ease-out group-hover:translate-x-1.5">
              <ArrowForwardIcon fontSize="small" />
            </span>
          </Link>
        </div>
        <ScorePreview />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        {cardContent.map((card, index) => (
          <InfoCard
            key={index}
            icon={card.icon}
            title={card.title}
            description={card.description}
          />
        ))}
      </div>
    </div>
  );
}
