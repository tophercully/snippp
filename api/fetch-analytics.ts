import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

type ErrorResponse = {
  error: string;
  message?: string;
  details?: unknown;
};

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const client_id = process.env.GA_CLIENT_ID;
  const client_secret = process.env.GA_CLIENT_SECRET;
  const refresh_token = process.env.GA_REFRESH_TOKEN;
  const property_id = process.env.GA_PROPERTY_ID;

  if (!client_id || !client_secret || !refresh_token || !property_id) {
    return res
      .status(500)
      .json({ error: "Missing required environment variables" });
  }

  try {
    const auth = new OAuth2Client(client_id, client_secret);
    auth.setCredentials({ refresh_token });

    const analyticsdata = google.analyticsdata({ version: "v1beta", auth });

    const response = await analyticsdata.properties.runReport({
      property: `properties/${property_id}`,
      requestBody: {
        dateRanges: [
          { startDate: "30daysAgo", endDate: "today" },
          { startDate: "1hourAgo", endDate: "now" },
        ],
        metrics: [{ name: "totalUsers" }, { name: "activeUsers" }],
      },
    });

    const usersLast30Days = parseInt(
      response.data.rows?.[0]?.metricValues?.[0]?.value ?? "0",
    );
    const activeUsersLastHour = parseInt(
      response.data.rows?.[1]?.metricValues?.[1]?.value ?? "0",
    );

    res.status(200).json({
      usersLast30Days,
      activeUsersLastHour,
    });
  } catch (error) {
    console.error("Error fetching Google Analytics data:", error);
    const errorResponse: ErrorResponse = {
      error: "Internal Server Error",
      message: error instanceof Error ? error.message : String(error),
    };

    if (error instanceof Error && "response" in error) {
      const gaxiosError = error as { response?: { data: unknown } };
      errorResponse.details = gaxiosError.response?.data;
    }

    res.status(500).json(errorResponse);
  }
}
