import { createPool } from "@vercel/postgres";

const pool = createPool({
  connectionString: import.meta.env.VITE_SNIPPET_URL,
});

export const deleteList = async (listID: number): Promise<void> => {
  try {
    await pool.sql`
      DELETE FROM snippet_lists
      WHERE listID = ${listID};
    `;
  } catch (error) {
    console.error("Error deleting list:", error);
    throw error;
  }
};
