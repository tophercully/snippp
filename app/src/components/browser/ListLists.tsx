import React, { useState, useRef, useEffect } from "react";
import { createList } from "../../backend/list/listFunctions";

import TooltipWrapper from "../universal/TooltipWrapper";
import AddListPopup from "../modals/AddListPopup";
import {
  GoogleUser,
  ListData,
  SnipppProfile,
} from "../../types/typeInterfaces";
import { useUser } from "../../contexts/UserContext";
import useCookie from "../../hooks/useCookie";
import { useNotif } from "../../contexts/NotificationContext";
import { useKeyboardControls } from "../../hooks/useKeyboardControls";

interface UserListsProps {
  profile: GoogleUser | SnipppProfile;
  lists: ListData[];
  addDisabled: boolean;
  onSelectList: (list: ListData) => void;
  onAddList: () => void;
  onRefreshLists: () => void;
}

export const ListLists: React.FC<UserListsProps> = ({
  profile,
  lists,
  addDisabled,
  onSelectList,
  onAddList,
  onRefreshLists,
}) => {
  const { userProfile } = useUser();
  const [isAdding, setIsAdding] = useCookie("isAddingList", false);
  const [isEditing] = useCookie("isEditingList", false);
  const [isEditingProfile] = useCookie("isEditingProfile", false);
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

  const keyboardControlOptions =
    !isAdding && !isEditing && !isEditingProfile ?
      {
        arrowUp: (event: KeyboardEvent) => {
          if (!event.ctrlKey && !event.metaKey) {
            event.preventDefault();
            setSelectedIndex((prev) =>
              event.shiftKey ? 0 : Math.max(0, prev - 1),
            );
          }
        },
        arrowDown: (event: KeyboardEvent) => {
          if (!event.ctrlKey && !event.metaKey) {
            event.preventDefault();
            setSelectedIndex((prev) =>
              event.shiftKey ?
                lists.length - 1
              : Math.min(lists.length - 1, prev + 1),
            );
          }
        },
        arrowRight: (event: KeyboardEvent) => {
          event.preventDefault();
          if (lists[selectedIndex]) {
            onSelectList(lists[selectedIndex]);
          }
        },
      }
    : {};
  useKeyboardControls(keyboardControlOptions);

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
        showNotif(`Error Saving List: ${error}`, "error", 5000);
      } finally {
        // Reset form and hide it
        setNewListName("");
        setNewDescription("");
        setIsAdding(false);
        setIsSaving(false);
        onAddList();
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
      <div>
        <h1 className="flex items-center justify-between bg-base-150 p-4 font-bold dark:bg-base-850 dark:text-base-50">
          {`${profile ? profile.name.toUpperCase() : "User"}'S LISTS`}

          <button
            onClick={onRefreshLists}
            className="flex items-center justify-center p-1 hover:bg-base-200 dark:hover:bg-base-700"
          >
            <img
              src="/refresh.svg"
              className="contrast-50 invert dark:invert-0"
            />
          </button>
        </h1>
      </div>
      <div
        ref={containerRef}
        className="relative h-full w-full overflow-y-auto"
      >
        <AddListPopup
          isAdding={isAdding}
          newListName={newListName}
          setNewListName={setNewListName}
          newDescription={newDescription}
          setNewDescription={setNewDescription}
          handleCancel={handleCancel}
          handleSaveList={handleSaveList}
          isSaving={isSaving}
        />
        {lists.map((list, index) => (
          <div
            key={list.listid}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            className={`flex w-full cursor-pointer flex-col gap-2 border-b border-dashed border-base-300 p-5 ${
              index === selectedIndex ?
                "bg-base-200 dark:bg-base-700"
              : "bg-base-50 dark:bg-base-900"
            } hover:bg-base-200 dark:hover:bg-base-700`}
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
        <TooltipWrapper tooltip={"Add New List"}>
          <button
            className="flex h-16 w-full items-center justify-center bg-base-950 p-2 hover:bg-base-700 dark:invert"
            onClick={handleAddList}
          >
            <img
              src="/add.svg"
              className="h-full"
            />
          </button>
        </TooltipWrapper>
      )}
    </div>
  );
};
