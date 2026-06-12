"use client";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  href: string;
  label: string;
}

const ButtonTab = ({ href, label }: Props) => {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={clsx(
        "btn-auth",
        pathname === href ? "bg-accent" : "hover:bg-gray-800 ",
      )}
    >
      {label}
    </Link>
  );
};

export default ButtonTab;
