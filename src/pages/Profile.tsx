import React, { useState, useEffect, useCallback, useMemo } from "react";
import { SearchBar } from "../components/browserComponents/SearchBar";
import { GoogleUser, Snippet, SnipppProfile } from "../typeInterfaces";
import { Navbar } from "../components/nav/Navbar";
import { ListSnippets } from "../components/browserComponents/ListSnippets";
import { ListLists } from "../components/browserComponents/ListLists";
import { ListData } from "../typeInterfaces";
import { Footer } from "../components/nav/Footer";
import { Display } from "../components/browserComponents/Display";
import { useLocalStorage, useSessionStorage } from "@uidotdev/usehooks";
import { loadFavorites } from "../backend/loader/loadFavorites";
import { loadUserSnippets } from "../backend/loader/loadUserSnippets";
import {
  deleteList,
  getListSnippets,
  getUserLists,
  updateList,
} from "../backend/list/listFunctions";
import { useNotif } from "../hooks/Notif";
import SnipppButton from "../components/SnipppButton";
import { setPageTitle } from "../utils/setPageTitle";
import { useNavigate, useParams } from "react-router-dom";
import { formatDescription } from "../utils/formatDescription";
import { ProfileInfo } from "../components/profile/ProfileInfo";
import { fetchUserProfile } from "../backend/user/userFunctions";
import { exportAndDownloadUserSnippets } from "../utils/downloadUserSnippets";
import { useKeyboardControls } from "../hooks/KeyboardControls";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ProfileStats } from "../components/profile/ProfileStats";
import ConfirmationPopup from "../components/popups/ConfirmationPopup";
import EditListPopup from "../components/popups/EditListPopup";

const getHighResGoogleProfilePicture = (pictureUrl: string): string => {
  // Check if the URL is a Google profile picture URL and replace for higher resolution
  if (
    pictureUrl.includes("googleusercontent.com") &&
    pictureUrl.includes("s96-c")
  ) {
    return pictureUrl.replace(/s96-c/, "s400-c");
  }
  return pictureUrl;
};

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

export const Profile: React.FC = () => {
  const { listid, userid } = useParams();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useLocalStorage<GoogleUser | null>(
    "userProfile",
    null,
  );
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [snippetMods, setSnippetMods] = useState<SnippetMods>({});
  const [filteredAndSortedSnippets, setFilteredAndSortedSnippets] = useState<
    Snippet[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const [profile, setProfile] = useState<SnipppProfile | null>(null);

  useEffect(() => {
    const getAndSetProfile = async () => {
      setIsLoading(true);
      const response = await fetchUserProfile(userid as string);

      if (response?.profile_picture) {
        response.profile_picture = getHighResGoogleProfilePicture(
          response.profile_picture,
        );
      }

      setProfile(response as SnipppProfile);
      setIsLoading(false);
      setPageTitle(response?.name as string);
    };

    getAndSetProfile();
  }, [userid]);

  const defaultLists = useMemo(
    () => [
      {
        listid: "creations",
        userid: userid || "",
        listname: "Creations",
        description: "",
        createdat: "",
        lastupdated: "",
        snippet_count: "-1",
      },
      {
        listid: "favorites",
        userid: userid || "",
        listname: "Favorites",
        description: "",
        createdat: "",
        lastupdated: "",
        snippet_count: "-1",
      },
    ],
    [userid],
  );
  const [lists, setLists] = useState<ListData[]>(() => defaultLists);
  const [list, setList] = useSessionStorage<ListData | null>(
    `${userid}-lists`,
    null,
  );
  const [selection, setSelection] = useState<Snippet | null>(null);
  const [query, setQuery] = useState<string>("");
  const [sortMethod, setSortMethod] = useState<keyof Snippet>("snippetID");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [listsLoading, setListsLoading] = useState<boolean>(false);
  const [snippetsLoading, setSnippetsLoading] = useState<boolean>(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isAdding] = useSessionStorage("isAddingList", false);
  const [isEditing, setIsEditing] = useSessionStorage("isEditingList", false);
  const [isEditingProfile] = useSessionStorage("isEditingProfile", false);
  const [isSaving, setIsSaving] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const { showNotif } = useNotif();

  const fetchAndSetLists = useCallback(async () => {
    try {
      setListsLoading(true);

      const result = await getUserLists(userid as string);
      setLists([...defaultLists, ...result]);
    } catch (error) {
      console.error("Error fetching lists:", error);
      showNotif("Error fetching lists:" + error, "error");
    } finally {
      setListsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAndSetLists();
  }, [fetchAndSetLists]);

  useEffect(() => {
    if (!listsLoading && listid && lists.length > 0) {
      const listToSet = lists.find((l) => l.listid.toString() === listid);
      if (listToSet) {
        setList(listToSet);
        setPageTitle(`${listToSet.listname} - ${profile?.name}`);
      } else {
        // Handle case when listid doesn't match any list
        // navigate(`/user/${userid}`);
        setList(null);
      }
    }
  }, [listid, lists]);

  const keyboardControlOptions =
    list && !isEditing && !isAdding && !isEditingProfile ?
      {
        arrowLeft: async () => {
          setList(null);
          navigate(`/user/${userid}`);
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
      await deleteList(list?.listid as number);
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
        await updateList(list?.listid as number, newListName, newDescription);
        fetchAndSetLists();
        showNotif("List Updated", "success", 5000);
        setIsSaving(false);
      } catch (error) {
        showNotif("Error Updating List", "error", 5000);
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
    if (userid) {
      setSnippetsLoading(true);
      let result: Snippet[] = [];
      if (list) {
        if (list.listid === "creations") {
          result = await loadUserSnippets(
            userid as string,
            userProfile ? userProfile.id : "",
          );
        } else if (list.listid === "favorites") {
          result = await loadFavorites({ userID: userid as string });
        } else {
          result = await getListSnippets(
            userid as string,
            list.listid as number,
          );
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
  }, [list, userProfile?.id]);

  useEffect(() => {
    fetchSnippets();
  }, [fetchSnippets]);

  const handleSelectList = useCallback(
    (listToSet: ListData) => {
      navigate(`/user/${userid}/${listToSet.listid}`);
      setList(listToSet);
      setPageTitle(`${listToSet.listname} - ${profile?.name}`);
    },
    [navigate],
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

  const handleUpdateProfile = (updatedProfileData: Partial<SnipppProfile>) => {
    setProfile((prevProfile) => {
      if (prevProfile) {
        return {
          ...prevProfile,
          ...updatedProfileData,
        };
      }
      return prevProfile;
    });

    setUserProfile((prevProfile) => {
      if (prevProfile) {
        return {
          ...prevProfile,
          name: updatedProfileData.name ?? prevProfile.name, // Ensure name is not undefined
        };
      }
      return prevProfile;
    });
  };

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
                  list?.listid === "creations" ?
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
              href={list?.listid === "creations" ? "/builder" : "/browse"}
              className="text-semibold w-fit bg-base-950 p-2 text-sm text-base-50 underline decoration-dashed underline-offset-4 duration-75 dark:bg-base-50 dark:text-base-950"
            >
              {list?.listid === "creations" ?
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
    <div className="over flex h-[100svh] max-h-screen w-full flex-col gap-5 bg-base-50 p-2 pt-24 lg:p-10 lg:pt-24 dark:bg-base-900">
      <Navbar />
      {!isLoading ?
        <>
          <div className="flex w-full flex-col gap-4 lg:flex-row">
            <ProfileInfo
              snipppUser={profile as SnipppProfile}
              onUpdateUser={handleUpdateProfile}
            />
            <ProfileStats />
          </div>
          <div className="flex h-[96%] min-h-[96%] w-full shadow-lg">
            {!list && (
              <div
                className={`flex ${listsLoading ? "h-fit" : "h-full"} w-full flex-col overflow-hidden lg:w-1/3`}
              >
                <ListLists
                  profile={profile as SnipppProfile}
                  lists={lists}
                  addDisabled={userProfile ? !(userProfile.id == userid) : true}
                  onSelectList={handleSelectList}
                  onAddList={fetchAndSetLists}
                  onRefreshLists={fetchAndSetLists}
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
                      navigate(`/user/${userid}`);
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
                      {(list.listid == "creations" ||
                        list.listid == "favorites") &&
                        userid == userProfile?.id && (
                          <SnipppButton
                            size="sm"
                            tooltip={`Download ${list.listname} JSON`}
                            onClick={() => {
                              exportAndDownloadUserSnippets(
                                list.listname,
                                snippets,
                              );
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

                      {list.listid != "creations" &&
                        list.listid != "favorites" && (
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
                    <p
                      className="hover:cursor-pointer"
                      onClick={() => navigate(`/user/${profile?.userId}`)}
                    >
                      {profile?.name}
                    </p>

                    {list?.description && (
                      <div className="mt-4">
                        <p
                          className={`overflow-hidden font-thin transition-all duration-75 ${
                            isDescriptionExpanded ? "max-h-[1000px]" : (
                              "max-h-[3em]"
                            )
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
        </>
      : <div className="flex h-full w-full items-center justify-center text-base-950 dark:text-base-50">
          <LoadingSpinner />
        </div>
      }
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
