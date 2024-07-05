import { createPool } from "@vercel/postgres";
import { SnippetList } from "../../typeInterfaces";

const pool = createPool({
  connectionString: import.meta.env.VITE_SNIPPET_URL,
});

interface CreateListParams {
  userID: string;
  listName: string;
  description?: string;
}

export const createList = async ({
  userID,
  listName,
  description,
}: CreateListParams): Promise<SnippetList> => {
  try {
    const { rows } = await pool.sql`
      INSERT INTO snippet_lists (userID, listName, description)
      VALUES (${userID}, ${listName}, ${description})
      RETURNING *;
    `;

    return rows[0] as SnippetList;
  } catch (error) {
    console.error("Error creating list:", error);
    throw error;
  }
};
