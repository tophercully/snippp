import { Snippet } from "../../typeInterfaces";

export const loadUserSnippets = async (userID: string): Promise<Snippet[]> => {
  try {
    const response = await fetch(
      `/api/loader/load-user-snippets?userID=${userID}`,
    );

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to load user snippets");
      } else {
        const textError = await response.text();
        console.error("Server returned non-JSON response:", textError);
        throw new Error(
          `Server error: ${response.status} ${response.statusText}`,
        );
      }
    }

    const snippets: Snippet[] = await response.json();
    return snippets;
  } catch (error) {
    console.error("Error loading user snippets:", error);
    throw error;
  }
};