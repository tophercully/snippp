import { Snippet } from "../typeInterfaces";
import SortDropdown from "./SortDropdown";

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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  return (
    <div className="flex w-full items-center">
      <input
        className="bg-base-150 w-full bg-transparent p-4 pl-3 text-xl outline-none dark:bg-base-800 dark:text-base-50"
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
