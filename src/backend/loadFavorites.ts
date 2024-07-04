import { createPool } from "@vercel/postgres";

const pool = createPool({
  connectionString: import.meta.env.VITE_SNIPPET_URL,
});

interface Params {
  userID: string;
}

export const loadFavorites = async ({ userID }: Params) => {
  try {
    const { rows } = await pool.sql`
      WITH FavoriteCounts AS (
          SELECT snippetid, COUNT(*) AS favoriteCount
          FROM favorites
          GROUP BY snippetid
      )
      SELECT 
          s.snippetid, 
          s.name, 
          s.code, 
          s.tags, 
          s.author, 
          s.authorid,
          COALESCE(fc.favoriteCount, 0) AS favoriteCount
      FROM Snippets s
      LEFT JOIN FavoriteCounts fc ON s.snippetid = fc.snippetid
      WHERE s.snippetID IN (
          SELECT snippetID
          FROM favorites
          WHERE userID = ${userID}
      );
    `;

    const snippetsArray = rows.map((row) => ({
      snippetID: row.snippetid,
      name: row.name,
      code: row.code,
      tags: row.tags,
      author: row.author,
      authorID: row.authorid,
      favoriteCount: row.favoritecount,
      isFavorite: true,
    }));

    console.log(snippetsArray);

    return snippetsArray;
  } catch (error) {
    console.error("Error retrieving favorite snippets:", error);
    throw error;
  }
};
