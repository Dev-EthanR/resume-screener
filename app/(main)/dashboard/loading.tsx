import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const DashboardLoading = () => {
  return (
    <SkeletonTheme baseColor="#142436" highlightColor="#1e3a52">
      <div className="flex flex-col gap-3">
        <div>
          <Skeleton width={120} height={16} />
          <Skeleton width={260} height={32} />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="border border-border bg-surface rounded-lg p-4 flex flex-col gap-2"
            >
              <Skeleton circle width={28} height={28} />
              <Skeleton width={48} height={24} />
              <Skeleton width={80} height={12} />
            </div>
          ))}
        </div>
        <div className="border border-border rounded-lg p-6 bg-surface space-y-3">
          <Skeleton width={160} height={20} />
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} height={48} borderRadius={8} />
          ))}
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default DashboardLoading;
