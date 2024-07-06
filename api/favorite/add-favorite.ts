import { createPool } from "@vercel/postgres";

const pool = createPool({
  connectionString: process.env.SNIPPET_URL,
});

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { userID, snippetIDToAdd } = req.body;

  if (!userID || !snippetIDToAdd) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    // Check if the exact pair exists
    const { rows } = await pool.sql`
      SELECT COUNT(*) as count
      FROM favorites
      WHERE userID = ${userID}
      AND snippetID = ${snippetIDToAdd};
    `;

    const favoriteExists = rows[0].count > 0;

    // If the pair doesn't exist, create it
    if (!favoriteExists) {
      await pool.sql`
        INSERT INTO favorites (userID, snippetID)
        VALUES (${userID}, ${snippetIDToAdd});
      `;
      res.status(200).json({
        message: `SnippetID ${snippetIDToAdd} added to favorites for userID ${userID}`,
      });
    } else {
      res.status(200).json({
        message: `SnippetID ${snippetIDToAdd} already exists in favorites for userID ${userID}`,
      });
    }
  } catch (error: any) {
    console.error("Error adding snippet to favorites:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
