import { createPool } from "@vercel/postgres";

const pool = createPool({
  connectionString: process.env.SNIPPET_URL,
});

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const params = req.body;

  if (!params || !params.name || !params.code || !params.authorID) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    const linePreservedCode = params.code.replace(
      /\r\n/g,
      String.fromCharCode(13) + String.fromCharCode(10),
    );

    // get the author's name from the users table
    const { rows: userRows } = await pool.sql`
      SELECT name FROM users WHERE userID = ${params.authorID};
    `;

    if (userRows.length === 0) {
      return res
        .status(404)
        .json({ error: `User with ID ${params.authorID} not found` });
    }

    const authorName = userRows[0].name;

    //insert the new snippet
    const { rows } = await pool.sql`
      INSERT INTO snippets(name, code, description, tags, author, authorID, public)
      VALUES (${params.name}, ${linePreservedCode}, ${params.description}, ${params.tags}, ${params.author}, ${params.authorID}, ${params.public})
      RETURNING snippetID, name, code, tags, authorID, public, createdat, lastcopied, lastedit, copycount;
    `;

    console.log("Snippet created with ID:", rows[0].snippetid);

    const newSnippet = {
      snippetID: rows[0].snippetid,
      name: rows[0].name,
      code: rows[0].code,
      description: rows[0].description,
      tags: rows[0].tags,
      author: authorName,
      authorID: rows[0].authorid,
      public: rows[0].public,
      createdAt: rows[0].createdat,
      lastCopied: rows[0].lastcopied,
      lastEdit: rows[0].lastedit,
      copyCount: rows[0].copycount,
      favoriteCount: 0,
      isFavorite: false,
    };

    res.status(200).json(newSnippet);
  } catch (error: any) {
    console.error("Error creating new snippet:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}
