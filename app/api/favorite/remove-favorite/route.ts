import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.SNIPPET_URL as string);

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const userID = searchParams.get("userID") as string;
  const snippetIDToRemove = parseInt(searchParams.get("snippetID") || "");

  if (!userID || !snippetIDToRemove) {
    return NextResponse.json({ error: "userID and snippetID are required" }, { status: 400 });
  }

  try {
    // Check if the exact pair exists
    const rows = await sql`
      SELECT COUNT(*) as count
      FROM favorites
      WHERE userID = ${userID}
      AND snippetID = ${snippetIDToRemove};
    `;

    const favoriteExists = rows[0].count > 0;

    // If the pair exists, delete it
    if (favoriteExists) {
      await sql`
        DELETE FROM favorites
        WHERE userID = ${userID}
        AND snippetID = ${snippetIDToRemove};
      `;
      return NextResponse.json({
        message: `SnippetID ${snippetIDToRemove} removed from favorites for userID ${userID}`,
      }, { status: 200 });
    } else {
      return NextResponse.json({
        message: `SnippetID ${snippetIDToRemove} does not exist in favorites for userID ${userID}`,
      }, { status: 404 });
    }
  } catch (error) {
    console.error("Error removing snippet from favorites:", error);
    return NextResponse.json({ error: "Internal Server Error", details: (error as Error).message }, { status: 500 });
  }
}