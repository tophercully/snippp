import { createPool } from "@vercel/postgres";
import { Snippet } from "../typeInterfaces";

const pool = createPool({
  connectionString: import.meta.env.VITE_SNIPPET_URL,
});

// Function to load a single snippet by its ID
export const loadSnippetById = async (snippetID: number) => {
  const { rows } = await pool.sql`
    WITH FavoriteCounts AS (
        SELECT snippetid, COUNT(*) AS favoriteCount
        FROM favorites
        GROUP BY snippetid
    )
    SELECT 
        Snippets.snippetid, 
        Snippets.name, 
        Snippets.code, 
        Snippets.tags, 
        Snippets.author, 
        Snippets.authorid,
        COALESCE(FavoriteCounts.favoriteCount, 0) AS favoriteCount
    FROM Snippets
    LEFT JOIN FavoriteCounts
    ON Snippets.snippetid = FavoriteCounts.snippetid
    WHERE Snippets.snippetid = ${snippetID};
  `;

  if (rows.length === 0) {
    throw new Error(`Snippet with ID ${snippetID} not found`);
  }

  const existingFavorites =
    localStorage.getItem("favorites") ?
      JSON.parse(localStorage.getItem("favorites") as string)
    : [];

  const snippet = rows.map((row) => ({
    snippetID: row.snippetid,
    name: row.name,
    code: row.code,
    tags: row.tags,
    author: row.author,
    authorID: row.authorid,
    favoriteCount: row.favoritecount,
    isFavorite:
      Array.isArray(existingFavorites) ?
        existingFavorites.some((e: Snippet) => e.snippetID === row.snippetid)
      : false,
  }))[0];

  return snippet;
};
