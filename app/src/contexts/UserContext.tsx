"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { track } from "@vercel/analytics";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import { GoogleUser } from "../types/typeInterfaces";

// Interfaces for type safety
interface UserContextType {
  userToken: string | null;
  userProfile: GoogleUser | null;
  isUserCreated: boolean;
  login: () => void;
  logout: () => void;
}

// Client-side context provider
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // State management with synchronization to cookies
  const [userToken, setUserToken] = useState<string | null>(
    () => getCookie("userToken") as string | null,
  );
  const [userProfile, setUserProfile] = useState<GoogleUser | null>(() => {
    const storedProfile = getCookie("userProfile") as string | null;
    return storedProfile ? JSON.parse(storedProfile) : null;
  });
  const [isUserCreated, setIsUserCreated] = useState<boolean>(
    () => getCookie("isUserCreated") === "true",
  );

  // Updated setters to sync with cookies
  const updateUserToken = (token: string | null) => {
    if (token) {
      setCookie("userToken", token, {
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    } else {
      deleteCookie("userToken");
    }
    setUserToken(token);
  };

  const updateUserProfile = (profile: GoogleUser | null) => {
    if (profile) {
      setCookie("userProfile", JSON.stringify(profile), {
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    } else {
      deleteCookie("userProfile");
    }
    setUserProfile(profile);
  };

  const updateIsUserCreated = (created: boolean) => {
    setCookie("isUserCreated", created.toString(), {
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    setIsUserCreated(created);
  };

  // Google login hook
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => updateUserToken(codeResponse.access_token),
    onError: (error) => console.log("Login Failed:", error),
  });

  // Logout function
  const logout = () => {
    track("User Sign Out");
    googleLogout();
    updateUserToken(null);
    updateUserProfile(null);
    updateIsUserCreated(false);
  };

  // Fetch user profile effect
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

          updateUserProfile(googleUserProfile);

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
              updateUserProfile(updatedProfile);
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
  }, [userToken, userProfile]);

  // Create user effect
  useEffect(() => {
    const checkAndCreateUser = async () => {
      if (userProfile && !isUserCreated) {
        try {
          // Check if user already exists before creating
          const existingProfile = await fetchUserProfile(userProfile.id);

          if (!existingProfile) {
            // Only create user if profile doesn't exist
            await newUser(userProfile);
            updateIsUserCreated(true);
          } else {
            // If profile exists, mark as created
            updateIsUserCreated(true);
          }
        } catch (error) {
          console.error("Error checking/creating user:", error);
        }
      }
    };

    checkAndCreateUser();
  }, [userProfile, isUserCreated]);

  return (
    <UserContext.Provider
      value={{
        userToken,
        userProfile,
        isUserCreated,
        login,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Context and hook setup
const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// You'll need to import these from your existing files
import { fetchUserProfile, newUser } from "../backend/user/userFunctions";
