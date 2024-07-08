import { createPool } from "@vercel/postgres";

const pool = createPool({
  connectionString: process.env.SNIPPET_URL,
});

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const snippetID = parseInt(req.query.snippetID);
  const userID = req.query.userID || "";

  if (!snippetID) {
    return res.status(400).json({ error: "snippetID is required" });
  }

  try {
    const { rows } = await pool.sql`
      WITH FavoriteCounts AS (
          SELECT snippetID, COUNT(*) AS favoriteCount
          FROM favorites
          GROUP BY snippetID
      ),
      UserFavorite AS (
          SELECT 1 AS is_favorite
          FROM favorites
          WHERE snippetID = ${snippetID} AND userID = ${userID}
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
          COALESCE(fc.favoriteCount, 0) AS favoriteCount,
          COALESCE(uf.is_favorite, 0) AS isFavorite
      FROM snippets s
      JOIN users u ON s.authorID = u.userID
      LEFT JOIN FavoriteCounts fc ON s.snippetID = fc.snippetID
      LEFT JOIN UserFavorite uf ON 1=1
      WHERE s.snippetID = ${snippetID};
    `;

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: `Snippet with ID ${snippetID} not found` });
    }

    const snippet = rows[0];
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
    };

    res.status(200).json(formattedSnippet);
  } catch (error: any) {
    console.error("Error fetching snippet by ID:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}
