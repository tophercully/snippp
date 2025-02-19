import { ListData, Snippet } from "../../types/typeInterfaces";
import { Signal, signal, useSignal } from "@preact-signals/safe-react";
import sortByProperty from "../../utils/sortByProperty";
import { useEffect } from "react";
import SearchBar from "../browser/SearchBar";
import { ListSnippets } from "../browser/ListSnippets";
import { LoadingSpinner } from "../universal/LoadingSpinner";
import { useRouter } from "next/navigation";
import ConfirmationPopup from "../modals/ConfirmationPopup";
import api from "../../backend/api";
import { useNotif } from "../../contexts/NotificationContext";
import SnipppButton from "../universal/SnipppButton";
import { exportAndDownloadUserSnippets } from "../../utils/downloadUserSnippets";
import Link from "next/link";
import { useUser } from "../../contexts/UserContext";
import { formatDescription } from "../../utils/formatDescription";
import { useKeyboardControls } from "../../hooks/useKeyboardControls";
import useCookie from "../../hooks/useCookie";

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
const isDescriptionExpanded = signal<boolean>(false);
const showDeleteConfirmation = signal<boolean>(false);

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
  const { showNotif } = useNotif();
  const { userProfile } = useUser();
  const [isAdding] = useCookie("isAddingList", false);
  const [isEditing, setIsEditing] = useCookie("isEditingList", false);
  const newList = useSignal<ListData>(list as ListData);
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

  const handleDeleteList = () => {
    showDeleteConfirmation.value = true;
  };
  const confirmDeleteList = async () => {
    try {
      await api.lists.delete(list?.listid as number);
      showNotif("Deleted List", "success", 5000);
      fetchAndSetLists();
    } catch (error) {
      showNotif("Error Deleting List:" + error, "error");
    }
  };

  const handleEditList = () => {
    // if (list) {
    //   setNewListName(list?.listname);
    //   setNewDescription(list?.description);
    //   setIsEditing(true);
    // }
  };

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

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/list/${list?.listid}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${list?.listname} on Snippp.io`,
          text: "Check out this list on Snippp.io :)",
          url: shareUrl,
        });
        console.log("Shared successfully");
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        showNotif("LINK TO LIST COPIED", "info", 3000);
      } catch (err) {
        console.log("Error copying to clipboard:", err);
        alert("Unable to share. Please copy this link manually: " + shareUrl);
      }
    }
  };

  if (!snippetsLoading) {
    if (filteredAndSortedSnippets.value.length > 0) {
      return (
        <div className="flex h-full w-full flex-col lg:w-1/3">
          <div className="flex w-full flex-col justify-start">
            <button
              className="group flex h-10 items-center gap-3 p-2 duration-75 hover:gap-2 hover:bg-base-200 hover:py-1 dark:invert"
              onClick={async () => {
                router.push("/dashboard");
                setListsToDefault();
                fetchAndSetLists();
              }}
            >
              <img
                src="/arrow-left.svg"
                className="h-full invert"
              />
              <p className="hidden group-hover:flex">BACK TO LISTS</p>
            </button>
            <div className="rounded-sm bg-base-150 p-4 text-base-950 dark:bg-base-800 dark:text-base-50">
              <div className="flex items-center justify-between">
                <a
                  href={`${window.location.origin}/list/${list?.listid}`}
                  className="mr-auto text-2xl font-bold"
                >
                  {list?.listname}
                </a>
                {(list?.listid == "mysnippets" ||
                  list?.listid == "favorites") && (
                  <SnipppButton
                    size="sm"
                    tooltip="Export Snippets as JSON"
                    onClick={() => {
                      exportAndDownloadUserSnippets(
                        list?.listname as string,
                        snippets,
                      );
                      showNotif("Downloaded Snippets as JSON", "success", 5000);
                    }}
                  >
                    <img
                      src="/download.svg"
                      className="invert group-hover:invert-0 dark:invert-0"
                    />
                  </SnipppButton>
                )}
                {list?.listid != "mysnippets" &&
                  list?.listid != "favorites" && (
                    <div className="flex gap-4">
                      <SnipppButton
                        onClick={handleShare}
                        fit={true}
                        size={"sm"}
                        colorType="neutral"
                        tooltip="Share List"
                      >
                        <img
                          src="/share.svg"
                          className="invert group-hover:invert-0 dark:invert-0"
                        />
                      </SnipppButton>
                      <SnipppButton
                        onClick={handleEditList}
                        fit={true}
                        size={"sm"}
                        colorType="neutral"
                        tooltip="Edit List"
                      >
                        <img
                          src="/edit.svg"
                          className="group-hover:invert dark:invert"
                        />
                      </SnipppButton>
                      <SnipppButton
                        onClick={handleDeleteList}
                        fit={true}
                        size={"sm"}
                        colorType="delete"
                        tooltip="Delete List"
                      >
                        <img
                          src="/trash.svg"
                          className="invert group-hover:invert-0 dark:invert-0"
                        />
                      </SnipppButton>
                    </div>
                  )}
              </div>
              <Link href={`/user/${userProfile?.id}`}>{userProfile?.name}</Link>
              {list?.description && (
                <div className="mt-4">
                  <p
                    className={`overflow-hidden font-thin transition-all duration-75 ${
                      isDescriptionExpanded.value ? "" : "line-clamp-2"
                    }`}
                    dangerouslySetInnerHTML={{
                      __html: formatDescription(list?.description),
                    }}
                  ></p>
                  <button
                    className="mt-2 text-sm text-base-950 hover:underline dark:text-base-50"
                    onClick={() =>
                      (isDescriptionExpanded.value =
                        !isDescriptionExpanded.peek())
                    }
                  >
                    {isDescriptionExpanded.value ? "Show less" : "Show more"}
                  </button>
                </div>
              )}
            </div>
          </div>
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
          <ConfirmationPopup
            isOpen={showDeleteConfirmation.value}
            onClose={() => (showDeleteConfirmation.value = false)}
            onConfirm={confirmDeleteList}
            title={`Delete ${list?.listname}?`}
            description="Are you sure you want to delete this list?"
            confirmButtonText="Delete"
          />
        </div>
      );
    } else {
      return (
        <div className="flex w-full flex-col items-center justify-center">
          <h1 className="mt-4 w-fit p-2 text-base-950 dark:text-base-50">
            NO SNIPPPETS TO DISPLAY
          </h1>
          <a
            href={list?.listid === "mysnippets" ? "/builder" : "/browse"}
            className="text-semibold w-fit bg-base-950 p-2 text-sm text-base-50 underline decoration-dashed underline-offset-4 duration-75 dark:bg-base-50 dark:text-base-950"
          >
            {list?.listid === "mysnippets" ?
              "CREATE SNIPPPET"
            : "DISCOVER SNIPPPETS"}
          </a>
        </div>
      );
    }
  } else {
    return (
      <div className="flex w-full items-center justify-center p-6 text-center lg:w-1/3 dark:text-base-50">
        <LoadingSpinner />
      </div>
    );
  }
};
