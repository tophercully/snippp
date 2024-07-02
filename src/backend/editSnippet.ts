import { createPool } from "@vercel/postgres";

console.log(import.meta.env.VITE_SNIPPET_URL);
const pool = createPool({
  connectionString: import.meta.env.VITE_SNIPPET_URL,
});

interface UpdateParams {
  name: string;
  code: string;
  tags: string;
}

export const updateSnippet = async (
  snippetIDToUpdate: number,
  newParams: UpdateParams,
): Promise<void> => {
  const updateRow = async () => {
    await pool.sql`
      UPDATE Snippets
      SET 
        Name = ${newParams.name},
        Code = ${newParams.code},
        Tags = ${newParams.tags}
      WHERE SnippetID = ${snippetIDToUpdate};
    `;

    console.log(`Snippet with SnippetID ${snippetIDToUpdate} updated`);
  };

  await updateRow();
};
