import { createPool } from "@vercel/postgres";

const pool = createPool({
  connectionString: process.env.SNIPPET_URL,
});

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { userId } = req.body;

  if (!userId) {
    return res
      .status(400)
      .json({ error: "Missing required parameter: userId" });
  }

  try {
    const result = await pool.sql`
      SELECT sl.listid, sl.userid, sl.listname, sl.description, sl.createdat, sl.lastupdated,
             COUNT(ls.snippetid) AS snippet_count
      FROM snippet_lists sl
      LEFT JOIN list_snippets ls ON sl.listid = ls.listid
      WHERE sl.userid = ${userId}
      GROUP BY sl.listid, sl.userid, sl.listname, sl.description, sl.createdat, sl.lastupdated
      ORDER BY sl.lastupdated DESC;
    `;

    res.status(200).json(result.rows);
  } catch (error: any) {
    console.error("Error fetching user lists:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
