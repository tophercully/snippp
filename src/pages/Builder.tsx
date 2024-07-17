import { useEffect, useState } from "react";
import { GoogleUser, Snippet, SnippetInBuilder } from "../typeInterfaces";
import { newSnippet } from "../backend/snippet/newSnippet";
import Editor from "@monaco-editor/react";
import { useLocalStorage } from "@uidotdev/usehooks";
import { Navbar } from "../components/nav/Navbar";
import { Footer } from "../components/nav/Footer";
import { useNavigate, useParams } from "react-router-dom";
import { loadSnippetById } from "../backend/loader/loadSnippetByID";
import { updateSnippet } from "../backend/snippet/editSnippet";
import { useNotif } from "../hooks/Notif";
import {
  categorizeLanguage,
  determineCategories,
} from "../utils/categoryTools";
import { CategoryInfo } from "../utils/categories";
import { detectLanguage } from "../utils/detectLanguage";
import { track } from "@vercel/analytics";
import { LoadingSpinner } from "../components/LoadingSpinner";

export const Builder = () => {
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryInfo[] | undefined>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDisallowed, setIsDisallowed] = useState(false);

  const { snippetId } = useParams();
  if (snippetId) {
    document.title = `Editor - Snippp`;
  } else {
    document.title = `Builder - Snippp`;
  }
  const isEditing = Boolean(snippetId);
  const [userProfile] = useLocalStorage<GoogleUser | null>("userProfile", null);

  const [snippet, setSnippet] = useState<SnippetInBuilder | Snippet>({
    authorID: "",
    author: "",
    name: "",
    code: "",
    description: "",
    tags: "",
    public: true,
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
        setIsLoading(true);
        try {
          const fetchedSnippet = await loadSnippetById(Number(snippetId));
          if (fetchedSnippet.authorID == userProfile?.id) {
            setSnippet(fetchedSnippet as Snippet);
          } else {
            setIsDisallowed(true);
          }
        } catch (error) {
          console.error("Error loading snippet:", error);
          showNotif("Error loading snippet", "error");
        } finally {
          setIsLoading(false);
        }
      };
      loadSnippet();
    }
  }, [isEditing, snippetId]);

  useEffect(() => {
    const langCategory = categorizeLanguage(
      detectLanguage(snippet.code) as string,
    );
    const finalCategories = determineCategories(snippet.tags, langCategory);
    if (finalCategories.length > 0) {
      setCategories(finalCategories);
    }
  }, [snippet.tags, snippet.code]);

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
    if (snippet.code && snippet.name) {
      if (userProfile) {
        if (isCreator) {
          try {
            // Assign autodetected language tag if not already present
            const detectedLang = detectLanguage(snippet.code);
            const detectedCategory = categorizeLanguage(detectedLang);

            const tagsArray = snippet.tags.split(",").map((tag) => tag.trim());

            // Check if any existing tag is a known language category
            const hasLanguageTag = tagsArray.some(
              (tag) => categorizeLanguage(tag) !== "unknown",
            );

            let updatedTags = snippet.tags;
            let detectedLanguageUsed = false;

            // Only add detected language if no language tag exists
            if (detectedCategory !== "unknown" && !hasLanguageTag) {
              updatedTags =
                snippet.tags ?
                  `${snippet.tags}, ${detectedCategory}`
                : detectedCategory;
              detectedLanguageUsed = true;
            }

            // Track if detected language was used
            if (detectedLanguageUsed) {
              track("Language Auto-Detected");
            }

            if (isEditing) {
              await updateSnippet(Number(snippetId), {
                name: snippet.name,
                code: snippet.code,
                description: snippet.description,
                tags: updatedTags,
                public: snippet.public,
              });
              showNotif("Snippet updated successfully", "success", 10000);
              navigate(`/snippet/${snippetId}`);
            } else {
              const result = await newSnippet({
                ...snippet,
                author: userProfile.name,
                authorID: userProfile.id,
                tags: updatedTags,
              });
              showNotif("Snippet created successfully", "success", 10000);
              navigate(`/snippet/${result.snippetID}`);
            }
          } catch (error) {
            showNotif("An error occurred while saving the snippet", "error");
            console.error(error);
          }
        } else {
          showNotif(`YOU ARE NOT THE AUTHOR`, "error");
        }
      } else {
        showNotif("Snippet missing Name or Content", "error");
      }
    }
  };

  return (
    <div className="flex h-fit min-h-svh w-full flex-col bg-base-100 p-10 pt-24 xl:h-svh dark:bg-base-900">
      <Navbar />
      {userProfile && !isDisallowed && (
        <div className="mb-8 flex h-full w-full flex-col-reverse gap-3 xl:flex-row">
          {isLoading ?
            <div className="flex h-full w-full items-center justify-center">
              <LoadingSpinner />
            </div>
          : <>
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
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-base-300 dark:text-base-50">
                    TAGS, COMMA SEPARATED
                  </p>
                  <input
                    className="w-full rounded-sm bg-base-50 p-4 shadow-md focus:outline-none dark:bg-base-800 dark:text-base-50 dark:shadow-sm dark:shadow-base-600"
                    name="tags"
                    value={snippet.tags}
                    onChange={handleChange}
                  />
                  <p className="text-sm text-base-300 dark:text-base-50">
                    THIS SNIPPET WILL BE ASSIGNED TO THESE CATEGORIES:
                  </p>
                  {categories && categories.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {categories.map((category, index) => (
                        <span
                          key={index}
                          className="group relative flex h-8 items-center rounded-sm bg-base-950 px-2 py-1 text-xs text-base-50 dark:bg-base-50 dark:text-base-950"
                        >
                          {category.autoDetected &&
                            category.kind === "language" && (
                              <img
                                src="/auto-sparkle.svg"
                                className="mr-1 dark:invert"
                              />
                            )}
                          {category.name}
                          {category.autoDetected &&
                            category.kind === "language" && (
                              <span className="invisible absolute left-1/2 right-1/2 top-full mx-auto mt-2 w-max max-w-xs -translate-x-1/2 transform rounded-sm bg-base-950 p-3 text-xs text-base-50 group-hover:visible dark:invert">
                                Language autodetected, you can overwrite this by
                                entering the correct language into the tags
                              </span>
                            )}
                        </span>
                      ))}
                    </div>
                  )}
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
                        className="relative block aspect-square min-h-[3.75rem] cursor-pointer overflow-hidden rounded-sm bg-red-600 before:absolute before:inset-0 before:-translate-x-[110%] before:bg-blue-700 before:transition-transform before:duration-75 before:content-[''] peer-checked:before:translate-x-0 dark:border-base-600"
                      >
                        <img
                          src={snippet.public ? "/public.svg" : "/private.svg"}
                          alt="Lock"
                          className={`absolute inset-0 h-full w-full p-4 ${
                            snippet.public ? "invert-0" : "invert"
                          } object-cover dark:invert-0`}
                        />
                      </label>
                      <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 transform opacity-0 transition-opacity duration-75 group-hover:opacity-100">
                        <div className="relative w-fit text-nowrap rounded-sm bg-gray-800 px-2 py-1 text-xs text-white">
                          Toggle Privacy
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
                    disabled={!snippet.name || !snippet.code}
                    className="group relative w-1/2 self-center overflow-hidden rounded-sm p-4 text-base-950 shadow-md duration-75 hover:cursor-pointer hover:text-base-50 disabled:invert-[45%] dark:bg-base-800 dark:text-base-50 dark:shadow-sm dark:shadow-base-600"
                  >
                    <div
                      className={`${
                        isCreator ? "bg-blue-700" : "bg-red-600"
                      } absolute inset-0 -translate-x-[110%] transform transition-transform duration-75 ease-in-out group-hover:translate-x-0`}
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
            </>
          }
        </div>
      )}
      {isDisallowed && (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4">
          <h1 className="flex gap-4 bg-red-600 p-4 text-base-50">
            SNIPPET NOT AVAILABLE
            <img src="/lock.svg" />
          </h1>
          <a
            href="/"
            className="text-semibold bg-base-950 p-2 text-sm text-base-50 underline decoration-dashed underline-offset-4 dark:bg-base-50 dark:text-base-950"
          >
            Return to Home
          </a>
        </div>
      )}
      {!userProfile && (
        <div className="mb-8 flex h-full w-full flex-col items-center justify-center gap-3">
          <h1 className="bg-red-500 p-5 text-2xl text-base-50">{`Please sign in to ${
            isEditing ? "edit" : "create"
          }`}</h1>
        </div>
      )}

      <div className={userProfile ? "mt-auto" : "justify-self-end"}>
        <Footer />
      </div>
    </div>
  );
};
