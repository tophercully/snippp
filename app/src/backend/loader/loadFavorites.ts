import { Snippet } from "../../types/typeInterfaces";

interface Params {
  userID: string;
}

export const loadFavorites = async ({ userID }: Params): Promise<Snippet[]> => {
  try {
    // Use full URL path for the fetch request
    const response = await fetch(
      `/api/loader/load-favorites?userID=${encodeURIComponent(userID)}`,
      {
        method: "GET", // Ensure that the method is GET
      },
    );

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to load favorite snippets");
      } else {
        const textError = await response.text();
        console.error("Server returned non-JSON response:", textError);
        throw new Error(
          `Server error: ${response.status} ${response.statusText}`,
        );
      }
    }

    // If the response is valid, return the favorites
    const favorites: Snippet[] = await response.json();
    return favorites;
  } catch (error) {
    console.error("Error retrieving favorite snippets:", error);
    throw error;
  }
};
