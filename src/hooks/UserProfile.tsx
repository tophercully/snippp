import React, { createContext, useContext, useEffect } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";
import axios from "axios";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { fetchUserProfile, newUser } from "../backend/user/userFunctions";
import { GoogleUser } from "../typeInterfaces";
import { track } from "@vercel/analytics";

interface UserContextType {
  userToken: string | null;
  userProfile: GoogleUser | null;
  isUserCreated: boolean;
  login: () => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
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

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUserToken(codeResponse.access_token),
    onError: (error) => console.log("Login Failed:", error),
  });

  const logout = () => {
    track("User Sign Out");
    googleLogout();
    setUserToken(null);
    setUserProfile(null);
    setIsUserCreated(false);
  };

  useEffect(() => {
    const getProfile = async () => {
      if (userToken && !userProfile) {
        try {
          const res = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${userToken}`,
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
                Accept: "application/json",
              },
            },
          );
          const googleUserProfile = res.data;
          const highResPicture = googleUserProfile.picture.replace(
            /s96-c/,
            "s400-c",
          );
          googleUserProfile.picture = highResPicture;

          setUserProfile(googleUserProfile);

          try {
            const snipppProfile = await fetchUserProfile(googleUserProfile.id);
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
          } catch (error) {
            console.error("Error fetching user profile:", error);
          }
        } catch (err) {
          console.log(err);
        }
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

  return (
    <UserContext.Provider
      value={{ userToken, userProfile, isUserCreated, login, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
