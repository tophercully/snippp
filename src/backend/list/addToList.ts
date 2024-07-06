interface AddToListParams {
  listID: number;
  snippetID: number;
}

export const addToList = async ({
  listID,
  snippetID,
}: AddToListParams): Promise<void> => {
  try {
    const response = await fetch("/api/list/add-to-list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ listID, snippetID }),
    });

    if (!response.ok) {
      throw new Error("Failed to add snippet to list");
    }

    const data = await response.json();
    console.log(data.message);
  } catch (error) {
    console.error("Error adding snippet to list:", error);
    throw error;
  }
};
