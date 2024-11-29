import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.SNIPPET_URL as string);

export async function POST(request: Request) {
  const { snippetID } = await request.json();

  if (!snippetID) {
    return NextResponse.json({ error: "Missing snippetID" }, { status: 400 });
  }

  try {
    await sql`
      UPDATE snippets
      SET copyCount = copyCount + 1,
          lastCopied = CURRENT_TIMESTAMP
      WHERE snippetID = ${snippetID};
    `;
    console.log(`Copy count incremented for snippet ${snippetID}`);
    return NextResponse.json({ message: `Copy count incremented for snippet ${snippetID}` }, { status: 200 });
  } catch (error) {
    console.error("Error incrementing copy count:", error);
    return NextResponse.json({ error: "Internal Server Error", details: (error as Error).message }, { status: 500 });
  }
}