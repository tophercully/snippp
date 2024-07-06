import { createPool } from "@vercel/postgres";

const pool = createPool({
  connectionString: process.env.SNIPPET_URL,
});

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const snippetIDToDelete = parseInt(req.query.snippetID);

  if (!snippetIDToDelete) {
    return res.status(400).json({ error: "snippetID is required" });
  }

  try {
    await pool.sql`
      DELETE FROM Snippets
      WHERE SnippetID = ${snippetIDToDelete};
    `;

    console.log(`Snippet with SnippetID ${snippetIDToDelete} deleted`);
    res.status(200).json({ message: "Snippet deleted successfully" });
  } catch (error) {
    console.error("Error deleting snippet:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}
