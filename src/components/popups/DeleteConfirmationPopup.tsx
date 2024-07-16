import React from "react";
import SnipppButton from "./SnipppButton";

interface DeleteConfirmationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  itemType: string;
}

const DeleteConfirmationPopup: React.FC<DeleteConfirmationPopupProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemType,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="rounded-sm bg-white p-6 dark:bg-base-800">
        <h2 className="mb-4 text-xl font-bold dark:text-white">
          Confirm Deletion
        </h2>
        <p className="mb-6 dark:text-base-200">
          Are you sure you want to delete the {itemType} "{itemName}"?
        </p>
        <div className="flex justify-end gap-4">
          <SnipppButton
            onClick={onClose}
            colorType="neutral"
          >
            CANCEL
          </SnipppButton>
          <SnipppButton
            onClick={() => {
              onConfirm();
              onClose();
            }}
            colorType="delete"
          >
            DELETE
          </SnipppButton>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationPopup;
