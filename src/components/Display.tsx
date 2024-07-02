import { GoogleUser, Snippet } from "../typeInterfaces";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { monokai, xcode } from "react-syntax-highlighter/dist/esm/styles/hljs";
import javascript from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import python from "react-syntax-highlighter/dist/esm/languages/hljs/python";
import { useState } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("python", python);

export const Display = ({ selection }: { selection: Snippet }) => {
  const [userProfile] = useLocalStorage<GoogleUser | null>("userProfile", null);
  const { name, author, code, authorID } = selection;
  let darkMode = false;
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    // dark mode
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
        <div className="rounded-xs h-full w-full border border-dashed border-base-200 p-4 text-sm dark:border-base-800">
          <SyntaxHighlighter
            language={javascript}
            style={selectedStyle}
            customStyle={{
              background: "transparent",
              fontSize: "10",
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
        <div
          id="controls"
          className="flex items-center justify-start gap-5"
        >
          <button className="bg-base-150 flex items-center gap-3 rounded-sm border p-2 hover:bg-base-200 dark:border-base-800 dark:bg-base-900 dark:text-base-50 dark:hover:bg-base-800">
            <img
              src="heart-full.svg"
              className="h-5 dark:invert"
            />
            ADD FAVORITE
          </button>
          {userProfile && userProfile.id == authorID && (
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
      </div>
    );
  } else {
    return <div>NO SNIPPET SELECTED</div>;
  }
};
