import { auth } from "@/lib/auth";

const DashboardPage = async () => {
  const session = await auth();
  return (
    <div>
      Welcome back {session?.user?.name}
      {session?.user?.image}
    </div>
  );
};

export default DashboardPage;
