import { GoogleUser, Snippet } from "../typeInterfaces";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { monokai, xcode } from "react-syntax-highlighter/dist/esm/styles/hljs";
import javascript from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import python from "react-syntax-highlighter/dist/esm/languages/hljs/python";
import glsl from "react-syntax-highlighter/dist/esm/languages/hljs/glsl";

import { useState } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";
import { removeSnippetFromFavorites } from "../backend/deleteFavorite";
import { addSnippetToFavorites } from "../backend/addFavorite";
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("glsl", glsl);

console.log(python);

import { useNotif } from "../hooks/Notif";
// import CodeBlock from "./CodeBlock";

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
          {/* <CodeBlock
            code={code}
            theme={selectedStyle as "monokai" | "xcode"}
          /> */}
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
            )}
          </div>
        )}
      </div>
    );
  } else {
    return <div>NO SNIPPET SELECTED</div>;
  }
};
