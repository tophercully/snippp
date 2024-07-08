type ColorType = "add" | "delete" | "neutral";

interface SnipppButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  colorType?: ColorType;
  className?: string;
  fit?: boolean;
}

const SnipppButton: React.FC<SnipppButtonProps> = ({
  onClick,
  disabled = false,
  children,
  colorType = "neutral",
  className = "",
  fit = true,
}) => {
  const getColorClass = (): string => {
    switch (colorType) {
      case "add":
        return "bg-green-600";
      case "delete":
        return "bg-red-600";
      default:
        return "bg-blue-700";
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`group relative ${fit ? "w-fit" : "w-full"} overflow-hidden rounded-sm p-4 text-base-950 shadow-md duration-200 hover:cursor-pointer hover:text-base-50 dark:bg-base-800 dark:text-base-50 dark:shadow-sm dark:shadow-base-600 ${className}`}
    >
      <div
        className={`absolute inset-0 -translate-x-full transform ${getColorClass()} transition-transform duration-300 ease-in-out group-hover:translate-x-0`}
        aria-hidden="true"
      />
      <span className="relative z-10 text-xl font-bold">{children}</span>
    </button>
  );
};

export default SnipppButton;
