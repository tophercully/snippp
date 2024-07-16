import React, { useState, useEffect } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { fetchUserProfile, newUser } from "../../backend/user/userFunctions";
import categories from "../../utils/categories";
import { GoogleUser } from "../../typeInterfaces";
import { KeyboardShortcuts } from "./KeyboardShortcuts";
import { useNavigate } from "react-router-dom";
import { track } from "@vercel/analytics";

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
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
  const [isShortcutsPopupOpen, setIsShortcutsPopupOpen] =
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
            const googleUserProfile = res.data;
            // Extract base URL and modify the size parameter for higher resolution
            const highResPicture = googleUserProfile.picture.replace(
              /s96-c/,
              "s400-c",
            );
            googleUserProfile.picture = highResPicture;

            setUserProfile(googleUserProfile);
            fetchUserProfile(googleUserProfile.id)
              .then((snipppProfile) => {
                if (snipppProfile) {
                  const updatedProfile = { ...googleUserProfile };
                  if (
                    snipppProfile.name &&
                    snipppProfile.name !== googleUserProfile.name
                  ) {
                    updatedProfile.name = snipppProfile.name;
                  }
                  if (
                    snipppProfile.profile_picture &&
                    snipppProfile.profile_picture !== googleUserProfile.picture
                  ) {
                    updatedProfile.picture = snipppProfile.profile_picture;
                  }
                  setUserProfile(updatedProfile);
                }
              })
              .catch((error) =>
                console.error("Error fetching user profile:", error),
              );
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

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "?") {
        setIsShortcutsPopupOpen(!isShortcutsPopupOpen);
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [isShortcutsPopupOpen]);

  const isBuilderPage = window.location.pathname.includes("builder");
  return (
    <>
      {!userProfile}
      <div className="absolute left-0 right-0 top-0 w-full p-2 lg:px-10">
        <div className="flex h-fit w-full items-center justify-start gap-5">
          <a
            href="/"
            className="group flex items-center gap-1 rounded-sm bg-base-950 p-3 text-base-50 dark:bg-base-50 dark:text-base-950"
          >
            <img
              src="/scissors.svg"
              className="h-6 w-6 brightness-0 invert dark:invert-0"
            />
            <span className="max-w-0 overflow-hidden whitespace-nowrap transition-all duration-100 ease-in-out group-hover:max-w-xs group-hover:px-3">
              SNIPPP
            </span>
          </a>
          <div className="flex w-fit items-center justify-center md:justify-start md:gap-5">
            <button
              onClick={() => {
                track(`Open Browser`);
                navigate(`/browse`);
              }}
              className="ml-10 hidden items-center p-4 text-base-950 invert-[40%] hover:text-base-800 hover:invert-0 focus:outline-none md:flex dark:text-base-50 dark:hover:text-base-200"
            >
              BROWSE
            </button>
            {Object.keys(categories).length > 0 && (
              <div className="relative">
                <button
                  onClick={toggleCategoryDropdown}
                  className="flex items-center p-4 text-base-950 invert-[40%] hover:text-base-800 hover:invert-0 focus:outline-none dark:text-base-50 dark:hover:text-base-200"
                >
                  CATEGORIES
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
                {isCategoryDropdownOpen && (
                  <div className="absolute left-0 z-20 mt-2 w-48 rounded-sm bg-base-50 shadow-lg ring-1 ring-base-950 ring-opacity-5 dark:bg-base-950">
                    <div className="px-4 py-2 font-bold text-base-950 dark:text-base-50">
                      Languages
                    </div>
                    {Object.entries(categories)
                      .filter(([, info]) => info.kind === "language")
                      .map(([key, info]) => (
                        <button
                          key={key}
                          className="block px-4 py-2 text-sm text-base-950 hover:bg-base-200 dark:text-base-50 dark:hover:bg-base-800"
                          onClick={() => {
                            setIsCategoryDropdownOpen(false);
                            track(`Category ${categories[key]} Browsed`);
                            navigate(`/browse/${key}`);
                          }}
                        >
                          {info.name.toUpperCase()}
                        </button>
                      ))}
                    <div className="mt-2 px-4 py-2 font-bold text-base-950 dark:text-base-50">
                      Frameworks/Libraries
                    </div>
                    {Object.entries(categories)
                      .filter(([, info]) => info.kind === "framework/library")
                      .map(([key, info]) => (
                        <button
                          key={key}
                          className="block px-4 py-2 text-sm text-base-950 hover:bg-base-200 dark:text-base-50 dark:hover:bg-base-800"
                          onClick={() => {
                            setIsCategoryDropdownOpen(false);
                            track(`Category ${categories[key]} Browsed`);
                            navigate(`/browse/${key}`);
                          }}
                        >
                          {info.name.toUpperCase()}
                        </button>
                      ))}
                  </div>
                )}
              </div>
            )}
            <button
              onClick={() => {
                track("Open About Page");
                navigate("/about");
              }}
              className="ml-0 hidden items-center p-4 text-base-950 invert-[40%] hover:text-base-800 hover:invert-0 focus:outline-none md:flex dark:text-base-50 dark:hover:text-base-200"
            >
              ABOUT
            </button>
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
            <button
              onClick={() => {
                track("Open Builder");
                navigate("/builder");
              }}
              className="group ml-auto flex h-full items-center rounded-sm bg-base-950 text-base-50 duration-100 hover:cursor-pointer hover:bg-base-900 dark:invert"
            >
              <span className="max-w-0 overflow-hidden whitespace-nowrap transition-all duration-100 ease-in-out group-hover:max-w-xs group-hover:pl-4">
                CREATE SNIPPET
              </span>
              <img
                src="/add.svg"
                className="rounded-sm p-2"
              />
            </button>
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
                  <button
                    className="w-full px-4 py-3 text-left text-sm text-base-50 hover:bg-base-800"
                    onClick={() => {
                      track("Open Dashboard");
                      navigate("/dashboard");
                    }}
                  >
                    DASHBOARD
                  </button>
                  <button
                    className="w-full px-4 py-3 text-left text-sm text-base-50 hover:bg-base-800"
                    onClick={() => {
                      track("Open Profile");
                      navigate(`/user/${userProfile.id}`);
                    }}
                  >
                    PROFILE
                  </button>
                  <button
                    className="w-full px-4 py-3 text-left text-sm text-base-50 hover:bg-base-800"
                    onClick={handleSignIn}
                  >
                    SIGN OUT
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
