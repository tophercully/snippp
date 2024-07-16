import { GoogleUser, Snippet } from "../../typeInterfaces";
import SyntaxHighlighter from "react-syntax-highlighter";
import { monokai, vs } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { deleteSnippet } from "../../backend/snippet/deleteSnippet";
import { useMemo, useState } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";
import { removeSnippetFromFavorites } from "../../backend/favorite/removeFavorite";
import { addSnippetToFavorites } from "../../backend/favorite/addFavorite";

import { detectLanguage } from "../../utils/detectLanguage";
import categories from "../../utils/categories";
import { useNotif } from "../../hooks/Notif";
import { addCopy } from "../../backend/snippet/addCopy";
import { simplifyNumber } from "../../utils/simplifyNumber";

import {
  ListWithSnippetStatus,
  addSnippetToList,
  getListsWithSnippetStatus,
  removeSnippetFromList,
} from "../../backend/list/listFunctions";
import formatPostgresDate from "../../utils/formatPostgresDate";

import { formatDescription } from "../../utils/formatDescription";
import SnipppButton from "../SnipppButton";
import { useKeyboardControls } from "../../hooks/KeyboardControls";

type SnippetMod = {
  favoriteStatus?: boolean;
  favoriteCount?: number;
  copyCount?: number;
  isDeleted?: boolean;
};

type SnippetMods = { [snippetID: number]: SnippetMod };

export const Display = ({
  selection,
  updateSnippetMod,
  snippetMods,
}: {
  selection: Snippet;
  updateSnippetMod: (id: number, mod: Partial<SnippetMod>) => void;
  snippetMods: SnippetMods;
}) => {
  const [userProfile] = useLocalStorage<GoogleUser | null>("userProfile", null);
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
  } = selection;
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [lastCopyTime, setLastCopyTime] = useState(0);
  const [showListPopup, setShowListPopup] = useState(false);
  const [userLists, setUserLists] = useState<ListWithSnippetStatus[]>([]);
  const [isLoadingLists, setIsLoadingLists] = useState(false);

  const codeFontSize = window.innerWidth < 500 ? "5" : "10";

  const snippetMod = snippetMods[snippetID] || {};
  const favoriteStatus = snippetMod.favoriteStatus ?? isFavorite;
  const { showNotif } = useNotif();

  const detectedLanguage = detectLanguage(code) || "plaintext";

  const worthExpanding = Boolean(tags) || Boolean(description);

  const snippetCategories = useMemo(() => {
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
  }, [selection.tags]);

  const copySnippet = () => {
    const now = Date.now();
    if (now - lastCopyTime >= 2000) {
      navigator.clipboard.writeText(code);
      showNotif("COPIED TO CLIPBOARD", "info", 3000);
      addCopy(selection.snippetID);
      updateSnippetMod(snippetID, {
        copyCount: (snippetMod.copyCount || 0) + 1,
      });
      setLastCopyTime(now);
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
        // showNotif("Removed Favorite", "success", 2000);
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

  useKeyboardControls({
    enter: (event) => {
      event.preventDefault();
      copySnippet();
    },
    arrowRight: (event) => {
      event.preventDefault();
      if (userProfile) {
        if (favoriteStatus) {
          handleRemoveFavorite();
        } else {
          handleAddFavorite();
        }
      }
    },
  });

  const fetchUserLists = async () => {
    if (userProfile) {
      setIsLoadingLists(true);
      try {
        const lists: ListWithSnippetStatus[] = (await getListsWithSnippetStatus(
          userProfile.id,
          snippetID,
        )) as ListWithSnippetStatus[];
        setUserLists(lists);
      } catch (error) {
        console.error("Failed to fetch user lists:", error);
        showNotif("Failed to load lists", "error", 2000);
      } finally {
        setIsLoadingLists(false);
      }
    }
  };

  const handleAddOrRemoveFromList = async (list: ListWithSnippetStatus) => {
    try {
      if (list.has_snippet) {
        await removeSnippetFromList(list.listid, snippetID);
        showNotif(
          `Removed ${selection.name} from ${list.listname}`,
          "success",
          2000,
        );
      } else {
        await addSnippetToList(list.listid, snippetID);
        showNotif(
          `Added ${selection.name} to ${list.listname}`,
          "success",
          2000,
        );
      }
      // Update the list status locally
      setUserLists((prevLists) =>
        prevLists.map((l) =>
          l.listid === list.listid ? { ...l, has_snippet: !l.has_snippet } : l,
        ),
      );
    } catch (error) {
      console.error("Failed to update snippet in list:", error);
      showNotif("Failed to update list" + error, "error", 2000);
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/snippet/${snippetID}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${name} on Snippp.io`,
          text: "Check out this code snippet :)",
          url: shareUrl,
        });
        console.log("Shared successfully");
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        showNotif("SNIPPET LINK COPIED", "info", 3000);
      } catch (err) {
        console.log("Error copying to clipboard:", err);
        alert("Unable to share. Please copy this link manually: " + shareUrl);
      }
    }
  };

  const handleDeleteSnippet = async () => {
    if (userProfile && userProfile.id === authorID) {
      try {
        setIsLoading(true);
        await deleteSnippet({
          snippetIDToDelete: selection.snippetID,
        });
        updateSnippetMod(snippetID, { isDeleted: true });
        showNotif("Snippet Deleted", "success", 2000);
      } catch (error) {
        console.error("Failed to delete snippet:", error);
        showNotif("Failed to delete snippet", "error", 2000);
      } finally {
        setIsLoading(false);
        setShowDeleteConfirm(false);
      }
    }
  };

  let darkMode = false;
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    darkMode = true;
  }

  const [selectedStyle, setSelectedStyle] = useState(darkMode ? monokai : vs);
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (event) => {
      setSelectedStyle(event.matches ? monokai : vs);
    });

  const simplifiedAndModdedCount = simplifyNumber(
    snippetMod.copyCount ? copyCount + snippetMod.copyCount : copyCount,
  );

  if (selection) {
    return (
      <div className="flex h-full w-full flex-col gap-3 bg-base-50 pt-0 lg:p-8 lg:pb-4 dark:bg-base-950 dark:text-base-50">
        <div className="flex h-fit w-fit flex-wrap gap-4">
          <div className="flex h-fit w-fit flex-col gap-2 rounded-sm bg-base-950 p-4 text-base-50 dark:bg-base-50 dark:text-base-950">
            <h1 className="text-3xl font-bold">{name}</h1>
            <div className="flex items-end justify-between gap-10">
              <a
                href={`/user/${authorID}`}
                className="text-xl font-thin"
              >
                {author}
              </a>
              <h1 className="text-sm font-thin">
                {createdAt ? formatPostgresDate(createdAt.toString()) : ""}
              </h1>
            </div>
          </div>
          <div className="mr-8 flex h-fit flex-col justify-between gap-3">
            {snippetCategories.length > 0 && (
              <div className="flex flex-nowrap gap-1 self-end">
                {snippetCategories.map((category, index) => (
                  <a
                    href={category.link}
                    key={index}
                    className="flex flex-wrap items-center justify-center text-nowrap rounded-sm bg-base-950 px-2 py-1 text-xs text-base-50 dark:bg-base-50 dark:text-base-950"
                  >
                    {category.name}
                  </a>
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
              className="group relative flex h-fit w-fit cursor-pointer items-center gap-2"
              onClick={copySnippet}
            >
              <div className="absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 whitespace-nowrap rounded-sm bg-base-700 px-3 py-2 text-sm text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:bg-base-100 dark:text-black">
                Times this snippet has been copied
                <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-base-800 dark:border-t-base-100"></div>
              </div>
              <img
                src="/copy.svg"
                className="invert dark:invert-0"
              />
              <span>{simplifiedAndModdedCount}</span>
            </span>
          </div>
        </div>
        {worthExpanding && (
          <div className="relative mt-4">
            <p
              className={`overflow-hidden font-thin transition-all duration-75 ${
                isDescriptionExpanded ? "max-h-none" : "max-h-[3em]"
              }`}
              dangerouslySetInnerHTML={{
                __html: formatDescription(description),
              }}
            ></p>
            {isDescriptionExpanded && tags && (
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
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
            >
              {isDescriptionExpanded ? "Show less" : "Show more"}
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
            customStyle={{
              background: "transparent",
              fontSize: codeFontSize,
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
        {selection && (
          <div
            id="controls"
            className="mb-3 flex items-center justify-start gap-5 p-2 lg:mb-0 lg:p-0"
          >
            <SnipppButton
              onClick={copySnippet}
              size="md"
              tooltip="Copy Snippet"
            >
              <img
                src="/copy.svg"
                className="h-5 invert group-hover:invert-0 lg:mx-10 dark:invert-0"
              />
            </SnipppButton>

            {userProfile && !favoriteStatus && (
              <SnipppButton
                onClick={handleAddFavorite}
                disabled={isLoading}
                colorType="add"
                fit={true}
                size="md"
                tooltip="Add/Remove Favorite"
              >
                <span className="flex items-center">
                  <img
                    src="/heart-empty.svg"
                    className="h-5 group-hover:invert dark:invert"
                  />
                  <span className="hidden text-sm font-normal sm:inline">
                    {isLoading ? "ADDING..." : ""}
                  </span>
                </span>
              </SnipppButton>
            )}
            {userProfile && favoriteStatus && (
              <SnipppButton
                onClick={handleRemoveFavorite}
                disabled={isLoading}
                colorType="delete"
                fit={true}
                size="md"
                tooltip="Add/Remove Favorite"
              >
                <span className="flex items-center">
                  <img
                    src="/heart-full.svg"
                    className="h-5 group-hover:invert dark:invert"
                  />
                  <span className="hidden text-sm font-normal sm:inline">
                    {isLoading ? "REMOVING..." : ""}
                  </span>
                </span>
              </SnipppButton>
            )}

            {userProfile && (
              <SnipppButton
                onClick={() => {
                  setShowListPopup(true);
                  fetchUserLists();
                }}
                colorType="neutral"
                size="md"
                tooltip="Add to List"
              >
                <img
                  src="/folder.svg"
                  className="h-5 invert group-hover:invert-0 dark:invert-0"
                />
              </SnipppButton>
            )}
            <SnipppButton
              onClick={handleShare}
              colorType="neutral"
              size="md"
              tooltip="Share snippet"
            >
              <img
                src="/share.svg"
                className="h-5 invert group-hover:invert-0 dark:invert-0"
              />
            </SnipppButton>

            <div className="mr-auto"></div>
            {userProfile && userProfile.id === authorID && (
              <>
                <SnipppButton
                  onClick={() =>
                    (window.location.href = `/builder/${selection.snippetID}`)
                  }
                  colorType="neutral"
                  size="md"
                  className="ml-auto"
                  tooltip="Edit Snippet"
                >
                  <span className="flex items-center gap-3">
                    <img
                      src="/edit.svg"
                      className="h-5 group-hover:invert dark:invert"
                    />
                    <span className="hidden 2xl:inline">EDIT</span>
                  </span>
                </SnipppButton>
                <SnipppButton
                  onClick={() => setShowDeleteConfirm(true)}
                  colorType="delete"
                  size="md"
                  tooltip="Delete Snippet"
                >
                  <span className="flex items-center gap-3">
                    <img
                      src="/trash.svg"
                      className="h-5 invert group-hover:invert-0 dark:invert-0"
                    />
                    <span className="hidden 2xl:inline">DELETE</span>
                  </span>
                </SnipppButton>
              </>
            )}
          </div>
        )}
        {showDeleteConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="rounded-sm bg-white p-6 dark:bg-base-800">
              <h2 className="mb-4 text-xl">
                Are you sure you want to delete this snippet?
              </h2>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="rounded-sm bg-gray-300 px-4 py-2 hover:bg-gray-400 dark:bg-base-700 dark:hover:bg-base-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteSnippet}
                  className="rounded-sm bg-red-600 px-4 py-2 text-white hover:bg-red-800"
                  disabled={isLoading}
                >
                  {isLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
        {showListPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md rounded-sm bg-white p-6 dark:bg-base-850">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold dark:text-white">
                  ADD TO LIST
                </h2>
                <button
                  onClick={() => setShowListPopup(false)}
                  className="bg-base-150 hover:invert"
                >
                  <img
                    src="/x.svg"
                    className="h-6 w-6 invert"
                  />
                </button>
              </div>
              {isLoadingLists ?
                <p className="mb-4 dark:text-base-200">Loading lists...</p>
              : <div className="mb-4 max-h-[40svh]">
                  {userLists.length > 0 ?
                    userLists.map((list) => (
                      <button
                        key={list.listid}
                        onClick={() => handleAddOrRemoveFromList(list)}
                        className={`mb-2 flex w-full items-center justify-between rounded-sm p-2 text-left ${
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
                    ))
                  : <p className="dark:text-base-200">No lists available.</p>}
                </div>
              }
            </div>
          </div>
        )}
      </div>
    );
  } else {
    return <div>NO SNIPPET SELECTED</div>;
  }
};