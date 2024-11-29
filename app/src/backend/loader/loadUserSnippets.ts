import { Snippet } from "../../types/typeInterfaces";

export const loadUserSnippets = async (
  userID: string,
  signedInID: string,
): Promise<Snippet[]> => {
  try {
    const response = await fetch(
      `/api/loader/load-user-snippets?userID=${userID}&userSignedIn=${signedInID ? signedInID : "0"}`,
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
