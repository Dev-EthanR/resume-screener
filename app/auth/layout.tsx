import { PropsWithChildren } from "react";
import { Logo } from "../components/layout/Navbar";
import Donut from "../components/Donut";

const layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="relative max-h-screen overflow-hidden">
      <div className="absolute inset-y-0 right-0 left-0 lg:left-1/2 bg-gray-950 border-border border-l" />

      <div className="relative z-10  grid lg:grid-cols-2 h-screen page-width">
        <div className=" hidden lg:flex flex-col justify-between py-8 page-width">
          <Logo />
          <div className="max-w-sm space-y-3">
            <p className="font-bold text-white text-3xl">
              Land more interviews with a resume that fits the job.
            </p>
            <p className="mb-6 text-sm">
              Resumatch scores your fit, surfaces missing skills, and rewrites
              your bullet points in seconds.
            </p>
            <div className="flex items-center gap-6 border border-border rounded-xl p-5 bg-surface w-full max-w-lg">
              <Donut
                percentage={88}
                size="extrasmall"
                color={{
                  progressColor: "green",
                  numColor: "green",
                }}
                instant
                removePercentLabel
              />
              <div className="flex flex-col  justify-between w-full text-sm">
                <span className="font-bold text-white">
                  Staff Software Engineer
                </span>
                <span className="font-lighter text-xs">
                  “Strong match — 2 skills to add”
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center py-14">{children}</div>
      </div>
    </div>
  );
};

export default layout;
