import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";
export const runtime = "edge";

const sql = neon(process.env.SNIPPET_URL as string);

export async function PUT(request: Request) {
  const { userId, newRole } = await request.json();

  if (!userId || !newRole) {
    return NextResponse.json(
      { error: "Missing userId or newRole" },
      { status: 400 },
    );
  }

  if (!["user", "admin", "moderator", "banned"].includes(newRole)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  try {
    const result = await sql`
      UPDATE users
      SET role = ${newRole}
      WHERE userid = ${userId};
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User role updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Database error", details: (error as Error).message },
      { status: 500 },
    );
  }
}
