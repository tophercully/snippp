import getBaseURL from "@/app/src/utils/getBaseURL";
import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

const sql = neon(process.env.SNIPPET_URL as string);

export async function GET(request: NextRequest) {
  const snippetID = parseInt(
    request.nextUrl.searchParams.get("snippetID") || "",
  );
  const userID = request.nextUrl.searchParams.get("userID") || "";

  if (!snippetID) {
    return NextResponse.json(
      { error: "snippetID is required" },
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
      UserFavorite AS (
          SELECT 1 AS is_favorite
          FROM favorites
          WHERE snippetID = ${snippetID} AND userID = ${userID}
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
          COALESCE(uf.is_favorite, 0) AS isFavorite,
          COALESCE(forkc.forkCount, 0) AS forkCount
      FROM snippets s
      JOIN users u ON s.authorID = u.userID
      LEFT JOIN snippets fs ON s.forkedFrom = fs.snippetID
      LEFT JOIN FavoriteCounts fc ON s.snippetID = fc.snippetID
      LEFT JOIN UserFavorite uf ON 1=1
      LEFT JOIN ForkCounts forkc ON s.snippetID = forkc.forkedFrom
      WHERE s.snippetID = ${snippetID};
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: `Snippet with ID ${snippetID} not found` },
        { status: 404 },
      );
    }

    const snippet = result[0];
    console.log("Raw snippet data:", snippet);
    console.log(getBaseURL());

    const formattedSnippet = {
      snippetID: snippet.snippetid,
      name: snippet.name,
      code: snippet.code,
      tags: snippet.tags,
      author: snippet.author,
      authorID: snippet.authorid,
      public: snippet.public,
      createdAt: snippet.createdat,
      lastCopied: snippet.lastcopied,
      lastEdit: snippet.lastedit,
      copyCount: snippet.copycount,
      favoriteCount: parseInt(snippet.favoritecount),
      isFavorite: Boolean(snippet.isfavorite),
      description: snippet.description,
      forkedFrom: snippet.forkedfrom,
      forkedFromName: snippet.forkedfromname,
      forkCount: snippet.forkcount,
    };

    return NextResponse.json(formattedSnippet, { status: 200 });
  } catch (error) {
    console.error("Error fetching snippet by ID:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: (error as Error).message },
      { status: 500 },
    );
  }
}
