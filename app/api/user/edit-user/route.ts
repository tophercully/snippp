import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";
export const runtime = "edge";

const sql = neon(process.env.SNIPPET_URL as string);

export async function PUT(request: Request) {
  const userProfile = await request.json();
  console.log("Received user profile:", userProfile);

  if (userProfile && userProfile.id) {
    try {
      console.log("Attempting to update user with ID:", userProfile.id);

      const result = await sql`
        UPDATE users
        SET name = ${userProfile.name},
            bio = ${userProfile.bio},
            last_login = CURRENT_TIMESTAMP
        WHERE userId = ${userProfile.id}
      `;

      console.log("Update result:", result);
      return NextResponse.json(
        { message: "User updated", userUpdated: true },
        { status: 200 },
      );
    } catch (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Database error", details: (error as Error).message },
        { status: 500 },
      );
    }
  } else {
    return NextResponse.json(
      {
        error: "Invalid user profile",
        details: "Missing id or other required fields",
      },
      { status: 400 },
    );
  }
}
