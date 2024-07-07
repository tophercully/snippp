// src/components/UserLists.tsx
import React from "react";

export interface ListData {
  listid: string;
  userid: string;
  listname: string;
  description: string;
  createdat: string;
  lastupdated: string;
}

interface UserListsProps {
  lists: ListData[];
  onSelectList: (list: ListData) => void;
}

export const ListLists: React.FC<UserListsProps> = ({
  lists,
  onSelectList,
}) => {
  return (
    <div className="h-full w-full overflow-y-auto">
      {lists.map((list) => (
        <div
          key={list.listid}
          className="flex w-full cursor-pointer flex-col border-b border-dashed border-base-300 bg-base-50 p-5 hover:bg-base-200 dark:bg-base-800 dark:hover:bg-base-700"
          onClick={() => onSelectList(list)}
        >
          <h2 className="text-xl text-base-900 dark:text-base-50">
            {list.listname}
          </h2>
          <p className="text-sm text-base-600 dark:text-base-300">
            {list.description}
          </p>
          <p className="text-xs text-base-500 dark:text-base-400">
            Last updated: {new Date(list.lastupdated).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
};
