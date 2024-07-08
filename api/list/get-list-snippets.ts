import { createPool } from "@vercel/postgres";

const pool = createPool({
  connectionString: process.env.SNIPPET_URL,
});

export default async function handler(request: any, response: any) {
  if (request.method !== "GET") {
    return response.status(405).json({ error: "Method Not Allowed" });
  }

  const { userId, listId } = request.query;

  if (!userId || !listId) {
    return response.status(400).json({ error: "Missing required parameters" });
  }

  try {
    const { rows } = await pool.sql`
      SELECT s.*,
             COUNT(f2.snippetid) AS favoritecount,
             CASE WHEN f1.snippetid IS NOT NULL THEN true ELSE false END AS isfavorite
      FROM snippets s
      JOIN list_snippets ls ON s.snippetid = ls.snippetid
      JOIN snippet_lists sl ON ls.listid = sl.listid
      LEFT JOIN favorites f1 ON s.snippetid = f1.snippetid AND f1.userid = ${userId}
      LEFT JOIN favorites f2 ON s.snippetid = f2.snippetid
      WHERE sl.userid = ${userId} AND sl.listid = ${listId}
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
      favoriteCount: parseInt(row.favoritecount), // Now calculated from favorites table
      isFavorite: row.isfavorite,
      description: row.description,
    }));

    response.status(200).json(snippets);
  } catch (error: any) {
    console.error("Error fetching list snippets:", error);
    response
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}
