import React, { useState, useEffect } from "react";
import { useSessionStorage } from "@uidotdev/usehooks";

import { categories } from "../../utils/categories";

import { KeyboardShortcuts } from "./KeyboardShortcuts";
import { useNavigate } from "react-router-dom";
import { track } from "@vercel/analytics";

import { useUser } from "../../hooks/UserProfile";

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile, login, logout } = useUser();
  // const [isWelcomePopupDismissed] = useLocalStorage(
  //   "isWelcomePopupDismissed",
  //   false,
  // );
  const [isAdding] = useSessionStorage("isAddingList", false);
  const [isEditing] = useSessionStorage("isEditingProfile", false);
  const [isEditingProfile] = useSessionStorage("isEditingProfile", false);
  // const isBrowseOrHome =
  //   window.location.pathname == "/" || window.location.pathname == "/browse";
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] =
    useState<boolean>(false);
  const [isShortcutsPopupOpen, setIsShortcutsPopupOpen] =
    useState<boolean>(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleCategoryDropdown = () => {
    setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
  };

  const handleSignIn = () => {
    if (userProfile) {
      logout();
      setIsDropdownOpen(false);
    } else {
      track("User Sign In");
      login();
    }
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "?") {
        setIsShortcutsPopupOpen(!isShortcutsPopupOpen);
      }
    };

    if (!isEditing && !isEditingProfile && !isAdding) {
      window.addEventListener("keydown", handleKeyPress);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [isShortcutsPopupOpen]);

  const isBuilderPage = window.location.pathname.includes("builder");
  return (
    <>
      <div className="absolute left-0 right-0 top-0 z-50 w-full rounded-b-2xl bg-opacity-10 p-2 shadow-sm backdrop-blur-sm lg:px-10">
        <div className="flex h-fit w-full items-center justify-start gap-5">
          {/* Snippp logo */}
          <a
            href="/"
            className="group flex items-center gap-1 rounded-sm bg-base-950 p-1 text-base-50 dark:bg-base-50 dark:text-base-950"
          >
            <img
              src="/snippp1x1.svg"
              className="h-10 w-10 brightness-0 invert dark:invert-0"
            />
            <span className="max-w-0 overflow-hidden whitespace-nowrap transition-all duration-100 ease-in-out group-hover:max-w-xs group-hover:px-3">
              {"Snippp"}
            </span>
          </a>
          <div className="flex w-fit items-center justify-center md:justify-start md:gap-5">
            <a
              href="/browse"
              className="hidden w-full items-center p-4 pl-10 text-base-950 invert-[40%] hover:cursor-pointer hover:text-base-800 hover:invert-0 focus:outline-none md:flex dark:text-base-50 dark:hover:text-base-200"
            >
              Browse
            </a>
            <a
              href="/featured"
              className="hidden w-full items-center p-4 text-base-950 invert-[40%] hover:cursor-pointer hover:text-base-800 hover:invert-0 focus:outline-none md:flex dark:text-base-50 dark:hover:text-base-200"
            >
              Featured
            </a>
            {Object.keys(categories).length > 0 && (
              <div className="relative">
                <button
                  onClick={toggleCategoryDropdown}
                  className="flex items-center p-4 text-base-950 invert-[40%] hover:text-base-800 hover:invert-0 focus:outline-none dark:text-base-50 dark:hover:text-base-200"
                >
                  <span className="hidden md:flex">Categories</span>
                  <span className="flex md:hidden">Menu</span>
                  <svg
                    className={`ml-1 h-4 w-4 transition-transform duration-100 ${
                      isCategoryDropdownOpen ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {/* Category Dropdown */}
                <div
                  className={`absolute ${isCategoryDropdownOpen ? "" : "sr-only"} left-0 z-20 mt-2 w-64 overflow-y-auto rounded-sm bg-base-50 shadow-lg ring-1 ring-base-950 ring-opacity-5 dark:bg-base-950`}
                >
                  <div className="flex flex-col items-start text-sm md:hidden">
                    <a
                      href="/browse"
                      className="block w-full px-4 py-2 text-left text-sm text-base-950 hover:bg-base-200 dark:text-base-50 dark:hover:bg-base-800"
                    >
                      Browse
                    </a>
                    <a
                      href="/featured"
                      className="block w-full px-4 py-2 text-left text-sm text-base-950 hover:bg-base-200 dark:text-base-50 dark:hover:bg-base-800"
                    >
                      Featured
                    </a>
                    <button
                      onClick={() => navigate("/about")}
                      className="block w-full px-4 py-2 text-left text-sm text-base-950 hover:bg-base-200 dark:text-base-50 dark:hover:bg-base-800"
                    >
                      About
                    </button>
                  </div>
                  <div className="px-4 py-2 font-bold text-base-950 dark:text-base-50">
                    Languages
                  </div>
                  {Object.entries(categories)
                    .filter(([, info]) => info.type === "language")
                    .map(([key, info]) => (
                      <a
                        key={key}
                        href={`/browse/${key}`}
                        className="block w-full px-4 py-2 text-left text-sm text-base-950 hover:bg-base-200 dark:text-base-50 dark:hover:bg-base-800"
                        onClick={() => {
                          setIsCategoryDropdownOpen(false);
                        }}
                      >
                        {info.name}
                      </a>
                    ))}
                  <div className="mt-2 px-4 py-2 font-bold text-base-950 dark:text-base-50">
                    Frameworks/Libraries
                  </div>
                  {Object.entries(categories)
                    .filter(([, info]) => info.type === "framework")
                    .map(([key, info]) => (
                      <a
                        key={key}
                        href={`/browse/${key}`}
                        className="block w-full px-4 py-2 text-left text-sm text-base-950 hover:bg-base-200 dark:text-base-50 dark:hover:bg-base-800"
                        onClick={() => {
                          setIsCategoryDropdownOpen(false);
                        }}
                      >
                        {info.name}
                      </a>
                    ))}
                </div>
              </div>
            )}
            <a
              href="/about"
              className="ml-0 hidden items-center p-4 text-base-950 invert-[40%] hover:text-base-800 hover:invert-0 focus:outline-none md:flex dark:text-base-50 dark:hover:text-base-200"
            >
              About
            </a>
          </div>

          {!userProfile && (
            <div
              onClick={handleSignIn}
              className="group ml-auto flex h-full items-center rounded-sm bg-base-950 text-base-50 duration-100 hover:cursor-pointer hover:bg-base-900 dark:invert"
            >
              <span className="max-w-0 overflow-hidden whitespace-nowrap transition-all duration-100 ease-in-out group-hover:max-w-xs group-hover:pl-4">
                Sign in with Google
              </span>
              <img
                src="/person.svg"
                className="rounded-sm p-3"
              />
            </div>
          )}
          {userProfile && !isBuilderPage && (
            <a
              href="/builder"
              className="group ml-auto flex h-full items-center rounded-sm bg-base-950 text-base-50 duration-100 hover:cursor-pointer hover:bg-base-900 dark:invert"
            >
              <span className="max-w-0 overflow-hidden whitespace-nowrap transition-all duration-100 ease-in-out group-hover:max-w-xs group-hover:pl-4">
                CREATE SNIPPET
              </span>
              <img
                src="/add.svg"
                className="rounded-sm p-2"
              />
            </a>
          )}
          {userProfile && (
            <div className={`relative ${isBuilderPage ? "ml-auto" : ""}`}>
              <img
                onClick={toggleDropdown}
                src={userProfile.picture}
                className={`z-30 max-h-12 cursor-pointer ${isDropdownOpen ? "rounded-t-sm" : "rounded-sm"} bg-base-950`}
                alt="User Profile"
              />
              {isDropdownOpen && (
                <div className="absolute right-0 z-20 max-h-[25vh] w-48 rounded-sm rounded-tr-none bg-base-950 shadow-lg ring-1 ring-base-50 ring-opacity-5">
                  <a
                    className="w-full px-4 py-3 text-left text-sm text-base-50 hover:bg-base-800"
                    href="/dashboard"
                  >
                    Dashboard
                  </a>
                  <a
                    className="w-full px-4 py-3 text-left text-sm text-base-50 hover:bg-base-800"
                    href={`/user/${userProfile.id}`}
                  >
                    Profile
                  </a>
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
        </div>
      </div>

      {isShortcutsPopupOpen && <KeyboardShortcuts />}
    </>
  );
};
