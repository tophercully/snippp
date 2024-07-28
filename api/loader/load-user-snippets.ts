import { createPool } from "@vercel/postgres";

const pool = createPool({
  connectionString: process.env.SNIPPET_URL,
});

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const userID = req.query.userID;
  const userSignedIn = req.query.userSignedIn;
  const isSignedIn = userSignedIn === userID;

  if (!userID) {
    return res.status(400).json({ error: "userID is required" });
  }

  if (!userSignedIn) {
    return res.status(400).json({ error: "userSignedIn is required" });
  }

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
          WHERE userID = ${userSignedIn}
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
          CASE WHEN uf.snippetID IS NOT NULL THEN true ELSE false END AS isFavorite
      FROM snippets s
      JOIN users u ON s.authorID = u.userID
      LEFT JOIN snippets fs ON s.forkedFrom = fs.snippetID
      LEFT JOIN FavoriteCounts fc ON s.snippetID = fc.snippetID
      LEFT JOIN UserFavorites uf ON s.snippetID = uf.snippetID
      WHERE (s.authorID = ${userID} AND s.public = true)
         OR (${isSignedIn} AND s.authorID = ${userID});
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
      description: row.description,
      forkedFrom: row.forkedfrom,
      forkedFromName: row.forkedfromname,
    }));

    res.status(200).json(snippets);
  } catch (error: any) {
    console.error("Error fetching snippets by authorID:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}
