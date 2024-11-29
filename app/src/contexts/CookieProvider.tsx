// // contexts/CookieContext.tsx
// import React, { createContext, useContext, useState, useEffect } from "react";
// import { getCookie, setCookie } from "../utils/cookies";

// interface CookieContextType {
//   userProfile: any;
//   setUserProfile: (value: any) => void;
//   isUserCreated: boolean;
//   setIsUserCreated: (value: boolean) => void;
//   userToken: string | null;
//   setUserToken: (value: string | null) => void;
//   isEditing: boolean;
//   setIsEditing: (value: boolean) => void;
//   isEditingProfile: boolean;
//   setIsEditingProfile: (value: boolean) => void;
//   isAddingList: boolean;
//   setIsAddingList: (value: boolean) => void;
// }

// export const CookieContext = createContext<CookieContextType>({
//   userProfile: null,
//   setUserProfile: () => {},
//   isUserCreated: false,
//   setIsUserCreated: () => {},
//   userToken: "",
//   setUserToken: () => {},
//   isEditing: false,
//   setIsEditing: () => {},
//   isEditingProfile: false,
//   setIsEditingProfile: () => {},
//   isAddingList: false,
//   setIsAddingList: () => {},
// });

// export const CookieProvider: React.FC<{
//   children: React.ReactNode;
//   request: Request;
// }> = ({ children, request }) => {
//   const [userProfile, setUserProfile] = useState(null);
//   const [isUserCreated, setIsUserCreated] = useState(false);
//   const [userToken, setUserToken] = useState<string | null>(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [isEditingProfile, setIsEditingProfile] = useState(false);
//   const [isAddingList, setIsAddingList] = useState(false);

//   // Fetch initial values
//   useEffect(() => {
//     const fetchCookies = async () => {
//       setUserProfile(await getCookie(request, "userProfile"));
//       setIsUserCreated(await getCookie(request, "isUserCreated"));
//       setUserToken(await getCookie(request, "userToken"));
//       setIsEditing(await getCookie(request, "isEditing"));
//       setIsEditingProfile(await getCookie(request, "isEditingProfile"));
//       setIsAddingList(await getCookie(request, "isAddingList"));
//     };
//     fetchCookies();
//   }, []);

//   // Sync state changes to cookies
//   useEffect(() => {
//     const syncCookies = async () => {
//       await setCookie("userProfile", userProfile);
//       await setCookie("isUserCreated", isUserCreated);
//       await setCookie("userToken", userToken);
//       await setCookie("isEditing", isEditing);
//       await setCookie("isEditingProfile", isEditingProfile);
//       await setCookie("isAddingList", isAddingList);
//     };
//     syncCookies();
//   }, [
//     userProfile,
//     isUserCreated,
//     userToken,
//     isEditing,
//     isEditingProfile,
//     isAddingList,
//   ]);

//   const contextValue = {
//     userProfile,
//     setUserProfile,
//     isUserCreated,
//     setIsUserCreated,
//     userToken,
//     setUserToken,
//     isEditing,
//     setIsEditing,
//     isEditingProfile,
//     setIsEditingProfile,
//     isAddingList,
//     setIsAddingList,
//   };

//   return (
//     <CookieContext.Provider value={contextValue}>
//       {children}
//     </CookieContext.Provider>
//   );
// };

// export const useCookies = () => {
//   const context = useContext(CookieContext);
//   if (!context) {
//     throw new Error("useCookies must be used within a CookieProvider");
//   }
//   return context;
// };
