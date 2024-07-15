import React, { useState, useRef, useEffect } from "react";
import { createList } from "../backend/list/listFunctions";
import { useLocalStorage } from "@uidotdev/usehooks";
import { GoogleUser } from "../typeInterfaces";
import { useNotif } from "../hooks/Notif";
import SnipppButton from "./SnipppButton";
import { useKeyboardControls } from "../hooks/KeyboardControls";

export interface ListData {
  listid: string | number;
  userid: string;
  listname: string;
  description: string;
  createdat: string;
  lastupdated: string;
  snippet_count?: string;
}

interface UserListsProps {
  lists: ListData[];
  addDisabled: boolean;
  onSelectList: (list: ListData) => void;
}

export const ListLists: React.FC<UserListsProps> = ({
  lists,
  addDisabled,
  onSelectList,
}) => {
  const [userProfile] = useLocalStorage<GoogleUser | null>("userProfile", null);
  const [isAdding, setIsAdding] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { showNotif } = useNotif();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, lists.length);
  }, [lists]);

  const scrollToSelectedItem = () => {
    if (itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({
        behavior: "auto",
        block: "nearest",
      });
    }
  };

  useEffect(() => {
    scrollToSelectedItem();
  }, [selectedIndex]);

  useKeyboardControls({
    arrowUp: (event) => {
      event.preventDefault();
      setSelectedIndex((prev) => {
        return event.shiftKey ? 0 : Math.max(0, prev - 1);
      });
    },
    arrowDown: (event) => {
      event.preventDefault();
      setSelectedIndex((prev) => {
        return event.shiftKey ?
            lists.length - 1
          : Math.min(lists.length - 1, prev + 1);
      });
    },
    arrowRight: (event) => {
      event.preventDefault();
      if (lists[selectedIndex]) {
        onSelectList(lists[selectedIndex]);
      }
    },
  });

  const handleAddList = () => {
    setIsAdding(true);
  };

  const handleSaveList = async () => {
    if (userProfile) {
      setIsSaving(true);

      try {
        const result = await createList({
          userID: userProfile.id,
          listName: newListName,
          description: newDescription,
        });
        // Select this as current list
        onSelectList({
          listid: result.listid,
          userid: userProfile.id,
          listname: newListName,
          description: newDescription,
          createdat: new Date().toISOString(),
          lastupdated: new Date().toISOString(),
        });
        showNotif("List Created", "success", 5000);
      } catch (error) {
        showNotif("Error Saving List", "error", 5000);
      } finally {
        // Reset form and hide it
        setNewListName("");
        setNewDescription("");
        setIsAdding(false);
        setIsSaving(false);
      }
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setNewListName("");
    setNewDescription("");
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <h1 className="bg-base-150 p-4 font-bold dark:bg-base-850 dark:text-base-50">{`${userProfile ? userProfile.name.toUpperCase() : "User"}'S LISTS`}</h1>
      <div
        ref={containerRef}
        className="relative h-full w-full overflow-y-auto"
        tabIndex={-1} // Remove focus to avoid focusing on the container
      >
        {isAdding && (
          <div className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-75 dark:bg-black dark:bg-opacity-75">
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
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  className="mt-1 block w-full rounded-sm border border-base-300 p-2 dark:border-base-700 dark:bg-base-900 dark:text-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-base-700 dark:text-base-200">
                  Description
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
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
                  disabled={isSaving}
                >
                  SAVE
                </SnipppButton>
              </div>
            </div>
          </div>
        )}
        {lists.map((list, index) => (
          <div
            key={list.listid}
            ref={(el) => (itemRefs.current[index] = el)}
            className={`flex w-full cursor-pointer flex-col gap-2 border-b border-dashed border-base-300 bg-base-50 p-5 hover:bg-base-200 dark:bg-base-900 dark:hover:bg-base-700 ${
              index === selectedIndex ? "bg-base-200 dark:bg-base-700" : ""
            }`}
            onClick={() => {
              setSelectedIndex(index);
              onSelectList(list);
            }}
          >
            <h2 className="flex items-center gap-2 text-xl text-base-900 dark:text-base-50">
              {list.listname}
              {(list.listid == "mysnippets" || list.listid == "creations") && (
                <img
                  src="/scissors.svg"
                  className="brightness-0 dark:invert"
                />
              )}
              {list.listid == "favorites" && (
                <img
                  src="/heart-full.svg"
                  className="dark:invert"
                />
              )}
            </h2>

            {list.description && (
              <p className="truncate text-sm text-base-600 dark:text-base-300">
                {list.description}
              </p>
            )}

            {list.lastupdated && (
              <p className="text-xs text-base-500 dark:text-base-400">
                Last updated: {new Date(list.lastupdated).toLocaleDateString()}
              </p>
            )}
            {Number(list.snippet_count) != -1 && (
              <span className="flex items-center gap-1 text-xs text-base-500 dark:text-base-400">
                <img
                  src="/scissors.svg"
                  className="h-3 brightness-0 dark:invert"
                />
                {list.snippet_count}
              </span>
            )}
          </div>
        ))}
      </div>
      {!addDisabled && (
        <button
          className="flex h-16 w-full items-center justify-center bg-base-950 p-2 hover:bg-base-700 dark:invert"
          onClick={handleAddList}
        >
          <img
            src="/add.svg"
            className="h-full"
          />
        </button>
      )}
    </div>
  );
};
