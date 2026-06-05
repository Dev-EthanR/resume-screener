import { auth } from "@/lib/auth";
import Link from "next/link";
import UserMenu from "./UserMenu";

export const Logo = () => {
  return (
    <Link href="/" className="flex items-center">
      <img src="/logo.png" alt="Resumatch Logo" width={30} height={30} />
      <span className="ml-2 font-bold text-lg text-white">Resumatch</span>
    </Link>
  );
};

const Navbar = async () => {
  const session = await auth();
  const initials = (
    session?.user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("") ?? session?.user?.email?.[0]
  )
    ?.slice(0, 2)
    .toUpperCase();

  return (
    <div className="border-b border-border">
      <div className="page-width py-4 flex items-center justify-between">
        <Logo />
        {session?.user && initials ? (
          <UserMenu initials={initials} user={session.user} />
        ) : (
          <Link href="/auth/signin" className="btn-outline py-1.5 ">
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
