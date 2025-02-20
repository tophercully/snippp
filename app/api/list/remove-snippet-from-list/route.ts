import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";
export const runtime = "edge";

const sql = neon(process.env.SNIPPET_URL as string);

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const listID = searchParams.get("listID");
  const snippetID = searchParams.get("snippetID");

  if (!listID || !snippetID) {
    return NextResponse.json(
      { error: "listID and snippetID are required" },
      { status: 400 },
    );
  }

  try {
    await sql`
      DELETE FROM list_snippets
      WHERE listID = ${parseInt(listID)} AND snippetID = ${parseInt(snippetID)};
    `;

    return NextResponse.json(
      { message: `Snippet ${snippetID} removed from list ${listID}` },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error removing snippet from list:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: (error as Error).message },
      { status: 500 },
    );
  }
}
