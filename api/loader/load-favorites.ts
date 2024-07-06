import { createPool } from "@vercel/postgres";

const pool = createPool({
  connectionString: process.env.SNIPPET_URL,
});

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { userID } = req.query;

  if (!userID) {
    return res.status(400).json({ error: "Missing userID parameter" });
  }

  try {
    const { rows } = await pool.sql`
      WITH FavoriteCounts AS (
          SELECT snippetID, COUNT(*) AS favoriteCount
          FROM favorites
          GROUP BY snippetID
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
          COALESCE(fc.favoriteCount, 0) AS favoriteCount
      FROM snippets s
      JOIN users u ON s.authorID = u.userID
      LEFT JOIN FavoriteCounts fc ON s.snippetID = fc.snippetID
      WHERE s.snippetID IN (
          SELECT snippetID
          FROM favorites
          WHERE userID = ${userID}
      );
    `;

    const favorites = rows.map((row) => ({
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
      isFavorite: true, // These are favorites, so isFavorite is always true
    }));

    res.status(200).json(favorites);
  } catch (error) {
    console.error("Error retrieving favorite snippets:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}
