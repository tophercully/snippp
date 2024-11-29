import { ReactNode, useState } from "react";

type TooltipPosition = "left" | "right" | "center";

interface TooltipWrapperProps {
  children: ReactNode;
  tooltip: ReactNode;
  position?: TooltipPosition;
}

const TooltipWrapper: React.FC<TooltipWrapperProps> = ({
  children,
  tooltip,
  position = "center",
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const getTooltipPositionClass = (): string => {
    switch (position) {
      case "left":
        return "left-0 -translate-x-0";
      case "right":
        return "right-0 translate-x-0";
      default:
        return "left-1/2 -translate-x-1/2";
    }
  };

  const getTooltipArrowPositionClass = (): string => {
    switch (position) {
      case "left":
        return "left-2";
      case "right":
        return "right-2";
      default:
        return "left-1/2 -translate-x-1/2";
    }
  };

  return (
    <div
      className="relative flex h-fit"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={`pointer-events-none absolute bottom-full z-20 mb-2 whitespace-nowrap rounded-sm bg-base-700 px-3 py-2 text-sm text-white transition-opacity duration-100 dark:bg-base-100 dark:text-black ${getTooltipPositionClass()}`}
        >
          {tooltip}
          <div
            className={`absolute top-full ${getTooltipArrowPositionClass()} border-4 border-transparent border-t-base-700 dark:border-t-base-100`}
          ></div>
        </div>
      )}
    </div>
  );
};

export default TooltipWrapper;
