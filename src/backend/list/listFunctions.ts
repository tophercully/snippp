import { Snippet } from "../../typeInterfaces";

interface ListData {
  listid: string;
  userid: string;
  listname: string;
  description: string;
  createdat: string;
  lastupdated: string;
}

export async function getUserLists(userId: string): Promise<ListData[]> {
  const response = await fetch("/api/list/get-user-lists", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch user lists");
  }
  return response.json();
}

export async function getListSnippets(listId: number): Promise<Snippet[]> {
  const response = await fetch("/api/list/get-list-snippets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ listId }),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch list snippets");
  }
  return response.json();
}

export async function addSnippetToList(
  listId: number,
  snippetId: number,
): Promise<void> {
  try {
    const response = await fetch("/api/list/add-snippet-to-list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ listId, snippetId }),
    });

    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);

    const rawResponse = await response.text();
    console.log("Raw response:", rawResponse);

    if (!response.ok) {
      if (rawResponse) {
        try {
          const errorData = JSON.parse(rawResponse);
          throw new Error(errorData.error || "Failed to add snippet to list");
        } catch (parseError) {
          console.error("Error parsing error response:", parseError);
          throw new Error(
            `Server error: ${response.status} ${response.statusText}`,
          );
        }
      } else {
        throw new Error(
          `Server error: ${response.status} ${response.statusText}`,
        );
      }
    }

    // If the response is successful but empty, we don't need to parse it
    if (rawResponse) {
      const data = JSON.parse(rawResponse);
      console.log("Parsed response data:", data);
    }
  } catch (error) {
    console.error("Error in addSnippetToList:", error);
    throw error;
  }
}

export async function removeSnippetFromList(
  listId: number,
  snippetId: number,
): Promise<void> {
  const response = await fetch("/api/list/remove-snippet-from-list", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ listId, snippetId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to remove snippet from list");
  }
}

interface CreateListParams {
  userID: string;
  listName: string;
  description?: string;
}

export const createList = async ({
  userID,
  listName,
  description,
}: CreateListParams): Promise<{ listid: string | number }> => {
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

    const newList = await response.json();
    return newList; // This will contain the listid
  } catch (error) {
    console.error("Error creating list:", error);
    throw error;
  }
};

export const deleteList = async (listID: number): Promise<void> => {
  try {
    const response = await fetch(`/api/list/delete-list?listID=${listID}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete list");
      } else {
        const textError = await response.text();
        console.error("Server returned non-JSON response:", textError);
        throw new Error(
          `Server error: ${response.status} ${response.statusText}`,
        );
      }
    }

    const result = await response.json();
    console.log(result.message);
  } catch (error) {
    console.error("Error deleting list:", error);
    throw error;
  }
};

export const updateList = async (
  listID: number,
  listName: string,
  description: string,
): Promise<void> => {
  try {
    const response = await fetch(`/api/list/update-list`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ listID, listName, description }),
    });

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update list");
      } else {
        const textError = await response.text();
        console.error("Server returned non-JSON response:", textError);
        throw new Error(
          `Server error: ${response.status} ${response.statusText}`,
        );
      }
    }

    const result = await response.json();
    console.log(result.message);
  } catch (error) {
    console.error("Error updating list:", error);
    throw error;
  }
};
