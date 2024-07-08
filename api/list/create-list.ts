import { createPool } from "@vercel/postgres";

const pool = createPool({
  connectionString: process.env.SNIPPET_URL,
});

interface CreateListParams {
  userID: string;
  listName: string;
  description?: string;
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { userID, listName, description }: CreateListParams = req.body;

  if (!userID || !listName) {
    return res.status(400).json({ error: "userID and listName are required" });
  }

  try {
    const { rows } = await pool.query(
      `
      INSERT INTO snippet_lists (userID, listName, description)
      VALUES ($1, $2, $3)
      RETURNING listid;
    `,
      [userID, listName, description],
    );

    const newList = rows[0];
    res.status(201).json(newList);
  } catch (error: any) {
    console.error("Error creating list:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}
