import { PropsWithChildren, Suspense } from "react";
import { auth } from "@/lib/auth";
import AuthSessionProvider from "@/app/providers/AuthSessionProvider";
import SettingsNav from "../../components/settings/SettingsNav";

export default async function SettingsLayout({ children }: PropsWithChildren) {
  const session = await auth();

  return (
    <AuthSessionProvider session={session}>
      <div className="flex flex-col gap-8">
        <h1 className="font-bold text-3xl text-white">Settings</h1>
        <div className="flex gap-8">
          <Suspense>
            <SettingsNav />
          </Suspense>
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </AuthSessionProvider>
  );
}
