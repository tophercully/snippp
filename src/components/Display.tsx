import { GoogleUser, Snippet } from "../typeInterfaces";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { monokai, xcode } from "react-syntax-highlighter/dist/esm/styles/hljs";
import javascript from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import python from "react-syntax-highlighter/dist/esm/languages/hljs/python";
import glsl from "react-syntax-highlighter/dist/esm/languages/hljs/glsl";
import { deleteSnippet } from "../backend/deleteSnippet";
import { useState } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";
import { removeSnippetFromFavorites } from "../backend/deleteFavorite";
import { addSnippetToFavorites } from "../backend/addFavorite";
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("glsl", glsl);

import { useNotif } from "../hooks/Notif";

export const Display = ({
  selection,
  updateFavorites,
  favoriteMods,
}: {
  selection: Snippet;
  updateFavorites: (id: number, isFavorite: boolean) => void;
  favoriteMods: { [snippetID: number]: number };
}) => {
  const [userProfile] = useLocalStorage<GoogleUser | null>("userProfile", null);
  const { snippetID, name, author, code, authorID, isFavorite } = selection;
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const favoriteStatus = (() => {
    if (favoriteMods[snippetID as number] !== undefined) {
      return favoriteMods[snippetID as number] > 0;
    }
    return isFavorite;
  })();
  const { showNotif } = useNotif();

  const copySnippet = () => {
    navigator.clipboard.writeText(code);
    showNotif("COPIED TO CLIPBOARD", "info", 3000);
  };

  const addFavorite = async (
    userID: string,
    snippetID: number,
    updateFavorites: (id: number, isFavorite: boolean) => void,
  ) => {
    try {
      await addSnippetToFavorites({
        userID: userID,
        snippetIDToAdd: snippetID,
      });
      updateFavorites(snippetID, true); // Only update local state if the server request succeeds
      showNotif("Added Favorite", "success", 2000);
    } catch (error) {
      console.error("Failed to add favorite:", error);
    }
  };

  const removeFavorite = async (
    userID: string,
    snippetID: number,
    updateFavorites: (id: number, isFavorite: boolean) => void,
  ) => {
    try {
      await removeSnippetFromFavorites({
        userID: userID,
        snippetIDToRemove: snippetID,
      });
      showNotif("Deleted Favorite", "success", 2000);
      updateFavorites(snippetID, false); // Only update local state if the server request succeeds
    } catch (error) {
      console.error("Failed to remove favorite:", error);
    }
  };
  const handleAddFavorite = async () => {
    if (userProfile) {
      setIsLoading(true);
      await addFavorite(userProfile.id, snippetID as number, updateFavorites);
      setIsLoading(false);
    }
  };

  const handleRemoveFavorite = async () => {
    if (userProfile) {
      setIsLoading(true);
      await removeFavorite(
        userProfile.id,
        snippetID as number,
        updateFavorites,
      );
      setIsLoading(false);
    }
  };

  const handleDeleteSnippet = async () => {
    if (userProfile && userProfile.id === authorID) {
      try {
        setIsLoading(true);
        // Replace this with your actual delete API call
        await deleteSnippet({
          snippetIDToDelete: selection.snippetID as number,
        });
        showNotif("Snippet deleted successfully", "success", 2000);
        // You might want to redirect the user or update the UI here
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

  const [selectedStyle, setSelectedStyle] = useState(
    darkMode ? monokai : xcode,
  );
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (event) => {
      setSelectedStyle(event.matches ? monokai : xcode);
    });

  if (selection) {
    return (
      <div className="flex h-full w-full flex-col gap-3 bg-base-50 p-8 pt-0 dark:bg-base-950 dark:text-base-50">
        <div className="h-fit w-fit rounded-sm bg-base-950 p-4 text-base-50 dark:bg-base-50 dark:text-base-950">
          <h1 className="text-3xl font-bold">{name}</h1>
          <h1 className="text-xl font-thin">{author}</h1>
        </div>
        <div
          onClick={copySnippet}
          className="rounded-xs group relative h-full w-full border border-dashed border-base-200 p-4 text-sm duration-200 hover:cursor-pointer dark:border-base-800"
        >
          <div className="absolute inset-0 flex items-center justify-center opacity-0 backdrop-blur-[1px] backdrop-filter transition-opacity duration-200 active:backdrop-blur-[2px] group-hover:opacity-100">
            <span className="rounded-sm bg-black bg-opacity-50 px-2 py-1 text-base-50 dark:bg-base-50 dark:text-base-950">
              CLICK TO COPY
            </span>
          </div>
          <SyntaxHighlighter
            // language={javascript}
            style={selectedStyle}
            customStyle={{
              background: "transparent",
              fontSize: "10",
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
        {userProfile && selection && (
          <div
            id="controls"
            className="flex items-center justify-start gap-5"
          >
            {!favoriteStatus && (
              <button
                className="bg-base-150 flex items-center gap-3 rounded-sm border p-2 hover:bg-base-200 dark:border-base-800 dark:bg-base-900 dark:text-base-50 dark:hover:bg-base-800"
                onClick={handleAddFavorite}
                disabled={isLoading}
              >
                <img
                  src="heart-empty.svg"
                  className="h-5 dark:invert"
                />
                {isLoading ? "ADDING..." : "ADD FAVORITE"}
              </button>
            )}
            {favoriteStatus && (
              <button
                className="bg-base-150 flex items-center gap-3 rounded-sm border p-2 hover:bg-base-200 dark:border-base-800 dark:bg-base-900 dark:text-base-50 dark:hover:bg-base-800"
                onClick={handleRemoveFavorite}
                disabled={isLoading}
              >
                <img
                  src="heart-full.svg"
                  className="h-5 dark:invert"
                />
                {isLoading ? "REMOVING..." : "REMOVE FAVORITE"}
              </button>
            )}
            {userProfile && userProfile.id === authorID && (
              <>
                <a
                  href={`/builder?snippetid=${selection.snippetID}`}
                  className="bg-base-150 flex items-center gap-3 rounded-sm border p-2 hover:bg-base-200 dark:border-base-800 dark:bg-base-900 dark:text-base-50 dark:hover:bg-base-800"
                >
                  <img
                    src="edit.svg"
                    className="h-5 dark:invert"
                  />
                  EDIT SNIPPET
                </a>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="group relative overflow-hidden rounded-sm border p-2 text-base-950 duration-200 hover:text-base-50 dark:border-base-800 dark:bg-base-900 dark:text-base-50"
                >
                  <div
                    className="absolute inset-0 -translate-x-full transform bg-red-600 transition-transform duration-300 ease-in-out group-hover:translate-x-0"
                    aria-hidden="true"
                  />
                  <span className="relative z-10 flex items-center gap-3">
                    <img
                      src="delete.svg"
                      className="h-5 dark:invert"
                    />
                    <span className="">DELETE SNIPPET</span>
                  </span>
                </button>
              </>
            )}
          </div>
        )}
        {showDeleteConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="rounded-lg bg-white p-6 dark:bg-base-800">
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
      </div>
    );
  } else {
    return <div>NO SNIPPET SELECTED</div>;
  }
};
