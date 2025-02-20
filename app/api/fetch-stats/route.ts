import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";
export const runtime = "edge";

const sql = neon(process.env.SNIPPET_URL as string);

interface HomepageInfo {
  snippetCount: number;
  userCount: number;
}

export async function GET(request: NextRequest) {
  if (request.method !== "GET") {
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
  }

  try {
    const result = await sql`
      SELECT
        (SELECT COUNT(*) FROM snippets) AS snippetCount,
        (SELECT COUNT(*) FROM users) AS userCount
    `;

    const stats: HomepageInfo = {
      snippetCount: parseInt(result[0].snippetcount),
      userCount: parseInt(result[0].usercount),
    };

    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: (error as Error).message },
      { status: 500 },
    );
  }
}
