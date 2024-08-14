import React, { useState } from "react";

type ColorType = "add" | "delete" | "neutral";
type SizeType = "xs" | "sm" | "md" | "lg";

interface SnipppButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  colorType?: ColorType;
  className?: string;
  fit?: boolean;
  size?: SizeType;
  tooltip?: string;
}

const SnipppButton: React.FC<SnipppButtonProps> = ({
  onClick,
  disabled = false,
  children,
  colorType = "neutral",
  className = "",
  fit = true,
  size = "md",
  tooltip,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const getColorClass = (): string => {
    switch (colorType) {
      case "add":
        return "bg-green-600";
      case "delete":
        return "bg-red-600";
      default:
        return "bg-blue-600";
    }
  };

  const getSize = (): string => {
    switch (size) {
      case "xs":
        return "p-1";
      case "sm":
        return "p-2";
      case "md":
        return "p-3";
      case "lg":
        return "p-4";
      default:
        return "p-4";
    }
  };

  return (
    <div className={`relative ${fit ? "inline-block" : "w-full"}`}>
      {tooltip && showTooltip && (
        <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-sm bg-base-800 px-3 py-2 text-sm text-white dark:bg-base-100 dark:text-black">
          {tooltip}
          <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-base-800 dark:border-t-base-100"></div>
        </div>
      )}
      <button
        onClick={onClick}
        disabled={disabled}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`group relative ${fit ? "w-fit" : "w-full"} ${getSize()} overflow-hidden rounded-sm text-base-950 shadow-md duration-75 hover:cursor-pointer hover:text-base-50 dark:bg-base-800 dark:text-base-50 dark:shadow-sm dark:shadow-base-600 ${className}`}
      >
        <div
          className={`absolute inset-0 -translate-x-[101%] transform ${getColorClass()} transition-transform duration-75 ease-in-out group-hover:translate-x-0`}
          aria-hidden="true"
        />
        <span className="relative">{children}</span>
      </button>
    </div>
  );
};

export default SnipppButton;
