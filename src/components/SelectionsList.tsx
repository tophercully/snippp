import React from "react";
import { Snippet } from "../typeInterfaces";

interface DisplaySelectionsProps {
  selection: Snippet | null;
  setSelection: React.Dispatch<React.SetStateAction<Snippet | null>>;
  snippets: Snippet[];
  favoriteMods: number[];
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

  const Item = ({ item, index }: { item: Snippet; index: number }) => {
    const { snippetID, name, author, favoriteCount } = item;
    const originalIndex =
      favoriteMods.length > snippets.length ?
        snippets.findIndex((s) => s.snippetID === snippetID)
      : index;
    const modifiedFavoriteCount =
      Number(favoriteCount) + (Number(favoriteMods[originalIndex]) || 0);

    const selectedClass =
      selection === item ?
        "invert dark:invert-0"
      : "active:bg-base-300 dark:invert hover:bg-base-200";

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
              src={
                favoriteMods[originalIndex] > 0 ?
                  "heart-full.svg"
                : "heart-empty.svg"
              }
              className="ml-auto h-5"
              alt="Favorites"
            />
            <p>{modifiedFavoriteCount}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full w-full overflow-y-auto">
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
