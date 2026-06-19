"use client";

import clsx from "clsx";
import { useState } from "react";
import DeleteZone from "./DeleteZone";
import ProfileForm from "./ProfileForm";

type Tab = "profile" | "usage" | "danger";

const tabs: { id: Tab; label: string }[] = [
  { id: "profile", label: "Profile" },
  { id: "usage", label: "Usage" },
  { id: "danger", label: "Danger Zone" },
];

interface Props {
  name: string;
  email: string;
  weeklyScans: number;
}

const SettingsTabs = ({ name, email, weeklyScans }: Props) => {
  const [active, setActive] = useState<Tab>("profile");

  return (
    <div className="flex gap-8">
      <nav className="flex flex-col w-40 shrink-0 pt-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={clsx(
              "text-left text-sm px-3 py-2 rounded-lg transition-colors cursor-pointer border-l-2",
              active === tab.id
                ? tab.id === "danger"
                  ? "text-danger-100 font-semibold border-danger-500"
                  : "text-white font-semibold border-accent"
                : "border-transparent hover:text-white",
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="flex-1">
        {active === "profile" && (
          <section className="border border-border bg-surface rounded-lg p-6">
            <h2 className="font-semibold text-white mb-0.5">Profile</h2>
            <p className="text-xs mb-6">Update your name and email address.</p>
            <ProfileForm defaultName={name} defaultEmail={email} />
          </section>
        )}

        {active === "usage" && (
          <section className="border border-border bg-surface rounded-lg p-6">
            <h2 className="font-semibold text-white mb-0.5">Usage</h2>
            <p className="text-xs mb-5">Your activity over the past 7 days.</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-white">
                {weeklyScans}
              </span>
              <span className="text-sm">
                {weeklyScans === 1 ? "scan" : "scans"} this week
              </span>
            </div>
          </section>
        )}

        {active === "danger" && (
          <section className="border border-danger-500/50 bg-surface rounded-lg p-6">
            <h2 className="font-semibold text-danger-100 mb-0.5">
              Danger Zone
            </h2>
            <p className="text-xs mb-5">
              Actions here are irreversible. Proceed with caution.
            </p>
            <DeleteZone />
          </section>
        )}
      </div>
    </div>
  );
};

export default SettingsTabs;
