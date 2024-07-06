import { createPool } from "@vercel/postgres";

const pool = createPool({
  connectionString: process.env.SNIPPET_URL,
});

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { listID, snippetID } = req.query;

  if (!listID || !snippetID) {
    return res.status(400).json({ error: "listID and snippetID are required" });
  }

  try {
    await pool.sql`
      DELETE FROM list_snippets
      WHERE listID = ${parseInt(listID as string)} AND snippetID = ${parseInt(snippetID as string)};
    `;

    res
      .status(200)
      .json({ message: `Snippet ${snippetID} removed from list ${listID}` });
  } catch (error) {
    console.error("Error removing snippet from list:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}
