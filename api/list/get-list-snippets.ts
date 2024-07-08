import { createPool } from "@vercel/postgres";

const pool = createPool({
  connectionString: process.env.SNIPPET_URL,
});
export default async function handler(request: any, response: any) {
  if (request.method !== "GET") {
    return response.status(405).json({ error: "Method Not Allowed" });
  }

  const { userId, listId } = request.query;

  if (!userId || !listId) {
    return response.status(400).json({ error: "Missing required parameters" });
  }

  try {
    const result = await pool.sql`
      SELECT s.*
      FROM snippets s
      JOIN list_snippets ls ON s.snippetid = ls.snippetid
      JOIN snippet_lists sl ON ls.listid = sl.listid
      WHERE sl.userid = ${userId} AND sl.listid = ${listId}
      ORDER BY s.createdat DESC
    `;

    response.status(200).json(result.rows);
  } catch (error: any) {
    console.error("Error fetching list snippets:", error);
    response
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}
