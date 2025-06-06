import React, { useEffect, useRef } from "react";
import { Snippet } from "../../types/typeInterfaces";
import useCookie from "../../hooks/useCookie";

type SortOrder = "asc" | "desc";

interface SortDropdownProps {
  sortMethod: keyof Snippet;
  setSortMethod: (method: keyof Snippet) => void;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({
  sortMethod,
  setSortMethod,
  sortOrder,
  setSortOrder,
}) => {
  const [isOpen, setIsOpen] = useCookie<boolean>("sortDropdownOpen", false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
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
      className="relative flex aspect-square h-full items-center justify-center bg-base-50 hover:bg-base-150 dark:bg-base-950 dark:hover:bg-base-700"
    >
      <img
        src="/sort.svg"
        alt="Sort Options"
        onClick={toggleDropdown}
        className="aspect-square h-full cursor-pointer p-3 dark:invert"
      />
      {isOpen && (
        <div className="absolute right-0 top-full z-50 flex w-52 flex-col items-center gap-3 bg-base-50 p-2 shadow-lg shadow-base-500 dark:border dark:border-black dark:shadow-lg dark:invert">
          <div className="flex w-full flex-col gap-2">
            <h1 className="p-3 font-bold dark:text-black"> SORT BY </h1>
            <div className="grid grid-cols-1">
              <button
                className={`flex w-full items-center justify-between gap-3 bg-base-50 p-3 dark:text-black ${sortMethod == "name" ? "invert" : "hover:bg-base-150 dark:hover:bg-base-200"}`}
                onClick={() => setSortMethod("name")}
              >
                Alphabetical
                <img
                  src="/az.svg"
                  className={`invert`}
                />
              </button>
              <button
                className={`flex w-full items-center justify-between gap-3 bg-base-50 p-3 dark:text-black ${sortMethod == "snippetID" ? "invert" : "hover:bg-base-150 dark:hover:bg-base-200"}`}
                onClick={() => setSortMethod("snippetID")}
              >
                Time
                <img
                  src="/clock.svg"
                  className={`invert`}
                />
              </button>
              <button
                className={`flex w-full items-center justify-between gap-3 bg-base-50 p-3 dark:text-black ${sortMethod == "favoriteCount" ? "invert" : "hover:bg-base-150 dark:hover:bg-base-200"}`}
                onClick={() => setSortMethod("favoriteCount")}
              >
                Popularity
                <img src="/heart-full.svg" />
              </button>
              <button
                className={`flex w-full items-center justify-between gap-3 bg-base-50 p-3 dark:text-black ${sortMethod == "copyCount" ? "invert" : "hover:bg-base-150 dark:hover:bg-base-200"}`}
                onClick={() => setSortMethod("copyCount")}
              >
                Most Copied
                <img
                  src="/copy.svg"
                  className={`invert`}
                />
              </button>
            </div>
          </div>
          <div className="h-1 w-full border-b border-base-200"></div>
          <div className="grid w-full grid-cols-2 items-center justify-center gap-2">
            <button
              className={`flex w-full items-center justify-center bg-base-50 ${sortOrder == "asc" ? "invert" : "hover:bg-base-150 dark:hover:bg-base-200"}`}
              onClick={() => handleOrderChange("asc")}
              disabled={sortOrder === "asc"}
            >
              <img
                src="/up.svg"
                className={`h80 -0 p-3 invert`}
              />
            </button>
            <button
              className={`flex w-full items-center justify-center bg-base-50 ${sortOrder == "desc" ? "invert" : "hover:bg-base-150 dark:hover:bg-base-200"}`}
              onClick={() => handleOrderChange("desc")}
              disabled={sortOrder === "desc"}
            >
              <img
                src="/down.svg"
                className={`h80 -0 p-3 invert`}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SortDropdown;
