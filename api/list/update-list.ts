import { createPool } from "@vercel/postgres";

const pool = createPool({
  connectionString: process.env.SNIPPET_URL,
});

export default async function handler(req: any, res: any) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { listID, listName, description } = req.body;

  if (!listID || !listName) {
    return res.status(400).json({ error: "listID and listName are required" });
  }

  try {
    await pool.sql`
      UPDATE snippet_lists
      SET listName = ${listName}, description = ${description}, lastUpdated = NOW()
      WHERE listID = ${listID};
    `;

    res
      .status(200)
      .json({ message: `List with ID ${listID} has been updated` });
  } catch (error: any) {
    console.error("Error updating list:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}
