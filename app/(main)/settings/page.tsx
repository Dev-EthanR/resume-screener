import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DeleteZone from "../../components/settings/DeleteZone";
import ProfileForm from "../../components/settings/ProfileForm";

const SettingsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) => {
  const session = await auth();
  if (!session?.user?.id) return null;

  const { tab } = await searchParams;

  if (tab === "usage") {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const weeklyScans = await prisma.analyseProcess.count({
      where: { userId: session.user.id, createdAt: { gte: weekAgo } },
    });

    return (
      <section className="border border-border bg-surface rounded-lg p-6">
        <h2 className="font-semibold text-white mb-0.5">Usage</h2>
        <p className="text-xs mb-5">Your activity over the past 7 days.</p>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-white">{weeklyScans}</span>
          <span className="text-sm">
            {weeklyScans === 1 ? "scan" : "scans"} this week
          </span>
        </div>
      </section>
    );
  }

  if (tab === "danger") {
    return (
      <section className="border border-danger-500/50 bg-surface rounded-lg p-6">
        <h2 className="font-semibold text-danger-100 mb-0.5">Danger Zone</h2>
        <p className="text-xs mb-5">
          Actions here are irreversible. Proceed with caution.
        </p>
        <DeleteZone />
      </section>
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true },
  });

  return (
    <section className="border border-border bg-surface rounded-lg p-6">
      <h2 className="font-semibold text-white mb-0.5">Profile</h2>
      <p className="text-xs mb-6">Update your name and email address.</p>
      <ProfileForm
        defaultName={user?.name ?? ""}
        defaultEmail={user?.email ?? ""}
      />
    </section>
  );
};

export default SettingsPage;
