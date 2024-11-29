import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.SNIPPET_URL as string);

interface ListPickParams {
  listID: string;
}

export async function PUT(request: Request) {
  const { listID }: ListPickParams = await request.json();

  if (!listID) {
    return NextResponse.json({ error: "listID is required" }, { status: 400 });
  }

  try {
    const added = await addListPick(listID);
    return NextResponse.json({
      message: added ? `List ${listID} added to Staff Picks` : `List ${listID} already in Staff Picks`,
    }, { status: added ? 201 : 200 });
  } catch (error) {
    console.error("Error managing staff picks:", error);
    return NextResponse.json({ error: "Internal Server Error", details: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { listID }: ListPickParams = await request.json();

  if (!listID) {
    return NextResponse.json({ error: "listID is required" }, { status: 400 });
  }

  try {
    await removeListPick(listID);
    return NextResponse.json({ message: `List ${listID} removed from Staff Picks` }, { status: 200 });
  } catch (error) {
    console.error("Error managing staff picks:", error);
    return NextResponse.json({ error: "Internal Server Error", details: (error as Error).message }, { status: 500 });
  }
}

async function addListPick(listID: string): Promise<boolean> {
  // First, check if the entry already exists
  const checkResult = await sql`
    SELECT id FROM staff_picks
    WHERE id = ${listID} AND type = 'list'
  `;

  // If the entry doesn't exist, insert it
  if (checkResult.length === 0) {
    await sql`
      INSERT INTO staff_picks (id, type)
      VALUES (${listID}, 'list')
    `;
    return true; // Indicates that a new entry was added
  }

  return false; // Indicates that the entry already existed
}

async function removeListPick(listID: string): Promise<void> {
  await sql`
    DELETE FROM staff_picks
    WHERE id = ${listID} AND type = 'list'
  `;
}