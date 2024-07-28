import React, { ReactNode, useState } from "react";

interface TooltipWrapperProps {
  children: ReactNode;
  tooltip: ReactNode;
}

const TooltipWrapper: React.FC<TooltipWrapperProps> = ({
  children,
  tooltip,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative flex h-fit"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 whitespace-nowrap rounded-sm bg-base-700 px-3 py-2 text-sm text-white transition-opacity duration-100 dark:bg-base-100 dark:text-black">
          {tooltip}
          <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-base-700 dark:border-t-base-100"></div>
        </div>
      )}
    </div>
  );
};

export default TooltipWrapper;
