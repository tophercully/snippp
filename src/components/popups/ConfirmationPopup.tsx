import React, { useRef, useEffect } from "react";
import SnipppButton from "../SnipppButton";

interface ConfirmationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmButtonText: string;
  cancelButtonText?: string;
}

const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmButtonText,
  cancelButtonText = "Cancel",
}) => {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        ref={popupRef}
        className="max-w-[90vw] rounded-sm bg-white p-6 md:max-w-sm dark:bg-base-800"
      >
        <h2 className="mb-4 text-xl font-bold dark:text-white">{title}</h2>
        {description && (
          <p className="mb-6 dark:text-base-200">{description}</p>
        )}
        <div className="flex justify-end gap-4">
          <SnipppButton
            onClick={onClose}
            colorType="neutral"
          >
            {cancelButtonText}
          </SnipppButton>
          <SnipppButton
            onClick={() => {
              onConfirm();
              onClose();
            }}
            colorType="delete"
          >
            {confirmButtonText}
          </SnipppButton>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopup;
