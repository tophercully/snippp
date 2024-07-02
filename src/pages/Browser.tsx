import { loadAllSnippets } from "../backend/loadAllSnippets";
import { SearchBar } from "../components/SearchBar";
import { useState, useEffect } from "react";
import { Snippet } from "../typeInterfaces";
import { Navbar } from "../components/Navbar";
import { SelectionsList } from "../components/SelectionsList";
import { Footer } from "../components/Footer";
import { Display } from "../components/Display";

export const Browser = () => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [selection, setSelection] = useState<Snippet | null>(snippets[0]);
  const [query, setQuery] = useState<string>("");
  useEffect(() => {
    const fetchSnippets = async () => {
      const snippetsArray = await loadAllSnippets();
      setSnippets(snippetsArray);
      setSelection(snippetsArray[0] || null); // Set the initial selection
    };

    fetchSnippets();
  }, []);

  console.log(selection);

  let filteredSnippets = snippets;
  if (query) {
    filteredSnippets = [];
    snippets.map((a) => {
      if (
        a.tags.includes(query) ||
        a.name.includes(query) ||
        a.author.includes(query)
      ) {
        filteredSnippets.push(a);
      }
    });
  }

  return (
    <div className="over flex h-screen w-full flex-col bg-base-100 p-10 pt-24 dark:bg-base-900">
      <Navbar />
      <div className="flex h-[96%] w-full shadow-lg">
        <div className="flex h-full w-1/3 flex-col">
          <SearchBar
            query={query}
            setQuery={setQuery}
          />
          <div className="h-full w-full overflow-hidden">
            <SelectionsList
              snippets={filteredSnippets}
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
