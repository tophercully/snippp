import { useRouter } from "next/navigation";
import { useUser } from "../../contexts/UserContext";
import SnipppButton from "../universal/SnipppButton";
import { Snippet } from "../../types/typeInterfaces";
import { Signal } from "@preact-signals/safe-react";

interface DisplayToolbarProps {
  selection: Snippet;
  authorID: string;
  copySnippet: () => void;
  fetchUserLists: () => void;
  favoriteStatus: boolean;
  handleAddFavorite: () => void;
  handleShare: () => Promise<void>;
  isLoading: boolean;
  handleRemoveFavorite: () => void;
  showListPopup: Signal<boolean>;
  showDeleteConfirm: Signal<boolean>;
}

const DisplayToolbar: React.FC<DisplayToolbarProps> = ({
  selection,
  copySnippet,
  fetchUserLists,
  favoriteStatus,
  handleAddFavorite,
  isLoading,
  handleShare,
  authorID,
  handleRemoveFavorite,
  showListPopup,
  showDeleteConfirm,
}) => {
  const { userProfile } = useUser();
  const router = useRouter();
  return (
    <div
      id="controls"
      className="mb-3 flex flex-wrap items-center justify-start gap-5 p-2 lg:mb-0 lg:p-0"
    >
      <div
        id="non-owner-controls"
        className="flex flex-1 items-center justify-around gap-3 md:justify-start"
      >
        <SnipppButton
          onClick={copySnippet}
          size="md"
          tooltip="Copy Snippet"
        >
          <img
            src="/copy.svg"
            className="h-5 invert group-hover:invert-0 lg:mx-10 dark:invert-0"
          />
        </SnipppButton>

        {userProfile && !favoriteStatus && (
          <SnipppButton
            onClick={handleAddFavorite}
            disabled={isLoading}
            colorType="add"
            fit={true}
            size="md"
            tooltip="Add/Remove Favorite"
          >
            <span className="flex items-center">
              <img
                src="/heart-empty.svg"
                className="h-5 group-hover:invert dark:invert"
              />
              <span className="hidden text-sm font-normal sm:inline">
                {isLoading ? "ADDING..." : ""}
              </span>
            </span>
          </SnipppButton>
        )}
        {userProfile && favoriteStatus && (
          <SnipppButton
            onClick={handleRemoveFavorite}
            disabled={isLoading}
            colorType="delete"
            fit={true}
            size="md"
            tooltip="Add/Remove Favorite"
          >
            <span className="flex items-center">
              <img
                src="/heart-full.svg"
                className="h-5 group-hover:invert dark:invert"
              />
              <span className="hidden text-sm font-normal sm:inline">
                {isLoading ? "REMOVING..." : ""}
              </span>
            </span>
          </SnipppButton>
        )}

        {userProfile && (
          <>
            <SnipppButton
              onClick={() => {
                showListPopup.value = true;
                fetchUserLists();
              }}
              colorType="neutral"
              size="md"
              tooltip="Add to List"
            >
              <img
                src="/folder.svg"
                className="h-5 invert group-hover:invert-0 dark:invert-0"
              />
            </SnipppButton>
            <SnipppButton
              onClick={() => {
                router.push(`/builder/${selection.snippetID}/fork`);
              }}
              colorType="add"
              size="md"
              tooltip="Fork your own copy of this Snippet"
            >
              <img
                src="/fork.svg"
                className="h-5 invert group-hover:invert-0 dark:invert-0"
              />
            </SnipppButton>
          </>
        )}
        <SnipppButton
          onClick={handleShare}
          colorType="neutral"
          size="md"
          tooltip="Share snippet"
        >
          <img
            src="/share.svg"
            className="h-5 invert group-hover:invert-0 dark:invert-0"
          />
        </SnipppButton>
      </div>

      {userProfile && userProfile.id === authorID && (
        <div
          id="over-controls"
          className="ml-auto flex w-full gap-3 lg:w-fit"
        >
          <SnipppButton
            href={`/builder/${selection.snippetID}`}
            colorType="neutral"
            size="md"
            fit={false}
            tooltip="Edit Snippet"
          >
            <span className="flex items-center justify-center gap-3">
              <img
                src="/edit.svg"
                className="h-5 group-hover:invert dark:invert"
              />
              <span className="flex text-sm md:hidden 2xl:flex">EDIT</span>
            </span>
          </SnipppButton>
          <SnipppButton
            onClick={() => (showDeleteConfirm.value = true)}
            colorType="delete"
            size="md"
            fit={false}
            tooltip="Delete Snippet"
          >
            <span className="flex items-center justify-center gap-3">
              <img
                src="/trash.svg"
                className="h-5 invert group-hover:invert-0 dark:invert-0"
              />
              <span className="flex text-sm md:hidden 2xl:flex">DELETE</span>
            </span>
          </SnipppButton>
        </div>
      )}
    </div>
  );
};

export default DisplayToolbar;
