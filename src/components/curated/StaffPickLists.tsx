import { useEffect, useState } from "react";
import { ListData } from "../../typeInterfaces";
import { getStaffPicks } from "../../backend/list/listFunctions";
import { LoadingSpinner } from "../LoadingSpinner";
import { formatDescription } from "../../utils/formatDescription";
import TooltipWrapper from "../TooltipWrapper";

const StaffPickLists = () => {
  const [picks, setPicks] = useState<ListData[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  //make a list of lists for testing scaling and styling
  // const testLists = [
  //   {
  //     listid: 1,
  //     listname: "List 1",
  //     description:
  //       "This is a description of the list. It has a lot of information about the list and what it contains. It is a very long description that should be cut off at some point.",
  //   },
  //   {
  //     listid: 2,
  //     listname: "List 2",
  //     description:
  //       "This is a description of the list. It has a lot of information about the list and what it contains. It is a very long description that should be cut off at some point.",
  //   },
  //   {
  //     listid: 3,
  //     listname: "List 3",
  //     description:
  //       "This is a description of the list. It has a lot of information about the list and what it contains. It is a very long description that should be cut off at some point.",
  //   },
  //   {
  //     listid: 4,
  //     listname: "List 4",
  //     description:
  //       "This is a description of the list. It has a lot of information about the list and what it contains. It is a very long description that should be cut off at some point.",
  //   },
  //   {
  //     listid: 5,
  //     listname: "List 5",
  //     description:
  //       "This is a description of the list. It has a lot of information about the list and what it contains. It is a very long description that should be cut off at some point.",
  //   },
  //   {
  //     listid: 6,
  //     listname: "List 6",
  //     description:
  //       "This is a description of the list. It has a lot of information about the list and what it contains. It is a very long description that should be cut off at some point.",
  //   },
  //   {
  //     listid: 7,
  //     listname: "List 7",
  //     description:
  //       "This is a description of the list. It has a lot of information about the list and what it contains. It is a very long description that should be cut off at some point.",
  //   },
  //   {
  //     listid: 8,
  //     listname: "List 8",
  //     description:
  //       "This is a description of the list. It has a lot of information about the list and what it contains. It is a very long description that should be cut off at some point.",
  //   },
  //   {
  //     listid: 9,
  //     listname: "List 9",
  //     description:
  //       "This is a description of the list. It has a lot of information about the list and what it contains. It is a very long description that should be cut off at some point.",
  //   },
  //   {
  //     listid: 10,
  //     listname: "List 10",
  //     description:
  //       "This is a description of the list. It has a lot of information about the list and what it contains. It is a very long description that should be cut off at some point.",
  //   },
  // ];
  useEffect(() => {
    const getPicks = async () => {
      setIsLoading(true);
      const result = await getStaffPicks();
      setPicks(result);
      setIsLoading(false);
    };
    getPicks();
  }, []);

  return (
    <div className="w-full">
      <div className="grid gap-4 gap-y-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 dark:invert">
        {picks?.map((pick, index) => (
          <a
            key={index}
            href={`/list/${pick.listid}`}
            className="flex h-fit flex-col rounded-sm border border-dashed border-base-500 bg-white p-4 shadow-md hover:bg-base-200 dark:border-base-700"
          >
            <div className="mb-4 flex items-center justify-between gap-2">
              <img
                src="folder.svg"
                className="h-6 w-6 invert"
                alt="Folder icon"
              />
              <TooltipWrapper tooltip="# of snippets in the list">
                <p className="text-sm">{pick.snippet_count}</p>
              </TooltipWrapper>
            </div>

            <div className="mb-4 flex min-w-0 flex-col">
              <h3 className="truncate text-xl font-semibold">
                {pick.listname}
              </h3>
              <p className="truncate text-sm text-gray-600">{pick.author}</p>
            </div>

            {pick?.description && (
              <div className="flex-grow pb-4">
                <p
                  className={`line-clamp-2 overflow-hidden font-thin transition-all duration-300`}
                  dangerouslySetInnerHTML={{
                    __html: formatDescription(pick.description),
                  }}
                ></p>
              </div>
            )}
            <div>
              {pick.listtags?.map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="mr-2 mt-2 rounded-sm bg-base-200 px-2 py-1 text-xs text-base-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          </a>
        ))}
      </div>
      {isLoading && (
        <div className="mt-8 flex flex-col items-center justify-center">
          <LoadingSpinner />
          <span className="ml-2 dark:text-white">Loading Staff Picks</span>
        </div>
      )}
    </div>
  );
};

export default StaffPickLists;
