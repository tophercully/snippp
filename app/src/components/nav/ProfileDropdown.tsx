"use client";
import { useUser } from "@/app/src/contexts/UserContext";
import Link from "next/link";
import { useState } from "react";

const ProfileDropdown: React.FC = () => {
  const { userProfile, login, logout } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSignIn = () => {
    console.log("handleSignIn");
    if (userProfile) {
      logout();
      setIsDropdownOpen(false);
    } else {
      login();
    }
  };

  return (
    <>
      {!userProfile && (
        <button
          onClick={handleSignIn}
          className="group ml-auto flex h-full items-center rounded-sm bg-base-950 text-base-50 duration-100 hover:cursor-pointer hover:bg-base-900 dark:invert"
        >
          <span className="max-w-0 overflow-hidden whitespace-nowrap transition-all duration-100 ease-in-out group-hover:max-w-xs group-hover:pl-4">
            Sign in with Google
          </span>
          <img
            src="/person.svg"
            alt="Sign in with Google"
            className="rounded-sm p-3"
          />
        </button>
      )}
      {userProfile && (
        <div className={`relative`}>
          <img
            onClick={toggleDropdown}
            src={userProfile.picture || "/person.svg"}
            className={`z-30 aspect-square max-h-12 cursor-pointer ${isDropdownOpen ? "rounded-t-sm" : "rounded-sm"} bg-base-950`}
            alt="Profile Picture"
          />
          {isDropdownOpen && (
            <div className="absolute right-0 z-20 flex max-h-[25vh] w-48 flex-col rounded-sm rounded-tr-none bg-base-950 shadow-lg ring-1 ring-base-50 ring-opacity-5">
              <Link
                className="w-full px-4 py-3 text-left text-sm text-base-50 hover:bg-base-800"
                href="/dashboard"
              >
                Dashboard
              </Link>
              <Link
                className="w-full px-4 py-3 text-left text-sm text-base-50 hover:bg-base-800"
                href={`/user/${userProfile.id}`}
              >
                Profile
              </Link>
              <button
                className="w-full px-4 py-3 text-left text-sm text-base-50 hover:bg-base-800"
                onClick={handleSignIn}
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ProfileDropdown;
