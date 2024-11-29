import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.SNIPPET_URL as string);

export async function POST(request: Request) {
  const params = await request.json();

  if (!params || !params.name || !params.code || !params.authorID) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
  }

  try {
    const linePreservedCode = params.code.replace(
      /\r\n/g,
      String.fromCharCode(13) + String.fromCharCode(10),
    );

    console.log(linePreservedCode.length);

    // get the author's name from the users table
    const userRows = await sql`
      SELECT name FROM users WHERE userID = ${params.authorID};
    `;

    if (userRows.length === 0) {
      return NextResponse.json({ error: `User with ID ${params.authorID} not found` }, { status: 404 });
    }

    const authorName = userRows[0].name;

    // insert the new snippet
    const rows = await sql`
      INSERT INTO snippets(name, code, description, tags, author, authorID, public, forkedFrom)
      VALUES (${params.name}, ${linePreservedCode}, ${params.description}, ${params.tags}, ${authorName}, ${params.authorID}, ${params.public}, ${params.forkedFrom || null})
      RETURNING snippetID, name, code, description, tags, authorID, public, createdat, lastcopied, lastedit, copycount, forkedFrom;
    `;

    console.log("Snippet created with ID:", rows[0].snippetid);

    const newSnippet = {
      snippetID: rows[0].snippetid,
      name: rows[0].name,
      code: rows[0].code,
      description: rows[0].description,
      tags: rows[0].tags,
      author: authorName,
      authorID: rows[0].authorid,
      public: rows[0].public,
      createdAt: rows[0].createdat,
      lastCopied: rows[0].lastcopied,
      lastEdit: rows[0].lastedit,
      copyCount: rows[0].copycount,
      favoriteCount: 0,
      isFavorite: false,
      forkedFrom: rows[0].forkedfrom,
    };

    return NextResponse.json(newSnippet, { status: 200 });
  } catch (error) {
    console.error("Error creating new snippet:", error);
    return NextResponse.json({ error: "Internal Server Error", details: (error as Error).message }, { status: 500 });
  }
}