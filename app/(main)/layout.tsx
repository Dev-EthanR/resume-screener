import { PropsWithChildren } from "react";
import Navbar from "../components/layout/Navbar";

export default function MainLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Navbar />
      <main className="flex-1 page-width w-full py-12 font-sans">
        {children}
      </main>
    </>
  );
}
