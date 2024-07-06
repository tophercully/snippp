import { SnippetList } from "../../typeInterfaces";

interface CreateListParams {
  userID: string;
  listName: string;
  description?: string;
}

export const createList = async ({
  userID,
  listName,
  description,
}: CreateListParams): Promise<SnippetList> => {
  try {
    const response = await fetch("/api/list/create-list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userID, listName, description }),
    });

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create list");
      } else {
        const textError = await response.text();
        console.error("Server returned non-JSON response:", textError);
        throw new Error(
          `Server error: ${response.status} ${response.statusText}`,
        );
      }
    }

    const newList: SnippetList = await response.json();
    return newList;
  } catch (error) {
    console.error("Error creating list:", error);
    throw error;
  }
};
