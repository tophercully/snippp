import { useRouter } from "next/navigation";
import { useNotif } from "../../contexts/NotificationContext";
import { useUser } from "../../contexts/UserContext";
import { exportAndDownloadUserSnippets } from "../../utils/downloadUserSnippets";
import SnipppButton from "../universal/SnipppButton";
import Link from "next/link";
import { signal } from "@preact-signals/safe-react";
import { ListData, Snippet } from "../../types/typeInterfaces";
import EditListPopup from "../modals/EditListPopup";
import ConfirmationPopup from "../modals/ConfirmationPopup";
import api from "../../backend/api";
import useCookie from "../../hooks/useCookie";
import { formatDescription } from "../../utils/formatDescription";

interface ListDetailsProps {
  list: ListData | null;
  snippets: Snippet[];
  setListsToDefault: () => void;
  fetchAndSetLists: () => void;
}

const isDescriptionExpanded = signal<boolean>(false);
const isSaving = signal<boolean>(false);
const showDeleteConfirmation = signal<boolean>(false);
const newListName = signal<string>("");
const newDescription = signal<string>("");

const ListDetails = ({
  list,
  snippets,
  setListsToDefault,
  fetchAndSetLists,
}: ListDetailsProps) => {
  const { showNotif } = useNotif();
  const { userProfile } = useUser();
  const router = useRouter();
  const [isEditing, setIsEditing] = useCookie("isEditingList", false);

  const handleDeleteList = () => {
    showDeleteConfirmation.value = true;
  };
  const confirmDeleteList = async () => {
    try {
      await api.lists.delete(list?.listid as number);
      showNotif("Deleted List", "success", 5000);
      router.back();
      fetchAndSetLists();
    } catch (error) {
      showNotif("Error Deleting List:" + error, "error");
    }
  };

  const handleEditList = () => {
    if (list) {
      newListName.value = list.listname;
      newDescription.value = list.description || "";
      setIsEditing(true);
    }
  };
  const handleCancel = () => {
    if (isEditing) {
      setIsEditing(false);
    }
  };

  const handleSaveList = async (newName: string, newDesc: string) => {
    console.log(`Saving list with name: ${newName} and desc: ${newDesc}`);
    console.log(`List ID: ${list?.listid}`);
    if (userProfile) {
      isSaving.value = true;

      try {
        await api.lists.update(list?.listid as number, newName, newDesc);
        fetchAndSetLists();
        showNotif("List Updated", "success", 5000);
        isSaving.value = false;

        // Reset form and hide it
        newListName.value = "";
        newDescription.value = "";
        setIsEditing(false);
        fetchAndSetLists();
      } catch (error) {
        console.error(error);
        showNotif(`Error Updating List: ${error}`, "error", 5000);
        isSaving.value = false;
      }
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/list/${list?.listid}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${list?.listname} on Snippp.io`,
          text: "Check out this list on Snippp.io :)",
          url: shareUrl,
        });
        console.log("Shared successfully");
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        showNotif("LINK TO LIST COPIED", "info", 3000);
      } catch (err) {
        console.log("Error copying to clipboard:", err);
        alert("Unable to share. Please copy this link manually: " + shareUrl);
      }
    }
  };

  return (
    <div className="flex w-full flex-col justify-start">
      <button
        className="group flex h-10 items-center gap-3 p-2 duration-75 hover:gap-2 hover:bg-base-200 hover:py-1 dark:invert"
        onClick={async () => {
          router.push("/dashboard");
          setListsToDefault();
          fetchAndSetLists();
        }}
      >
        <img
          src="/arrow-left.svg"
          className="h-full invert"
        />
        <p className="hidden group-hover:flex dark:invert">BACK TO LISTS</p>
      </button>
      <div className="rounded-sm bg-base-150 p-4 text-base-950 dark:bg-base-800 dark:text-base-50">
        <div className="flex items-center justify-between">
          <a
            href={`${window.location.origin}/list/${list?.listid}`}
            className="mr-auto text-2xl font-bold"
          >
            {list?.listname}
          </a>
          {(list?.listid == "mysnippets" || list?.listid == "favorites") && (
            <SnipppButton
              size="sm"
              tooltip="Export Snippets as JSON"
              onClick={() => {
                exportAndDownloadUserSnippets(
                  list?.listname as string,
                  snippets,
                );
                showNotif("Downloaded Snippets as JSON", "success", 5000);
              }}
            >
              <img
                src="/download.svg"
                className="invert group-hover:invert-0 dark:invert-0"
              />
            </SnipppButton>
          )}
          {list?.listid != "mysnippets" && list?.listid != "favorites" && (
            <div className="flex gap-4">
              <SnipppButton
                onClick={handleShare}
                fit={true}
                size={"sm"}
                colorType="neutral"
                tooltip="Share List"
              >
                <img
                  src="/share.svg"
                  className="invert group-hover:invert-0 dark:invert-0"
                />
              </SnipppButton>
              <SnipppButton
                onClick={handleEditList}
                fit={true}
                size={"sm"}
                colorType="neutral"
                tooltip="Edit List"
              >
                <img
                  src="/edit.svg"
                  className="group-hover:invert dark:invert"
                />
              </SnipppButton>
              <SnipppButton
                onClick={handleDeleteList}
                fit={true}
                size={"sm"}
                colorType="delete"
                tooltip="Delete List"
              >
                <img
                  src="/trash.svg"
                  className="invert group-hover:invert-0 dark:invert-0"
                />
              </SnipppButton>
            </div>
          )}
        </div>
        <Link href={`/user/${userProfile?.id}`}>{userProfile?.name}</Link>
        {list?.description && (
          <div className="mt-4">
            <p
              className={`overflow-hidden font-thin transition-all duration-75 ${
                isDescriptionExpanded.value ? "" : "line-clamp-2"
              }`}
              dangerouslySetInnerHTML={{
                __html: formatDescription(list?.description),
              }}
            ></p>
            <button
              className="mt-2 text-sm text-base-950 hover:underline dark:text-base-50"
              onClick={() =>
                (isDescriptionExpanded.value = !isDescriptionExpanded.peek())
              }
            >
              {isDescriptionExpanded.value ? "Show less" : "Show more"}
            </button>
          </div>
        )}
      </div>
      <ConfirmationPopup
        isOpen={showDeleteConfirmation.value}
        onClose={() => (showDeleteConfirmation.value = false)}
        onConfirm={confirmDeleteList}
        title={`Delete ${list?.listname}?`}
        description="Are you sure you want to delete this list?"
        confirmButtonText="Delete"
      />
      <EditListPopup
        isOpen={isEditing}
        onClose={handleCancel}
        onSave={handleSaveList}
        isSaving={isSaving.value}
        name={list?.listname || ""}
        description={list?.description || ""}
      />
    </div>
  );
};

export default ListDetails;
