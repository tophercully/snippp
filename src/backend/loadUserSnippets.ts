import { createPool } from "@vercel/postgres";

console.log(import.meta.env.VITE_SNIPPET_URL);
const pool = createPool({
  connectionString: import.meta.env.VITE_SNIPPET_URL,
});

interface Params {
  userID: string;
}

export const loadUserSnippets = async ({ userID }: Params) => {
  try {
    // Fetch snippets with authorID matching userID
    const snippets = await pool.sql`
        SELECT *
        FROM Snippets
        WHERE authorID = ${userID};
      `;

    const snippetsArray = snippets.rows.map((row) => ({
      snippetID: row.snippetid,
      name: row.name,
      code: row.code,
      tags: row.tags,
      author: row.author,
      authorID: row.authorid,
    }));
    return snippetsArray;
  } catch (error) {
    console.error("Error fetching snippets by authorID:", error);
    throw error; // Re-throw the error for handling in the calling code
  }
};
