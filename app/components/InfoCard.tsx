import React, { JSX } from "react";

interface Props {
  icon: JSX.Element;
  title: string;
  description: string;
}

const InfoCard = ({ icon, title, description }: Props) => {
  return (
    <div className="border border-border rounded-lg p-6 bg-surface w-full max-w-xl space-y-2">
      <div className="text-accent bg-blue-900/30 p-3 rounded-xl mb-2 aspect-square w-fit">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="text-sm text-text">{description}</p>
    </div>
  );
};

export default InfoCard;
