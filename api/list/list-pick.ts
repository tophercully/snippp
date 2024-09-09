import { createPool } from "@vercel/postgres";

const pool = createPool({
  connectionString: process.env.SNIPPET_URL,
});

interface ListPickParams {
  listID: string;
}

export default async function handler(req: any, res: any) {
  const { listID }: ListPickParams = req.body;

  if (!listID) {
    return res.status(400).json({ error: "listID is required" });
  }

  try {
    switch (req.method) {
      case "PUT": {
        const added = await addListPick(listID);
        return res.status(added ? 201 : 200).json({
          message:
            added ?
              `List ${listID} added to Staff Picks`
            : `List ${listID} already in Staff Picks`,
        });
      }

      case "DELETE": {
        await removeListPick(listID);
        return res.status(200).json({
          message: `List ${listID} removed from Staff Picks`,
        });
      }

      default:
        return res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (error: any) {
    console.error("Error managing staff picks:", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}

async function addListPick(listID: string): Promise<boolean> {
  // First, check if the entry already exists
  const checkResult = await pool.query(
    `
    SELECT id FROM staff_picks
    WHERE id = $1 AND type = 'list'
    `,
    [listID],
  );

  // If the entry doesn't exist, insert it
  if (checkResult.rowCount === 0) {
    await pool.query(
      `
      INSERT INTO staff_picks (id, type)
      VALUES ($1, 'list')
      `,
      [listID],
    );
    return true; // Indicates that a new entry was added
  }

  return false; // Indicates that the entry already existed
}

async function removeListPick(listID: string): Promise<void> {
  await pool.query(
    `
    DELETE FROM staff_picks
    WHERE id = $1 AND type = 'list'
    `,
    [listID],
  );
}
