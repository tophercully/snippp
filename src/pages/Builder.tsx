import { useEffect, useState } from "react";
import { GoogleUser, Snippet } from "../typeInterfaces";
import { newSnippet } from "../backend/newSnippet";
import Editor from "@monaco-editor/react";
import { useLocalStorage } from "@uidotdev/usehooks";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useSearchParams } from "react-router-dom";
import { loadSnippetById } from "../backend/loadSnippetByID";
import { updateSnippet } from "../backend/editSnippet";
import { usePopup } from "../components/Popup";

export const Builder = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  const snippetId = searchParams.get("snippetid");
  const isEditing = Boolean(snippetId);
  const [userProfile] = useLocalStorage<GoogleUser | null>("userProfile", null);
  const [snippet, setSnippet] = useState<Snippet>({
    name: "",
    code: "",
    tags: "",
    author: "",
    authorID: "",
    favoriteCount: 0,
    isFavorite: false,
  });
  const { showPopup } = usePopup();

  let darkMode = false;
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    // dark mode
    darkMode = true;
  }
  const [selectedStyle, setSelectedStyle] = useState(
    darkMode ? "vs-dark" : "vs-light",
  );
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (event) => {
      setSelectedStyle(event.matches ? "vs-dark" : "vs-light");
    });

  useEffect(() => {
    if (isEditing && snippetId) {
      const loadSnippet = async () => {
        const fetchedSnippet = await loadSnippetById(Number(snippetId));
        setSnippet(fetchedSnippet);
      };
      loadSnippet();
    }
  }, [isEditing, snippetId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (message) {
      setMessage(null);
    }
    setSnippet((prevSnippet) => ({
      ...prevSnippet,
      [name]: value,
    }));
  };

  const handleCodeChange = (value: string | undefined) => {
    if (message) {
      setMessage(null);
    }
    setSnippet((prevSnippet) => ({
      ...prevSnippet,
      code: value ?? "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (userProfile) {
      try {
        if (isEditing) {
          await updateSnippet(Number(snippetId), {
            name: snippet.name,
            code: snippet.code,
            tags: snippet.tags,
          });
          showPopup("Snippet updated successfully", "success", 10000);
        } else {
          await newSnippet({
            params: {
              ...snippet,
              author: userProfile.name,
              authorID: userProfile.id,
            },
          });
          showPopup("Snippet created successfully", "success", 10000);
        }
      } catch (error) {
        showPopup("An error occurred while saving the snippet", "error");
        console.error(error);
      }
    }
  };

  return (
    <div className="flex h-svh w-full flex-col bg-base-100 p-10 pt-24 dark:bg-base-900">
      <Navbar />
      {userProfile && (
        <div className="mb-8 flex h-full w-full gap-3">
          <div className="flex h-full w-full shadow-md">
            <Editor
              height="100%"
              value={snippet.code}
              width="100%"
              options={{
                scrollBeyondLastLine: true,
                fontSize: 15,
                padding: {
                  top: 30,
                },
              }}
              theme={selectedStyle}
              defaultLanguage="javascript"
              //   defaultValue={snippet.code}
              onChange={handleCodeChange}
            />
          </div>
          <form className="flex h-full w-1/3 flex-col gap-5 rounded-sm align-bottom">
            <div className="flex flex-col">
              <p className="text-sm text-base-300 dark:text-base-700">
                NAME YOUR SNIPPET
              </p>
              <input
                className="w-full bg-base-50 p-4 shadow-md dark:bg-base-800 dark:text-base-50 dark:shadow-sm dark:shadow-base-600"
                placeholder="Name"
                name="name"
                value={snippet.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <p className="text-sm text-base-300 dark:text-base-700">
                TAGS, COMMA SEPARATED
              </p>
              <input
                className="w-full rounded-sm bg-base-50 p-4 shadow-md dark:bg-base-800 dark:text-base-50 dark:shadow-sm dark:shadow-base-600"
                placeholder="Tags"
                name="tags"
                value={snippet.tags}
                onChange={handleChange}
              />
            </div>
            <button
              onClick={handleSubmit}
              className="group relative ml-auto mt-auto w-1/2 overflow-hidden rounded-sm p-4 text-base-950 shadow-md duration-200 hover:text-base-50 dark:bg-base-800 dark:text-base-50 dark:shadow-sm dark:shadow-base-600"
            >
              <div
                className="absolute inset-0 -translate-x-full transform bg-blue-700 transition-transform duration-300 ease-in-out group-hover:translate-x-0"
                aria-hidden="true"
              />
              <span className="relative z-10 text-xl font-bold">
                {isEditing ? "SAVE" : "CREATE"}
              </span>
            </button>
          </form>
        </div>
      )}
      {!userProfile && (
        <div className="mb-8 flex h-full w-full flex-col items-center justify-center gap-3">
          <h1 className="bg-red-500 p-5 text-2xl text-base-50">{`Please sign in to ${isEditing ? "edit" : "create"}`}</h1>
        </div>
      )}

      <div className={userProfile ? "mt-auto" : "justify-self-end"}>
        <Footer />
      </div>
    </div>
  );
};
