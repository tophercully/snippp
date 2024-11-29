import { track } from "@vercel/analytics";

export const addCopy = async (snippetID: number): Promise<void> => {
  try {
    track("Snippet Copy Event");
    const response = await fetch("/api/snippet/add-copy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ snippetID }),
    });

    if (!response.ok) {
      throw new Error("Failed to increment copy count");
    }

    const data = await response.json();
    console.log(data.message);
  } catch (error) {
    console.error("Error incrementing copy count:", error);
    throw error;
  }
};
