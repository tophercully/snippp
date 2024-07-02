interface SearchBarProps {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}

export const SearchBar = ({ query, setQuery }: SearchBarProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  return (
    <div className="w-full">
      <input
        className="bg-base-150 w-full bg-transparent p-4 pl-3 text-xl outline-none dark:bg-base-800 dark:text-base-50"
        placeholder="search"
        value={query}
        onChange={handleChange}
      />
    </div>
  );
};
