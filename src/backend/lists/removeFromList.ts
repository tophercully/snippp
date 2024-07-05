import { createPool } from "@vercel/postgres";

const pool = createPool({
  connectionString: import.meta.env.VITE_SNIPPET_URL,
});

interface RemoveFromListParams {
  listID: number;
  snippetID: number;
}

export const removeFromList = async ({
  listID,
  snippetID,
}: RemoveFromListParams): Promise<void> => {
  try {
    await pool.sql`
      DELETE FROM list_snippets
      WHERE listID = ${listID} AND snippetID = ${snippetID};
    `;
  } catch (error) {
    console.error("Error removing snippet from list:", error);
    throw error;
  }
};
