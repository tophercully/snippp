import React from "react";
import { Metadata } from "next";
import { neon } from "@neondatabase/serverless";
import SnippetPageContent from "@/app/src/pages/SnippetContent";

type Props = {
  params: Promise<{ id: string }>;
};

const sql = neon(process.env.SNIPPET_URL as string);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const snippetId = Number(id);

  try {
    const result = await sql`
      SELECT 
        s.name, 
        u.name AS author, 
        s.description, 
        s.tags
      FROM snippets s
      JOIN users u ON s.authorID = u.userID
      WHERE s.snippetID = ${snippetId};
    `;

    if (result.length === 0) {
      throw new Error(`Snippet with ID ${snippetId} not found`);
    }

    const snippet = result[0];
    const imageUrl = `/snippp1x1.svg`;
    const truncatedDescription = `${snippet.description.slice(0, 120)}${snippet.description.length > 120 ? "..." : ""}`;
    const fallbackDescription = `${snippet.author} shared a code snippet on Snippp - the code toolkit organizer for developers`;

    return {
      metadataBase: new URL("https://snippp.io"),
      title: `${snippet.name || "Untitled Snippet"} - ${snippet.author} | Snippp`,
      description: truncatedDescription || fallbackDescription,
      openGraph: {
        title: `${snippet.name || "Untitled Snippet"} | Snippp`,
        description: truncatedDescription || fallbackDescription,
        url: `https://snippp.io/snippet/${snippetId}`,
        type: "article",
        siteName: "Snippp",
        images: [
          {
            url: imageUrl,
            alt: snippet.name || "Snippet Image",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${snippet.name || "Untitled Snippet"} - ${snippet.author} | Snippp`,
        description: truncatedDescription || fallbackDescription,
        images: [imageUrl],
      },
      keywords: ["code snippet", "programming", ...(snippet.tags || [])],
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
        },
      },
      creator: snippet.author || "Anonymous",
      authors: [{ name: snippet.author || "Anonymous" }],
      referrer: "no-referrer",
      alternates: {
        canonical: `https://snippp.io/snippet/${snippetId}`,
      },
    };
  } catch (error) {
    console.error("Metadata generation error:", error);
    return {
      title: "Snippet Not Found | Snippp",
      description: "Snippet could not be found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

const SnippetPage: React.FC = () => {
  return <SnippetPageContent />;
};

export default SnippetPage;
