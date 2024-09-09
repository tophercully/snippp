import { useEffect, useState } from "react";
import { ListData } from "../../typeInterfaces";
import {
  getStaffPicks,
  removeListFromStaffPicks,
} from "../../backend/list/listFunctions";
import { LoadingSpinner } from "../LoadingSpinner";
import SnipppButton from "../SnipppButton";
import ConfirmationPopup from "../popups/ConfirmationPopup";

const ExistingStaffPicks = () => {
  const [picks, setPicks] = useState<ListData[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [workingPick, setWorkingPick] = useState<number | null>(null);

  useEffect(() => {
    const getPicks = async () => {
      setIsLoading(true);
      const result = await getStaffPicks();
      setPicks(result);
      setIsLoading(false);
    };
    getPicks();
  }, []);

  const handleRemovePick = async (id: number, index: number) => {
    try {
      await removeListFromStaffPicks(id);
      if (picks) {
        const newPicks = [...picks];
        newPicks.splice(index, 1);
        setPicks(newPicks);
      }
    } catch (error) {
      console.error("Could not remove staff pick");
    }
  };

  return (
    <>
      <h2 className="mt-12">Current Staff Picked Lists:</h2>
      <div className="grid w-full grid-cols-2 gap-4">
        {picks?.map((pick, index) => {
          return (
            <div
              key={index}
              className="flex w-1/4 items-center p-4 shadow-md"
            >
              <div className="flex flex-1 flex-col">
                <h3 className="w-fit font-semibold">{pick.listname}</h3>
                <p className="w-fit text-sm">{pick.author}</p>
                <p className="w-fit text-xs">{`List #${pick.listid}`}</p>
              </div>
              <SnipppButton
                size="xs"
                colorType="delete"
                onClick={() => setWorkingPick(index)}
              >
                <img
                  src="/x.svg"
                  className={`invert group-hover:invert-0 ${workingPick == index ? "animate-pulse" : ""}`}
                />
              </SnipppButton>
            </div>
          );
        })}
      </div>
      {isLoading && (
        <div className="flex w-full justify-center">
          <LoadingSpinner />
        </div>
      )}
      {workingPick !== null && (
        <ConfirmationPopup
          isOpen={workingPick !== null}
          title={`Remove ${picks?.[workingPick].listname} from Staff Picks?`}
          confirmButtonText="Remove"
          onClose={() => setWorkingPick(null)}
          onConfirm={() => {
            if (picks)
              handleRemovePick(
                picks[workingPick].listid as number,
                workingPick,
              );
          }}
        />
      )}
    </>
  );
};

export default ExistingStaffPicks;
