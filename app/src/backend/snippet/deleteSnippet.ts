interface Params {
  snippetIDToDelete: number;
}

export const deleteSnippet = async ({
  snippetIDToDelete,
}: Params): Promise<void> => {
  try {
    const response = await fetch(
      `/api//snippet/delete-snippet?snippetID=${snippetIDToDelete}`,
      {
        method: "DELETE",
      },
    );

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete snippet");
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
    console.error("Error deleting snippet:", error);
    throw error;
  }
};
