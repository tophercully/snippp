import { createPool } from "@vercel/postgres";

const pool = createPool({
  connectionString: process.env.SNIPPET_URL,
});

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const result = await pool.sql`
      SELECT sl.listid, sl.userid, sl.listname, sl.description, sl.createdat, sl.lastupdated,
             COUNT(ls.snippetid) AS snippet_count,
             u.name AS username,
             author.name AS author,
             true AS staffPick
      FROM snippet_lists sl
      JOIN staff_picks sp ON sl.listid = sp.id AND sp.type = 'list'
      LEFT JOIN list_snippets ls ON sl.listid = ls.listid
      LEFT JOIN users u ON sl.userid = u.userid
      LEFT JOIN users author ON sl.userid = author.userid
      GROUP BY sl.listid, sl.userid, sl.listname, sl.description, sl.createdat, sl.lastupdated, u.name, author.name
      ORDER BY sl.lastupdated DESC;
    `;

    res.status(200).json(result.rows);
  } catch (error: any) {
    console.error("Error fetching staff-picked lists:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
