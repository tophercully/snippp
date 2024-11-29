import React from "react";
import api from "@/app/src/backend/api";
import { Metadata } from "next";
import SnippetPageContent from "@/app/src/pages/SnippetContent";
import { Snippet } from "@/app/src/types/typeInterfaces";
import getBaseURL from "@/app/src/utils/getBaseURL";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const snippetId = Number(id);
  console.log("id", snippetId);

  try {
    const snippet: Snippet = await api.snippets.loadById(snippetId);
    console.log("snippet", snippet);

    return {
      metadataBase: new URL(getBaseURL()),
      title: `${snippet.name || "Untitled Snippet"} | Snippp`,
      description: snippet.description || "A code snippet shared on Snippp",
      openGraph: {
        title: `${snippet.name || "Untitled Snippet"} | Snippp`,
        description: snippet.description || "A code snippet shared on Snippp",
        url: `https://snippp.io/snippet/${snippetId}`,
        type: "website",
        siteName: "Snippp",
      },
      twitter: {
        card: "summary_large_image",
        title: `${snippet.name || "Untitled Snippet"} | Snippp`,
        description: snippet.description || "A code snippet shared on Snippp",
      },
      keywords: ["code snippet", "programming", ...(snippet.tags || [])],
      robots: {
        index: snippet.public !== false,
        follow: snippet.public !== false,
        googleBot: {
          index: snippet.public !== false,
          follow: snippet.public !== false,
        },
      },
      creator: snippet.author || "Anonymous",
      authors: [{ name: snippet.author || "Anonymous" }],
      referrer: "no-referrer",
      alternates: {
        canonical: `https://snippp.io/snippet/${snippetId}`,
      },
    };
  } catch {
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
