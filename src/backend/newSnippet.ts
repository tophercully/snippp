import { createPool } from "@vercel/postgres";
import { Snippet } from "../typeInterfaces.ts";

interface Params {
  params: {
    name: string;
    code: string;
    tags: string;
    author: string;
    authorID: string;
    public: boolean;
  };
}

const pool = createPool({
  connectionString: import.meta.env.VITE_SNIPPET_URL,
});

export const newSnippet = async ({ params }: Params): Promise<Snippet> => {
  const linePreservedCode = params.code.replace(
    /\r\n/g,
    String.fromCharCode(13) + String.fromCharCode(10),
  );

  // get the author's name from the users table
  const { rows: userRows } = await pool.sql`
    SELECT name FROM users WHERE userID = ${params.authorID};
  `;

  if (userRows.length === 0) {
    throw new Error(`User with ID ${params.authorID} not found`);
  }

  const authorName = userRows[0].name;

  //insert the new snippet
  const { rows } = await pool.sql`
    INSERT INTO snippets(name, code, tags, author, authorID, public)
    VALUES (${params.name}, ${linePreservedCode}, ${params.tags}, ${params.author}, ${params.authorID}, ${params.public})
    RETURNING snippetID, name, code, tags, authorID, public, createdat, lastcopied, lastedit, copycount;
  `;

  console.log("Snippet created with ID:", rows[0].snippetid);

  return {
    snippetID: rows[0].snippetid,
    name: rows[0].name,
    code: rows[0].code,
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
};
