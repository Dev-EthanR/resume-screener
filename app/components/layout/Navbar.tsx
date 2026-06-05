import { auth } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";

export const Logo = () => {
  return (
    <Link href="/" className="flex items-center">
      <Image src="/logo.png" alt="Resumatch Logo" width={30} height={30} />
      <span className="ml-2 font-bold text-lg text-white">Resumatch</span>
    </Link>
  );
};

const Navbar = async () => {
  const session = await auth();
  console.log(session?.user);
  return (
    <div className="border-b border-border">
      <div className="page-width py-4 flex items-center justify-between">
        <Logo />
        {session?.user ? (
          <div className="rounded-full bg-accent font-bold text-white size-7 flex justify-center items-center text-sm">
            {(
              session.user.name
                ?.split(" ")
                .map((n) => n[0])
                .join("") ?? session.user.email?.[0]
            )
              ?.slice(0, 2)
              .toUpperCase()}
          </div>
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
