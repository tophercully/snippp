import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { SearchBar } from "../components/SearchBar";
import { GoogleUser, Snippet } from "../typeInterfaces";
import { Navbar } from "../components/Navbar";
import { ListSnippets } from "../components/ListSnippets";
import { Footer } from "../components/Footer";
import { Display } from "../components/Display";
import { useLocalStorage } from "@uidotdev/usehooks";
import {
  getListSnippets,
  getList,
  deleteList,
  updateList,
} from "../backend/list/listFunctions";
import { useNotif } from "../hooks/Notif";
import SnipppButton from "../components/SnipppButton";
import DeleteConfirmationPopup from "../components/DeleteConfirmationPopup";

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
  console.log(snippets);
  const [snippetMods, setSnippetMods] = useState<SnippetMods>({});
  console.log(snippetMods);
  const [filteredAndSortedSnippets, setFilteredAndSortedSnippets] = useState<
    Snippet[]
  >([]);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const [listData, setListData] = useState<any>(null);
  console.log(listData);
  const [selection, setSelection] = useState<Snippet | null>(null);
  const [query, setQuery] = useState<string>("");
  const [sortMethod, setSortMethod] = useState<keyof Snippet>("snippetID");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

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
    };

    filterAndSortSnippets();
  }, [snippets, snippetMods, query, sortMethod, sortOrder]);

  const handleDeleteList = () => {
    setShowDeleteConfirmation(true);
  };
  const handleCancel = () => {
    setIsEditing(false);
    setNewListName("");
    setNewDescription("");
  };
  const confirmDeleteList = async () => {
    try {
      await deleteList(listData?.listid as number);
      setListData(null);
      showNotif("Deleted List", "success", 5000);
    } catch (error) {
      showNotif("Error Deleting List:" + error, "error");
    }
  };

  const handleEditList = () => {
    if (listData) {
      setNewListName(listData?.listname);
      setNewDescription(listData?.description);
      setIsEditing(true);
    }
  };

  const handleSaveList = async () => {
    if (userProfile) {
      setIsSaving(true);

      // Reset form and hide it
      setNewListName("");
      setNewDescription("");
      setIsEditing(false);

      try {
        await updateList(
          listData?.listid as number,
          newListName,
          newDescription,
        );
        showNotif("List Updated", "success", 5000);
      } catch (error) {
        showNotif("Error Updating List", "error", 5000);
      }
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/list/${listData?.listid}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${listData?.listname} on Snippp.io`,
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

  return (
    <div className="over flex h-screen w-full flex-col bg-base-100 p-2 pt-24 lg:p-10 lg:pt-24 dark:bg-base-900">
      <Navbar />
      {!isLoading && listData && (
        <div className="flex h-[96%] w-full shadow-lg">
          <div className="flex h-full w-full flex-col lg:w-1/3">
            <div className="rounded-sm bg-base-150 p-4 text-base-950 dark:bg-base-800 dark:text-base-50">
              <div className="flex items-center justify-between">
                <h1 className="mr-auto text-2xl font-bold">
                  {listData?.listname}
                </h1>
                {listData.listid != "mysnippets" &&
                  listData.listid != "favorites" && (
                    <div className="flex gap-4">
                      <SnipppButton
                        onClick={handleShare}
                        fit={true}
                        size={"sm"}
                        colorType="neutral"
                      >
                        <img
                          src="/share.svg"
                          className="invert group-hover:invert-0 dark:invert-0"
                        />
                      </SnipppButton>
                      {userProfile && userProfile.id == listData.userid && (
                        <>
                          <SnipppButton
                            onClick={handleEditList}
                            fit={true}
                            size={"sm"}
                            colorType="neutral"
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
                          >
                            <img
                              src="/x.svg"
                              className="invert group-hover:invert-0 dark:invert-0"
                            />
                          </SnipppButton>
                        </>
                      )}
                    </div>
                  )}
              </div>
              {listData?.description && (
                <div className="mt-4">
                  <p
                    className={`overflow-hidden font-thin transition-all duration-300 ${
                      isDescriptionExpanded ? "max-h-[1000px]" : "max-h-[3em]"
                    }`}
                  >
                    {listData.description}
                  </p>
                  <button
                    className="mt-2 text-sm text-base-950 hover:underline dark:text-base-50"
                    onClick={() =>
                      setIsDescriptionExpanded(!isDescriptionExpanded)
                    }
                  >
                    {isDescriptionExpanded ? "Show less" : "Show more"}
                  </button>
                </div>
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
      <DeleteConfirmationPopup
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={confirmDeleteList}
        itemName={listData?.listname || ""}
        itemType="list"
      />
      <Footer />
      {isEditing && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-75 dark:bg-black dark:bg-opacity-75">
          <div className="w-full max-w-md rounded-sm bg-white p-4 shadow-lg dark:bg-base-800">
            <h2 className="mb-4 text-center text-2xl dark:text-white">
              Add New List
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-base-700 dark:text-base-200">
                List Name
              </label>
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                className="mt-1 block w-full rounded-sm border border-base-300 p-2 dark:border-base-700 dark:bg-base-900 dark:text-white"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-base-700 dark:text-base-200">
                Description
              </label>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="mt-1 block w-full rounded-sm border border-base-300 p-2 dark:border-base-700 dark:bg-base-900 dark:text-white"
              />
            </div>
            <div className="flex justify-end gap-4">
              <SnipppButton
                onClick={handleCancel}
                colorType="delete"
              >
                CANCEL
              </SnipppButton>
              <SnipppButton
                onClick={handleSaveList}
                disabled={isSaving}
              >
                SAVE
              </SnipppButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
