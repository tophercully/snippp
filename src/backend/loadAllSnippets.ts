// In loadAllSnippets.ts
import { createPool } from "@vercel/postgres";

const pool = createPool({
  connectionString: import.meta.env.VITE_SNIPPET_URL,
});

export const loadAllSnippets = async (userID?: string) => {
  const { rows } = await pool.sql`
    WITH FavoriteCounts AS (
        SELECT snippetid, COUNT(*) AS favoriteCount
        FROM favorites
        GROUP BY snippetid
    ),
    UserFavorites AS (
        SELECT snippetid
        FROM favorites
        WHERE userid = ${userID || ""}
    )
    SELECT 
        s.snippetid, 
        s.name, 
        s.code, 
        s.tags, 
        s.author, 
        s.authorid,
        COALESCE(fc.favoriteCount, 0) AS favoriteCount,
        CASE WHEN uf.snippetid IS NOT NULL THEN true ELSE false END AS isFavorite
    FROM Snippets s
    LEFT JOIN FavoriteCounts fc ON s.snippetid = fc.snippetid
    LEFT JOIN UserFavorites uf ON s.snippetid = uf.snippetid;
  `;

  const snippetsArray = rows.map((row) => ({
    snippetID: row.snippetid,
    name: row.name,
    code: row.code,
    tags: row.tags,
    author: row.author,
    authorID: row.authorid,
    favoriteCount: row.favoritecount,
    isFavorite: row.isfavorite,
  }));

  return snippetsArray;
};
