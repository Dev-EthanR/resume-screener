import { auth } from "@/lib/auth";
import Link from "next/link";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import { prisma } from "@/lib/prisma";
import Widget from "@/app/components/dashboard/Widget";
import TaskOutlinedIcon from "@mui/icons-material/TaskOutlined";
import SpeedOutlinedIcon from "@mui/icons-material/SpeedOutlined";
import { AnalyzeResult } from "@/entities/AnalyzeResult";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import { AnalyseProcess } from "@/lib/generated/prisma/client";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import RecentAnalysis from "@/app/components/dashboard/RecentAnalysis";
const getScore = (d: AnalyseProcess) =>
  (d.result as unknown as AnalyzeResult)?.score ?? 0;

const getStreak = (data: AnalyseProcess[]) => {
  const uniqueDays = [
    ...new Set(data.map((d) => d.createdAt.toISOString().split("T")[0])),
  ].sort((a, b) => b.localeCompare(a));

  let streak = 0;
  const expected = new Date();

  for (const day of uniqueDays) {
    const expectedStr = expected.toISOString().split("T")[0];
    if (day === expectedStr) {
      streak++;
      expected.setDate(expected.getDate() - 1);
    } else break;
  }

  return streak;
};

const DashboardPage = async () => {
  const session = await auth();
  const date = new Date().toLocaleDateString("en-us", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const userId = session?.user?.id;

  const [data, recent, totalCount] = await prisma.$transaction([
    prisma.analyseProcess.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.analyseProcess.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.analyseProcess.count({
      where: { userId },
    }),
  ]);

  const scores = data
    .map(getScore)
    .filter((s): s is number => typeof s === "number");

  const averageScore = scores.length
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0;

  const bestEntry = data.length
    ? data.reduce((best, current) =>
        getScore(current) > getScore(best) ? current : best,
      )
    : null;

  const bestScore = bestEntry ? getScore(bestEntry) : 0;
  const streak = getStreak(data);
  return (
    <div className="flex flex-col gap-3">
      <div>
        <div className="text-accent uppercase tracking-widest font-semibold text-xs leading-8">
          {date}
        </div>
        <h1 className="font-bold text-3xl text-white">
          Welcome back, {session?.user?.name?.split(" ")[0]}
        </h1>
      </div>
      <Link href="/upload" className="btn-primary font-medium self-end">
        <BoltOutlinedIcon fontSize="small" />
        New analysis
      </Link>

      <div className="grid grid-cols-4 gap-4">
        <Widget
          title="Resumes analysed"
          value={totalCount}
          icon={
            <TaskOutlinedIcon className="text-accent" sx={{ fontSize: 16 }} />
          }
        />
        <Widget
          title="Average match score"
          value={`${averageScore}%`}
          icon={
            <SpeedOutlinedIcon className="text-success" sx={{ fontSize: 16 }} />
          }
        />
        <Widget
          title={`Best match: ${bestEntry?.companyName ?? "N/A"}`}
          value={`${bestScore}%`}
          icon={
            <StarBorderOutlinedIcon
              className="text-warning"
              sx={{ fontSize: 16 }}
            />
          }
        />
        <Widget
          title="Current streak"
          value={`${streak} ${streak > 1 ? "days" : "day"}`}
          icon={
            <CalendarMonthOutlinedIcon
              className="text-accent"
              sx={{ fontSize: 16 }}
            />
          }
        />
      </div>
      <RecentAnalysis data={recent} />
    </div>
  );
};

export default DashboardPage;
