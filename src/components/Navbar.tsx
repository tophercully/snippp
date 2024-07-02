import { useLocalStorage } from "@uidotdev/usehooks";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { GoogleUser } from "../typeInterfaces";
import { useEffect, useState } from "react";
import axios from "axios";
import { newUser } from "../backend/newUser";

export const Navbar = () => {
  const [isUserCreated, setIsUserCreated] = useLocalStorage<boolean>(
    "isUserCreated",
    false,
  );

  const [userToken, setUserToken] = useLocalStorage<string | null>(
    "user",
    null,
  );
  const [userProfile, setUserProfile] = useLocalStorage<GoogleUser | null>(
    "userProfile",
    null,
  );

  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUserToken(codeResponse.access_token),
    onError: (error) => console.log("Login Failed:", error),
  });

  console.log(userProfile);
  const handleSignIn = () => {
    if (userToken || userProfile) {
      //sign out
      googleLogout();
      setUserToken(null);
      setUserProfile(null);
      setIsDropdownOpen(false);
      setIsUserCreated(false);
    } else {
      //sign in
      login();
    }
  };

  useEffect(() => {
    const getProfile = () => {
      if (userToken && !userProfile) {
        console.log("getting userProfile data");
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
      console.log("user check");
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

  return (
    <div className="absolute left-0 right-0 top-0 w-full p-2 md:px-10">
      <div className="flex h-fit w-full items-center justify-start">
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
        {userProfile && (
          <div className="relative ml-auto">
            <img
              onClick={toggleDropdown}
              src={userProfile.picture}
              className="z-30 max-h-12 cursor-pointer rounded-sm bg-base-950"
              alt="User Profile"
            />
            {isDropdownOpen && (
              <div className="absolute right-0 z-20 max-h-[25vh] w-48 rounded-sm bg-base-950 shadow-lg ring-1 ring-base-50 ring-opacity-5">
                <a href="/mysnippets">
                  <button
                    className="w-full px-4 py-3 text-left text-sm text-base-50 hover:bg-base-800"
                    onClick={() => console.log("Profile clicked")}
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
