import { createPool } from "@vercel/postgres";

const pool = createPool({
  connectionString: process.env.SNIPPET_URL,
});

export default async function editUserHandler(req: any, res: any) {
  if (req.method === "PUT") {
    const userProfile = req.body;
    console.log("Received user profile:", userProfile);

    if (userProfile && userProfile.id) {
      try {
        console.log("Attempting to update user with ID:", userProfile.id);

        const result = await pool.sql`
            UPDATE users
            SET name = ${userProfile.name},
                bio = ${userProfile.bio},
                last_login = CURRENT_TIMESTAMP
            WHERE userId = ${userProfile.id}
          `;

        console.log("Update result:", result);
        return res
          .status(200)
          .json({ message: "User updated", userUpdated: true });
      } catch (error) {
        console.error("Database error:", error);
        return res
          .status(500)
          .json({ error: "Database error", details: error.message });
      }
    } else {
      return res
        .status(400)
        .json({
          error: "Invalid user profile",
          details: "Missing id or other required fields",
        });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
