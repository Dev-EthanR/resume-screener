"use client";

import clsx from "clsx";

interface Props<T extends string> {
  label: string;
  value: T;
  options: readonly T[];
  optionLabels: Record<T, string>;
  onChange: (value: T) => void;
  disabled?: boolean;
}

function SegmentedControl<T extends string>({
  label,
  value,
  options,
  optionLabels,
  onChange,
  disabled,
}: Props<T>) {
  return (
    <div>
      <p className="text-xs uppercase text-gray-500 mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            disabled={disabled}
            onClick={() => onChange(option)}
            className={clsx(
              "px-3 py-1.5 rounded-lg text-xs border transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
              value === option
                ? "bg-accent border-accent text-white"
                : "border-border text-text hover:bg-border/40",
            )}
          >
            {optionLabels[option]}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SegmentedControl;
