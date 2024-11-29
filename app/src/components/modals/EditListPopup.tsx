"use client";
import React, { useState, useRef, useEffect } from "react";

import ConfirmationPopup from "./ConfirmationPopup";
import SnipppButton from "../universal/SnipppButton";

interface EditListPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  initialName: string;
  initialDescription: string;
  isSaving: boolean;
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
}

const EditListPopup: React.FC<EditListPopupProps> = ({
  isOpen,
  onClose,
  onSave,
  initialName,
  initialDescription,
  isSaving,
  name,
  setName,
  description,
  setDescription,
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setDescription(initialDescription);
    }
  }, [isOpen, initialName, initialDescription, setName, setDescription]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        !showConfirmation // Add this condition
      ) {
        handleCancel();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, showConfirmation]); // Add showConfirmation to the dependency array

  if (!isOpen) return null;

  const handleCancel = () => {
    if (name !== initialName || description !== initialDescription) {
      setShowConfirmation(true);
    } else {
      onClose();
    }
  };

  const confirmClose = () => {
    setShowConfirmation(false);
    setName(initialName);
    setDescription(initialDescription);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-10 flex flex-col items-center justify-center bg-white bg-opacity-75 dark:bg-black dark:bg-opacity-75">
        <div
          ref={popupRef}
          className="w-full max-w-[90vw] rounded-sm bg-white p-4 shadow-lg md:max-w-md dark:bg-base-800"
        >
          <h2 className="mb-4 text-center text-2xl dark:text-white">
            Edit List
          </h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-base-700 dark:text-base-200">
              List Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-sm border border-base-300 p-2 dark:border-base-700 dark:bg-base-900 dark:text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-base-700 dark:text-base-200">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              onClick={onSave}
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

export default EditListPopup;
