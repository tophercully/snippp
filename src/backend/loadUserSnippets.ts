import { createPool } from "@vercel/postgres";
import { Snippet } from "../typeInterfaces";
import { loadFavorites } from "./loadFavorites";

const pool = createPool({
  connectionString: import.meta.env.VITE_SNIPPET_URL,
});

interface Params {
  userID: string;
}

export const loadUserSnippets = async ({ userID }: Params) => {
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
      WHERE s.authorID = ${userID};
    `;

    let existingFavorites: Snippet[] = [];
    if (userID) {
      existingFavorites = await loadFavorites({ userID });
    }

    const snippetsArray = rows.map((row) => ({
      snippetID: row.snippetid,
      name: row.name,
      code: row.code,
      tags: row.tags,
      author: row.author,
      authorID: row.authorid,
      favoriteCount: row.favoritecount,
      isFavorite: existingFavorites.some(
        (favorite: Snippet) => favorite.snippetID === row.snippetid,
      ),
    }));

    return snippetsArray;
  } catch (error) {
    console.error("Error fetching snippets by authorID:", error);
    throw error;
  }
};
