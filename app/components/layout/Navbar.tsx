import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="border-b border-border">
      <div className="page-width py-4 flex items-center justify-between">
      <div className="flex items-center">
        <Image src="/logo.png" alt="Resumatch Logo" width={30} height={30} />
        <span className="ml-2 font-bold text-lg text-white">Resumatch</span>
      </div>
      <Link href="/signin" className="btn-outline">
        Sign In
      </Link>
      </div>
    </div>
  );
};

export default Navbar;
