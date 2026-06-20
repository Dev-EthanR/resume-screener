import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SettingsLoading = () => {
  return (
    <SkeletonTheme baseColor="#142436" highlightColor="#1e3a52">
      <section className="border border-border bg-surface rounded-lg p-6 space-y-4">
        <Skeleton width={140} height={20} />
        <Skeleton width={220} height={12} />
        <div className="space-y-4 max-w-md">
          <Skeleton height={40} borderRadius={8} />
          <Skeleton height={40} borderRadius={8} />
          <Skeleton width={120} height={36} borderRadius={8} />
        </div>
      </section>
    </SkeletonTheme>
  );
};

export default SettingsLoading;
