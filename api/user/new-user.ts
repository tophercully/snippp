import { createPool } from "@vercel/postgres";

const pool = createPool({
  connectionString: process.env.VITE_SNIPPET_URL,
});

export default async function handler(req: any, res: any) {
  if (req.method === "POST") {
    const userProfile = req.body;

    if (userProfile) {
      try {
        console.log("Checking if user exists");
        const { rows } = await pool.sql`
          SELECT userId, name, email, profile_picture, last_login
          FROM users
          WHERE userId = ${userProfile.id};
        `;

        if (rows.length > 0) {
          const existingUser = rows[0];
          if (
            existingUser.name !== userProfile.name ||
            existingUser.email !== userProfile.email ||
            existingUser.profile_picture !== userProfile.picture ||
            Date.now() - new Date(existingUser.last_login).getTime() > 3600000 // 1 hour in milliseconds
          ) {
            console.log("Updating existing user");
            await pool.sql`
              UPDATE users
              SET name = ${userProfile.name},
                  email = ${userProfile.email},
                  profile_picture = ${userProfile.picture},
                  last_login = CURRENT_TIMESTAMP
              WHERE userId = ${userProfile.id};
            `;
            return res
              .status(200)
              .json({ message: "User updated", userUpdated: true });
          } else {
            console.log("User exists and no update needed");
            return res.status(200).json({
              message: "User exists and no update needed",
              userUpdated: false,
            });
          }
        } else {
          console.log("Creating new user");
          await pool.sql`
            INSERT INTO users (userId, name, email, profile_picture, createdAt, last_login)
            VALUES (${userProfile.id}, ${userProfile.name}, ${userProfile.email}, ${userProfile.picture}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
          `;
          return res
            .status(201)
            .json({ message: "New user created", userCreated: true });
        }
      } catch (error: any) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Database error" });
      }
    } else {
      return res.status(400).json({ error: "Invalid user profile" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
