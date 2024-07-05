import React, { useEffect, useState, useCallback } from "react";
import { Display } from "../components/Display";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { loadSnippetById } from "../backend/loadSnippetByID";
import { Snippet } from "../typeInterfaces";
import { useSearchParams } from "react-router-dom";

type FavoriteMod = { [snippetID: number]: number };

export const SnippetPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [selection, setSelection] = useState<Snippet | null>(null);
  const [favoriteMods, setFavoriteMods] = useState<FavoriteMod>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const id = searchParams.get("snippetid");

  const updateFavorites = useCallback((id: number, isFavorite: boolean) => {
    setFavoriteMods((prevMods) => {
      const newMods = { ...prevMods };
      if (prevMods[id] === -1 && isFavorite) {
        delete newMods[id];
      } else if (prevMods[id] === 1 && !isFavorite) {
        delete newMods[id];
      } else {
        newMods[id] = isFavorite ? 1 : -1;
      }
      return newMods;
    });
  }, []);

  useEffect(() => {
    const fetchSelection = async () => {
      if (id) {
        setIsLoading(true);
        setIsTransitioning(true);
        setError(null);
        try {
          const snippet = await loadSnippetById(Number(id));
          setSelection(snippet as Snippet);
          setFavoriteMods({ [snippet.snippetID]: snippet.isFavorite ? 1 : 0 });
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
        {selection && !isLoading && !isTransitioning && !error && (
          <Display
            selection={selection}
            favoriteMods={favoriteMods}
            updateFavorites={updateFavorites}
          />
        )}
      </div>
      <Footer />
    </div>
  );
};
