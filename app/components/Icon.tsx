import clsx from "clsx";
import React, { JSX } from "react";

interface Props {
  icon: JSX.Element;
  className?: string;
}

const Icon = ({ icon, className }: Props) => {
  return (
    <span
      className={clsx(
        className,
        "text-accent bg-surface p-2 inline-flex justify-center items-center rounded-lg size-8",
      )}
    >
      {icon}
    </span>
  );
};

export default Icon;
