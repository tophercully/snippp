import React, { useState } from "react";
import { createList } from "../backend/list/listFunctions";
import { useLocalStorage } from "@uidotdev/usehooks";
import { GoogleUser } from "../typeInterfaces";
import { useNotif } from "../hooks/Notif";
import SnipppButton from "./SnipppButton";

export interface ListData {
  listid: string | number;
  userid: string;
  listname: string;
  description: string;
  createdat: string;
  lastupdated: string;
}

interface UserListsProps {
  lists: ListData[];
  onSelectList: (list: ListData) => void;
}

export const ListLists: React.FC<UserListsProps> = ({
  lists,
  onSelectList,
}) => {
  const [userProfile] = useLocalStorage<GoogleUser | null>("userProfile", null);
  const [isAdding, setIsAdding] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { showNotif } = useNotif();

  const handleAddList = () => {
    setIsAdding(true);
  };

  const handleSaveList = async () => {
    if (userProfile) {
      setIsSaving(true);

      // Reset form and hide it
      setNewListName("");
      setNewDescription("");
      setIsAdding(false);

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
      <h1 className="bg-base-150 p-4 font-bold">{`${userProfile ? userProfile.name.toUpperCase() : "User"}'S LISTS`}</h1>
      <div className="relative h-full w-full overflow-y-auto">
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
        {lists.map((list) => (
          <div
            key={list.listid}
            className="flex w-full cursor-pointer flex-col border-b border-dashed border-base-300 bg-base-50 p-5 hover:bg-base-200 dark:bg-base-800 dark:hover:bg-base-700"
            onClick={() => onSelectList(list)}
          >
            <h2 className="text-xl text-base-900 dark:text-base-50">
              {list.listname}
            </h2>

            {list.description && (
              <p className="truncate text-sm text-base-600 dark:text-base-300">
                {list.description}
              </p>
            )}
            <p className="text-xs text-base-500 dark:text-base-400">
              Last updated: {new Date(list.lastupdated).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
      <button
        className="flex h-16 w-full items-center justify-center bg-base-950 p-2 hover:bg-base-700 dark:invert"
        onClick={handleAddList}
      >
        <img
          src="add.svg"
          className="h-full"
        />
      </button>
    </div>
  );
};