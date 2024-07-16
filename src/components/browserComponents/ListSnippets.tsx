// In SelectionsList.tsx
import React, { useRef, useEffect, useState } from "react";
import { Snippet } from "../../typeInterfaces";
import { useSessionStorage, useWindowSize } from "@uidotdev/usehooks";
import { simplifyNumber } from "../../utils/simplifyNumber";
import { useKeyboardControls } from "../../hooks/KeyboardControls";

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
  const [isEditing] = useSessionStorage("isEditingList", false);

  const handleClick = (input: Snippet, index: number) => {
    if (input !== selection) {
      setSelection(input);
      setSelectedIndex(index);
    }
  };

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
  console.log(isEditing);
  const keyboardControlOptions =
    !isEditing ?
      {
        arrowUp: (event) => {
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
        arrowDown: (event) => {
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

  const Item = ({ item, index }: { item: Snippet; index: number }) => {
    const {
      snippetID,
      name,
      author,
      favoriteCount,
      isFavorite,
      public: isPublic,
    } = item;
    const { width } = useWindowSize();
    const isMobile = width && width <= 1024;
    const mod = snippetMods[Number(snippetID)];

    const modifiedFavoriteCount = mod?.favoriteCount ?? favoriteCount ?? 0;
    const favorited = mod?.favoriteStatus ?? isFavorite ?? false;
    const selectedClass =
      index === selectedIndex ?
        "invert dark:invert-0"
      : "active:bg-base-300 dark:invert hover:bg-base-200";

    const commonContent = (
      <>
        <div className="flex w-4/5 flex-col gap-3">
          <div className="flex items-center gap-2 text-2xl">
            {name}
            {!isPublic && (
              <img
                src="/lock.svg"
                className="mr-auto h-5 invert"
                alt="Private"
              />
            )}
          </div>
          <h1 className="text-sm">{author}</h1>
        </div>
        <div className="ml-5 flex w-fit flex-col items-end justify-center gap-3 justify-self-end">
          <div className="flex items-center justify-end gap-1">
            <img
              src={favorited ? "/heart-full.svg" : "/heart-empty.svg"}
              className="ml-auto h-5"
              alt="Favorites"
            />
            <p>
              {isMobile ?
                simplifyNumber(modifiedFavoriteCount)
              : modifiedFavoriteCount.toString()}
            </p>
          </div>
        </div>
      </>
    );

    if (!isMobile) {
      return (
        <div
          ref={(el) => (itemRefs.current[index] = el)}
          className={`flex w-full flex-row justify-between border-b border-dashed border-base-300 bg-base-50 p-5 pb-5 duration-75 last:border-none hover:cursor-pointer ${selectedClass}`}
          key={snippetID}
          onClick={() => handleClick(item, index)}
        >
          {commonContent}
        </div>
      );
    } else {
      return (
        <a
          ref={(el) => (itemRefs.current[index] = el)}
          className={`flex w-full flex-row justify-between border-b border-dashed border-base-300 bg-base-50 p-5 pb-5 duration-75 last:border-none hover:cursor-alias ${selectedClass}`}
          key={snippetID}
          href={`/snippet/${snippetID}`}
        >
          {commonContent}
        </a>
      );
    }
  };

  return (
    <div
      ref={containerRef}
      className="h-full w-full overflow-y-auto"
    >
      {snippets &&
        snippets.map((a, index) => (
          <Item
            item={a}
            index={index}
            key={a.snippetID}
          />
        ))}
    </div>
  );
};
