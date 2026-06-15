import { ReactNode } from "react";

interface Props {
  title: string;
  value: string | number;
  icon?: ReactNode;
}

const Widget = ({ title, value, icon }: Props) => {
  return (
    <div className="border border-border bg-surface rounded-lg p-4 flex flex-col gap-2">
      {icon && (
        <div className="bg-background size-7 flex items-center justify-center rounded-lg">
          {icon}
        </div>
      )}
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-medium">{title}</div>
    </div>
  );
};

export default Widget;
