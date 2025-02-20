import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";
export const runtime = "edge";

const sql = neon(process.env.SNIPPET_URL as string);

export async function GET(req: NextRequest) {
  const userID = req.nextUrl.searchParams.get("userID") || "";

  if (!userID) {
    return NextResponse.json(
      { error: "Missing userID parameter" },
      { status: 400 },
    );
  }

  try {
    const result = await sql`
      WITH FavoriteCounts AS (
          SELECT snippetID, COUNT(*) AS favoriteCount
          FROM favorites
          GROUP BY snippetID
      ),
      ForkCounts AS (
          SELECT forkedFrom, COUNT(*) AS forkCount
          FROM snippets
          WHERE forkedFrom IS NOT NULL
          GROUP BY forkedFrom
      )
      SELECT 
          s.snippetID, 
          s.name, 
          s.code, 
          s.tags, 
          u.name AS author, 
          s.authorID,
          s.public,
          s.createdAt,
          s.lastCopied,
          s.lastEdit,
          s.copyCount,
          s.description,
          s.forkedFrom,
          fs.name AS forkedFromName,
          COALESCE(fc.favoriteCount, 0) AS favoriteCount,
          COALESCE(forkc.forkCount, 0) AS forkCount
      FROM snippets s
      JOIN users u ON s.authorID = u.userID
      LEFT JOIN snippets fs ON s.forkedFrom = fs.snippetID
      LEFT JOIN FavoriteCounts fc ON s.snippetID = fc.snippetID
      LEFT JOIN ForkCounts forkc ON s.snippetID = forkc.forkedFrom
      WHERE s.snippetID IN (
          SELECT snippetID
          FROM favorites
          WHERE userID = ${userID}
      );
    `;

    const favorites = result.map((row) => ({
      snippetID: row.snippetid,
      name: row.name,
      code: row.code,
      tags: row.tags,
      author: row.author,
      authorID: row.authorid,
      public: row.public,
      createdAt: row.createdat,
      lastCopied: row.lastcopied,
      lastEdit: row.lastedit,
      copyCount: row.copycount,
      favoriteCount: row.favoritecount,
      description: row.description,
      forkedFrom: row.forkedfrom,
      forkedFromName: row.forkedfromname,
      forkCount: row.forkcount,
      isFavorite: true, // These are favorites, so isFavorite is always true
    }));

    return NextResponse.json(favorites, { status: 200 });
  } catch (error) {
    console.error("Error retrieving favorite snippets:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: (error as Error).message },
      { status: 500 },
    );
  }
}
