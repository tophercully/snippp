import React, { useState, useEffect, useCallback } from "react";
import { SearchBar } from "../components/SearchBar";
import { GoogleUser, Snippet } from "../typeInterfaces";
import { Navbar } from "../components/Navbar";
import { SelectionsList } from "../components/SelectionsList";
import { Footer } from "../components/Footer";
import { Display } from "../components/Display";
import { useLocalStorage } from "@uidotdev/usehooks";
import { loadFavorites } from "../backend/loadFavorites";
import { loadUserSnippets } from "../backend/loadUserSnippets";

type SortOrder = "asc" | "desc";
type FavoriteMod = { [snippetID: number]: number };

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

export const MySnippets: React.FC = () => {
  const [userProfile] = useLocalStorage<GoogleUser | null>("userProfile", null);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [favoriteMods, setFavoriteMods] = useState<FavoriteMod>({});
  const [filteredAndSortedSnippets, setFilteredAndSortedSnippets] = useState<
    Snippet[]
  >([]);
  const [page, setPage] = useState<string>("mysnippets");
  const [selection, setSelection] = useState<Snippet | null>(null);
  const [query, setQuery] = useState<string>("");
  const [sortMethod, setSortMethod] = useState<keyof Snippet>("snippetID");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

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

  const fetchSnippets = useCallback(async () => {
    if (userProfile && userProfile.id) {
      const result =
        page === "mysnippets" ?
          await loadUserSnippets({ userID: userProfile.id })
        : await loadFavorites({ userID: userProfile.id });

      if (Array.isArray(result)) {
        const snippetsArray = result as Snippet[];
        if (
          snippetsArray.length !== snippets.length ||
          !snippetsArray.every(
            (val, index) => val.snippetID === snippets[index]?.snippetID,
          )
        ) {
          setSnippets(snippetsArray);
          setFavoriteMods({}); // Reset favorite mods when snippets change
        }
      } else {
        console.error(
          "Unexpected result type from loadUserSnippets or loadFavorites",
        );
        setSnippets([]);
      }
    }
  }, [page, userProfile, snippets]);

  useEffect(() => {
    fetchSnippets();
  }, [fetchSnippets]);

  useEffect(() => {
    const filterAndSortSnippets = () => {
      let filteredSnippets = snippets;

      if (query) {
        filteredSnippets = snippets.filter(
          (a) =>
            a.tags.includes(query) ||
            a.name.includes(query) ||
            a.author.includes(query),
        );
      }

      const sortedSnippets = sortByProperty(
        filteredSnippets,
        sortMethod,
        sortOrder,
      );

      setFilteredAndSortedSnippets(sortedSnippets);

      // Preserve selection if possible, otherwise select the first snippet
      if (selection) {
        const newSelectionIndex = sortedSnippets.findIndex(
          (s) => s.snippetID === selection.snippetID,
        );
        if (newSelectionIndex !== -1) {
          setSelection(sortedSnippets[newSelectionIndex]);
        } else {
          setSelection(sortedSnippets[0] || null);
        }
      } else {
        setSelection(sortedSnippets[0] || null);
      }
    };

    filterAndSortSnippets();
  }, [snippets, query, sortMethod, sortOrder, selection]);

  // Effect to update selection when favoriteMods changes
  useEffect(() => {
    if (selection) {
      const updatedSelection = snippets.find(
        (s) => s.snippetID === selection.snippetID,
      );
      if (updatedSelection) {
        setSelection(updatedSelection);
      }
    }
  }, [favoriteMods, snippets, selection]);

  return (
    <div className="over flex h-screen w-full flex-col bg-base-100 p-10 pt-24 dark:bg-base-900">
      <Navbar />
      <div className="flex h-[96%] w-full shadow-lg">
        {snippets.length > 0 ?
          <div className="flex h-full w-1/3 flex-col">
            <div className="flex w-full">
              <button
                onClick={() => setPage("mysnippets")}
                className={`bg-base-50 text-lg text-base-950 duration-300 dark:bg-base-950 dark:text-base-50 ${page === "mysnippets" ? "flex-[1.5] invert" : "flex-1"}`}
              >
                MY SNIPPPETS
              </button>
              <button
                onClick={() => setPage("myfavorites")}
                className={`bg-base-50 text-lg text-base-950 duration-300 dark:bg-base-950 dark:text-base-50 ${page === "myfavorites" ? "flex-[1.5] invert" : "flex-1"}`}
              >
                FAVORITES
              </button>
            </div>
            <SearchBar
              query={query}
              setQuery={setQuery}
              placeHolder={
                page === "mysnippets" ? "search creations" : "search favorites"
              }
              setSortMethod={setSortMethod}
              sortMethod={sortMethod}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
            <div className="h-full w-full overflow-hidden">
              <SelectionsList
                snippets={filteredAndSortedSnippets}
                favoriteMods={favoriteMods}
                selection={selection}
                setSelection={setSelection}
              />
            </div>
          </div>
        : <div className="flex h-full w-1/3 flex-col items-center gap-5">
            <div className="flex w-full">
              <button
                onClick={() => setPage("mysnippets")}
                className={`bg-base-50 text-lg text-base-950 duration-300 dark:bg-base-950 dark:text-base-50 ${page === "mysnippets" ? "flex-[1.5] invert" : "flex-1"}`}
              >
                MY SNIPPPETS
              </button>
              <button
                onClick={() => setPage("myfavorites")}
                className={`bg-base-50 text-lg text-base-950 duration-300 dark:bg-base-950 dark:text-base-50 ${page === "myfavorites" ? "flex-[1.5] invert" : "flex-1"}`}
              >
                FAVORITES
              </button>
            </div>
            <h1 className="mt-4 p-2 text-base-950 dark:text-base-50">
              NO SNIPPPETS TO DISPLAY
            </h1>
            <a
              href={page === "mysnippets" ? "/builder" : "/browse"}
              className="text-semibold bg-base-950 p-2 text-sm text-base-50 underline decoration-dashed underline-offset-4 dark:bg-base-50 dark:text-base-950"
            >
              {page === "mysnippets" ? "CREATE SNIPPPET" : "DISCOVER SNIPPPETS"}
            </a>
          </div>
        }
        {selection && (
          <div className="h-full w-2/3 overflow-y-auto">
            <Display
              selection={selection}
              updateFavorites={updateFavorites}
              favoriteMods={favoriteMods}
            />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};