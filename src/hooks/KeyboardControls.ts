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
  questionMark?: KeyHandler;
  spacebar?: KeyHandler;
  f?: KeyHandler;
  [key: string]: KeyHandler | undefined;
}

export const useKeyboardControls = (keyHandlers: KeyHandlers) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowUp":
          if (keyHandlers.arrowUp) {
            event.preventDefault();
            keyHandlers.arrowUp(event);
          }
          break;
        case "ArrowDown":
          if (keyHandlers.arrowDown) {
            event.preventDefault();
            keyHandlers.arrowDown(event);
          }
          break;
        case "ArrowLeft":
          if (keyHandlers.arrowLeft) {
            event.preventDefault();
            keyHandlers.arrowLeft(event);
          }
          break;
        case "ArrowRight":
          if (keyHandlers.arrowRight) {
            event.preventDefault();
            keyHandlers.arrowRight(event);
          }
          break;
        case "Enter":
          if (keyHandlers.enter) {
            event.preventDefault();
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
            event.preventDefault();
            keyHandlers.slash(event);
          }
          break;
        case "?":
          if (keyHandlers.questionMark) {
            event.preventDefault();
            keyHandlers.questionMark(event);
          }
          break;
        case " ":
          if (keyHandlers.spacebar) {
            event.preventDefault();
            keyHandlers.spacebar(event);
          }
          break;
        case "f":
          if (keyHandlers.f) {
            event.preventDefault();
            keyHandlers.f(event);
          }
          break;
        default:
          if (keyHandlers[event.key]) {
            event.preventDefault();
            keyHandlers[event.key]!(event);
          }
      }
    },
    [keyHandlers],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);
};
