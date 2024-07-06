import { createPool } from "@vercel/postgres";
import { GoogleUser } from "../typeInterfaces";
const pool = createPool({
  connectionString: import.meta.env.VITE_SNIPPET_URL,
});

export const newUser = async (userProfile: GoogleUser) => {
  console.log("Checking if user exists");
  if (userProfile) {
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
        return false; // User existed and was updated
      } else {
        console.log("User exists and no update needed");
        return false; // User existed but no update was needed
      }
    } else {
      console.log("Creating new user");
      await pool.sql`
        INSERT INTO users (userId, name, email, profile_picture, createdAt, last_login)
        VALUES (${userProfile.id}, ${userProfile.name}, ${userProfile.email}, ${userProfile.picture}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
      `;
      return true; // New user was created
    }
  }
};
