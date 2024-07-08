import { useEffect, useState } from "react";
import { GoogleUser, Snippet, SnippetInBuilder } from "../typeInterfaces";
import { newSnippet } from "../backend/snippet/newSnippet";
import Editor from "@monaco-editor/react";
import { useLocalStorage } from "@uidotdev/usehooks";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useSearchParams } from "react-router-dom";
import { loadSnippetById } from "../backend/loader/loadSnippetByID";
import { updateSnippet } from "../backend/snippet/editSnippet";
import { useNotif } from "../hooks/Notif";

export const Builder = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  const snippetId = searchParams.get("snippetid");
  const isEditing = Boolean(snippetId);
  const [userProfile] = useLocalStorage<GoogleUser | null>("userProfile", null);

  const [snippet, setSnippet] = useState<SnippetInBuilder | Snippet>({
    authorID: "",
    author: "",
    name: "",
    code: "",
    description: "",
    tags: "",
    public: false,
  } as SnippetInBuilder);
  const { showNotif } = useNotif();

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

  const isCreator =
    isEditing ?
      userProfile ?
        userProfile.id == snippet.authorID ?
          true
        : false
      : false
    : true;
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (event) => {
      setSelectedStyle(event.matches ? "vs-dark" : "vs-light");
    });

  useEffect(() => {
    if (isEditing && snippetId) {
      const loadSnippet = async () => {
        const fetchedSnippet = await loadSnippetById(Number(snippetId));
        console.log(fetchedSnippet);
        setSnippet(fetchedSnippet as Snippet);
      };
      loadSnippet();
    }
  }, [isEditing, snippetId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
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

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSnippet((prevSnippet) => ({
      ...prevSnippet,
      public: e.target.checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (userProfile) {
      if (isCreator) {
        try {
          if (isEditing) {
            await updateSnippet(Number(snippetId), {
              name: snippet.name,
              code: snippet.code,
              description: snippet.description,
              tags: snippet.tags,
              public: snippet.public,
            });
            showNotif("Snippet updated successfully", "success", 10000);
          } else {
            console.log({
              ...snippet,
              author: userProfile.name,
              authorID: userProfile.id,
            });
            await newSnippet({
              ...snippet,
              author: userProfile.name,
              authorID: userProfile.id,
            });
            showNotif("Snippet created successfully", "success", 10000);
          }
        } catch (error) {
          showNotif("An error occurred while saving the snippet", "error");
          console.error(error);
        }
      } else {
        showNotif(`YOU ARE NOT THE AUTHOR`, "error");
      }
    }
  };

  return (
    <div className="flex h-fit min-h-svh w-full flex-col bg-base-100 p-10 pt-24 xl:h-svh dark:bg-base-900">
      <Navbar />
      {userProfile && (
        <div className="mb-8 flex h-full w-full flex-col-reverse gap-3 xl:flex-row">
          <form className="flex h-full flex-col gap-5 rounded-sm xl:w-1/3">
            <div className="flex flex-col">
              <p className="text-sm text-base-300 dark:text-base-50">
                NAME YOUR SNIPPET
              </p>
              <input
                className="w-full bg-base-50 p-4 shadow-md focus:outline-none dark:bg-base-800 dark:text-base-50 dark:shadow-sm dark:shadow-base-600"
                name="name"
                value={snippet.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <p className="text-sm text-base-300 dark:text-base-50">
                DESCRIPTION
              </p>
              <textarea
                className="h-[30svh] w-full resize-none rounded-sm bg-base-50 p-4 shadow-md focus:outline-none dark:bg-base-800 dark:text-base-50 dark:shadow-sm dark:shadow-base-600"
                name="description"
                value={snippet.description}
                onChange={handleChange}
              />
            </div>
            <div>
              <p className="text-sm text-base-300 dark:text-base-50">
                TAGS, COMMA SEPARATED
              </p>
              <input
                className="w-full rounded-sm bg-base-50 p-4 shadow-md focus:outline-none dark:bg-base-800 dark:text-base-50 dark:shadow-sm dark:shadow-base-600"
                name="tags"
                value={snippet.tags}
                onChange={handleChange}
              />
            </div>
            <div className="mt-auto flex w-full items-center justify-end gap-4">
              <div className="flex h-full w-fit items-center self-center">
                <div className="group relative flex h-full items-center shadow-md">
                  <input
                    type="checkbox"
                    id="public"
                    checked={snippet.public}
                    onChange={handleCheckboxChange}
                    className="peer sr-only"
                  />
                  <label
                    htmlFor="public"
                    className="dark:bg-base-850 relative block aspect-square h-full cursor-pointer overflow-hidden rounded-sm bg-base-150 before:absolute before:inset-0 before:-translate-x-[110%] before:bg-blue-700 before:transition-transform before:duration-300 before:content-[''] peer-checked:before:translate-x-0 dark:border-base-600"
                  >
                    <img
                      src={snippet.public ? "/lock-open.svg" : "/lock.svg"}
                      alt="Lock"
                      className={`absolute inset-0 h-full w-full p-4 ${snippet.public ? "invert-0" : "invert"} object-cover dark:invert-0`}
                    />
                  </label>
                  <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 transform opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="relative w-fit text-nowrap rounded-sm bg-gray-800 px-2 py-1 text-xs text-white">
                      {snippet.public ?
                        "Snippet is Public"
                      : "Snippet is Private"}
                      <svg
                        className="absolute left-0 top-full h-2 w-full text-gray-800"
                        x="0px"
                        y="0px"
                        viewBox="0 0 255 255"
                        xmlSpace="preserve"
                      >
                        <polygon
                          className="fill-current"
                          points="0,0 127.5,127.5 255,0"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={handleSubmit}
                className="group relative w-1/2 self-center overflow-hidden rounded-sm p-4 text-base-950 shadow-md duration-200 hover:cursor-pointer hover:text-base-50 dark:bg-base-800 dark:text-base-50 dark:shadow-sm dark:shadow-base-600"
              >
                <div
                  className={`${isCreator ? "bg-blue-700" : "bg-red-600"} absolute inset-0 -translate-x-[110%] transform transition-transform duration-300 ease-in-out group-hover:translate-x-0`}
                  aria-hidden="true"
                />
                <span className="relative z-10 text-xl font-bold">
                  {isEditing ?
                    isCreator ?
                      "SAVE"
                    : "YOU ARE NOT THE AUTHOR"
                  : "CREATE"}
                </span>
              </button>
            </div>
          </form>
          <div className="flex h-[70svh] w-full shadow-md xl:h-full xl:w-2/3">
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
              defaultLanguage="auto"
              onChange={handleCodeChange}
            />
          </div>
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
