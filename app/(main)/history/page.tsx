import DisplayCard from "@/app/components/DisplayCard";
import EmptyHistory from "@/app/components/EmptyHistory";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const HistoryPage = async () => {
  const session = await auth();
  const historyData = await prisma.analyseProcess.findMany({
    where: { userId: session?.user?.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-bold text-white text-3xl leading-14">
        Analysis history
      </h1>
      <p className=" mb-4 text-sm text-text">
        {historyData.length} saved analyses. Click any card to reopen the report
      </p>
      {historyData.length === 0 ? (
        <EmptyHistory />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {historyData.map((d) => (
            <DisplayCard key={d.id} data={d} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
