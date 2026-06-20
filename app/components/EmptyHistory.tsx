import Avatar from "@mui/material/Avatar";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Link from "next/link";

const EmptyHistory = () => {
  return (
    <div className="flex flex-col items-center text-center">
      <Avatar
        sx={{
          width: 88,
          height: 88,
          bgcolor: "var(--color-background)",
          color: "var(--color-accent)",
          border: "1px solid var(--color-border)",
        }}
      >
        <Inventory2OutlinedIcon sx={{ fontSize: 40 }} />
      </Avatar>
      <h2 className="text-white font-semibold text-lg mt-4">No analyses yet</h2>
      <p className="text-sm max-w-sm mt-1">
        Your saved match reports will appear here. Upload a resume and a job
        description to run your first analysis.
      </p>
      <Link
        href="/upload"
        className="btn-primary w-fit group flex items-center gap-1 mt-6"
      >
        <span>Analyze my resume</span>
        <span className="transition-transform duration-200 ease-out group-hover:translate-x-1.5">
          <ArrowForwardIcon fontSize="small" />
        </span>
      </Link>
    </div>
  );
};

export default EmptyHistory;
