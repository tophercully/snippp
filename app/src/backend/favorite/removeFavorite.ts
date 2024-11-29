interface Params {
  userID: string;
  snippetIDToRemove: number;
}

export const removeSnippetFromFavorites = async ({
  userID,
  snippetIDToRemove,
}: Params): Promise<void> => {
  try {
    const response = await fetch(
      `/api/favorite/remove-favorite?userID=${userID}&snippetID=${snippetIDToRemove}`,
      {
        method: "DELETE",
      },
    );

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            errorData.message ||
            "Failed to remove snippet from favorites",
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
    console.error("Error removing snippet from favorites:", error);
    throw error;
  }
};
