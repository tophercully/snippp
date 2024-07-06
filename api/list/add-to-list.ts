import { createPool } from "@vercel/postgres";

const pool = createPool({
  connectionString: process.env.SNIPPET_URL,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { listID, snippetID } = req.body;

  if (!listID || !snippetID) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    await pool.sql`
      INSERT INTO list_snippets (listID, snippetID)
      VALUES (${listID}, ${snippetID})
      ON CONFLICT (listID, snippetID) DO NOTHING;
    `;
    res
      .status(200)
      .json({
        message: `Snippet ${snippetID} added to list ${listID} successfully`,
      });
  } catch (error) {
    console.error("Error adding snippet to list:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
