// src/utils/listFunctions.ts

import { Snippet, SnippetList } from "../../typeInterfaces";

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
  //   console.log(response);
  return response.json();
}

export async function getListSnippets(listId: string): Promise<Snippet[]> {
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
  listId: string,
  snippetId: string,
): Promise<void> {
  const response = await fetch("/api/addSnippetToList", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ listId, snippetId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to add snippet to list");
  }
}

export async function removeSnippetFromList(
  listId: string,
  snippetId: string,
): Promise<void> {
  const response = await fetch("/api/removeSnippetFromList", {
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
