import React from "react";
import { neon } from "@neondatabase/serverless";
import BrowserContent from "@/app/src/pages/BrowserContent";
import Link from "next/link";
export const runtime = "edge";

const sql = neon(process.env.SNIPPET_URL as string);

async function getAllSnippets() {
  try {
    const result = await sql`
      WITH FavoriteCounts AS (
          SELECT snippetID, COUNT(*) AS favoriteCount
          FROM favorites
          GROUP BY snippetID
      ),
      ForkCounts AS (
          SELECT forkedFrom, COUNT(*) AS forkCount
          FROM snippets
          WHERE forkedFrom IS NOT NULL
          GROUP BY forkedFrom
      )
      SELECT 
          s.snippetID, 
          s.name, 
          s.code, 
          s.tags, 
          u.name AS author, 
          s.authorID,
          s.public,
          s.createdAt,
          s.lastCopied,
          s.lastEdit,
          s.copyCount,
          s.description,
          s.forkedFrom,
          fs.name AS forkedFromName,
          COALESCE(fc.favoriteCount, 0) AS favoriteCount,
          COALESCE(forkc.forkCount, 0) AS forkCount
      FROM snippets s
      JOIN users u ON s.authorID = u.userID
      LEFT JOIN snippets fs ON s.forkedFrom = fs.snippetID
      LEFT JOIN FavoriteCounts fc ON s.snippetID = fc.snippetID
      LEFT JOIN ForkCounts forkc ON s.snippetID = forkc.forkedFrom
      WHERE s.public = true;
    `;

    const snippets = result.map((row) => ({
      snippetID: row.snippetid,
      name: row.name,
      code: row.code,
      tags: row.tags,
      author: row.author,
      authorID: row.authorid,
      public: row.public,
      createdAt: row.createdat,
      lastCopied: row.lastcopied,
      lastEdit: row.lastedit,
      copyCount: row.copycount,
      favoriteCount: row.favoritecount,
      description: row.description,
      forkedFrom: row.forkedfrom,
      forkedFromName: row.forkedfromname,
      forkCount: row.forkcount,
    }));

    return snippets;
  } catch (error) {
    console.error("Error fetching snippets:", error);
    return [];
  }
}

const snippets = await getAllSnippets();
console.log("Snippets:", snippets);

const BrowserPage: React.FC = () => {
  return (
    <>
      <BrowserContent />
      {snippets.map((snippet) => (
        <Link
          className="sr-only"
          key={snippet.snippetID}
          href={`/snippet/${snippet.snippetID}`}
        >
          {`${snippet.name} - ${snippet.author}`}
        </Link>
      ))}
    </>
  );
};

export default BrowserPage;
