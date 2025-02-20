import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";
export const runtime = "edge";

const sql = neon(process.env.SNIPPET_URL as string);

export async function PUT(request: Request) {
  const { listID, listName, description } = await request.json();

  if (!listID || !listName) {
    return NextResponse.json(
      { error: "listID and listName are required" },
      { status: 400 },
    );
  }

  try {
    await sql`
      UPDATE snippet_lists
      SET listName = ${listName}, description = ${description}, lastUpdated = NOW()
      WHERE listID = ${listID};
    `;

    return NextResponse.json(
      { message: `List with ID ${listID} has been updated` },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating list:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: (error as Error).message },
      { status: 500 },
    );
  }
}
