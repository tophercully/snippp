"use client";
import React, { useRef, useEffect, useState } from "react";
import { Snippet } from "../../types/typeInterfaces";
import useCookie from "../../hooks/useCookie";
import { useKeyboardControls } from "../../hooks/useKeyboardControls";
import { useWindowSize } from "@uidotdev/usehooks";
import ListSnippetItem from "./ListSnippetItem";

interface DisplaySelectionsProps {
  selection: Snippet | null;
  setSelection: React.Dispatch<React.SetStateAction<Snippet | null>>;
  snippets: Snippet[];
  snippetMods: {
    [snippetID: number]: {
      favoriteStatus?: boolean;
      favoriteCount?: number;
      copyCount?: number;
      isDeleted?: boolean;
    };
  };
}

export const ListSnippets: React.FC<DisplaySelectionsProps> = ({
  selection,
  setSelection,
  snippets,
  snippetMods,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(
    snippets.findIndex((s) => s === selection) || 0,
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const mobileItemRefs = useRef<(HTMLElement | null)[]>([]);
  const { width } = useWindowSize();
  const isMobile = (width as number) < 768;
  const [isEditing] = useCookie("isEditingList", false);
  const [isAdding] = useCookie("isAddingList", false);
  const [isEditingProfile] = useCookie("isEditingProfile", false);

  const handleClick = (input: Snippet, index: number) => {
    if (input !== selection) {
      setSelection(input);
      setSelectedIndex(index);
    }
  };

  useEffect(() => {
    if (itemRefs.current[selectedIndex]) {
      isMobile ?
        mobileItemRefs.current[selectedIndex]?.scrollIntoView({
          behavior: "instant",
          block: "nearest",
        })
      : itemRefs.current[selectedIndex]?.scrollIntoView({
          behavior: "instant",
          block: "nearest",
        });
    }
  }, [selection]);

  const keyboardControlOptions =
    !isEditing && !isAdding && !isEditingProfile ?
      {
        arrowUp: (event: KeyboardEvent) => {
          if (!event.ctrlKey && !event.metaKey) {
            setSelectedIndex((prev) => {
              let newIndex;
              if (event.shiftKey) {
                newIndex = 0; // Jump to the first item
              } else {
                newIndex = prev > 0 ? prev - 1 : prev;
              }
              setSelection(snippets[newIndex]);
              return newIndex;
            });
          }
        },
        arrowDown: (event: KeyboardEvent) => {
          if (!event.ctrlKey && !event.metaKey) {
            setSelectedIndex((prev) => {
              let newIndex;
              if (event.shiftKey) {
                newIndex = snippets.length - 1; // Jump to the last item
              } else {
                newIndex = prev < snippets.length - 1 ? prev + 1 : prev;
              }
              setSelection(snippets[newIndex]);
              return newIndex;
            });
          }
        },
      }
    : {};
  useKeyboardControls(keyboardControlOptions);

  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, snippets.length);
  }, [snippets]);

  return (
    <div
      ref={containerRef}
      className="h-full w-full overflow-y-auto"
    >
      {snippets &&
        snippets.map((a, index) => (
          <ListSnippetItem
            item={a}
            index={index}
            key={a.snippetID}
            handleClick={handleClick}
            selectedIndex={selectedIndex}
            snippetMods={snippetMods}
            itemRefs={itemRefs}
            mobileItemRefs={mobileItemRefs}
          />
        ))}
    </div>
  );
};
