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
    const result = await sql`
   SELECT sl.listid, sl.userid, sl.listname, sl.description, sl.createdat, sl.lastupdated,
       COUNT(ls.snippetid) AS snippet_count,
       u.name AS username,
       author.name AS author,
       CASE 
           WHEN EXISTS (
               SELECT 1 
               FROM staff_picks sp 
               WHERE sp.id = sl.listid AND sp.type = 'list'
           ) THEN true 
           ELSE false 
       END AS staffPick
FROM snippet_lists sl
LEFT JOIN list_snippets ls ON sl.listid = ls.listid
LEFT JOIN users u ON sl.userid = u.userid
LEFT JOIN users author ON sl.userid = author.userid
WHERE sl.listid = ${listId} 
GROUP BY sl.listid, sl.userid, sl.listname, sl.description, sl.createdat, sl.lastupdated, u.name, author.name;


    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "List not found" }, { status: 404 });
    }

    return NextResponse.json(result[0], { status: 200 });
  } catch (error) {
    console.error("Error fetching list:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: (error as Error).message },
      { status: 500 },
    );
  }
}
