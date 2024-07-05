import { createPool } from "@vercel/postgres";

const pool = createPool({
  connectionString: import.meta.env.VITE_SNIPPET_URL,
});

interface Params {
  snippetIDToDelete: number;
}
export const deleteSnippet = async ({ snippetIDToDelete }: Params) => {
  const deleteRow = async () => {
    await pool.sql`
            DELETE FROM Snippets
            WHERE SnippetID = ${snippetIDToDelete};
        `;

    console.log(`Snippet with SnippetID ${snippetIDToDelete} deleted`);
  };

  await deleteRow();
};
