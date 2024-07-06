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
