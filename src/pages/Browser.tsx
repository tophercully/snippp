import React, { useState, useEffect, useCallback, useMemo } from "react";
import { loadAllSnippets } from "../backend/loadAllSnippets";
import { SearchBar } from "../components/SearchBar";
import { Snippet } from "../typeInterfaces";
import { Navbar } from "../components/Navbar";
import { SelectionsList } from "../components/SelectionsList";
import { Footer } from "../components/Footer";
import { Display } from "../components/Display";
import categories from "../utils/categories";

type SortOrder = "asc" | "desc";
type SortableSnippetKeys = keyof Snippet;

function sortByProperty<T>(
  array: T[],
  property: keyof T,
  order: SortOrder = "asc",
): T[] {
  if (property === "name") {
    return array.slice().sort((a, b) => {
      if (a[property] < b[property]) {
        return order === "desc" ? -1 : 1;
      } else if (a[property] > b[property]) {
        return order === "desc" ? 1 : -1;
      } else {
        return 0;
      }
    });
  } else {
    return array.slice().sort((a, b) => {
      if (a[property] < b[property]) {
        return order === "asc" ? -1 : 1;
      } else if (a[property] > b[property]) {
        return order === "asc" ? 1 : -1;
      } else {
        return 0;
      }
    });
  }
}

type FavoriteMod = { [snippetID: number]: number };

export const Browser: React.FC = () => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [favoriteMods, setFavoriteMods] = useState<FavoriteMod>({});
  const [selection, setSelection] = useState<Snippet | null>(null);
  const [query, setQuery] = useState<string>("");
  const [category, setCategory] = useState<string | null>(null);
  const [sortMethod, setSortMethod] = useState<SortableSnippetKeys>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const fetchSnippets = useCallback(async () => {
    setIsLoading(true);
    setIsTransitioning(true);
    const userProfile = JSON.parse(
      localStorage.getItem("userProfile") || "null",
    );
    const userID = userProfile ? userProfile.id : undefined;
    const snippetsArray = await loadAllSnippets(userID);
    setSnippets(snippetsArray);
    setFavoriteMods({});
    setIsLoading(false);
    setTimeout(() => setIsTransitioning(false), 300);
  }, []);

  useEffect(() => {
    fetchSnippets();
  }, [fetchSnippets]);

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
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get("category");
    setCategory(categoryParam);
  }, []);

  const filteredAndSortedSnippets = useMemo(() => {
    let filteredSnippets = snippets;

    if (category && categories[category]) {
      const categoryTags = categories[category].tags;
      filteredSnippets = filteredSnippets.filter((snippet) =>
        categoryTags.some((catTag) =>
          snippet.tags
            .toLowerCase()
            .split(",")
            .map((tag) => tag.trim())
            .includes(catTag),
        ),
      );
    }

    if (query) {
      filteredSnippets = filteredSnippets.filter(
        (a) =>
          a.tags.toLowerCase().includes(query.toLowerCase()) ||
          a.name.toLowerCase().includes(query.toLowerCase()) ||
          a.author.toLowerCase().includes(query.toLowerCase()),
      );
    }

    return sortByProperty(filteredSnippets, sortMethod, sortOrder);
  }, [snippets, query, sortMethod, sortOrder, category]);

  //   useEffect(() => {
  //     setSelection(filteredAndSortedSnippets[0] || null);
  //   }, [filteredAndSortedSnippets]);

  const isReady =
    !isLoading && filteredAndSortedSnippets.length > 0 && selection;

  return (
    <div className="over flex h-screen w-full flex-col bg-base-100 p-10 pt-24 dark:bg-base-900">
      <Navbar />
      <div className="flex h-[96%] w-full shadow-lg">
        <div className="flex h-full w-1/3 flex-col">
          <SearchBar
            query={query}
            setQuery={setQuery}
            placeHolder={
              category ?
                `search ${categories[category].name.toLowerCase()} snipppets`
              : "search all"
            }
            setSortMethod={setSortMethod}
            sortMethod={sortMethod}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />
          <div className="relative h-full w-full overflow-hidden">
            <div
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                isLoading || isTransitioning ? "opacity-100" : (
                  "pointer-events-none opacity-0"
                )
              }`}
            >
              <p className="text-xl text-base-950 dark:text-base-50">
                Loading...
              </p>
            </div>
            <div
              className={`h-full w-full transition-opacity duration-300 ${
                isLoading || isTransitioning ?
                  "pointer-events-none opacity-0"
                : "opacity-100"
              }`}
            >
              {filteredAndSortedSnippets.length > 0 ?
                <SelectionsList
                  snippets={filteredAndSortedSnippets}
                  favoriteMods={favoriteMods}
                  selection={selection}
                  setSelection={setSelection}
                />
              : <div className="flex h-full flex-col items-center gap-5">
                  <h1 className="mt-4 p-2 text-base-950 dark:text-base-50">
                    NO SNIPPPETS TO DISPLAY
                  </h1>
                  <a
                    href={"/builder"}
                    className="text-semibold bg-base-950 p-2 text-sm text-base-50 underline decoration-dashed underline-offset-4 dark:bg-base-50 dark:text-base-950"
                  >
                    CREATE SNIPPPET
                  </a>
                </div>
              }
            </div>
          </div>
        </div>
        <div
          className={`h-full w-2/3 overflow-y-auto transition-opacity duration-300 ${
            isReady ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          {isReady && (
            <Display
              selection={selection}
              updateFavorites={updateFavorites}
              favoriteMods={favoriteMods}
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};
