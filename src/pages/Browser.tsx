import React, { useState, useEffect, useCallback } from "react";
import { loadAllSnippets } from "../backend/loadAllSnippets";
import { SearchBar } from "../components/SearchBar";
import { Snippet } from "../typeInterfaces";
import { Navbar } from "../components/Navbar";
import { SelectionsList } from "../components/SelectionsList";
import { Footer } from "../components/Footer";
import { Display } from "../components/Display";

type SortOrder = "asc" | "desc";

function sortByProperty<T>(
  array: T[],
  property: keyof T,
  order: SortOrder = "asc",
): T[] {
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

export const Browser: React.FC = () => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [selection, setSelection] = useState<Snippet | null>(null);
  const [query, setQuery] = useState<string>("");
  const [sortMethod, setSortMethod] = useState<keyof Snippet>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [filteredAndSortedSnippets, setFilteredAndSortedSnippets] = useState<
    Snippet[]
  >([]);

  useEffect(() => {
    const fetchSnippets = async () => {
      const snippetsArray = await loadAllSnippets();
      setSnippets(snippetsArray);
      setSelection(snippetsArray[0] || null); // Set the initial selection
    };

    fetchSnippets();
  }, []);

  const filterAndSortSnippets = useCallback(() => {
    let filteredSnippets = snippets;

    // Filter
    if (query) {
      filteredSnippets = snippets.filter(
        (a) =>
          a.tags.includes(query) ||
          a.name.includes(query) ||
          a.author.includes(query),
      );
    }

    // Sort
    const sortedSnippets = sortByProperty(
      filteredSnippets,
      sortMethod,
      sortOrder,
    );

    setFilteredAndSortedSnippets(sortedSnippets);
    setSelection(sortedSnippets[0] || null);
  }, [snippets, query, sortMethod, sortOrder]);

  useEffect(() => {
    filterAndSortSnippets();
  }, [snippets, query, sortMethod, sortOrder, filterAndSortSnippets]);

  return (
    <div className="over flex h-screen w-full flex-col bg-base-100 p-10 pt-24 dark:bg-base-900">
      <Navbar />
      <div className="flex h-[96%] w-full shadow-lg">
        <div className="flex h-full w-1/3 flex-col">
          <SearchBar
            query={query}
            setQuery={setQuery}
            placeHolder={"search all"}
            setSortMethod={setSortMethod}
            sortMethod={sortMethod}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />
          <div className="h-full w-full overflow-hidden">
            <SelectionsList
              snippets={filteredAndSortedSnippets}
              selection={selection}
              setSelection={setSelection}
            />
          </div>
        </div>
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
