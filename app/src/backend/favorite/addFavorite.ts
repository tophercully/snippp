import { track } from "@vercel/analytics";

interface Params {
  userID: string;
  snippetIDToAdd: number;
}

export const addSnippetToFavorites = async ({
  userID,
  snippetIDToAdd,
}: Params): Promise<void> => {
  try {
    track("Add Favorite");
    const response = await fetch("/api/favorite/add-favorite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userID, snippetIDToAdd }),
    });

    if (!response.ok) {
      throw new Error("Failed to add snippet to favorites");
    }

    const data = await response.json();
    console.log(data.message);
  } catch (error) {
    console.error("Error adding snippet to favorites:", error);
    throw error;
  }
};
