import { GoogleUser } from "../../typeInterfaces";

export const newUser = async (userProfile: GoogleUser): Promise<boolean> => {
  try {
    const response = await fetch("/api/user/new-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userProfile),
    });

    if (!response.ok) {
      throw new Error("Failed to update user");
    }

    const data = await response.json();
    console.log(data.message);
    return data.isNewUser;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};
