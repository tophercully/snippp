import { useEffect, useState } from "react";
import { ListData } from "../../typeInterfaces";
import { getStaffPicks } from "../../backend/list/listFunctions";
import { LoadingSpinner } from "../LoadingSpinner";
import ListCard from "./ListCard";

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
      <div className="grid gap-4 gap-y-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {picks?.map((pick, index) => (
          <ListCard
            key={index}
            list={pick}
            index={index}
          />
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
