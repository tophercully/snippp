import React, { useState, useEffect, useCallback, useMemo } from "react";
import { SearchBar } from "../components/SearchBar";
import { GoogleUser, Snippet } from "../typeInterfaces";
import { Navbar } from "../components/Navbar";
import { ListSnippets } from "../components/listSnippets";
import { ListLists } from "../components/ListLists";
import { Footer } from "../components/Footer";
import { Display } from "../components/Display";
import { useLocalStorage } from "@uidotdev/usehooks";
import { loadFavorites } from "../backend/loader/loadFavorites";
import { loadUserSnippets } from "../backend/loader/loadUserSnippets";
import { getListSnippets, getUserLists } from "../backend/list/listFunctions";

type SortOrder = "asc" | "desc";

interface ListData {
  listid: string;
  userid: string;
  listname: string;
  description: string;
  createdat: string;
  lastupdated: string;
}

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

export const Dashboard: React.FC = () => {
  const [userProfile] = useLocalStorage<GoogleUser | null>("userProfile", null);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [snippetMods, setSnippetMods] = useState<SnippetMods>({});
  const [filteredAndSortedSnippets, setFilteredAndSortedSnippets] = useState<
    Snippet[]
  >([]);
  const defaultLists = useMemo(
    () => [
      {
        listid: "mysnippets",
        userid: userProfile?.id || "",
        listname: "My Snippets",
        description: "All my snippets",
        createdat: "",
        lastupdated: "",
      },
      {
        listid: "favorites",
        userid: userProfile?.id || "",
        listname: "Favorites",
        description: "My favorite snippets",
        createdat: "",
        lastupdated: "",
      },
    ],
    [userProfile],
  );
  const [lists, setLists] = useState<ListData[]>(() => defaultLists);
  const [list, setList] = useState<ListData | null>(null);
  const [selection, setSelection] = useState<Snippet | null>(null);
  const [query, setQuery] = useState<string>("");
  const [sortMethod, setSortMethod] = useState<keyof Snippet>("snippetID");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [listsLoading, setListsLoading] = useState<boolean>(false);
  const [snippetsLoading, setSnippetsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchAndSetLists = async () => {
      if (userProfile) {
        setListsLoading(true);
        const result = await getUserLists(userProfile.id);
        setLists((prevLists) => [...prevLists, ...result]);
        setListsLoading(false);
      }
    };
    console.log("running fetchlists");
    fetchAndSetLists();
  }, []);

  const updateSnippetMod = useCallback(
    (id: number, mod: Partial<SnippetMod>) => {
      setSnippetMods((prevMods) => ({
        ...prevMods,
        [id]: { ...prevMods[id], ...mod },
      }));
    },
    [],
  );

  const fetchSnippets = useCallback(async () => {
    if (userProfile && userProfile.id) {
      setSnippetsLoading(true);
      let result: Snippet[] = [];
      if (list) {
        if (list.listid === "mysnippets") {
          result = await loadUserSnippets(userProfile.id);
        } else if (list.listid === "favorites") {
          result = await loadFavorites({ userID: userProfile.id });
        } else {
          result = await getListSnippets(list.listid);
        }
      }
      if (Array.isArray(result)) {
        const snippetsArray = result as Snippet[];
        if (
          snippetsArray.length !== snippets.length ||
          !snippetsArray.every(
            (val, index) => val.snippetID === snippets[index]?.snippetID,
          )
        ) {
          setSnippets(snippetsArray);
          setSnippetMods({}); // Reset snippet mods when snippets change
        }
      } else {
        console.error(
          "Unexpected result type from loadUserSnippets or loadFavorites",
        );
        setSnippets([]);
      }
      setSnippetsLoading(false);
    }
  }, [list]);

  useEffect(() => {
    fetchSnippets();
  }, [fetchSnippets]);

  const handleSelectList = (listToSet: ListData) => {
    setList(listToSet);
  };

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
  }, [snippets, snippetMods, query, sortMethod, sortOrder, selection]);

  const SnippetExplorer: React.FC = () => {
    if (!snippetsLoading) {
      if (snippets.length > 0) {
        return (
          <>
            <SearchBar
              query={query}
              setQuery={setQuery}
              placeHolder={
                list?.listid === "mysnippets" ?
                  "search creations"
                : "search favorites"
              }
              setSortMethod={setSortMethod}
              sortMethod={sortMethod}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
            <div className="h-full w-full overflow-hidden">
              {list && (
                <ListSnippets
                  snippets={filteredAndSortedSnippets}
                  snippetMods={snippetMods}
                  selection={selection}
                  setSelection={setSelection}
                />
              )}
            </div>
          </>
        );
      } else {
        return (
          <div className="flex w-full flex-col items-center justify-center">
            <h1 className="mt-4 w-fit p-2 text-base-950 dark:text-base-50">
              NO SNIPPPETS TO DISPLAY
            </h1>
            <a
              href={list?.listid === "mysnippets" ? "/builder" : "/browse"}
              className="text-semibold w-fit bg-base-950 p-2 text-sm text-base-50 underline decoration-dashed underline-offset-4 duration-300 dark:bg-base-50 dark:text-base-950"
            >
              {list?.listid === "mysnippets" ?
                "CREATE SNIPPPET"
              : "DISCOVER SNIPPPETS"}
            </a>
          </div>
        );
      }
    } else {
      return <div className="w-full p-6 text-center">Loading...</div>;
    }
  };

  return (
    <div className="over flex h-screen w-full flex-col bg-base-100 p-2 pt-24 lg:p-10 lg:pt-24 dark:bg-base-900">
      <Navbar />
      <div className="flex h-[96%] w-full shadow-lg">
        {!list && (
          <div className="h-full w-1/3 overflow-hidden">
            <ListLists
              lists={lists}
              onSelectList={handleSelectList}
            />

            {listsLoading && <div>Loading Lists...</div>}
          </div>
        )}
        {list && (
          <div className="flex h-full w-full flex-col lg:w-1/3">
            <div className="flex w-full flex-col justify-start">
              <button
                className="h-10 max-h-10 max-w-10 p-4"
                onClick={() => {
                  setList(null);
                }}
              >
                <img
                  src="arrow-left.svg"
                  className="aspect-square h-3 bg-red-300 invert"
                />
              </button>
              <div className="p-4">
                <h1 className="font-bold">{list?.listname}</h1>
                <h1 className="font-thin">{list?.description}</h1>
              </div>
            </div>
            <SnippetExplorer />
          </div>
        )}

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
      <Footer />
    </div>
  );
};
