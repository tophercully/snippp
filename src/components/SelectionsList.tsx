// In SelectionsList.tsx
import React from "react";
import { Snippet } from "../typeInterfaces";
import { useWindowSize } from "@uidotdev/usehooks";
interface DisplaySelectionsProps {
  selection: Snippet | null;
  setSelection: React.Dispatch<React.SetStateAction<Snippet | null>>;
  snippets: Snippet[];
  favoriteMods: { [snippetID: number]: number };
}

export const SelectionsList: React.FC<DisplaySelectionsProps> = ({
  selection,
  setSelection,
  snippets,
  favoriteMods,
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
    const modifiedFavoriteCount = (() => {
      const baseFavoriteCount = Number(favoriteCount);
      const mod = favoriteMods[snippetID as number];

      if (mod === undefined) {
        return baseFavoriteCount;
      }

      if (mod === 1 && !isFavorite) {
        return baseFavoriteCount + 1;
      }

      if (mod === -1 && isFavorite) {
        return baseFavoriteCount - 1;
      }

      return baseFavoriteCount;
    })();

    const favorited =
      favoriteMods[snippetID as number] !== undefined ?
        favoriteMods[snippetID as number] > 0
      : isFavorite;

    const selectedClass =
      selection === item ?
        "invert dark:invert-0"
      : "active:bg-base-300 dark:invert hover:bg-base-200";

    if (!isMobile) {
      // Set selection like normal
      return (
        <div
          className={`flex w-full flex-row border-b border-dashed border-base-300 bg-base-50 p-5 pb-5 duration-75 last:border-none ${selectedClass}`}
          key={snippetID}
          onClick={() => handleClick(item)}
        >
          <div className="flex w-4/5 flex-col gap-3">
            <h1 className="text-2xl">{name}</h1>
            <h1 className="text-sm">{author}</h1>
          </div>
          <div className="flex w-1/5 flex-col items-end justify-center">
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
          className={`flex w-full flex-row border-b border-dashed border-base-300 bg-base-50 p-5 pb-5 duration-75 last:border-none ${selectedClass}`}
          key={snippetID}
          href={`/snippet?snippetid=${snippetID}`}
        >
          <div className="flex w-4/5 flex-col gap-3">
            <h1 className="text-2xl">{name}</h1>
            <h1 className="text-sm">{author}</h1>
          </div>
          <div className="flex w-1/5 flex-col items-end justify-center">
            <div className="flex items-center justify-end gap-1">
              <img
                src={favorited ? "heart-full.svg" : "heart-empty.svg"}
                className="ml-auto h-5"
                alt="Favorites"
              />
              <p>{modifiedFavoriteCount.toString()}</p>
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
