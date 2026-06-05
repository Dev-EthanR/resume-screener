"use client";

import { signOutAction } from "@/util/authActions";
import LogoutIcon from "@mui/icons-material/Logout";
import clsx from "clsx";
import { User } from "next-auth";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import SettingsIcon from "@mui/icons-material/Settings";

interface Props {
  initials: string;
  user: User;
}

const UserMenu = ({ initials, user }: Props) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={clsx(
          "avatar hover:border-2 border-white cursor-pointer",
          open && "border-2",
        )}
      >
        {initials}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-55 bg-surface border border-border rounded-lg shadow-2xl overflow-hidden z-50  px-4 py-2.5  ">
          <div className="flex gap-2 border-border border-b pb-3 mb-3">
            <div className="avatar aspect-square! ">{initials}</div>
            <div className="tracking-tighter min-w-0">
              <div className="text-white font-bold leading-4 text-sm truncate">
                {user.name}
              </div>
              <div className="text-xs truncate">{user.email}</div>
            </div>
          </div>
          <Link
            href="/settings"
            className="text-xs font-semi-bold hover:text-white transition-colors flex items-center gap-2 pl-1"
            onClick={() => setOpen(false)}
          >
            <SettingsIcon sx={{ fontSize: 16 }} />
            Settings
          </Link>
          <form action={signOutAction}>
            <button
              type="submit"
              className="w-full flex items-center gap-2 text-xs hover:text-danger-500 transition-colors text-left cursor-pointer text-danger-100  border-border border-t pt-3 mt-3 pl-1"
            >
              <LogoutIcon sx={{ fontSize: 16 }} />
              Sign out
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
