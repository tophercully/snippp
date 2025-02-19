"use client";
import { loadAllSnippets } from "@/app/src/backend/loader/loadAllSnippets";
import { Display } from "@/app/src/components/browser/Display";
import { ListSnippets } from "@/app/src/components/browser/ListSnippets";
import SearchBar from "@/app/src/components/browser/SearchBar";
import { Footer } from "@/app/src/components/nav/Footer";
import { Navbar } from "@/app/src/components/nav/Navbar";
import { LoadingSpinner } from "@/app/src/components/universal/LoadingSpinner";
import { categories } from "@/app/src/data/categories";
import { Snippet, SnippetMod } from "@/app/src/types/typeInterfaces";
import searchAndScoreSnippets from "@/app/src/utils/Search";
import searchSuggestions from "@/app/src/utils/searchSuggestions";
import { setPageTitle } from "@/app/src/utils/setPageTitle";
import Link from "next/link";
import React, { useState, useEffect, useCallback } from "react";
import GoogleAd from "../components/ads/GoogleAd";
import { computed, effect, signal } from "@preact-signals/safe-react";
import sortByProperty from "../utils/sortByProperty";

type SortOrder = "asc" | "desc";
type SortableSnippetKeys = keyof Snippet;
type SnippetMods = { [snippetID: number]: SnippetMod };

const shuffledSuggestions = searchSuggestions.sort(() => Math.random() - 0.5);
const searchAllPlaceholder = `search - try "${shuffledSuggestions[0]}" or "${shuffledSuggestions[1]}"`;

const snippets = signal<Snippet[]>([]);
const snippetMods = signal<SnippetMods>({});
const query = signal<string>("");
const sortMethod = signal<SortableSnippetKeys>("copyCount");
const sortOrder = signal<SortOrder>("desc");
const category = window.location.pathname.split("/").slice(2, 3)[0] || "";
console.log(`category: ${category}`);
const filteredAndSortedSnippets = computed(() => {
  let filteredSnippets = snippets.value.filter(
    (snippet) => !snippetMods.peek()[snippet.snippetID]?.isDeleted,
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
    return searchAndScoreSnippets(query.value, filteredSnippets);
  }

  return sortByProperty(filteredSnippets, sortMethod.value, sortOrder.value);
});
const selection = signal<Snippet | null>(null);
const isLoading = signal<boolean>(true);
const isTransitioning = signal<boolean>(false);

const BrowserContent: React.FC = () => {
  useEffect(() => {
    if (category) {
      setPageTitle(
        `${categories[category] ? categories[category].name : "All"} Snippets`,
      );
    } else {
      setPageTitle("All Snippets");
    }
  }, []);

  const fetchSnippets = async () => {
    try {
      isLoading.value = true;
      isTransitioning.value = true;
      const userProfile = JSON.parse(
        localStorage.getItem("userProfile") || "null",
      );
      const userID = userProfile ? userProfile.id : undefined;
      const snippetsArray = await loadAllSnippets(userID);
      console.log(`Setting snippets to ${snippetsArray.length} snippets`);
      snippets.value = snippetsArray;
      snippetMods.value = {}; // Reset snippet mods when snippets change
      isLoading.value = false;
      setTimeout(() => (isTransitioning.value = false), 300);
    } catch (error) {
      console.error("Error fetching snippets:", error);
    }
  };

  useEffect(() => {
    fetchSnippets();
  }, []);

  const updateSnippetMod = (id: number, mod: Partial<SnippetMod>) => {
    snippetMods.value = {
      ...snippetMods.peek(),
      [id]: { ...snippetMods.peek()[id], ...mod },
    };
  };

  const isReady =
    !isLoading.value && filteredAndSortedSnippets.value.length > 0;

  return (
    <div className="over flex h-screen w-screen flex-col bg-base-100 p-2 pt-24 lg:p-10 lg:pt-24 dark:bg-base-900">
      <Navbar />
      <GoogleAd adSlot="6797801111" />
      <div className="flex h-fit w-full flex-col-reverse shadow-lg lg:h-[96%] lg:flex-row">
        <div className="flex h-full w-full flex-col lg:w-1/3">
          <SearchBar
            query={query.value}
            setQuery={(newQuery) => (query.value = newQuery as string)}
            placeHolder={
              category ?
                `search ${categories[category]?.name.toLowerCase()} snipppets`
              : searchAllPlaceholder
            }
            setSortMethod={(newValue) => (sortMethod.value = newValue)}
            sortMethod={sortMethod.value}
            sortOrder={sortOrder.value}
            setSortOrder={(newSortOrder) =>
              (sortOrder.value = newSortOrder as SortOrder)
            }
          />
          <div className="relative h-full w-full overflow-hidden">
            <div
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-75 ${
                isLoading.value || isTransitioning.value ?
                  "opacity-100"
                : "pointer-events-none opacity-0"
              }`}
            >
              <LoadingSpinner />
            </div>
            <div
              className={`h-full w-full transition-opacity duration-75 ${
                isLoading.value || isTransitioning.value ?
                  "pointer-events-none opacity-0"
                : "opacity-100"
              }`}
            >
              {filteredAndSortedSnippets.value.length > 0 ?
                <ListSnippets
                  snippets={filteredAndSortedSnippets.value}
                  snippetMods={snippetMods.value}
                  selection={selection.value}
                  setSelection={(newSelection) =>
                    (selection.value = newSelection as Snippet)
                  }
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
          {isReady && selection.value && (
            <Display
              selection={selection.value as Snippet}
              updateSnippetMod={updateSnippetMod}
              snippetMods={snippetMods.value}
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BrowserContent;
