interface RemoveFromListParams {
  listID: number;
  snippetID: number;
}

export const removeFromList = async ({
  listID,
  snippetID,
}: RemoveFromListParams): Promise<void> => {
  try {
    const response = await fetch(
      `/api/list/remove-from-list?listID=${listID}&snippetID=${snippetID}`,
      {
        method: "DELETE",
      },
    );

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Failed to remove snippet from list",
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
    console.error("Error removing snippet from list:", error);
    throw error;
  }
};
