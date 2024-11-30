"use client";
import Link from "next/link";
import { useUser } from "../../contexts/UserContext";

const BuilderButton: React.FC = () => {
  const { userProfile } = useUser();

  if (!userProfile) return null;
  return (
    <Link
      href="/builder"
      className="group ml-auto flex h-full items-center rounded-sm bg-base-950 text-base-50 duration-100 hover:cursor-pointer hover:bg-base-900 dark:invert"
    >
      <span className="max-w-0 overflow-hidden whitespace-nowrap transition-all duration-100 ease-in-out group-hover:max-w-xs group-hover:pl-4">
        CREATE SNIPPET
      </span>
      <img
        src="/add.svg"
        alt="plus"
        className="rounded-sm p-2"
      />
    </Link>
  );
};

export default BuilderButton;
