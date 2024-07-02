import React, { useEffect, useRef, useState } from "react";

type SortOrder = "asc" | "desc";

interface SortDropdownProps {
  sortMethod: string;
  setSortMethod: (method: string) => void;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({
  sortMethod,
  setSortMethod,
  sortOrder,
  setSortOrder,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortMethod(e.target.value);
  };

  const handleOrderChange = (order: SortOrder) => {
    setSortOrder(order);
  };
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      ref={dropdownRef}
      className="hover:bg-base-150 relative flex aspect-square h-full items-center justify-center bg-base-50 dark:bg-base-950 dark:hover:bg-base-800"
    >
      <img
        src="sort.svg"
        alt="Sort Options"
        onClick={toggleDropdown}
        className="aspect-square h-full cursor-pointer p-3"
      />
      {isOpen && (
        <div className="absolute right-1/2 top-full z-50 flex flex-col items-center gap-8 bg-base-50 p-10 shadow-lg">
          <div>
            <label htmlFor="sortOptions">Sort By: </label>
            <select
              id="sortOptions"
              value={sortMethod}
              onChange={handleOptionChange}
            >
              <option value="name">Relevance</option>
              <option value="snippetID">Date</option>
              <option value="favoriteCount">Popularity</option>
            </select>
          </div>
          <div className="flex justify-between">
            <button
              className="w-full"
              onClick={() => handleOrderChange("asc")}
              disabled={sortOrder === "asc"}
            >
              <img
                src="up.svg"
                className={`h80 p-3 invert dark:invert-0 ${sortOrder == "asc" ? "bg-base-800" : ""}`}
              />
            </button>
            <button
              className="w-full"
              onClick={() => handleOrderChange("desc")}
              disabled={sortOrder === "desc"}
            >
              <img
                src="down.svg"
                className={`h80 p-3 invert dark:invert-0 ${sortOrder == "desc" ? "bg-base-800" : ""}`}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SortDropdown;
