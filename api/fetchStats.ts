import { createPool } from "@vercel/postgres";

const pool = createPool({
  connectionString: process.env.SNIPPET_URL,
});

interface HomepageInfo {
  snippetCount: number;
  userCount: number;
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { rows } = await pool.sql`
      SELECT
        (SELECT COUNT(*) FROM snippets) AS snippetCount,
        (SELECT COUNT(*) FROM users) AS userCount
    `;

    const stats: HomepageInfo = {
      snippetCount: parseInt(rows[0].snippetcount),
      userCount: parseInt(rows[0].usercount),
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}
