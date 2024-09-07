import { createPool } from "@vercel/postgres";

const pool = createPool({
  connectionString: process.env.POSTGRES_URL,
});

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const result = await pool.sql`
      WITH listtags AS (
        SELECT sl.listid, s.tags
        FROM snippet_lists sl
        JOIN list_snippets ls ON sl.listid = ls.listid
        JOIN snippets s ON ls.snippetid = s.snippetid
      ),
      tag_counts AS (
        SELECT listid, trim(tag) AS tag, COUNT(*) AS tag_count
        FROM listtags, unnest(string_to_array(tags, ',')) AS tag
        GROUP BY listid, tag
      ),
      ranked_tags AS (
        SELECT listid, tag,
               ROW_NUMBER() OVER (PARTITION BY listid ORDER BY tag_count DESC) AS rank
        FROM tag_counts
      ),
      top_tags AS (
        SELECT listid, 
               array_agg(tag ORDER BY rank) AS top_tags
        FROM ranked_tags
        WHERE rank <= 5
        GROUP BY listid
      )
      SELECT sl.listid, sl.userid, sl.listname, sl.description, sl.createdat, sl.lastupdated,
             COUNT(ls.snippetid) AS snippet_count,
             u.name AS username,
             author.name AS author,
             true AS staff_pick,
             COALESCE(tt.top_tags, ARRAY[]::text[]) AS listtags,
             COUNT(ls.snippetid) AS snippetcount
      FROM snippet_lists sl
      JOIN staff_picks sp ON sl.listid = sp.id AND sp.type = 'list'
      LEFT JOIN list_snippets ls ON sl.listid = ls.listid
      LEFT JOIN users u ON sl.userid = u.userid
      LEFT JOIN users author ON sl.userid = author.userid
      LEFT JOIN top_tags tt ON sl.listid = tt.listid
      GROUP BY sl.listid, sl.userid, sl.listname, sl.description, sl.createdat, sl.lastupdated, u.name, author.name, tt.top_tags
      ORDER BY sl.lastupdated DESC;
    `;

    const processedResults = result.rows.map((row) => ({
      ...row,
      listtags:
        Array.isArray(row.listtags) && row.listtags.length > 0 ?
          row.listtags
        : getRandomTags(row.listtags || [], 3),
    }));

    res.status(200).json(processedResults);
  } catch (error: any) {
    console.error("Error fetching staff-picked lists:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}

function getRandomTags(tags: string[], count: number): string[] {
  const uniqueTags = Array.from(new Set(tags.flatMap((tag) => tag.split(","))));
  const shuffled = uniqueTags.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, uniqueTags.length));
}
