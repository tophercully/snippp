"use client";
import { useEffect, useState } from "react";
import { KeyboardShortcuts } from "./KeyboardShortcuts";
import useCookie from "../../hooks/useCookie";

const KeyboardShortcutTrigger: React.FC = () => {
  const [isShortcutsPopupOpen, setIsShortcutsPopupOpen] =
    useState<boolean>(false);
  const [isAddingList] = useCookie("isAddingList", false);
  const [isEditingProfile] = useCookie("isEditingProfile", false);
  const [isEditing] = useCookie("isEditing", false);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "?") {
        setIsShortcutsPopupOpen(!isShortcutsPopupOpen);
      }
    };

    if (!isEditing && !isEditingProfile && !isAddingList) {
      window.addEventListener("keydown", handleKeyPress);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [isShortcutsPopupOpen]);

  if (isShortcutsPopupOpen) return <KeyboardShortcuts />;
};

export default KeyboardShortcutTrigger;
