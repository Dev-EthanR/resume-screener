import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SettingsTabs from "../../components/settings/SettingsTabs";

const SettingsPage = async () => {
  const session = await auth();

  if (!session?.user?.id) return null;

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [user, weeklyScans] = await prisma.$transaction([
    prisma.user.findUnique({
      where: { id: session?.user.id },
      select: { name: true, email: true },
    }),
    prisma.analyseProcess.count({
      where: { userId: session?.user.id, createdAt: { gte: weekAgo } },
    }),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-bold text-3xl text-white">Settings</h1>
      <SettingsTabs
        name={user?.name ?? ""}
        email={user?.email ?? ""}
        weeklyScans={weeklyScans}
      />
    </div>
  );
};

export default SettingsPage;
