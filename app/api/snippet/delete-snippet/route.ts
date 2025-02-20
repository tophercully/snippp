import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";
export const runtime = "edge";

const sql = neon(process.env.SNIPPET_URL as string);

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const snippetIDToDelete = parseInt(searchParams.get("snippetID") || "");

  if (!snippetIDToDelete) {
    return NextResponse.json(
      { error: "snippetID is required" },
      { status: 400 },
    );
  }

  try {
    await sql`
      DELETE FROM Snippets
      WHERE SnippetID = ${snippetIDToDelete};
    `;

    console.log(`Snippet with SnippetID ${snippetIDToDelete} deleted`);
    return NextResponse.json(
      { message: "Snippet deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting snippet:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: (error as Error).message },
      { status: 500 },
    );
  }
}
