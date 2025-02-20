import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";
export const runtime = "edge";

const sql = neon(process.env.SNIPPET_URL as string);

export async function POST(request: Request) {
  const userProfile = await request.json();

  if (userProfile) {
    try {
      console.log("Checking if user exists");
      const rows = await sql`
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
          await sql`
            UPDATE users
            SET name = ${userProfile.name},
                email = ${userProfile.email},
                profile_picture = ${userProfile.picture},
                last_login = CURRENT_TIMESTAMP
            WHERE userId = ${userProfile.id};
          `;
          return NextResponse.json(
            { message: "User updated", userUpdated: true },
            { status: 200 },
          );
        } else {
          console.log("User exists and no update needed");
          return NextResponse.json(
            {
              message: "User exists and no update needed",
              userUpdated: false,
            },
            { status: 200 },
          );
        }
      } else {
        console.log("Creating new user");
        await sql`
          INSERT INTO users (userId, name, email, profile_picture, createdAt, last_login)
          VALUES (${userProfile.id}, ${userProfile.name}, ${userProfile.email}, ${userProfile.picture}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
        `;
        return NextResponse.json(
          { message: "New user created", userCreated: true },
          { status: 201 },
        );
      }
    } catch (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Database error", details: (error as Error).message },
        { status: 500 },
      );
    }
  } else {
    return NextResponse.json(
      { error: "Invalid user profile" },
      { status: 400 },
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 204 });
}
