import React, { useRef, useCallback, useEffect } from "react";
import { Snippet } from "../../typeInterfaces";
import SortDropdown from "./SortDropdown";
import { useKeyboardControls } from "../../hooks/KeyboardControls";

type SortOrder = "asc" | "desc";
interface SearchBarProps {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  placeHolder?: string;
  sortMethod: keyof Snippet;
  setSortMethod: (method: keyof Snippet) => void;
  sortOrder: SortOrder;
  setSortOrder: (method: SortOrder) => void;
}

export const SearchBar = ({
  query,
  setQuery,
  placeHolder,
  sortMethod,
  sortOrder,
  setSortMethod,
  setSortOrder,
}: SearchBarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
      // Ensure the input retains focus after updating the query
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    },
    [setQuery],
  );

  useKeyboardControls({
    slash: (event) => {
      if (document.activeElement !== inputRef.current) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    },
  });

  // Use useEffect to focus the input after each render
  useEffect(() => {
    inputRef.current?.focus();
  });

  return (
    <div className="flex w-full items-center">
      <input
        ref={inputRef}
        className="w-full bg-base-150 bg-transparent p-4 pl-3 text-xl outline-none dark:bg-base-800 dark:text-base-50"
        placeholder={placeHolder ? placeHolder : "search"}
        value={query}
        onChange={handleChange}
      />
      <SortDropdown
        setSortMethod={setSortMethod}
        sortMethod={sortMethod}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />
    </div>
  );
};

export default SearchBar;
