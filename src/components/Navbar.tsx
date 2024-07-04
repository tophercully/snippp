import React, { useState, useEffect } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { newUser } from "../backend/newUser";
import categories from "../utils/categories";
import { GoogleUser } from "../typeInterfaces";

export const Navbar: React.FC = () => {
  const [isUserCreated, setIsUserCreated] = useLocalStorage<boolean>(
    "isUserCreated",
    false,
  );
  const [userToken, setUserToken] = useLocalStorage<string | null>(
    "userGoogleToken",
    null,
  );
  const [userProfile, setUserProfile] = useLocalStorage<GoogleUser | null>(
    "userProfile",
    null,
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] =
    useState<boolean>(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleCategoryDropdown = () => {
    setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
  };

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUserToken(codeResponse.access_token),
    onError: (error) => console.log("Login Failed:", error),
  });

  const handleSignIn = () => {
    if (userToken || userProfile) {
      googleLogout();
      setUserToken(null);
      setUserProfile(null);
      setIsDropdownOpen(false);
      setIsUserCreated(false);
    } else {
      login();
    }
  };

  useEffect(() => {
    const getProfile = () => {
      if (userToken && !userProfile) {
        axios
          .get(
            `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${userToken}`,
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
                Accept: "application/json",
              },
            },
          )
          .then((res) => {
            setUserProfile(res.data);
          })
          .catch((err) => console.log(err));
      }
    };

    getProfile();
  }, [userToken, userProfile, setUserProfile]);

  useEffect(() => {
    if (userProfile && !isUserCreated) {
      newUser(userProfile)
        .then(() => {
          setIsUserCreated(true);
        })
        .catch((error) => {
          console.error("Error creating user:", error);
        });
      setUserToken(null);
    }
  }, [userProfile, isUserCreated, setUserToken, setIsUserCreated]);

  const isBuilderPage = window.location.pathname.includes("builder");

  return (
    <div className="absolute left-0 right-0 top-0 w-full p-2 md:px-10">
      <div className="flex h-fit w-full items-center justify-start gap-5">
        <a
          href="/"
          className="group flex items-center gap-1 rounded-sm bg-base-950 p-3 text-base-50 dark:bg-base-50 dark:text-base-950"
        >
          <img
            src="scissors.svg"
            className="h-6 w-6"
          />
          <span className="max-w-0 overflow-hidden whitespace-nowrap transition-all duration-500 ease-in-out group-hover:max-w-xs group-hover:px-3">
            SNIPPP
          </span>
        </a>
        <a
          href="/browse"
          className="ml-10 flex items-center p-4 text-base-950 invert-[40%] hover:text-base-800 hover:invert-0 focus:outline-none dark:text-base-50 dark:hover:text-base-200"
        >
          BROWSE
        </a>
        {Object.keys(categories).length > 0 && (
          <div className="relative">
            <button
              onClick={toggleCategoryDropdown}
              className="ml-10 flex items-center p-4 text-base-950 invert-[40%] hover:text-base-800 hover:invert-0 focus:outline-none dark:text-base-50 dark:hover:text-base-200"
            >
              CATEGORIES
              <svg
                className={`ml-1 h-4 w-4 transition-transform duration-200 ${
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
            {isCategoryDropdownOpen && (
              <div className="absolute left-0 z-20 mt-2 w-48 rounded-sm bg-base-50 shadow-lg ring-1 ring-base-950 ring-opacity-5 dark:bg-base-950">
                {Object.entries(categories).map(([key, info]) => (
                  <a
                    key={key}
                    href={`/browse?category=${key}`}
                    className="block px-4 py-2 text-sm text-base-950 hover:bg-base-200 dark:text-base-50 dark:hover:bg-base-800"
                    onClick={() => setIsCategoryDropdownOpen(false)}
                  >
                    {info.name.toUpperCase()}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {!userProfile && (
          <div
            onClick={handleSignIn}
            className="group ml-auto flex h-full items-center rounded-sm bg-base-950 text-base-50 duration-200 hover:cursor-pointer hover:bg-base-900 dark:invert"
          >
            <span className="max-w-0 overflow-hidden whitespace-nowrap transition-all duration-200 ease-in-out group-hover:max-w-xs group-hover:pl-4">
              Sign in with Google
            </span>
            <img
              src="person.svg"
              className="rounded-sm p-3"
            />
          </div>
        )}
        {userProfile && !isBuilderPage && (
          <a
            href="/builder"
            className="group ml-auto flex h-full items-center rounded-sm bg-base-950 text-base-50 duration-200 hover:cursor-pointer hover:bg-base-900 dark:invert"
          >
            <span className="max-w-0 overflow-hidden whitespace-nowrap transition-all duration-200 ease-in-out group-hover:max-w-xs group-hover:pl-4">
              CREATE SNIPPET
            </span>
            <img
              src="add.svg"
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
                <a href="/mysnippets">
                  <button
                    className="w-full px-4 py-3 text-left text-sm text-base-50 hover:bg-base-800"
                    onClick={() => console.log("My Snippets clicked")}
                  >
                    My Snippets
                  </button>
                </a>
                <a href="/profile">
                  <button
                    className="w-full px-4 py-3 text-left text-sm text-base-50 hover:bg-base-800"
                    onClick={() => console.log("Profile clicked")}
                  >
                    Profile
                  </button>
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
  );
};