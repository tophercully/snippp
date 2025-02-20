import { ListData, Snippet } from "../../types/typeInterfaces";
import { Signal, signal } from "@preact-signals/safe-react";
import sortByProperty from "../../utils/sortByProperty";
import { useEffect } from "react";
import SearchBar from "../browser/SearchBar";
import { ListSnippets } from "../browser/ListSnippets";
import { LoadingSpinner } from "../universal/LoadingSpinner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useKeyboardControls } from "../../hooks/useKeyboardControls";
import useCookie from "../../hooks/useCookie";
import ListDetails from "./DashboardListDetails";

interface DisplaySelectionsProps {
  snippets: Snippet[];
  snippetMods: {
    [snippetID: number]: {
      favoriteStatus?: boolean;
      favoriteCount?: number;
      copyCount?: number;
      isDeleted?: boolean;
    };
  };
  selection: Signal<Snippet | null>;
  snippetsLoading: boolean;
  list: ListData | null;
  setListsToDefault: () => void;
  fetchAndSetLists: () => void;
}

const query = signal<string>("");
const sortMethod = signal<keyof Snippet>("name");
const sortOrder = signal<"asc" | "desc">("asc");
const filteredAndSortedSnippets = signal<Snippet[]>([]);

export const SnippetExplorer: React.FC<DisplaySelectionsProps> = ({
  snippets,
  snippetMods,
  snippetsLoading,
  selection,
  list,
  setListsToDefault,
  fetchAndSetLists,
}) => {
  console.log(
    `SnippetExplorer with list: ${list?.listname}, snippets: ${snippets.length}`,
  );
  const router = useRouter();
  const [isAdding] = useCookie("isAddingList", false);
  const [isEditing] = useCookie("isEditingList", false);

  useEffect(() => {
    const filterAndSortSnippets = () => {
      let filteredSnippets = snippets.filter(
        (snippet) => !snippetMods[snippet.snippetID]?.isDeleted,
      );

      if (query) {
        filteredSnippets = filteredSnippets.filter((a) => {
          // Ensure the properties exist and are strings before calling toLowerCase
          const tags = a.tags ? a.tags.toLowerCase() : "";
          const name = a.name ? a.name.toLowerCase() : "";
          const description = a.description ? a.description.toLowerCase() : "";
          const code = a.code ? a.code.toLowerCase() : "";
          const author = a.author ? a.author.toLowerCase() : "";

          // Perform the filtering
          return (
            tags.includes(query.value.toLowerCase()) ||
            name.includes(query.value.toLowerCase()) ||
            description.includes(query.value.toLowerCase()) ||
            code.includes(query.value.toLowerCase()) ||
            author.includes(query.value.toLowerCase())
          );
        });
      }

      const sortedSnippets = sortByProperty(
        filteredSnippets,
        sortMethod.value,
        sortOrder.value,
      );

      filteredAndSortedSnippets.value = sortedSnippets;

      // Preserve selection if possible, otherwise select the first snippet
      if (selection && selection.value) {
        const newSelectionIndex = sortedSnippets.findIndex(
          (s) => s.snippetID === selection.value?.snippetID,
        );
        if (newSelectionIndex !== -1) {
          selection.value = sortedSnippets[newSelectionIndex];
        } else {
          selection.value = sortedSnippets[0] || null;
        }
      } else {
        selection.value = sortedSnippets[0] || null;
      }
    };

    filterAndSortSnippets();
  }, [snippets, snippetMods, query, sortMethod, sortOrder]);

  const keyboardControlOptions =
    list && !isEditing && !isAdding ?
      {
        arrowLeft: async () => {
          router.back();
          setListsToDefault();
          fetchAndSetLists();
        },
      }
    : {};
  useKeyboardControls(keyboardControlOptions);

  return (
    <div className="flex h-full w-full flex-col lg:w-1/3">
      <ListDetails
        list={list}
        snippets={snippets}
        fetchAndSetLists={fetchAndSetLists}
        setListsToDefault={setListsToDefault}
      />
      {!snippetsLoading ?
        <>
          {filteredAndSortedSnippets.value.length > 0 ?
            <>
              <SearchBar
                query={query.value}
                setQuery={(value: React.SetStateAction<string>) => {
                  query.value =
                    typeof value === "function" ? value(query.value) : value;
                }}
                placeHolder={
                  Number(list?.listid) < 0 ?
                    list?.listid === "mysnippets" ?
                      "search creations"
                    : "search favorites"
                  : `search list`
                }
                setSortMethod={(newValue) => (sortMethod.value = newValue)}
                sortMethod={sortMethod.value}
                sortOrder={sortOrder.value}
                setSortOrder={(newValue) => (sortOrder.value = newValue)}
              />

              <div className="h-full w-full overflow-y-hidden">
                <ListSnippets
                  snippets={filteredAndSortedSnippets.value}
                  snippetMods={snippetMods}
                  selection={selection.value}
                  setSelection={(value) => (selection.value = value as Snippet)}
                />
              </div>
            </>
          : <div className="flex w-full flex-col items-center justify-center pt-10">
              <h1 className="mt-4 w-fit p-2 text-base-950 dark:text-base-50">
                NO SNIPPPETS TO DISPLAY
              </h1>
              <Link
                href={list?.listid === "mysnippets" ? "/builder" : "/browse"}
                className="text-semibold w-fit bg-base-950 p-2 text-sm text-base-50 underline decoration-dashed underline-offset-4 duration-75 dark:bg-base-50 dark:text-base-950"
              >
                {list?.listid === "mysnippets" ?
                  "CREATE SNIPPPET"
                : "DISCOVER SNIPPPETS"}
              </Link>
            </div>
          }
        </>
      : <div className="mx-auto flex h-full w-full items-center justify-center p-6 text-center lg:w-1/3 dark:text-base-50">
          <LoadingSpinner />
        </div>
      }
    </div>
  );
};
