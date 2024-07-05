import { createPool } from "@vercel/postgres";

const pool = createPool({
  connectionString: import.meta.env.VITE_SNIPPET_URL,
});

export const addCopy = async (snippetID: number): Promise<void> => {
  try {
    await pool.sql`
      UPDATE snippets
      SET copyCount = copyCount + 1,
          lastCopied = CURRENT_TIMESTAMP
      WHERE snippetID = ${snippetID};
    `;
    console.log(`Copy count incremented for snippet ${snippetID}`);
  } catch (error) {
    console.error("Error incrementing copy count:", error);
    throw error;
  }
};
