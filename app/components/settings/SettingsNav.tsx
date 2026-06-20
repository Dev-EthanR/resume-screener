"use client";

import clsx from "clsx";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type Tab = "profile" | "usage" | "danger";

const tabs: { id: Tab; label: string }[] = [
  { id: "profile", label: "Profile" },
  { id: "usage", label: "Usage" },
  { id: "danger", label: "Danger Zone" },
];

const SettingsNav = () => {
  const searchParams = useSearchParams();
  const active = searchParams.get("tab") ?? "profile";

  return (
    <nav className="flex flex-col w-40 shrink-0 pt-1">
      {tabs.map((tab) => (
        <Link
          key={tab.id}
          href={tab.id === "profile" ? "/settings" : `/settings?tab=${tab.id}`}
          className={clsx(
            "text-sm px-3 py-2 rounded-lg transition-colors border-l-2",
            active === tab.id
              ? tab.id === "danger"
                ? "text-danger-100 font-semibold border-danger-500"
                : "text-white font-semibold border-accent"
              : "border-transparent hover:text-white",
          )}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
};

export default SettingsNav;
