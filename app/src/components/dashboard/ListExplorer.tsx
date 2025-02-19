import { useRouter } from "next/navigation";
import { GoogleUser, ListData } from "../../types/typeInterfaces";
import { Signal } from "@preact-signals/safe-react";
import { ListLists } from "../browser/ListLists";
import { useUser } from "../../contexts/UserContext";
import { LoadingSpinner } from "../universal/LoadingSpinner";

interface ListExplorerProps {
  lists: ListData[];
  listsLoading: Signal<boolean>;
  fetchAndSetLists: () => void;
}

const ListExplorer: React.FC<ListExplorerProps> = ({
  lists,
  listsLoading,
  fetchAndSetLists,
}) => {
  const router = useRouter();
  const { userProfile } = useUser();
  return (
    <div
      className={`flex ${listsLoading ? "h-fit" : "h-full"} h-full w-full flex-col overflow-hidden lg:w-1/3`}
    >
      <ListLists
        profile={userProfile as GoogleUser}
        lists={lists}
        addDisabled={false}
        onSelectList={(listItem) =>
          router.push(`/dashboard/${listItem.listid}`)
        }
        onAddList={fetchAndSetLists}
        onRefreshLists={fetchAndSetLists}
      />

      {listsLoading.value && (
        <div className="flex w-full items-center justify-center p-4 text-center text-base-600 dark:text-base-50">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};

export default ListExplorer;
