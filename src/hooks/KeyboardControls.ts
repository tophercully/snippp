import { useSessionStorage } from "@uidotdev/usehooks";
import { useEffect, useCallback } from "react";

type KeyHandler = (event: KeyboardEvent) => void;

interface KeyHandlers {
  arrowUp?: KeyHandler;
  arrowDown?: KeyHandler;
  arrowLeft?: KeyHandler;
  arrowRight?: KeyHandler;
  enter?: KeyHandler;
  escape?: KeyHandler;
  slash?: KeyHandler;
  backslash?: KeyHandler;
  questionMark?: KeyHandler;
  spacebar?: KeyHandler;
  f?: KeyHandler;
  [key: string]: KeyHandler | undefined;
}

export const useKeyboardControls = (keyHandlers: KeyHandlers) => {
  const [isEditing] = useSessionStorage("isEditingList", false);
  const [isAdding] = useSessionStorage("isAddingList", false);
  const [isEditingProfile] = useSessionStorage("isEditingProfile", false);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowUp":
          if (keyHandlers.arrowUp) {
            keyHandlers.arrowUp(event);
          }
          break;
        case "ArrowDown":
          if (keyHandlers.arrowDown) {
            keyHandlers.arrowDown(event);
          }
          break;
        case "ArrowLeft":
          if (keyHandlers.arrowLeft) {
            keyHandlers.arrowLeft(event);
          }
          break;
        case "ArrowRight":
          if (keyHandlers.arrowRight) {
            keyHandlers.arrowRight(event);
          }
          break;
        case "Enter":
          if (keyHandlers.enter) {
            keyHandlers.enter(event);
          }
          break;
        case "Escape":
          if (keyHandlers.escape) {
            event.preventDefault();
            keyHandlers.escape(event);
          }
          break;
        case "/":
          if (keyHandlers.slash) {
            keyHandlers.slash(event);
          }
          break;
        case "?":
          if (keyHandlers.questionMark) {
            keyHandlers.questionMark(event);
          }
          break;
        case " ":
          if (keyHandlers.spacebar) {
            keyHandlers.spacebar(event);
          }
          break;
        case "f":
        case "F":
          if (keyHandlers.f) {
            keyHandlers.f(event);
          }
          break;
        case "a":
        case "A":
          if (keyHandlers.a) {
            keyHandlers.a(event);
          }
          break;
        case "t":
        case "T":
          if (keyHandlers.t) {
            keyHandlers.t(event);
          }
          break;
        case "p":
        case "P":
          if (keyHandlers.p) {
            keyHandlers.p(event);
          }
          break;
        default:
          if (keyHandlers[event.key]) {
            keyHandlers[event.key]!(event);
          }
      }
    },
    [keyHandlers],
  );

  useEffect(() => {
    if (!isAdding && !isEditing && !isEditingProfile) {
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [handleKeyDown, isAdding, isEditing, isEditingProfile]);
};
