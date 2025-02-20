import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";
export const runtime = "edge";

const sql = neon(process.env.SNIPPET_URL as string);

export async function GET() {
  try {
    const rows = await sql`SELECT * FROM users;`;
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
    return NextResponse.json(typedRows, { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
