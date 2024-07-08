import { createPool } from "@vercel/postgres";

const pool = createPool({
  connectionString: process.env.SNIPPET_URL,
});

export default async function handler(request: any, response: any) {
  if (request.method !== "GET") {
    return response.status(405).json({ error: "Method Not Allowed" });
  }

  const { userId, snippetId } = request.query;

  if (!userId || !snippetId) {
    return response.status(400).json({ error: "Missing required parameters" });
  }

  try {
    const result = await pool.sql`
      SELECT sl.listid, sl.listname,
             CASE WHEN ls.snippetid IS NOT NULL THEN true ELSE false END AS has_snippet
      FROM snippet_lists sl
      LEFT JOIN list_snippets ls ON sl.listid = ls.listid AND ls.snippetid = ${snippetId}
      WHERE sl.userid = ${userId}
      ORDER BY sl.listname
    `;

    response.status(200).json(result.rows);
  } catch (error: any) {
    console.error("Error fetching lists with snippet status:", error);
    response
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}
