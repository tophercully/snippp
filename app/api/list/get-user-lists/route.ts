import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";
export const runtime = "edge";

const sql = neon(process.env.SNIPPET_URL as string);

export async function POST(request: NextRequest) {
  const { userId } = await request.json();

  if (!userId) {
    return NextResponse.json(
      { error: "Missing required parameter: userId" },
      { status: 400 },
    );
  }

  try {
    const result = await sql`
      SELECT sl.listid, sl.userid, sl.listname, sl.description, sl.createdat, sl.lastupdated,
             COUNT(ls.snippetid) AS snippet_count
      FROM snippet_lists sl
      LEFT JOIN list_snippets ls ON sl.listid = ls.listid
      WHERE sl.userid = ${userId}
      GROUP BY sl.listid, sl.userid, sl.listname, sl.description, sl.createdat, sl.lastupdated
      ORDER BY sl.lastupdated DESC;
    `;

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error fetching user lists:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: (error as Error).message },
      { status: 500 },
    );
  }
}
