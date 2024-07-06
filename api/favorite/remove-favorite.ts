import { createPool } from "@vercel/postgres";

const pool = createPool({
  connectionString: process.env.SNIPPET_URL,
});

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const userID = req.query.userID as string;
  const snippetIDToRemove = parseInt(req.query.snippetID);

  if (!userID || !snippetIDToRemove) {
    return res.status(400).json({ error: "userID and snippetID are required" });
  }

  try {
    // Check if the exact pair exists
    const { rows } = await pool.sql`
      SELECT COUNT(*) as count
      FROM favorites
      WHERE userID = ${userID}
      AND snippetID = ${snippetIDToRemove};
    `;

    const favoriteExists = rows[0].count > 0;

    // If the pair exists, delete it
    if (favoriteExists) {
      await pool.sql`
        DELETE FROM favorites
        WHERE userID = ${userID}
        AND snippetID = ${snippetIDToRemove};
      `;
      res
        .status(200)
        .json({
          message: `SnippetID ${snippetIDToRemove} removed from favorites for userID ${userID}`,
        });
    } else {
      res
        .status(404)
        .json({
          message: `SnippetID ${snippetIDToRemove} does not exist in favorites for userID ${userID}`,
        });
    }
  } catch (error) {
    console.error("Error removing snippet from favorites:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}
