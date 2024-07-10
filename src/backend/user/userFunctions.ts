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

interface SnipppProfile {
  userId: string;
  name: string;
  email: string;
  profile_picture: string;
  bio: string;
  last_login: string;
}
interface EditableUserFields {
  id: string;
  name?: string;
  bio?: string;
}

export const editUserProfile = async (
  userFields: EditableUserFields,
): Promise<boolean> => {
  try {
    const response = await fetch("/api/user/edit-user", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: userFields.id,
        name: userFields.name,
        bio: userFields.bio,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update user");
    }

    const data = await response.json();
    console.log(data.message);
    return data.userUpdated;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const fetchUserProfile = async (
  userId: string,
): Promise<SnipppProfile | null> => {
  try {
    const response = await fetch(`/api/user/fetch-user-data?userId=${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }

    const data = await response.json();

    if (data.user) {
      console.log(data.user);
      return data.user;
    } else {
      console.log("User not found");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};
