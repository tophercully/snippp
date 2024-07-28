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
      SELECT sl.listid, sl.userid, sl.listname, sl.description, sl.createdat, sl.lastupdated,
             COUNT(ls.snippetid) AS snippet_count,
             u.name AS username
      FROM snippet_lists sl
      LEFT JOIN list_snippets ls ON sl.listid = ls.listid
      LEFT JOIN users u ON sl.userid = u.userid
      WHERE sl.userid = ${userId} AND sl.listid = ${listId}
      GROUP BY sl.listid, sl.userid, sl.listname, sl.description, sl.createdat, sl.lastupdated, u.name
    `;

    if (result.rows.length === 0) {
      return response.status(404).json({ error: "List not found" });
    }

    response.status(200).json(result.rows[0]);
  } catch (error: any) {
    console.error("Error fetching list:", error);
    response
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}
