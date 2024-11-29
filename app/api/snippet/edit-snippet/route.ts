import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.SNIPPET_URL as string);

interface UpdateParams {
  name: string;
  code: string;
  description: string;
  tags: string;
  public: boolean;
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const snippetIDToUpdate = parseInt(searchParams.get("snippetID") || "");
  const newParams: UpdateParams = await request.json();

  if (!snippetIDToUpdate || !newParams) {
    return NextResponse.json({ error: "snippetID and update parameters are required" }, { status: 400 });
  }

  try {
    await sql`
      UPDATE Snippets
      SET 
        Name = ${newParams.name},
        Code = ${newParams.code},
        Description = ${newParams.description},
        Tags = ${newParams.tags},
        Public = ${newParams.public},
        lastEdit = CURRENT_TIMESTAMP
      WHERE SnippetID = ${snippetIDToUpdate};
    `;

    console.log(`Snippet with SnippetID ${snippetIDToUpdate} updated`);
    return NextResponse.json({ message: "Snippet updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating snippet:", error);
    return NextResponse.json({ error: "Internal Server Error", details: (error as Error).message }, { status: 500 });
  }
}