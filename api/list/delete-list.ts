import { createPool } from "@vercel/postgres";

const pool = createPool({
  connectionString: process.env.SNIPPET_URL,
});

export default async function handler(req: any, res: any) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const listID = parseInt(req.query.listID as string);

  if (!listID) {
    return res.status(400).json({ error: "listID is required" });
  }

  try {
    await pool.sql`
      DELETE FROM snippet_lists
      WHERE listID = ${listID};
    `;

    res
      .status(200)
      .json({ message: `List with ID ${listID} has been deleted` });
  } catch (error: any) {
    console.error("Error deleting list:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}
