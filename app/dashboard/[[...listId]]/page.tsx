"use client";

import { Navbar } from "@/app/src/components/nav/Navbar";
import { useUser } from "@/app/src/contexts/UserContext";
import { ListData, Snippet, SnippetMod } from "@/app/src/types/typeInterfaces";
import { signal } from "@preact-signals/safe-react";
import { useMemo } from "@preact-signals/safe-react/react";
import useCookie from "@/app/src/hooks/useCookie";
import { useNotif } from "@/app/src/contexts/NotificationContext";
import api from "@/app/src/backend/api";
import { SnippetExplorer } from "@/app/src/components/dashboard/SnippetExplorer";
import ListExplorer from "@/app/src/components/dashboard/ListExplorer";
import { Display } from "@/app/src/components/browser/Display";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { Footer } from "@/app/src/components/nav/Footer";
export const runtime = "edge";

type SnippetMods = { [snippetID: number]: SnippetMod };

const snippets = signal<Snippet[]>([]);
const snippetMods = signal<SnippetMods>({});
const selection = signal<Snippet | null>(null);
const listsLoading = signal<boolean>(false);
const snippetsLoading = signal<boolean>(false);

const Dashboard = () => {
  const { listId } = useParams();
  const listIdValue = listId ? listId[0] : null;
  console.log("listid", listIdValue);
  const { userProfile } = useUser();
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
  const { showNotif } = useNotif();
  // const [isAdding] = useCookie("isAddingList", false);
  // const [isEditing, setIsEditing] = useCookie("isEditingList", false);
  const [lists, setLists] = useCookie<ListData[]>(
    "dashboardCachedLists",
    defaultLists,
  );
  console.log("lists", lists);
  const list = lists.find((a) => a.listid == listIdValue);
  console.log("list", list);
  console.log(
    `looking for a list with id ${listIdValue} in lists. found ${list}`,
  );
  const [lastFetchTime, setLastFetchTime] = useCookie<number>(
    "lastListsFetchTime",
    0,
  );

  const fetchAndSetLists = async () => {
    const currentTime = Date.now();
    const cacheExpiration = 5 * 60 * 1000; // 5 minutes

    if (
      currentTime - lastFetchTime > cacheExpiration ||
      lists.length === defaultLists.length
    ) {
      try {
        listsLoading.value = true;
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
        listsLoading.value = false;
      }
    } else {
      console.log("Using cached lists");
    }
  };
  useEffect(() => {
    fetchAndSetLists();
    if (listIdValue) {
      console.log("listId present, fetching snippets");
      fetchSnippets();
    } else {
      console.log("listId not present, not fetching snippets");
    }
  }, [userProfile]);

  const forceFetchAndSetLists = async () => {
    const currentTime = Date.now();
    {
      try {
        listsLoading.value = true;
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
        listsLoading.value = false;
      }
    }
  };

  const fetchSnippets = async () => {
    console.log("fetchSnippets");
    if (userProfile && userProfile.id) {
      console.log("User profile found");
      snippetsLoading.value = true;
      let result: Snippet[] = [];
      if (listIdValue) {
        console.log(`List found: ${listIdValue}`);
        if (listIdValue === "mysnippets") {
          try {
            console.log("Fetching user snippets");
            result = await api.snippets.loadByUserId(
              userProfile.id,
              userProfile.id,
            );
          } catch (error) {
            console.error("Error fetching snippets:", error);
            showNotif("Error fetching snippets:" + error, "error");
          }
        } else if (listIdValue === "favorites") {
          try {
            console.log("Fetching favorites");
            result = await api.snippets.loadFavorites({
              userID: userProfile.id,
            });
          } catch (error) {
            console.error("Error fetching favorites:", error);
            showNotif("Error fetching favorites:" + error, "error");
          }
        } else {
          try {
            console.log(`Fetching list snippets for ${listIdValue}`);
            result = await api.snippets.loadByListId(
              Number(listIdValue) as number,
            );
            console.log(`Loaded ${result.length} snippets`);
          } catch (error) {
            console.error("Error fetching snippets:", error);
            showNotif("Error fetching snippets:" + error, "error");
          }
        }
      } else {
        console.error("List not found");
      }
      if (Array.isArray(result)) {
        const snippetsArray = result as Snippet[];
        console.log(`Setting snippets to ${snippetsArray.length} snippets`);
        if (
          snippetsArray.length !== snippets.value.length ||
          !snippetsArray.every(
            (val, index) => val.snippetID === snippets.value[index]?.snippetID,
          )
        ) {
          snippets.value = snippetsArray;
          snippetMods.value = {}; // Reset snippet mods when snippets change
        }
      } else {
        console.error(
          "Unexpected result type from loadUserSnippets or loadFavorites",
        );
        snippets.value = [];
      }
      snippetsLoading.value = false;
    }
  };

  const updateSnippetMod = (id: number, mod: Partial<SnippetMod>) => {
    snippetMods.value = {
      ...snippetMods.peek(),
      [id]: { ...snippetMods.peek()[id], ...mod },
    };
  };

  console.log(snippets.value);

  return (
    <div className="over flex h-screen w-full flex-col bg-base-100 p-2 pt-24 lg:p-10 lg:pt-24 dark:bg-base-900">
      <Navbar />
      <div className="flex h-[96%] w-full shadow-lg">
        {listIdValue ?
          <SnippetExplorer
            snippets={snippets.value}
            snippetMods={snippetMods.value}
            snippetsLoading={snippetsLoading.value}
            selection={selection}
            list={list as ListData}
            fetchAndSetLists={forceFetchAndSetLists}
            setListsToDefault={() => setLists(defaultLists)}
          />
        : <ListExplorer
            lists={lists}
            listsLoading={listsLoading}
            fetchAndSetLists={forceFetchAndSetLists}
          />
        }
        <div className="hidden h-full lg:flex lg:w-2/3">
          {selection.value && (
            <Display
              selection={selection.value as Snippet}
              updateSnippetMod={updateSnippetMod}
              snippetMods={snippetMods.value}
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default Dashboard;
