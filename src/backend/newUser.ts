import { createPool } from "@vercel/postgres";

const pool = createPool({
  connectionString: import.meta.env.VITE_SNIPPET_URL,
});

interface GoogleUser {
  id: string;
  name: string;
  givenName: string;
  familyName: string;
  email: string;
  verified_email: boolean;
  picture: string;
}

export const newUser = async (userProfile: GoogleUser) => {
  console.log("checking user exists");
  if (userProfile) {
    const { rows } = await pool.sql`
        SELECT EXISTS (
            SELECT 1 FROM Snippet_Users
            WHERE Email = ${userProfile.email}
            ) AS UserExists;`;

    const userExists = rows[0].userexists;
    if (!userExists) {
      console.log("creating new user profile");
      await pool.sql`
                INSERT INTO Snippet_Users(Name, Email, Googleid)
                VALUES (${userProfile.name}, ${userProfile.email}, ${userProfile.id})`;

      console.log("User created");
    } else {
      console.log("User with the specified email already exists");
    }
  }
};
