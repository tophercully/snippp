import React from "react";
import api from "@/app/src/backend/api";
import { Metadata, ResolvingMetadata } from "next";
import SnippetPageContent from "@/app/src/pages/SnippetContent";
import { Snippet } from "@/app/src/types/typeInterfaces";

type Props = {
  params: { id: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const id = Number(params.id);
  console.log("id", id);

  try {
    const snippet: Snippet = await api.snippets.loadById(id);
    console.log("snippet", snippet);

    return {
      metadataBase: new URL("https://snippp.io"), // Replace with actual base URL
      title: `${snippet.name || "Untitled Snippet"} | Snippp`,
      description: snippet.description || "A code snippet shared on Snippp",

      // Open Graph Metadata
      openGraph: {
        title: `${snippet.name || "Untitled Snippet"} | Snippp`,
        description: snippet.description || "A code snippet shared on Snippp",
        url: `https://snippp.io/snippet/${id}`, // Dynamic snippet URL
        type: "website",
        siteName: "Snippp",
      },

      // Twitter Card Metadata
      twitter: {
        card: "summary_large_image",
        title: `${snippet.name || "Untitled Snippet"} | Snippp`,
        description: snippet.description || "A code snippet shared on Snippp",
      },

      // Keywords
      keywords: ["code snippet", "programming", ...(snippet.tags || [])],

      // Robots instructions
      robots: {
        index: snippet.public !== false, // Only index public snippets
        follow: snippet.public !== false,
        googleBot: {
          index: snippet.public !== false,
          follow: snippet.public !== false,
        },
      },

      // Additional metadata
      creator: snippet.author || "Anonymous",
      authors: [{ name: snippet.author || "Anonymous" }],
      referrer: "no-referrer",

      // Alternate languages if applicable
      alternates: {
        canonical: `https://snippp.io/snippet/${id}`,
      },
    };
  } catch (error) {
    return {
      title: "Snippet Not Found | Snippp",
      description: "The requested code snippet could not be found",
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
