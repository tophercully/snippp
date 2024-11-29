"use client";
import { loadAllSnippets } from "@/app/src/backend/loader/loadAllSnippets";
import { Display } from "@/app/src/components/browser/Display";
import { ListSnippets } from "@/app/src/components/browser/ListSnippets";
import SearchBar from "@/app/src/components/browser/SearchBar";
import { Footer } from "@/app/src/components/nav/Footer";
import { Navbar } from "@/app/src/components/nav/Navbar";
import { LoadingSpinner } from "@/app/src/components/universal/LoadingSpinner";
import { categories } from "@/app/src/data/categories";
import { Snippet } from "@/app/src/types/typeInterfaces";
import searchAndScoreSnippets from "@/app/src/utils/Search";
import searchSuggestions from "@/app/src/utils/searchSuggestions";
import { setPageTitle } from "@/app/src/utils/setPageTitle";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useState, useEffect, useCallback, useMemo } from "react";

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

type SnippetMod = {
  favoriteStatus?: boolean;
  favoriteCount?: number;
  copyCount?: number;
  isDeleted?: boolean;
};

type SnippetMods = { [snippetID: number]: SnippetMod };

const shuffledSuggestions = searchSuggestions.sort(() => Math.random() - 0.5);
const searchAllPlaceholder = `search - try "${shuffledSuggestions[0]}" or "${shuffledSuggestions[1]}"`;

const Browser: React.FC = () => {
  const { category } = useParams();

  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [snippetMods, setSnippetMods] = useState<SnippetMods>({});
  const [selection, setSelection] = useState<Snippet | null>(null);
  const [query, setQuery] = useState<string>("");
  if (category) {
    setPageTitle(`${categories[category[0]].name} Snippets`);
  } else {
    setPageTitle("All Snippets");
  }
  const [sortMethod, setSortMethod] =
    useState<SortableSnippetKeys>("copyCount");
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
    setSnippetMods({});
    setIsLoading(false);
    setTimeout(() => setIsTransitioning(false), 300);
  }, []);

  useEffect(() => {
    fetchSnippets();
  }, [fetchSnippets]);

  const updateSnippetMod = useCallback(
    (id: number, mod: Partial<SnippetMod>) => {
      setSnippetMods((prevMods) => ({
        ...prevMods,
        [id]: { ...prevMods[id], ...mod },
      }));
    },
    [],
  );

  const filteredAndSortedSnippets = useMemo(() => {
    let filteredSnippets = snippets.filter(
      (snippet) => !snippetMods[snippet.snippetID]?.isDeleted,
    );

    if (category && categories[category[0]]) {
      const categoryTags = categories[category[0]].tags;
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
      return searchAndScoreSnippets(query, filteredSnippets);
    }

    return sortByProperty(filteredSnippets, sortMethod, sortOrder);
  }, [snippets, snippetMods, query, sortMethod, sortOrder, category]);

  const isReady =
    !isLoading && filteredAndSortedSnippets.length > 0 && selection;

  return (
    <div className="over flex h-screen w-screen flex-col bg-base-100 p-2 pt-24 lg:p-10 lg:pt-24 dark:bg-base-900">
      <Navbar />
      <div className="flex h-fit w-full flex-col-reverse shadow-lg lg:h-[96%] lg:flex-row">
        <div className="flex h-full w-full flex-col lg:w-1/3">
          <SearchBar
            query={query}
            setQuery={setQuery}
            placeHolder={
              category ?
                `search ${categories[category[0]].name.toLowerCase()} snipppets`
              : searchAllPlaceholder
            }
            setSortMethod={setSortMethod}
            sortMethod={sortMethod}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />
          <div className="relative h-full w-full overflow-hidden">
            <div
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-75 ${
                isLoading || isTransitioning ? "opacity-100" : (
                  "pointer-events-none opacity-0"
                )
              }`}
            >
              {/* <p className="text-xl text-base-950 dark:text-base-50">
                Loading...
              </p> */}
              <LoadingSpinner />
            </div>
            <div
              className={`h-full w-full transition-opacity duration-75 ${
                isLoading || isTransitioning ?
                  "pointer-events-none opacity-0"
                : "opacity-100"
              }`}
            >
              {filteredAndSortedSnippets.length > 0 ?
                <ListSnippets
                  snippets={filteredAndSortedSnippets}
                  snippetMods={snippetMods}
                  selection={selection}
                  setSelection={setSelection}
                />
              : <div className="flex h-full flex-col items-center gap-5">
                  <h1 className="mt-4 p-2 text-base-950 dark:text-base-50">
                    NO SNIPPPETS TO DISPLAY
                  </h1>
                  <Link
                    href={"/builder"}
                    className="text-semibold bg-base-950 p-2 text-sm text-base-50 underline decoration-dashed underline-offset-4 dark:bg-base-50 dark:text-base-950"
                  >
                    CREATE SNIPPPET
                  </Link>
                </div>
              }
            </div>
          </div>
        </div>
        <div
          className={`hidden h-[90svh] w-full transition-opacity duration-75 lg:flex lg:h-full lg:w-2/3 ${
            isReady ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          {isReady && (
            <Display
              selection={selection}
              updateSnippetMod={updateSnippetMod}
              snippetMods={snippetMods}
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Browser;
