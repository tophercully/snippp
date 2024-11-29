import { Snippet } from "../../types/typeInterfaces";


export const loadAllSnippets = async (userID?: string): Promise<Snippet[]> => {
  try {
    const url =
      userID ?
        `/api/loader/load-all-snippets?userID=${userID}`
      : "/api/loader/load-all-snippets";
    const response = await fetch(url);

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to load snippets");
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
    console.error("Error loading snippets:", error);
    throw error;
  }
};
