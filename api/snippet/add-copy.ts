import { createPool } from "@vercel/postgres";

const pool = createPool({
  connectionString: process.env.SNIPPET_URL,
});

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { snippetID } = req.body;

  if (!snippetID) {
    return res.status(400).json({ error: "Missing snippetID" });
  }

  try {
    await pool.sql`
      UPDATE snippets
      SET copyCount = copyCount + 1,
          lastCopied = CURRENT_TIMESTAMP
      WHERE snippetID = ${snippetID};
    `;
    console.log(`Copy count incremented for snippet ${snippetID}`);
    res
      .status(200)
      .json({ message: `Copy count incremented for snippet ${snippetID}` });
  } catch (error: any) {
    console.error("Error incrementing copy count:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
