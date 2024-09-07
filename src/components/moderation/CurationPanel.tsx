import { useLocalStorage } from "@uidotdev/usehooks";
import {
  addListToStaffPicks,
  getList,
  removeListFromStaffPicks,
} from "../../backend/list/listFunctions";
import { useEffect, useState } from "react";
import { GoogleUser } from "../../typeInterfaces";
import { LoadingSpinner } from "../LoadingSpinner";
import { ListData } from "../../typeInterfaces";
import SnipppButton from "../SnipppButton";

const CurationPanel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedList, setSelectedList] = useState<ListData | null>(null);
  const [listInput, setListInput] = useState<string>("");
  const [userProfile] = useLocalStorage<GoogleUser | null>("userProfile", null);
  const [isWorking, setIsWorking] = useState(false);
  useEffect(() => {}, [listInput]);

  const getListData = async (e: any) => {
    setIsLoading(true);
    e.preventDefault();
    const listToSet = await getList(userProfile?.id as string, listInput);
    console.log(listToSet);
    setSelectedList(listToSet as ListData);
    setIsLoading(false);
  };

  const handleTogglePick = async () => {
    setIsWorking(true);
    try {
      if (selectedList?.staffpick) {
        console.log(`remove ${selectedList?.listid} from staff picks`);
        await removeListFromStaffPicks(Number(selectedList?.listid) as number);
      } else {
        console.log(`add ${selectedList?.listid} to staff picks`);
        await addListToStaffPicks(Number(selectedList?.listid) as number);
      }
      setSelectedList({
        ...(selectedList as ListData),
        staffpick: !selectedList?.staffpick,
      });
    } catch (error) {
      console.error("Could not change staff pick status");
    }
    setIsWorking(false);
  };

  if (userProfile) {
    return (
      <>
        {!isLoading ?
          <div className="flex justify-center gap-8 rounded-sm border border-base-950 p-8 shadow-md">
            {!selectedList && (
              <div className="flex w-fit flex-col justify-center gap-4">
                <h2 className="w-fit font-semibold">
                  Input a list ID to manage it's curation
                </h2>
                <form
                  onSubmit={getListData}
                  className="flex w-fit flex-col gap-4"
                >
                  <div className="flex w-fit items-center gap-4">
                    <label>List ID</label>
                    <input
                      value={listInput}
                      className="rounded-sm border border-gray-700 p-2 shadow-sm"
                      onChange={(e) => setListInput(e.target.value)}
                    ></input>
                    <button className="bg-black px-3 py-2 text-white">
                      Fetch Data
                    </button>
                  </div>
                </form>
              </div>
            )}

            {selectedList && (
              <div
                id="list-info"
                className="flex w-full flex-col gap-4"
              >
                <div className="flex flex-col gap-1">
                  <button
                    className="mb-12 w-fit bg-base-150 p-2 hover:bg-base-150"
                    onClick={() => setSelectedList(null)}
                  >
                    <img
                      src="/arrow-left.svg"
                      className="invert"
                    />
                  </button>
                  <h3 className="text-xl font-semibold">
                    {selectedList.listname}
                  </h3>
                  <p className="text-sm">{`by ${selectedList.author}`}</p>
                </div>
                <p className="w-[40ch]">{selectedList.description}</p>
                <div className="mt-12 self-center">
                  <SnipppButton
                    colorType={selectedList.staffpick ? "delete" : "add"}
                    className="bg-black px-3 py-2 text-white"
                    onClick={handleTogglePick}
                  >
                    {isWorking ?
                      "Working..."
                    : selectedList.staffpick ?
                      "Remove as Staff Pick"
                    : "Add as Staff Pick"}
                  </SnipppButton>
                </div>
              </div>
            )}
          </div>
        : <div className="flex flex-col items-center justify-center">
            <LoadingSpinner />
            <p>{`Fetching Data for List #${listInput}`}</p>
          </div>
        }
      </>
    );
  } else {
    return <div>Sign in to manage staff picks</div>;
  }
};

export default CurationPanel;
