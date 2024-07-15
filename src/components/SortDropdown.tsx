import React, { useEffect, useRef, useState } from "react";
import { Snippet } from "../typeInterfaces";
import { useKeyboardControls } from "../hooks/KeyboardControls";

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
  const [isOpen, setIsOpen] = useState<boolean>(false);
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

  useKeyboardControls({
    a: (event) => {
      event.preventDefault();
      setSortMethod("name");
    },
    t: (event) => {
      event.preventDefault();
      setSortMethod("snippetID");
    },
    p: (event) => {
      event.preventDefault();
      setSortMethod("favoriteCount");
    },
    arrowUp: (event) => {
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        setSortOrder("asc");
      }
    },
    arrowDown: (event) => {
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        setSortOrder("desc");
      }
    },
  });

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
        <div className="absolute right-1/2 top-full z-50 flex w-44 flex-col items-center gap-3 bg-base-50 p-6 shadow-lg shadow-base-500 dark:shadow-lg dark:invert">
          <div className="flex w-full flex-col gap-2">
            <h1>SORT BY </h1>
            <div className="grid grid-cols-2 gap-2">
              <button
                className={`flex aspect-square w-full items-center justify-center bg-base-50 p-3 ${sortMethod == "name" ? "invert" : "hover:bg-base-150 dark:hover:bg-base-200"}`}
                onClick={() => setSortMethod("name")}
              >
                <img
                  src="/az.svg"
                  className={`invert`}
                />
              </button>
              <button
                className={`flex aspect-square w-full items-center justify-center bg-base-50 p-3 ${sortMethod == "snippetID" ? "invert" : "hover:bg-base-150 dark:hover:bg-base-200"}`}
                onClick={() => setSortMethod("snippetID")}
              >
                <img
                  src="/clock.svg"
                  className={`invert`}
                />
              </button>
              <button
                className={`flex aspect-square w-full items-center justify-center bg-base-50 p-3 ${sortMethod == "favoriteCount" ? "invert" : "hover:bg-base-150 dark:hover:bg-base-200"}`}
                onClick={() => setSortMethod("favoriteCount")}
              >
                <img src="/heart-full.svg" />
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
