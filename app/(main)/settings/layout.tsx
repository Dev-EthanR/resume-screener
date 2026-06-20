import { PropsWithChildren } from "react";
import SettingsNav from "../../components/settings/SettingsNav";

export default function SettingsLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-bold text-3xl text-white">Settings</h1>
      <div className="flex gap-8">
        <SettingsNav />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
