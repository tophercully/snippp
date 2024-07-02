import { SearchBar } from "../components/SearchBar";
import { useState, useEffect } from "react";
import { GoogleUser, Snippet } from "../typeInterfaces";
import { Navbar } from "../components/Navbar";
import { SelectionsList } from "../components/SelectionsList";
import { Footer } from "../components/Footer";
import { Display } from "../components/Display";
import { useLocalStorage } from "@uidotdev/usehooks";
import { loadFavorites } from "../backend/loadFavorites";
import { loadUserSnippets } from "../backend/loadUserSnippets";

export const MySnippets = () => {
  const [userProfile] = useLocalStorage<GoogleUser | null>("userProfile", null);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [page, setPage] = useState<string>("mysnippets");
  const [selection, setSelection] = useState<Snippet | null>(null);
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    const fetchSnippets = async () => {
      if (userProfile && userProfile.id) {
        const snippetsArray = await loadUserSnippets({
          userID: userProfile.id,
        });
        if (
          snippetsArray.length !== snippets.length ||
          !snippetsArray.every(
            (val, index) => val.snippetID === snippets[index]?.snippetID,
          )
        ) {
          setSnippets(snippetsArray as Snippet[]);
          setSelection(snippetsArray[0] as Snippet);
        }
      }
    };

    const fetchFavorites = async () => {
      if (userProfile && userProfile.id) {
        const favoritesArray = await loadFavorites({
          userID: userProfile.id,
        });
        if (
          favoritesArray.length !== snippets.length ||
          !favoritesArray.every(
            (val, index) => val.snippetID === snippets[index]?.snippetID,
          )
        ) {
          setSnippets(favoritesArray as Snippet[]);
          setSelection(favoritesArray[0] as Snippet);
        }
      }
    };

    if (userProfile) {
      if (page === "mysnippets") {
        fetchSnippets();
      } else {
        fetchFavorites();
      }
    }
  }, [page, userProfile, snippets]);

  let filteredSnippets = snippets;
  if (query) {
    filteredSnippets = snippets.filter(
      (a) =>
        a.tags.includes(query) ||
        a.name.includes(query) ||
        a.author.includes(query),
    );
  }

  console.log(snippets.length);
  return (
    <div className="over flex h-screen w-full flex-col bg-base-100 p-10 pt-24 dark:bg-base-900">
      <Navbar />
      <div className="flex h-[96%] w-full shadow-lg">
        {snippets.length > 0 && (
          <div className="flex h-full w-1/3 flex-col">
            <div className="flex w-full">
              <button
                onClick={() => setPage("mysnippets")}
                className={`bg-base-50 text-lg text-base-950 duration-300 dark:bg-base-950 dark:text-base-50 ${page == "mysnippets" ? "flex-[1.5] invert" : "flex-1"}`}
              >
                MY SNIPPPETS
              </button>
              <button
                onClick={() => setPage("myfavorites")}
                className={`bg-base-50 text-lg text-base-950 duration-300 dark:bg-base-950 dark:text-base-50 ${page == "myfavorites" ? "flex-[1.5] invert" : "flex-1"}`}
              >
                FAVORITES
              </button>
            </div>
            <SearchBar
              query={query}
              setQuery={setQuery}
              placeHolder={
                page == "mysnippets" ? "search creations" : "search favorites"
              }
            />
            <div className="h-full w-full overflow-hidden">
              <SelectionsList
                snippets={filteredSnippets}
                selection={selection}
                setSelection={setSelection}
              />
            </div>
          </div>
        )}
        {snippets.length < 1 && (
          <div className="flex h-full w-1/3 flex-col items-center gap-5">
            <div className="flex w-full">
              <button
                onClick={() => setPage("mysnippets")}
                className={`bg-base-50 text-lg text-base-950 duration-300 dark:bg-base-950 dark:text-base-50 ${page == "mysnippets" ? "flex-[1.5] invert" : "flex-1"}`}
              >
                MY SNIPPPETS
              </button>
              <button
                onClick={() => setPage("myfavorites")}
                className={`bg-base-50 text-lg text-base-950 duration-300 dark:bg-base-950 dark:text-base-50 ${page == "myfavorites" ? "flex-[1.5] invert" : "flex-1"}`}
              >
                FAVORITES
              </button>
            </div>
            <h1 className="mt-4 p-2 text-base-950 dark:text-base-50">
              NO SNIPPPETS TO DISPLAY
            </h1>
            <a
              href={page == "mysnippets" ? "/builder" : "/browse"}
              className="text-semibold bg-base-950 p-2 text-sm text-base-50 underline decoration-dashed underline-offset-4 dark:bg-base-50 dark:text-base-950"
            >
              {page == "mysnippets" ? "CREATE SNIPPPET" : "DISCOVER SNIPPPETS"}
            </a>
          </div>
        )}
        {selection && (
          <div className="h-full w-2/3 overflow-y-auto">
            <Display selection={selection} />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};
