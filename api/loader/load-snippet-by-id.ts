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

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: `Snippet with ID ${snippetID} not found` });
    }

    const snippet = rows[0];
    console.log("Raw snippet data:", snippet);

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
      forkCount: parseInt(snippet.forkcount),
    };

    res.status(200).json(formattedSnippet);
  } catch (error: any) {
    console.error("Error fetching snippet by ID:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}
