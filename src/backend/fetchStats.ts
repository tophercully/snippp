interface HomepageInfo {
  snippetCount: number;
  userCount: number;
}

export const fetchStats = async (): Promise<HomepageInfo> => {
  try {
    const response = await fetch("/api/fetch-stats");

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch stats");
      } else {
        const textError = await response.text();
        console.error("Server returned non-JSON response:", textError);
        throw new Error(
          `Server error: ${response.status} ${response.statusText}`,
        );
      }
    }

    const stats: HomepageInfo = await response.json();
    return stats;
  } catch (error) {
    console.error("Error fetching stats:", error);
    throw error;
  }
};
