"use client";
import Link from "next/link";
import React from "react";
import { useSignal } from "@preact-signals/safe-react";

type ColorType = "add" | "delete" | "neutral";
type SizeType = "xs" | "sm" | "md" | "lg";
type TooltipPosition = "left" | "right" | "center";

interface SnipppButtonProps {
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  children: React.ReactNode;
  colorType?: ColorType;
  className?: string;
  fit?: boolean;
  size?: SizeType;
  tooltip?: string;
  tooltipPosition?: TooltipPosition;
  pronounced?: boolean;
  loading?: boolean;
}

const SnipppButton: React.FC<SnipppButtonProps> = ({
  onClick,
  href,
  disabled = false,
  children,
  colorType = "neutral",
  className = "",
  fit = true,
  size = "md",
  tooltip,
  tooltipPosition = "center",
  pronounced = false,
  loading = false,
}) => {
  const showTooltip = useSignal<boolean>(false);
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

  const getBaseColorClass = (): string => {
    return pronounced ?
        "bg-base-950 text-base-50 dark:bg-base-50 dark:text-base-950"
      : "bg-base-50 text-base-950 dark:bg-base-800 dark:text-base-50";
  };

  const getTooltipPositionClass = (): string => {
    switch (tooltipPosition) {
      case "left":
        return "left-0 -translate-x-0";
      case "right":
        return "right-0 translate-x-0";
      default:
        return "left-1/2 -translate-x-1/2";
    }
  };

  const getTooltipArrowPositionClass = (): string => {
    switch (tooltipPosition) {
      case "left":
        return "left-2";
      case "right":
        return "right-2";
      default:
        return "left-1/2 -translate-x-1/2";
    }
  };

  const CommonContent = () => (
    <>
      {tooltip && showTooltip.value && (
        <div
          className={`absolute bottom-full mb-2 whitespace-nowrap rounded-sm bg-base-800 px-3 py-2 text-sm text-white dark:bg-base-100 dark:text-black ${getTooltipPositionClass()}`}
        >
          {tooltip}
          <div
            className={`absolute top-full ${getTooltipArrowPositionClass()} border-4 border-transparent border-t-base-800 dark:border-t-base-100`}
          ></div>
        </div>
      )}
      <button
        onClick={onClick}
        disabled={disabled || loading}
        onMouseEnter={() => (showTooltip.value = true)}
        onMouseLeave={() => (showTooltip.value = false)}
        className={`group relative ${fit ? "w-fit" : "w-full"} ${getSize()} overflow-hidden rounded-sm ${getBaseColorClass()} shadow-md duration-75 hover:cursor-pointer hover:text-base-50 dark:shadow-sm dark:shadow-base-600 ${
          loading ? "cursor-wait opacity-70" : ""
        }`}
      >
        <div
          className={`absolute inset-0 -translate-x-[101%] transform ${getColorClass()} transition-transform duration-75 ease-in-out group-hover:translate-x-0`}
          aria-hidden="true"
        />
        <span className="relative">{loading ? "Working..." : children}</span>
      </button>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={`relative ${fit ? "inline-block" : "w-full"} ${className}`}
      >
        <CommonContent />
      </Link>
    );
  } else {
    return (
      <div
        className={`relative ${fit ? "inline-block" : "w-full"} ${className}`}
      >
        <CommonContent />
      </div>
    );
  }
};

export default SnipppButton;
