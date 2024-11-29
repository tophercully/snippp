export interface AnalyticsInfo {
  activeUsersLastHour: number;
  usersLast30Days: number;
}

export async function fetchAnalytics() {
  try {
    const response = await fetch("/api/fetch-analytics");
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(JSON.stringify(errorData));
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    throw error;
  }
}
