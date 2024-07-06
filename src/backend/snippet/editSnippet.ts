interface UpdateParams {
  name: string;
  code: string;
  tags: string;
  public: boolean;
}

export const updateSnippet = async (
  snippetIDToUpdate: number,
  newParams: UpdateParams,
): Promise<void> => {
  try {
    const response = await fetch(
      `/api/snippet/edit-snippet?snippetID=${snippetIDToUpdate}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newParams),
      },
    );

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update snippet");
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
    console.error("Error updating snippet:", error);
    throw error;
  }
};
