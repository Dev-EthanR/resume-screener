"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Logo = () => {
  return (
    <Link href="/" className="flex items-center">
      <Image src="/logo.png" alt="Resumatch Logo" width={30} height={30} />
      <span className="ml-2 font-bold text-lg text-white">Resumatch</span>
    </Link>
  );
};

const Navbar = () => {
  const pathname = usePathname();
  if (pathname.startsWith("/auth")) return;

  return (
    <div className="border-b border-border">
      <div className="page-width py-4 flex items-center justify-between">
        <Logo />
        <Link href="/auth/signin" className="btn-outline py-1.5 ">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
