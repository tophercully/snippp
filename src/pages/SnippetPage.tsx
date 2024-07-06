import React, { useEffect, useState, useCallback } from "react";
import { Display } from "../components/Display";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { loadSnippetById } from "../backend/loader/loadSnippetByID";
import { GoogleUser, Snippet } from "../typeInterfaces";
import { useSearchParams } from "react-router-dom";
import { useLocalStorage } from "@uidotdev/usehooks";

type SnippetMod = {
  favoriteStatus?: boolean;
  favoriteCount?: number;
  copyCount?: number;
  isDeleted?: boolean;
};

type SnippetMods = { [snippetID: number]: SnippetMod };

export const SnippetPage: React.FC = () => {
  const [userProfile] = useLocalStorage<GoogleUser | null>("userProfile", null);
  const [searchParams] = useSearchParams();
  const [selection, setSelection] = useState<Snippet | null>(null);
  const [snippetMods, setSnippetMods] = useState<SnippetMods>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const id = searchParams.get("snippetid");

  const isAuthor = selection?.authorID == userProfile?.id;
  let isVisible = true;
  if (!selection?.public) {
    if (userProfile) {
      isVisible = isAuthor;
    } else {
      isVisible = false;
    }
  }

  console.log(isVisible);
  console.log(isAuthor);

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
          const snippet = await loadSnippetById(Number(id));
          setSelection(snippet as Snippet);
          setSnippetMods({
            [snippet.snippetID]: {
              favoriteStatus: snippet.isFavorite,
              favoriteCount: snippet.favoriteCount,
              copyCount: 0,
            },
          });
        } catch (err) {
          setError("Snippet not found");
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

  console.log(selection);

  return (
    <div className="flex h-screen w-screen flex-col bg-base-100 p-2 pt-24 lg:p-10 lg:pt-24 dark:bg-base-900">
      <Navbar />
      <div className="relative flex-grow">
        {(isLoading || isTransitioning) && (
          <div className="absolute inset-0 flex items-center justify-center bg-base-100 dark:bg-base-900">
            <p className="text-xl text-base-950 dark:text-base-50">
              Loading...
            </p>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-base-100 dark:bg-base-900">
            <p className="mb-4 text-xl text-red-500">{error}</p>
            <a
              href="/"
              className="text-semibold bg-base-950 p-2 text-sm text-base-50 underline decoration-dashed underline-offset-4 dark:bg-base-50 dark:text-base-950"
            >
              Return to Home
            </a>
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
              <img src="lock.svg" />
            </h1>
            <a
              href="/"
              className="text-semibold bg-base-950 p-2 text-sm text-base-50 underline decoration-dashed underline-offset-4 dark:bg-base-50 dark:text-base-950"
            >
              Return to Home
            </a>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};
