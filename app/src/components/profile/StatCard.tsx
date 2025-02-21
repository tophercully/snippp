interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}
const StatCard = ({ title, value, icon }: StatCardProps) => {
  return (
    <div className="flex aspect-[3/4] flex-col gap-2 border bg-base-50 p-4 shadow-lg">
      <div className="flex h-2 w-full items-start justify-end text-black">
        {icon}
      </div>

      <p className="mt-auto flex text-2xl font-semibold text-base-950 md:text-3xl lg:text-5xl xl:text-6xl dark:text-base-50">
        {value}
      </p>
      <p className="flex text-xs text-base-500 dark:text-base-200">{title}</p>
    </div>
  );
};

export default StatCard;
