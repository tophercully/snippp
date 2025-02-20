import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";
export const runtime = "edge";

const sql = neon(process.env.SNIPPET_URL as string);

export async function POST(request: Request) {
  const { listId, snippetId } = await request.json();

  if (!listId || !snippetId) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 },
    );
  }

  try {
    await sql`
      INSERT INTO list_snippets (listid, snippetid, addedat)
      VALUES (${listId}, ${snippetId}, NOW())
      ON CONFLICT (listid, snippetid) DO NOTHING;
    `;

    // Update the lastupdated field of the snippet_lists table
    await sql`
      UPDATE snippet_lists
      SET lastupdated = NOW()
      WHERE listid = ${listId};
    `;

    return NextResponse.json(
      { message: "Snippet added to list successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error adding snippet to list:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: (error as Error).message },
      { status: 500 },
    );
  }
}
