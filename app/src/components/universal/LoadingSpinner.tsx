"use client";
export const LoadingSpinner = () => {
  return (
    <svg
      className="aspect-square h-32 bg-transparent p-5 dark:invert"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
    >
      <rect
        className="animate-dash"
        x="0"
        y="0"
        width="100"
        height="100"
        fill="none"
        stroke="black"
        strokeWidth="4"
      />
    </svg>
  );
};
