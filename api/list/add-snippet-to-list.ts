import { createPool } from "@vercel/postgres";

const pool = createPool({
  connectionString: process.env.SNIPPET_URL,
});

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { listId, snippetId } = req.body;

  if (!listId || !snippetId) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    await pool.sql`
      INSERT INTO list_snippets (listid, snippetid, addedat)
      VALUES (${listId}, ${snippetId}, NOW())
      ON CONFLICT (listid, snippetid) DO NOTHING;
    `;

    // Update the lastupdated field of the snippet_lists table
    await pool.sql`
      UPDATE snippet_lists
      SET lastupdated = NOW()
      WHERE listid = ${listId};
    `;

    res.status(200).json({ message: "Snippet added to list successfully" });
  } catch (error: any) {
    console.error("Error adding snippet to list:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
