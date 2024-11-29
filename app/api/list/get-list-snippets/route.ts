import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

const sql = neon(process.env.SNIPPET_URL as string);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const listId = searchParams.get("listId");

  if (!listId) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 },
    );
  }

  try {
    const rows = await sql`
      SELECT s.*,
             COUNT(f2.snippetid) AS favoritecount,
             CASE WHEN f1.snippetid IS NOT NULL THEN true ELSE false END AS isfavorite
      FROM snippets s
      JOIN list_snippets ls ON s.snippetid = ls.snippetid
      JOIN snippet_lists sl ON ls.listid = sl.listid
      LEFT JOIN favorites f1 ON s.snippetid = f1.snippetid
      LEFT JOIN favorites f2 ON s.snippetid = f2.snippetid
      WHERE sl.listid = ${listId}
      GROUP BY s.snippetid, f1.snippetid
      ORDER BY s.createdat DESC
    `;

    const snippets = rows.map((row) => ({
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
      favoriteCount: parseInt(row.favoritecount),
      isFavorite: row.isfavorite,
      description: row.description,
    }));

    return NextResponse.json(snippets, { status: 200 });
  } catch (error) {
    console.error("Error fetching list snippets:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: (error as Error).message },
      { status: 500 },
    );
  }
}
