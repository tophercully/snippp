import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { SearchBar } from "../components/SearchBar";
import { GoogleUser, Snippet } from "../typeInterfaces";
import { Navbar } from "../components/Navbar";
import { ListSnippets } from "../components/ListSnippets";
import { Footer } from "../components/Footer";
import { Display } from "../components/Display";
import { useLocalStorage } from "@uidotdev/usehooks";
import { getListSnippets, getList } from "../backend/list/listFunctions";
import { useNotif } from "../hooks/Notif";

type SortOrder = "asc" | "desc";

type SnippetMod = {
  favoriteStatus?: boolean;
  favoriteCount?: number;
  copyCount?: number;
  isDeleted?: boolean;
};

type SnippetMods = { [snippetID: number]: SnippetMod };

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

export const ListPage: React.FC = () => {
  const { listId } = useParams<{ listId: string }>();

  const [userProfile] = useLocalStorage<GoogleUser | null>("userProfile", null);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [snippetMods, setSnippetMods] = useState<SnippetMods>({});
  const [filteredAndSortedSnippets, setFilteredAndSortedSnippets] = useState<
    Snippet[]
  >([]);
  const [listData, setListData] = useState<any>(null);
  const [selection, setSelection] = useState<Snippet | null>(null);
  const [query, setQuery] = useState<string>("");
  const [sortMethod, setSortMethod] = useState<keyof Snippet>("snippetID");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { showNotif } = useNotif();

  const updateSnippetMod = useCallback(
    (id: number, mod: Partial<SnippetMod>) => {
      setSnippetMods((prevMods) => ({
        ...prevMods,
        [id]: { ...prevMods[id], ...mod },
      }));
    },
    [],
  );

  const fetchListAndSnippets = useCallback(async () => {
    console.log(`fetching list from id ${listId}`);
    if (listId && userProfile?.id) {
      setIsLoading(true);
      try {
        const [listResult, snippetsResult] = await Promise.all([
          getList(userProfile.id, listId),
          getListSnippets(userProfile.id, Number(listId)),
        ]);
        setListData(listResult);
        setSnippets(snippetsResult);
        setSnippetMods({});
      } catch (error) {
        console.error("Error fetching list and snippets:", error);
        showNotif("Error fetching list and snippets: " + error, "error");
      } finally {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchListAndSnippets();
  }, [fetchListAndSnippets]);

  useEffect(() => {
    const filterAndSortSnippets = () => {
      let filteredSnippets = snippets.filter(
        (snippet) => !snippetMods[snippet.snippetID]?.isDeleted,
      );

      if (query) {
        filteredSnippets = filteredSnippets.filter(
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
  }, [snippets, snippetMods, query, sortMethod, sortOrder, selection]);

  return (
    <div className="over flex h-screen w-full flex-col bg-base-100 p-2 pt-24 lg:p-10 lg:pt-24 dark:bg-base-900">
      <Navbar />
      {!isLoading && listData && (
        <div className="flex h-[96%] w-full shadow-lg">
          <div className="flex h-full w-full flex-col lg:w-1/3">
            <div className="rounded-sm bg-base-150 p-4 text-base-950 dark:bg-base-800 dark:text-base-50">
              <h1 className="text-2xl font-bold">{listData?.listname}</h1>
              {listData?.description && (
                <p className="mt-4 font-thin">{listData.description}</p>
              )}
            </div>
            {snippets.length > 0 ?
              <>
                <SearchBar
                  query={query}
                  setQuery={setQuery}
                  placeHolder="search snippets"
                  setSortMethod={setSortMethod}
                  sortMethod={sortMethod}
                  sortOrder={sortOrder}
                  setSortOrder={setSortOrder}
                />
                <div className="h-full w-full overflow-hidden">
                  <ListSnippets
                    snippets={filteredAndSortedSnippets}
                    snippetMods={snippetMods}
                    selection={selection}
                    setSelection={setSelection}
                  />
                </div>
              </>
            : <div className="flex w-full flex-col items-center justify-center">
                <h1 className="mt-4 w-fit p-2 text-base-950 dark:text-base-50">
                  NO SNIPPETS TO DISPLAY
                </h1>
              </div>
            }
          </div>
          {selection && (
            <div className="hidden h-full w-2/3 overflow-y-auto lg:flex">
              <Display
                selection={selection}
                updateSnippetMod={updateSnippetMod}
                snippetMods={snippetMods}
              />
            </div>
          )}
        </div>
      )}
      {isLoading && (
        <div className="flex h-full w-full items-center justify-center">
          LOADING LIST...
        </div>
      )}
      {!isLoading && !listData && (
        <div className="flex h-full w-full items-center justify-center">
          <h1 className="bg-red-600 p-6 text-base-50">NO LIST FOUND</h1>
        </div>
      )}
      <Footer />
    </div>
  );
};
