"use client";
import CoverLetterGenerator from "@/app/components/results/CoverLetterGenerator";
import { useProcess } from "@/app/hooks/useProcess";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import Link from "next/link";
import { useParams } from "next/navigation";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CoverLetterPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isError, error, isLoading } = useProcess(id);
  const isDone = data?.generatingStatus === "done";

  return (
    <div className="w-full max-w-2xl space-y-6">
      <Link
        href={`/upload/results/${id}`}
        className="inline-flex items-center gap-1 text-sm text-text hover:text-white transition-colors"
      >
        <ArrowBackRoundedIcon sx={{ fontSize: 16 }} />
        Back to results
      </Link>

      <div>
        <h1 className="text-white text-3xl font-bold">Cover letter</h1>
        {(data?.jobTitle || data?.companyName) && (
          <p className="text-gray-400 text-sm mt-1">
            Tailored for{" "}
            {data?.jobTitle && (
              <span className="font-semibold text-white">
                {data.jobTitle}
              </span>
            )}
            {data?.jobTitle && data?.companyName && " at "}
            {data?.companyName}
          </p>
        )}
      </div>

      {isError && (
        <div className="text-danger-100">
          Something went wrong. Please try again.
          {error.message}
        </div>
      )}

      {isLoading && (
        <SkeletonTheme baseColor="#142436" highlightColor="#1e3a52">
          <Skeleton height={280} borderRadius={8} />
        </SkeletonTheme>
      )}

      {!isLoading && !isError && !isDone && (
        <p className="text-text text-sm">
          Your analysis needs to finish before you can generate a cover
          letter.
        </p>
      )}

      {isDone && <CoverLetterGenerator processId={id} />}
    </div>
  );
};

export default CoverLetterPage;
