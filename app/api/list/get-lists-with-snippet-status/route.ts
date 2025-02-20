import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";
export const runtime = "edge";

const sql = neon(process.env.SNIPPET_URL as string);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const snippetId = searchParams.get("snippetId");

  if (!userId || !snippetId) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 },
    );
  }

  try {
    const result = await sql`
      SELECT sl.listid, sl.listname,
             CASE WHEN ls.snippetid IS NOT NULL THEN true ELSE false END AS has_snippet
      FROM snippet_lists sl
      LEFT JOIN list_snippets ls ON sl.listid = ls.listid AND ls.snippetid = ${snippetId}
      WHERE sl.userid = ${userId}
      ORDER BY sl.listname
    `;

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error fetching lists with snippet status:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: (error as Error).message },
      { status: 500 },
    );
  }
}
