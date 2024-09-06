import { createPool } from "@vercel/postgres";

const pool = createPool({
  connectionString: process.env.SNIPPET_URL,
});

export default async function fetchUserHandler(req: any, res: any) {
  if (req.method === "GET") {
    const userId = req.query.userId;

    if (userId) {
      try {
        const { rows } = await pool.sql`
          SELECT userId, name, email, profile_picture, bio, last_login, role
          FROM users
          WHERE userId = ${userId};
        `;

        if (rows.length > 0) {
          // Wrap the user data in an object with a 'user' property
          return res.status(200).json({ user: rows[0] });
        } else {
          return res.status(404).json({ error: "User not found" });
        }
      } catch (error: any) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Database error" });
      }
    } else {
      return res.status(400).json({ error: "Invalid user ID" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
