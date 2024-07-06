import { createPool } from "@vercel/postgres";

const pool = createPool({
  connectionString: process.env.SNIPPET_URL,
});

interface UpdateParams {
  name: string;
  code: string;
  tags: string;
  public: boolean;
}

export default async function handler(req: any, res: any) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const snippetIDToUpdate = parseInt(req.query.snippetID);
  const newParams: UpdateParams = req.body;

  if (!snippetIDToUpdate || !newParams) {
    return res
      .status(400)
      .json({ error: "snippetID and update parameters are required" });
  }

  try {
    await pool.sql`
      UPDATE Snippets
      SET 
        Name = ${newParams.name},
        Code = ${newParams.code},
        Tags = ${newParams.tags},
        Public = ${newParams.public},
        lastEdit = CURRENT_TIMESTAMP
      WHERE SnippetID = ${snippetIDToUpdate};
    `;

    console.log(`Snippet with SnippetID ${snippetIDToUpdate} updated`);
    res.status(200).json({ message: "Snippet updated successfully" });
  } catch (error: any) {
    console.error("Error updating snippet:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}
