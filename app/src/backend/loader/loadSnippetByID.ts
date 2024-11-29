import { Snippet } from "../../types/typeInterfaces";
import getBaseURL from "../../utils/getBaseURL";

export const loadSnippetById = async (
  snippetID: number,
  userID?: string,
): Promise<Snippet> => {
  try {
    const baseUrl = getBaseURL();
    const url =
      userID ?
        `${baseUrl}/api/loader/load-snippet-by-id?snippetID=${snippetID}&userID=${userID}`
      : `${baseUrl}/api/loader/load-snippet-by-id?snippetID=${snippetID}`;

    const response = await fetch(url);

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to load snippet");
      } else {
        const textError = await response.text();
        console.error("Server returned non-JSON response:", textError);
        throw new Error(
          `Server error: ${response.status} ${response.statusText}`,
        );
      }
    }
    const snippet: Snippet = await response.json();
    return snippet;
  } catch (error) {
    console.error("Error loading snippet:", error);
    throw error;
  }
};
