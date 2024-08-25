import { createPool } from "@vercel/postgres";

const pool = createPool({
  connectionString: process.env.SNIPPET_URL,
});

export default async function fetchAllUsersHandler(req: any, res: any) {
  if (req.method === "GET") {
    try {
      const { rows } = await pool.sql`SELECT * FROM users;`;
      const typedRows = rows.map((row) => ({
        userId: row.userid,
        name: row.name,
        email: row.email,
        profile_picture: row.profile_picture,
        bio: row.bio,
        last_login: row.last_login,
        created_at: row.createdat,
        role: row.role,
      }));
      return res.status(200).json(typedRows);
    } catch (error: any) {
      console.error("Database error:", error);
      return res.status(500).json({ error: "Database error" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
