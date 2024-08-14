import React, { useState, useRef, useEffect } from "react";
import SnipppButton from "../SnipppButton";
import ConfirmationPopup from "./ConfirmationPopup";

interface AddListPopupProps {
  isAdding: boolean;
  newListName: string;
  setNewListName: (name: string) => void;
  newDescription: string;
  setNewDescription: (description: string) => void;
  handleCancel: () => void;
  handleSaveList: () => void;
  isSaving: boolean;
}

const AddListPopup: React.FC<AddListPopupProps> = ({
  isAdding,
  newListName,
  setNewListName,
  newDescription,
  setNewDescription,
  handleCancel,
  handleSaveList,
  isSaving,
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        !showConfirmation
      ) {
        handleCancelWithConfirmation();
      }
    };

    if (isAdding) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAdding, showConfirmation]);

  if (!isAdding) return null;

  const handleCancelWithConfirmation = () => {
    if (newListName !== "" || newDescription !== "") {
      setShowConfirmation(true);
    } else {
      handleCancel();
    }
  };

  const confirmClose = () => {
    setShowConfirmation(false);
    setNewListName("");
    setNewDescription("");
    handleCancel();
  };

  return (
    <>
      <div className="fixed inset-0 z-10 flex flex-col items-center justify-center bg-white bg-opacity-75 dark:bg-black dark:bg-opacity-75">
        <div
          ref={popupRef}
          className="w-full max-w-[90vw] rounded-sm bg-white p-4 shadow-lg md:max-w-md dark:bg-base-800"
        >
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
              onClick={handleCancelWithConfirmation}
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
      <ConfirmationPopup
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={confirmClose}
        title="Discard changes?"
        description="You have unsaved changes. Are you sure you want to discard them?"
        confirmButtonText="Discard"
      />
    </>
  );
};

export default AddListPopup;
