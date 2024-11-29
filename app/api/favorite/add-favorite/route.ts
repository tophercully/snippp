import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.SNIPPET_URL as string);

export async function POST(request: Request) {
  const { userID, snippetIDToAdd } = await request.json();

  if (!userID || !snippetIDToAdd) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
  }

  try {
    // Check if the exact pair exists
    const rows = await sql`
      SELECT COUNT(*) as count
      FROM favorites
      WHERE userID = ${userID}
      AND snippetID = ${snippetIDToAdd};
    `;

    const favoriteExists = rows[0].count > 0;

    // If the pair doesn't exist, create it
    if (!favoriteExists) {
      await sql`
        INSERT INTO favorites (userID, snippetID)
        VALUES (${userID}, ${snippetIDToAdd});
      `;
      return NextResponse.json({
        message: `SnippetID ${snippetIDToAdd} added to favorites for userID ${userID}`,
      }, { status: 200 });
    } else {
      return NextResponse.json({
        message: `SnippetID ${snippetIDToAdd} already exists in favorites for userID ${userID}`,
      }, { status: 200 });
    }
  } catch (error) {
    console.error("Error adding snippet to favorites:", error);
    return NextResponse.json({ error: "Internal Server Error", details: (error as Error).message }, { status: 500 });
  }
}