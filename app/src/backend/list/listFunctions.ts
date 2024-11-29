import { track } from "@vercel/analytics";
import { ListData, Snippet } from "../../types/typeInterfaces";

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

export interface ListWithSnippetStatus {
  listid: number;
  listname: string;
  has_snippet: boolean;
}

export async function getListsWithSnippetStatus(
  userId: string,
  snippetId: number,
): Promise<ListWithSnippetStatus[]> {
  const response = await fetch(
    `/api/list/get-lists-with-snippet-status?userId=${userId}&snippetId=${snippetId}`,
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error response:", errorText);
    throw new Error(
      `Failed to fetch lists with snippet status: ${response.status} ${response.statusText}`,
    );
  }

  return await response.json();
}

export async function getList(listId: string): Promise<ListData> {
  const response = await fetch(`/api/list/get-list-by-id?listId=${listId}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch list");
  }

  return await response.json();
}

export async function getListSnippets(listId: number): Promise<Snippet[]> {
  const response = await fetch(`/api/list/get-list-snippets?listId=${listId}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch list snippets");
  }

  return await response.json();
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
  listID: number,
  snippetID: number,
): Promise<void> {
  const response = await fetch(
    `/api/list/remove-snippet-from-list?listID=${listID}&snippetID=${snippetID}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.error ||
        `Failed to remove snippet ${snippetID} from list ${listID}`,
    );
  }

  const data = await response.json();
  console.log(data.message); // Log the success message
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
    track("Create List");
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

export const addListToStaffPicks = async (listID: number): Promise<void> => {
  try {
    const response = await fetch(`/api/list/list-pick`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ listID }),
    });

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add list to staff picks");
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
export const removeListFromStaffPicks = async (
  listID: number,
): Promise<void> => {
  try {
    const response = await fetch(`/api/list/list-pick`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ listID }),
    });

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Failed to remove list from staff pick",
        );
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

export const getStaffPicks = async (): Promise<ListData[]> => {
  try {
    const response = await fetch("/api/list/get-staff-picks");

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch staff picks");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching staff picks:", error);
    throw error;
  }
};
