import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

const sql = neon(process.env.SNIPPET_URL as string);

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  try {
    const result = await sql`
      SELECT userId, name, email, profile_picture, bio, last_login, role
      FROM users
      WHERE userId = ${userId};
    `;

    if (result.length > 0) {
      // Wrap the user data in an object with a 'user' property
      return NextResponse.json({ user: result[0] }, { status: 200 });
    } else {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Database error", details: (error as Error).message },
      { status: 500 },
    );
  }
}
