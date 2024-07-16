import React from "react";

interface StatCardProps {
  name: string;
  value: string | number;
}

export const StatCard: React.FC<StatCardProps> = ({ name, value }) => {
  return (
    <div className="flex aspect-[3/2] h-32 w-full max-w-full flex-col rounded-sm bg-base-900 p-4 text-base-50 shadow-md dark:bg-base-50 dark:text-base-950">
      <h3 className="font-medium">{name}</h3>
      {value && <p className="flex w-fit flex-1 text-5xl font-bold">{value}</p>}
    </div>
  );
};
export const StatCardSmall: React.FC<StatCardProps> = ({ name, value }) => {
  return (
    <div className="flex aspect-[3/2] h-20 w-full max-w-full flex-col rounded-sm bg-base-900 p-2 text-base-50 shadow-md dark:bg-base-50 dark:text-base-950">
      <h3 className="font-sm">{name}</h3>
      {value && <p className="flex w-fit flex-1 text-3xl font-bold">{value}</p>}
    </div>
  );
};
