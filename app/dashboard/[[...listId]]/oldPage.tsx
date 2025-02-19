"use client";
import api from "@/app/src/backend/api";
import { Display } from "@/app/src/components/browser/Display";
import { ListLists } from "@/app/src/components/browser/ListLists";
import { ListSnippets } from "@/app/src/components/browser/ListSnippets";
import SearchBar from "@/app/src/components/browser/SearchBar";
import ConfirmationPopup from "@/app/src/components/modals/ConfirmationPopup";
import EditListPopup from "@/app/src/components/modals/EditListPopup";
import { Footer } from "@/app/src/components/nav/Footer";
import { Navbar } from "@/app/src/components/nav/Navbar";
import { LoadingSpinner } from "@/app/src/components/universal/LoadingSpinner";
import SnipppButton from "@/app/src/components/universal/SnipppButton";
import { useNotif } from "@/app/src/contexts/NotificationContext";
import { useUser } from "@/app/src/contexts/UserContext";
import useCookie from "@/app/src/hooks/useCookie";
import { useKeyboardControls } from "@/app/src/hooks/useKeyboardControls";
import { GoogleUser, ListData, Snippet } from "@/app/src/types/typeInterfaces";
import { exportAndDownloadUserSnippets } from "@/app/src/utils/downloadUserSnippets";
import { formatDescription } from "@/app/src/utils/formatDescription";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect, useCallback, useMemo } from "react";

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

const Dashboard: React.FC = () => {
  const { listid } = useParams();
  const router = useRouter();
  const { userProfile } = useUser();
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
        description: "",
        createdat: "",
        lastupdated: "",
        snippet_count: "-1",
      },
      {
        listid: "favorites",
        userid: userProfile?.id || "",
        listname: "Favorites",
        description: "",
        createdat: "",
        lastupdated: "",
        snippet_count: "-1",
      },
    ],
    [userProfile],
  );
  const [lists, setLists] = useCookie<ListData[]>(
    "dashboardCachedLists",
    defaultLists,
  );
  const [list, setList] = useState<ListData | null>(null);

  const [lastFetchTime, setLastFetchTime] = useCookie<number>(
    "lastListsFetchTime",
    0,
  );
  const [selection, setSelection] = useState<Snippet | null>(null);
  const [query, setQuery] = useState<string>("");
  const [sortMethod, setSortMethod] = useState<keyof Snippet>("snippetID");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [listsLoading, setListsLoading] = useState<boolean>(false);
  const [snippetsLoading, setSnippetsLoading] = useState<boolean>(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isAdding] = useCookie("isAddingList", false);
  const [isEditing, setIsEditing] = useCookie("isEditingList", false);
  const [isSaving, setIsSaving] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const { showNotif } = useNotif();

  const fetchAndSetLists = useCallback(async () => {
    const currentTime = Date.now();
    const cacheExpiration = 5 * 60 * 1000; // 5 minutes

    if (
      currentTime - lastFetchTime > cacheExpiration ||
      lists.length === defaultLists.length
    ) {
      try {
        setListsLoading(true);
        document.title = `Dashboard - Snippp`;

        if (userProfile) {
          const result = await api.lists.getByUserId(userProfile.id);
          setLists([...defaultLists, ...result]);
          setLastFetchTime(currentTime);
        }
      } catch (error) {
        console.error("Error fetching lists:", error);
        showNotif("Error fetching lists:" + error, "error");
      } finally {
        setListsLoading(false);
      }
    } else {
      console.log("Using cached lists");
    }
  }, []);

  const forceFetchAndSetLists = async () => {
    const currentTime = Date.now();
    {
      try {
        setListsLoading(true);
        setLists(defaultLists);
        document.title = `Dashboard - Snippp`;

        if (userProfile) {
          const result = await api.lists.getByUserId(userProfile.id);
          setLists([...defaultLists, ...result]);
          setLastFetchTime(currentTime);
        }
      } catch (error) {
        console.error("Error fetching lists:", error);
        showNotif("Error fetching lists:" + error, "error");
      } finally {
        setListsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchAndSetLists();
  }, [userProfile]);

  useEffect(() => {
    if (!listsLoading && listid && lists.length > 0) {
      const listToSet = lists.find((l) => l.listid.toString() === listid);
      if (listToSet) {
        setList(listToSet);
        // setPageTitle(`${listToSet.listname} - Dashboard`);
      } else {
        // Handle case when listid doesn't match any list
        setList(null);
      }
    }
  }, []);

  const keyboardControlOptions =
    list && !isEditing && !isAdding ?
      {
        arrowLeft: async () => {
          setList(null);
          router.push("/dashboard");
          setLists(defaultLists);
          fetchAndSetLists();
        },
      }
    : {};
  useKeyboardControls(keyboardControlOptions);

  const updateSnippetMod = useCallback(
    (id: number, mod: Partial<SnippetMod>) => {
      setSnippetMods((prevMods) => ({
        ...prevMods,
        [id]: { ...prevMods[id], ...mod },
      }));
    },
    [],
  );

  const handleDeleteList = () => {
    setShowDeleteConfirmation(true);
  };
  const confirmDeleteList = async () => {
    try {
      await api.lists.delete(list?.listid as number);
      setList(null);
      showNotif("Deleted List", "success", 5000);
      await fetchAndSetLists();
    } catch (error) {
      showNotif("Error Deleting List:" + error, "error");
    }
  };

  const handleEditList = () => {
    if (list) {
      setNewListName(list?.listname);
      setNewDescription(list?.description);
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
        await api.lists.update(
          list?.listid as number,
          newListName,
          newDescription,
        );
        fetchAndSetLists();
        showNotif("List Updated", "success", 5000);
        setIsSaving(false);
      } catch (error) {
        showNotif(`Error Updating List: ${error}`, "error", 5000);
        setIsSaving(false);
      }
    }
  };

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

  const handleCancel = () => {
    setIsEditing(false);
    setNewListName("");
    setNewDescription("");
  };
  const fetchSnippets = useCallback(async () => {
    if (userProfile && userProfile.id) {
      setSnippetsLoading(true);
      let result: Snippet[] = [];
      if (list) {
        if (list.listid === "mysnippets") {
          result = await api.snippets.loadByUserId(
            userProfile.id,
            userProfile.id,
          );
          console.log(result);
        } else if (list.listid === "favorites") {
          result = await api.snippets.loadFavorites({ userID: userProfile.id });
        } else {
          result = await api.snippets.loadByListId(list.listid as number);
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

  const handleSelectList = useCallback(
    (listToSet: ListData) => {
      router.push(`/dashboard/${listToSet.listid}`);
      setList(listToSet);
    },
    [router],
  );

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
            tags.includes(query.toLowerCase()) ||
            name.includes(query.toLowerCase()) ||
            description.includes(query.toLowerCase()) ||
            code.includes(query.toLowerCase()) ||
            author.includes(query.toLowerCase())
          );
        });
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
  }, [snippets, snippetMods, query, sortMethod, sortOrder]);

  const SnippetExplorer: React.FC = () => {
    if (!snippetsLoading) {
      if (snippets.length > 0) {
        return (
          <>
            <SearchBar
              query={query}
              setQuery={setQuery}
              placeHolder={
                Number(list?.listid) < 0 ?
                  list?.listid === "mysnippets" ?
                    "search creations"
                  : "search favorites"
                : `search list`
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
        <div className="flex w-full items-center justify-center p-6 text-center dark:text-base-50">
          <LoadingSpinner />
        </div>
      );
    }
  };

  return (
    <div className="over flex h-screen w-full flex-col bg-base-100 p-2 pt-24 lg:p-10 lg:pt-24 dark:bg-base-900">
      <Navbar />
      <div className="flex h-[96%] w-full shadow-lg">
        {!list && (
          <div
            className={`flex ${listsLoading ? "h-fit" : "h-full"} w-full flex-col overflow-hidden lg:w-1/3`}
          >
            <ListLists
              profile={userProfile as GoogleUser}
              lists={lists}
              addDisabled={false}
              onSelectList={handleSelectList}
              onAddList={forceFetchAndSetLists}
              onRefreshLists={forceFetchAndSetLists}
            />

            {listsLoading && (
              <div className="flex w-full items-center justify-center p-4 text-center text-base-600 dark:text-base-50">
                <LoadingSpinner />
              </div>
            )}
          </div>
        )}
        {list && (
          <div className="flex h-full w-full flex-col lg:w-1/3">
            <div className="flex w-full flex-col justify-start">
              <button
                className="group flex h-10 items-center gap-3 p-2 duration-75 hover:gap-2 hover:bg-base-200 hover:py-1 dark:invert"
                onClick={async () => {
                  setList(null);
                  router.push("/dashboard");
                  setLists(defaultLists);
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
                  {(list.listid == "mysnippets" ||
                    list.listid == "favorites") && (
                    <SnipppButton
                      size="sm"
                      tooltip="Export Snippets as JSON"
                      onClick={() => {
                        exportAndDownloadUserSnippets(list.listname, snippets);
                        showNotif(
                          "Downloaded Snippets as JSON",
                          "success",
                          5000,
                        );
                      }}
                    >
                      <img
                        src="/download.svg"
                        className="invert group-hover:invert-0 dark:invert-0"
                      />
                    </SnipppButton>
                  )}
                  {list.listid != "mysnippets" &&
                    list.listid != "favorites" && (
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
                <Link href={`/user/${userProfile?.id}`}>
                  {userProfile?.name}
                </Link>
                {list?.description && (
                  <div className="mt-4">
                    <p
                      className={`overflow-hidden font-thin transition-all duration-75 ${
                        isDescriptionExpanded ? "max-h-[1000px]" : "max-h-[3em]"
                      }`}
                      dangerouslySetInnerHTML={{
                        __html: formatDescription(list.description),
                      }}
                    ></p>
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
            </div>
            <SnippetExplorer />
            <ConfirmationPopup
              isOpen={showDeleteConfirmation}
              onClose={() => setShowDeleteConfirmation(false)}
              onConfirm={confirmDeleteList}
              title={`Delete ${list?.listname}?`}
              description="Are you sure you want to delete this list?"
              confirmButtonText="Delete"
            />
          </div>
        )}

        {selection && (
          <div className="hidden h-full lg:flex lg:w-2/3">
            <Display
              selection={selection}
              updateSnippetMod={updateSnippetMod}
              snippetMods={snippetMods}
            />
          </div>
        )}
      </div>
      <Footer />
      <EditListPopup
        isOpen={isEditing}
        onClose={handleCancel}
        onSave={handleSaveList}
        initialName={list?.listname || ""}
        initialDescription={list?.description || ""}
        isSaving={isSaving}
        name={newListName}
        setName={setNewListName}
        description={newDescription}
        setDescription={setNewDescription}
      />
    </div>
  );
};

export default Dashboard;
