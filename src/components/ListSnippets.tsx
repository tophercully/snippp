// In SelectionsList.tsx
import React from "react";
import { Snippet } from "../typeInterfaces";
import { useWindowSize } from "@uidotdev/usehooks";
import { simplifyNumber } from "../utils/simplifyNumber";

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
  const handleClick = (input: Snippet) => {
    if (input !== selection) {
      setSelection(input);
    }
  };

  const Item = ({ item }: { item: Snippet }) => {
    const { snippetID, name, author, favoriteCount, isFavorite } = item;
    const { width } = useWindowSize();
    const isMobile = width && width <= 1024;
    const mod = snippetMods[Number(snippetID)];

    const modifiedFavoriteCount = mod?.favoriteCount ?? favoriteCount;
    const favorited = mod?.favoriteStatus ?? isFavorite;

    const selectedClass =
      selection === item ?
        "invert dark:invert-0"
      : "active:bg-base-300 dark:invert hover:bg-base-200";

    if (!isMobile) {
      // Set selection like normal
      return (
        <div
          className={`flex w-full flex-row justify-between border-b border-dashed border-base-300 bg-base-50 p-5 pb-5 duration-75 last:border-none ${selectedClass}`}
          key={snippetID}
          onClick={() => handleClick(item)}
        >
          <div className="flex w-4/5 flex-col gap-3">
            <div className="flex items-center gap-2 text-2xl">
              {name}
              {!item.public && (
                <img
                  src="lock.svg"
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
                src={favorited ? "heart-full.svg" : "heart-empty.svg"}
                className="ml-auto h-5"
                alt="Favorites"
              />
              <p>{modifiedFavoriteCount.toString()}</p>
            </div>
          </div>
        </div>
      );
    } else {
      // Return a link to the snippet page on mobile
      return (
        <a
          className={`flex w-full flex-row justify-between border-b border-dashed border-base-300 bg-base-50 p-5 pb-5 duration-75 last:border-none ${selectedClass}`}
          key={snippetID}
          href={`/snippet?snippetid=${snippetID}`}
        >
          <div className="flex w-4/5 flex-col gap-3">
            <div className="flex items-center gap-2 text-2xl">
              {name}
              {!item.public && (
                <img
                  src="lock.svg"
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
                src={favorited ? "heart-full.svg" : "heart-empty.svg"}
                className="ml-auto h-5"
                alt="Favorites"
              />
              <p>{simplifyNumber(modifiedFavoriteCount).toString()}</p>
            </div>
          </div>
        </a>
      );
    }
  };

  return (
    <div className="h-full w-full overflow-y-auto">
      {snippets &&
        snippets.map((a) => (
          <Item
            item={a}
            key={a.snippetID}
          />
        ))}
    </div>
  );
};
