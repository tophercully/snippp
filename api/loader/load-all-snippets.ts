import { createPool } from "@vercel/postgres";

const pool = createPool({
  connectionString: process.env.SNIPPET_URL,
});

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const userID = req.query.userID || "";

  try {
    const { rows } = await pool.sql`
      WITH FavoriteCounts AS (
          SELECT snippetID, COUNT(*) AS favoriteCount
          FROM favorites
          GROUP BY snippetID
      ),
      UserFavorites AS (
          SELECT snippetID
          FROM favorites
          WHERE userID = ${userID}
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
          CASE WHEN uf.snippetID IS NOT NULL THEN true ELSE false END AS isFavorite
      FROM snippets s
      JOIN users u ON s.authorID = u.userID
      LEFT JOIN FavoriteCounts fc ON s.snippetID = fc.snippetID
      LEFT JOIN UserFavorites uf ON s.snippetID = uf.snippetID;
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
      favoriteCount: row.favoritecount,
      isFavorite: row.isfavorite,
    }));

    res.status(200).json(snippets);
  } catch (error) {
    console.error("Error loading snippets:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}
