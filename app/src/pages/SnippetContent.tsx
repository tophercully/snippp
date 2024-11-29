"use client";
import { useLocalStorage } from "@uidotdev/usehooks";
import React, { useEffect, useState, useCallback } from "react";
import { GoogleUser, Snippet } from "../../src/types/typeInterfaces";
import { useParams } from "next/navigation";
import api from "@/app/src/backend/api";
import { Navbar } from "@/app/src/components/nav/Navbar";
import { LoadingSpinner } from "@/app/src/components/universal/LoadingSpinner";
import { Display } from "@/app/src/components/browser/Display";
import { Footer } from "@/app/src/components/nav/Footer";
import Link from "next/link";
import { Metadata, ResolvingMetadata } from "next";

type SnippetMod = {
  favoriteStatus?: boolean;
  favoriteCount?: number;
  copyCount?: number;
  isDeleted?: boolean;
};

type SnippetMods = { [snippetID: number]: SnippetMod };

// type Props = {
//   params: { id: string };
// };

// export async function generateMetadata(
//   { params }: Props,
//   parent: ResolvingMetadata,
// ): Promise<Metadata> {
//   const id = Number(params.id);

//   try {
//     const snippet: Snippet = await api.snippets.loadById(id);

//     return {
//       metadataBase: new URL("https://yourwebsite.com"), // Replace with actual base URL
//       title: `${snippet.name || "Untitled Snippet"} | CodeSnippet`,
//       description:
//         snippet.description || "A code snippet shared on CodeSnippet",

//       // Open Graph Metadata
//       openGraph: {
//         title: `${snippet.name || "Untitled Snippet"} | CodeSnippet`,
//         description:
//           snippet.description || "A code snippet shared on CodeSnippet",
//         url: `https://yourwebsite.com/snippet/${id}`, // Dynamic snippet URL
//         type: "website",
//         siteName: "CodeSnippet",
//       },

//       // Twitter Card Metadata
//       twitter: {
//         card: "summary_large_image",
//         title: `${snippet.name || "Untitled Snippet"} | CodeSnippet`,
//         description:
//           snippet.description || "A code snippet shared on CodeSnippet",
//       },

//       // Keywords
//       keywords: [
//         "code snippet",
//         "programming",
//         snippet.tags || "",
//         ...(snippet.tags || []),
//       ],

//       // Robots instructions
//       robots: {
//         index: snippet.public !== false, // Only index public snippets
//         follow: snippet.public !== false,
//         googleBot: {
//           index: snippet.public !== false,
//           follow: snippet.public !== false,
//         },
//       },

//       // Additional metadata
//       creator: snippet.author || "Anonymous",
//       authors: [{ name: snippet.author || "Anonymous" }],
//       referrer: "no-referrer",

//       // Alternate languages if applicable
//       alternates: {
//         canonical: `https://yourwebsite.com/snippet/${id}`,
//       },
//     };
//   } catch (error) {
//     return {
//       title: "Snippet Not Found | CodeSnippet",
//       description: "The requested code snippet could not be found",
//       robots: {
//         index: false,
//         follow: false,
//       },
//     };
//   }
// }

const SnippetPageContent: React.FC = () => {
  const [userProfile] = useLocalStorage<GoogleUser | null>("userProfile", null);
  const [selection, setSelection] = useState<Snippet | null>(null);
  const [snippetMods, setSnippetMods] = useState<SnippetMods>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();

  const isAuthor = selection?.authorID == userProfile?.id;
  let isVisible = true;
  if (!selection?.public) {
    if (userProfile) {
      isVisible = isAuthor;
    } else {
      isVisible = false;
    }
  }

  const updateSnippetMod = useCallback(
    (id: number, mod: Partial<SnippetMod>) => {
      setSnippetMods((prevMods) => ({
        ...prevMods,
        [id]: { ...prevMods[id], ...mod },
      }));
    },
    [],
  );

  useEffect(() => {
    const fetchSelection = async () => {
      if (id) {
        setIsLoading(true);
        setIsTransitioning(true);
        setError(null);
        try {
          const snippet = await api.snippets.loadById(Number(id));
          setSelection(snippet as Snippet);
          setSnippetMods({
            [snippet.snippetID]: {
              favoriteStatus: snippet.isFavorite,
              favoriteCount: snippet.favoriteCount,
              copyCount: 0,
            },
          });
        } catch (err) {
          setError(`Snippet not found: ${err}`);
          setSelection(null);
        } finally {
          setIsLoading(false);
          setTimeout(() => setIsTransitioning(false), 300);
        }
      } else {
        setError("No snippet ID provided");
        setIsLoading(false);
        setIsTransitioning(false);
      }
    };
    fetchSelection();
  }, [id]);

  return (
    <div className="flex h-screen w-screen flex-col bg-base-100 p-2 pt-24 lg:p-10 lg:pt-24 dark:bg-base-900">
      <Navbar />
      <div className="relative flex-grow">
        {(isLoading || isTransitioning) && (
          <div className="absolute inset-0 flex items-center justify-center bg-base-100 dark:bg-base-900">
            <LoadingSpinner />
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-base-100 dark:bg-base-900">
            <p className="mb-4 text-xl text-red-500">{error}</p>
            <Link
              href="/"
              className="text-semibold bg-base-950 p-2 text-sm text-base-50 underline decoration-dashed underline-offset-4 dark:bg-base-50 dark:text-base-950"
            >
              Return to Home
            </Link>
          </div>
        )}
        {selection && isVisible && !isLoading && !isTransitioning && !error && (
          <Display
            selection={selection}
            updateSnippetMod={updateSnippetMod}
            snippetMods={snippetMods}
          />
        )}
        {!isVisible && (
          <div className="flex h-full w-full flex-col items-center justify-center gap-4">
            <h1 className="flex gap-4 bg-red-600 p-4 text-base-50">
              SNIPPET NOT AVAILABLE
              <img src="/lock.svg" />
            </h1>
            <Link
              href="/"
              className="text-semibold bg-base-950 p-2 text-sm text-base-50 underline decoration-dashed underline-offset-4 dark:bg-base-50 dark:text-base-950"
            >
              Return to Home
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SnippetPageContent;
