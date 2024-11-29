import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.SNIPPET_URL as string);

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const listID = parseInt(searchParams.get("listID") || "");

  if (!listID) {
    return NextResponse.json({ error: "listID is required" }, { status: 400 });
  }

  try {
    await sql`
      DELETE FROM snippet_lists
      WHERE listID = ${listID};
    `;

    return NextResponse.json({ message: `List with ID ${listID} has been deleted` }, { status: 200 });
  } catch (error) {
    console.error("Error deleting list:", error);
    return NextResponse.json({ error: "Internal Server Error", details: (error as Error).message }, { status: 500 });
  }
}