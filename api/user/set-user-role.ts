import { createPool } from "@vercel/postgres";

const pool = createPool({
  connectionString: process.env.SNIPPET_URL,
});

export default async function updateUserRole(req: any, res: any) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId, newRole } = req.body;

  if (!userId || !newRole) {
    return res.status(400).json({ error: "Missing userId or newRole" });
  }

  if (!["user", "admin", "moderator", "banned"].includes(newRole)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  try {
    const { rowCount } = await pool.sql`
      UPDATE users
      SET role = ${newRole}
      WHERE userid = ${userId};
    `;

    if (rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ message: "User role updated successfully" });
  } catch (error: any) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Database error" });
  }
}
