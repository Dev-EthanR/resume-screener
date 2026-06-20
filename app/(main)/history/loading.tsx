import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const HistoryLoading = () => {
  return (
    <SkeletonTheme baseColor="#142436" highlightColor="#1e3a52">
      <div>
        <Skeleton width={240} height={32} />
        <Skeleton width={180} height={16} />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="border border-border rounded-lg bg-surface p-3 space-y-3"
            >
              <div className="flex gap-3 items-center border-b border-border pb-3">
                <Skeleton circle width={32} height={32} />
                <div className="flex-1">
                  <Skeleton width="70%" height={16} />
                  <Skeleton width="50%" height={12} />
                </div>
              </div>
              <Skeleton height={14} />
            </div>
          ))}
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default HistoryLoading;
