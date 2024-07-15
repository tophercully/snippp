export const LoadingSpinner = () => {
  return (
    <svg
      className="aspect-square h-32 p-5"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        className="animate-dash"
        x="0"
        y="0"
        width="100%"
        height="100%"
      />
    </svg>
  );
};
