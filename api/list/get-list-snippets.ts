import { createPool } from "@vercel/postgres";

const pool = createPool({
  connectionString: process.env.SNIPPET_URL,
});

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { listId } = req.body;

  if (!listId) {
    return res
      .status(400)
      .json({ error: "Missing required parameter: listId" });
  }

  try {
    const result = await pool.sql`
      SELECT s.*
      FROM snippets s
      JOIN list_snippets ls ON s.snippetid = ls.snippetid
      WHERE ls.listid = ${listId}
      ORDER BY ls.addedat DESC;
    `;

    res.status(200).json(result.rows);
  } catch (error: any) {
    console.error("Error fetching list snippets:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
