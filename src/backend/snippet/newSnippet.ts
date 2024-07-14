import { Snippet } from "../../typeInterfaces";
import { track } from "@vercel/analytics";

interface Params {
  name: string;
  code: string;
  description: string;
  tags: string;
  author: string;
  authorID: string;
  public: boolean;
}

export const newSnippet = async (params: Params): Promise<Snippet> => {
  track("Create Snippet");
  try {
    const response = await fetch("/api/snippet/new-snippet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create new snippet");
      } else {
        const textError = await response.text();
        console.error("Server returned non-JSON response:", textError);
        throw new Error(
          `Server error: ${response.status} ${response.statusText}`,
        );
      }
    }

    const newSnippet: Snippet = await response.json();
    console.log("Snippet created with ID:", newSnippet.snippetID);
    return newSnippet;
  } catch (error) {
    console.error("Error creating new snippet:", error);
    throw error;
  }
};
