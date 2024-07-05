import { createPool } from "@vercel/postgres";
import { Snippet } from "../typeInterfaces";

const pool = createPool({
  connectionString: import.meta.env.VITE_SNIPPET_URL,
});

export const loadSnippetById = async (
  snippetID: number,
  userID?: string,
): Promise<Snippet> => {
  const { rows } = await pool.sql`
    WITH FavoriteCounts AS (
        SELECT snippetID, COUNT(*) AS favoriteCount
        FROM favorites
        GROUP BY snippetID
    ),
    UserFavorite AS (
        SELECT 1 AS is_favorite
        FROM favorites
        WHERE snippetID = ${snippetID} AND userID = ${userID || ""}
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
    throw new Error(`Snippet with ID ${snippetID} not found`);
  }

  const snippet = rows[0];
  return {
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
  };
};
