import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";
export const runtime = "edge";

const sql = neon(process.env.SNIPPET_URL as string);

interface CreateListParams {
  userID: string;
  listName: string;
  description?: string;
}

export async function POST(request: Request) {
  const { userID, listName, description }: CreateListParams =
    await request.json();

  if (!userID || !listName) {
    return NextResponse.json(
      { error: "userID and listName are required" },
      { status: 400 },
    );
  }

  try {
    const rows = await sql`
      INSERT INTO snippet_lists (userID, listName, description)
      VALUES (${userID}, ${listName}, ${description})
      RETURNING listid;
    `;

    const newList = rows[0];
    return NextResponse.json(newList, { status: 201 });
  } catch (error) {
    console.error("Error creating list:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: (error as Error).message },
      { status: 500 },
    );
  }
}
