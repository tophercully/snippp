import SyntaxHighlighter from "react-syntax-highlighter";
import { monokai, vs } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { deleteSnippet } from "../../backend/snippet/deleteSnippet";
import { useMediaQuery, useSessionStorage } from "@uidotdev/usehooks";
import { removeSnippetFromFavorites } from "../../backend/favorite/removeFavorite";
import { addSnippetToFavorites } from "../../backend/favorite/addFavorite";
import { detectLanguage } from "../../utils/detectLanguage";
import { addCopy } from "../../backend/snippet/addCopy";
import { simplifyNumber } from "../../utils/simplifyNumber";
import {
  ListWithSnippetStatus,
  addSnippetToList,
  createList,
  getListsWithSnippetStatus,
  removeSnippetFromList,
} from "../../backend/list/listFunctions";
import formatPostgresDate from "../../utils/formatPostgresDate";
import "../../../markdown.css";
import { track } from "@vercel/analytics";
import { formatDescription } from "../../utils/formatDescription";
import { Snippet, SnippetMod } from "../../types/typeInterfaces";
import { useNotif } from "../../contexts/NotificationContext";
import { useRouter } from "next/navigation";
import { categories } from "../../data/categories";
import { useKeyboardControls } from "../../hooks/useKeyboardControls";
import Link from "next/link";
import SnipppButton from "../universal/SnipppButton";
import { useUser } from "../../contexts/UserContext";
import { signal, useComputed } from "@preact-signals/safe-react";
import DisplayToolbar from "./DisplayToolbar";

type SnippetMods = { [snippetID: number]: SnippetMod };

// Booleans / Switches
const isLoading = signal<boolean>(true);
const showDeleteConfirm = signal<boolean>(false);
const isDescriptionExpanded = signal<boolean>(false);
const isSaving = signal<boolean>(false);
const showListPopup = signal<boolean>(false);
const isLoadingLists = signal<boolean>(false);

// States
const userLists = signal<ListWithSnippetStatus[]>([]);
const lastCopyTime = signal<number>(0);
const newListName = signal<string>("");
const newDescription = signal<string>("");

export const Display = ({
  selection,
  updateSnippetMod,
  snippetMods,
}: {
  selection: Snippet;
  updateSnippetMod: (id: number, mod: Partial<SnippetMod>) => void;
  snippetMods: SnippetMods;
}) => {
  const { userProfile } = useUser();
  const {
    snippetID,
    name,
    tags,
    createdAt,
    author,
    code,
    authorID,
    isFavorite,
    copyCount,
    description,
    forkedFrom,
    forkedFromName,
    forkCount,
  } = selection;
  const { showNotif } = useNotif();
  const snippetMod = snippetMods[snippetID] || {};
  const [isAdding, setIsAdding] = useSessionStorage("isAddingList", false);
  const isForked = Boolean(forkedFrom != null);
  const [isEditing] = useSessionStorage("isEditingList", false);
  const [isEditingProfile] = useSessionStorage("isEditingProfile", false);
  const codeFontSize = window.innerWidth < 500 ? "5" : "10";
  const favoriteStatus = snippetMod.favoriteStatus ?? isFavorite;
  const detectedLanguage = detectLanguage(code) || "plaintext";
  const worthExpanding = Boolean(tags) || Boolean(description);
  const darkmode = useMediaQuery("(prefers-color-scheme: dark)");
  const selectedStyle = darkmode ? monokai : vs;

  const snippetCategories = useComputed(() => {
    const snippetTags = selection.tags
      .toLowerCase()
      .split(",")
      .map((tag) => tag.trim());

    return Object.entries(categories)
      .filter(([, categoryInfo]) =>
        categoryInfo.tags.some((catTag) => snippetTags.includes(catTag)),
      )
      .map(([key, categoryInfo]) => ({
        name: categoryInfo.name,
        link: `/browse/${key}`,
      }));
  });

  const copySnippet = () => {
    const now = Date.now();
    if (now - lastCopyTime.value >= 2000) {
      navigator.clipboard.writeText(code);
      showNotif("COPIED TO CLIPBOARD", "info", 1000, false);
      addCopy(selection.snippetID);
      updateSnippetMod(snippetID, {
        copyCount: (snippetMod.copyCount || 0) + 1,
      });
      lastCopyTime.value = now;
    }
  };

  const handleAddFavorite = async () => {
    if (userProfile) {
      // Calculate the new favorite count
      const currentFavoriteCount =
        snippetMod.favoriteCount ?? selection.favoriteCount;
      const newFavoriteCount = Number(currentFavoriteCount) + 1;

      // Optimistic update
      updateSnippetMod(snippetID, {
        favoriteStatus: true,
        favoriteCount: newFavoriteCount,
      });

      try {
        await addSnippetToFavorites({
          userID: userProfile.id,
          snippetIDToAdd: snippetID,
        });
        // showNotif("Added Favorite", "success", 2000);
      } catch (error) {
        console.error("Failed to add favorite:", error);
        // Revert optimistic update
        updateSnippetMod(snippetID, {
          favoriteStatus: false,
          favoriteCount: currentFavoriteCount,
        });
        showNotif("Failed to add favorite", "error", 2000);
      }
    }
  };

  const handleRemoveFavorite = async () => {
    if (userProfile) {
      // Calculate the new favorite count
      const currentFavoriteCount =
        snippetMod.favoriteCount ?? selection.favoriteCount;
      const newFavoriteCount = Math.max(currentFavoriteCount - 1, 0);

      // Optimistic update
      updateSnippetMod(snippetID, {
        favoriteStatus: false,
        favoriteCount: newFavoriteCount,
      });

      try {
        await removeSnippetFromFavorites({
          userID: userProfile.id,
          snippetIDToRemove: snippetID,
        });
      } catch (error) {
        console.error("Failed to remove favorite:", error);
        // Revert optimistic update
        updateSnippetMod(snippetID, {
          favoriteStatus: true,
          favoriteCount: currentFavoriteCount,
        });
        showNotif("Failed to remove favorite", "error", 2000);
      }
    }
  };

  const keyboardControlOptions =
    !isEditing && !isAdding && !isEditingProfile ?
      {
        keyboardRight: (event: KeyboardEvent) => {
          event.preventDefault();
          copySnippet();
        },
        enter: (event: KeyboardEvent) => {
          event.preventDefault();
          if (userProfile) {
            if (favoriteStatus) {
              handleRemoveFavorite();
            } else {
              handleAddFavorite();
            }
          }
        },
      }
    : {};
  useKeyboardControls(keyboardControlOptions);

  const fetchUserLists = async () => {
    console.log("Fetching user lists");
    if (userProfile) {
      isLoadingLists.value = true;
      try {
        const lists: ListWithSnippetStatus[] = (await getListsWithSnippetStatus(
          userProfile.id,
          snippetID,
        )) as ListWithSnippetStatus[];
        userLists.value = lists;
      } catch (error) {
        console.error("Failed to fetch user lists:", error);
        showNotif("Failed to load lists", "error", 2000);
      } finally {
        isLoadingLists.value = false;
      }
    }
  };

  const handleAddOrRemoveFromList = async (list: ListWithSnippetStatus) => {
    // Optimistically update the UI
    userLists.value = userLists.value.map((l) =>
      l.listid === list.listid ? { ...l, has_snippet: !l.has_snippet } : l,
    );

    try {
      if (!list.has_snippet) {
        await addSnippetToList(list.listid, snippetID);
        showNotif(
          `Added ${selection.name} to ${list.listname}`,
          "success",
          2000,
          false,
        );
      } else {
        await removeSnippetFromList(list.listid, snippetID);
        showNotif(
          `Removed ${selection.name} from ${list.listname}`,
          "success",
          2000,
          false,
        );
      }
    } catch (error) {
      // Revert the optimistic update if the operation fails
      userLists.value = userLists.value.map((l) =>
        l.listid === list.listid ? { ...l, has_snippet: list.has_snippet } : l,
      );
      console.error("Failed to update snippet in list:", error);
      showNotif("Failed to update list: " + error, "error", 2000);
    }
  };

  const handleSaveList = async () => {
    if (userProfile) {
      isSaving.value = true;

      try {
        await createList({
          userID: userProfile.id,
          listName: newListName.value,
          description: newDescription.value,
        });

        showNotif("List Created", "success", 5000);
      } catch (error) {
        showNotif(`Error Saving List: ${error}`, "error", 5000);
      } finally {
        // Reset form and hide it
        newListName.value = "";
        newDescription.value = "";
        setIsAdding(false);
        isSaving.value = false;
        fetchUserLists();
      }
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    newListName.value = "";
    newDescription.value = "";
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/snippet/${snippetID}`;
    const shareData = {
      title: `${name} on Snippp.io`,
      text: "Check out this code snippet :)",
      url: shareUrl,
    };

    // Check if running on macOS
    const isMacOS = /Mac/.test(navigator.userAgent);

    if (
      navigator.share &&
      navigator.canShare &&
      navigator.canShare(shareData) &&
      !isMacOS
    ) {
      try {
        await navigator.share(shareData);
        console.log("Shared successfully");
      } catch (err) {
        console.log("Error sharing:", err);
        await fallbackShare(shareUrl);
      }
    } else {
      await fallbackShare(shareUrl);
    }
  };

  const fallbackShare = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      showNotif("SNIPPET LINK COPIED", "info", 3000);
    } catch (err) {
      console.log("Error copying to clipboard:", err);
      alert("Unable to share. Please copy this link manually: " + url);
    }
  };

  const handleDeleteSnippet = async () => {
    if (userProfile && userProfile.id === authorID) {
      try {
        isLoading.value = true;
        await deleteSnippet({
          snippetIDToDelete: selection.snippetID,
        });
        updateSnippetMod(snippetID, { isDeleted: true });
        showNotif("Snippet Deleted", "success", 2000);
      } catch (error) {
        console.error("Failed to delete snippet:", error);
        showNotif("Failed to delete snippet", "error", 2000);
      } finally {
        isLoading.value = false;
        showDeleteConfirm.value = false;
      }
    }
  };

  const simplifiedAndModdedCount = simplifyNumber(
    snippetMod.copyCount ? copyCount + snippetMod.copyCount : copyCount,
  );

  if (selection) {
    return (
      <div className="flex h-full w-full flex-col gap-3 bg-base-50 pt-0 lg:p-8 lg:pb-4 dark:bg-base-950 dark:text-base-50">
        <div className="flex h-fit w-fit flex-wrap gap-4">
          <div className="flex h-fit w-fit flex-col gap-2 rounded-sm bg-base-950 p-4 text-base-50 dark:bg-base-50 dark:text-base-950">
            <Link
              href={`/snippet/${snippetID}`}
              className="text-3xl font-bold"
            >
              {name}
            </Link>
            {isForked && (
              <span className="-mt-2 mb-2 text-xs">
                <span>forked from </span>
                <Link
                  className="h-fit max-w-[20ch] truncate underline"
                  href={forkedFromName ? `/snippet/${forkedFrom}` : ""}
                >{`${forkedFromName ? forkedFromName : "Deleted Snippet"}`}</Link>
              </span>
            )}
            <div className="flex items-end justify-between gap-10">
              <Link
                href={`/user/${authorID}`}
                className="text-xl font-light"
              >
                {author}
              </Link>
              <h1 className="text-sm font-light">
                {createdAt ? formatPostgresDate(createdAt.toString()) : ""}
              </h1>
            </div>
          </div>
          <div className="mr-8 flex h-fit justify-between gap-3 md:flex-col">
            {snippetCategories.value.length > 0 && (
              <div className="flex flex-nowrap gap-1 self-end">
                {snippetCategories.value.map((category, index) => (
                  <Link
                    onClick={() => {
                      track(
                        `Category "${category.name}" browsed from snippet tag`,
                      );
                    }}
                    href={category.link}
                    key={index}
                    className="flex flex-wrap items-center justify-center text-nowrap rounded-sm bg-base-950 px-2 py-1 text-xs text-base-50 dark:bg-base-50 dark:text-base-950"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}

            {!selection.public && (
              <span className="flex h-fit items-center gap-2">
                <img
                  src="/lock.svg"
                  className="invert dark:invert-0"
                />
              </span>
            )}
            <span
              className="relative flex h-fit w-fit cursor-pointer items-center gap-2"
              onClick={copySnippet}
            >
              <span className="group flex gap-1">
                <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 whitespace-nowrap rounded-sm bg-base-700 px-3 py-2 text-sm text-white opacity-0 transition-opacity duration-100 group-hover:opacity-100 dark:bg-base-100 dark:text-black">
                  Times this snippet has been copied
                  <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-base-800 dark:border-t-base-100"></div>
                </div>
                <img
                  src="/copy.svg"
                  className="invert dark:invert-0"
                />
                <span>{simplifiedAndModdedCount}</span>
              </span>
            </span>
            {forkCount && forkCount != 0 && (
              <span className="relative flex h-fit w-fit items-center gap-2">
                <span className="group flex gap-1">
                  <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 whitespace-nowrap rounded-sm bg-base-700 px-3 py-2 text-sm text-white opacity-0 transition-opacity duration-100 group-hover:opacity-100 dark:bg-base-100 dark:text-black">
                    Times this snippet has been forked
                    <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-base-800 dark:border-t-base-100"></div>
                  </div>
                  <img
                    src="/fork.svg"
                    className="invert dark:invert-0"
                  />
                  <span>{forkCount}</span>
                </span>
              </span>
            )}
          </div>
        </div>
        {worthExpanding && (
          <div className="relative mt-4">
            <p
              className={`overflow-hidden font-light transition-all duration-75 ${
                isDescriptionExpanded.value ?
                  `${window.location.pathname.includes("/snippet") ? "max-h-none" : "max-h-[40vh] overflow-y-auto"}`
                : "max-h-[6em]"
              }`}
              dangerouslySetInnerHTML={{
                __html: formatDescription(description),
              }}
            ></p>
            {isDescriptionExpanded.value && tags && (
              <div className="mt-2 flex flex-wrap gap-1">
                {tags
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter((tag) => tag !== "")
                  .map((tag, index) => (
                    <span
                      key={index}
                      className="rounded-sm bg-base-950 px-2 py-1 text-xs text-base-50 dark:bg-base-50 dark:text-base-950"
                    >
                      {tag}
                    </span>
                  ))}
              </div>
            )}
            <button
              className="mt-2 text-sm text-base-500 hover:underline dark:text-base-500"
              onClick={() =>
                (isDescriptionExpanded.value = !isDescriptionExpanded.peek())
              }
            >
              {isDescriptionExpanded.value ? "Show less" : "Show more"}
            </button>
          </div>
        )}

        <div
          onClick={copySnippet}
          className="group relative h-full w-full overflow-y-auto border border-dashed border-base-200 p-4 text-sm duration-75 hover:cursor-pointer dark:border-base-800"
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-75 group-hover:opacity-100">
              <span className="rounded-sm bg-black bg-opacity-50 px-2 py-1 text-base-50 dark:bg-base-50 dark:text-base-950">
                CLICK TO COPY
              </span>
            </div>
          </div>
          <SyntaxHighlighter
            style={selectedStyle}
            language={detectedLanguage || "javascript"}
            wrapLongLines={true}
            customStyle={{
              background: "transparent",
              fontSize: codeFontSize,
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
        <DisplayToolbar
          selection={selection}
          favoriteStatus={favoriteStatus}
          copySnippet={copySnippet}
          handleAddFavorite={handleAddFavorite}
          handleRemoveFavorite={handleRemoveFavorite}
          isLoading={isAdding}
          handleShare={handleShare}
          showDeleteConfirm={showDeleteConfirm}
          showListPopup={showListPopup}
          fetchUserLists={fetchUserLists}
          authorID={authorID}
        />
        {showDeleteConfirm.value && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="rounded-sm bg-white p-6 dark:bg-base-800">
              <h2 className="mb-4 text-xl">
                Are you sure you want to delete this snippet?
              </h2>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => (showDeleteConfirm.value = false)}
                  className="rounded-sm bg-gray-300 px-4 py-2 hover:bg-gray-400 dark:bg-base-700 dark:hover:bg-base-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteSnippet}
                  className="rounded-sm bg-red-600 px-4 py-2 text-white hover:bg-red-800"
                  disabled={isLoading.value}
                >
                  {isLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
        {showListPopup.value && !isAdding && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md rounded-sm bg-white p-6 dark:bg-base-850">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold dark:text-white">
                  ADD TO LIST
                </h2>
                <button
                  onClick={() => (showListPopup.value = false)}
                  className="bg-base-150 hover:invert"
                >
                  <img
                    src="/x.svg"
                    className="h-6 w-6 invert"
                  />
                </button>
              </div>
              {isLoadingLists.value ?
                <p className="mb-4 dark:text-base-200">Loading lists...</p>
              : <div className="mb-4 flex max-h-[40svh] flex-col gap-2">
                  {userLists.value.length > 0 ?
                    userLists.value.map((list) => (
                      <div
                        key={list.listid}
                        className="flex gap-2"
                      >
                        <button
                          key={list.listid}
                          onClick={() => handleAddOrRemoveFromList(list)}
                          className={`flex w-full items-center justify-between rounded-sm p-2 text-left shadow-md ${
                            list.has_snippet ?
                              "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-800 dark:text-green-100 dark:hover:bg-green-700"
                            : "bg-base-100 text-base-950 hover:bg-base-200 dark:bg-base-700 dark:text-base-50 dark:hover:bg-base-600"
                          }`}
                        >
                          <span>{list.listname}</span>
                          {list.has_snippet ?
                            <img
                              src="/x.svg"
                              className="h-5 w-5 invert dark:invert-0"
                            />
                          : <img
                              src="/add.svg"
                              className="h-5 w-5 invert dark:invert-0"
                            />
                          }
                        </button>
                        <SnipppButton
                          size="md"
                          tooltip="View List in New Tab"
                          colorType="neutral"
                          onClick={() =>
                            window.open(
                              `${window.location.origin}/list/${list.listid}`,
                            )
                          }
                        >
                          <img
                            src="/opennew.svg"
                            className="invert group-hover:invert-0 dark:invert-0"
                          />
                        </SnipppButton>
                      </div>
                    ))
                  : <p className="dark:text-base-200">No lists available.</p>}
                  <p
                    onClick={() => {
                      setIsAdding(true);
                    }}
                    className="mt-4 flex items-center justify-center bg-black p-2 text-lg text-white hover:cursor-pointer hover:bg-base-500 dark:bg-white dark:text-black"
                  >
                    NEW LIST
                    <img
                      src="/add.svg"
                      className="ml-1 h-full dark:invert"
                    />
                  </p>
                </div>
              }
            </div>
          </div>
        )}
        {isAdding && (
          <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
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
                  value={newListName.value}
                  onChange={(e) => (newListName.value = e.target.value)}
                  className="mt-1 block w-full rounded-sm border border-base-300 p-2 dark:border-base-700 dark:bg-base-900 dark:text-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-base-700 dark:text-base-200">
                  Description
                </label>
                <textarea
                  value={newDescription.value}
                  onChange={(e) => (newDescription.value = e.target.value)}
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
                  disabled={isSaving.value}
                >
                  SAVE
                </SnipppButton>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  } else {
    return <div>NO SNIPPET SELECTED</div>;
  }
};
