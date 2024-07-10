import { useLocalStorage } from "@uidotdev/usehooks";
import { GoogleUser, SnipppProfile } from "../typeInterfaces";
import SnipppButton from "./SnipppButton";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { editUserProfile } from "../backend/user/userFunctions";
import { useNotif } from "../hooks/Notif";
import { formatDescription } from "../utils/formatDescription";

interface ProfileInfoParams {
  snipppUser: SnipppProfile;
  onUpdateUser: (updatedProfileData: Partial<SnipppProfile>) => void;
}

function isWithinOneHour(timestamp: string | number | Date): boolean {
  // Convert the input timestamp to a Date object
  const timestampDate = new Date(timestamp);
  // Get the current time
  const now = new Date();
  // Calculate the difference in milliseconds
  const differenceMs = now.getTime() - timestampDate.getTime();
  // Convert one hour to milliseconds
  const oneHourMs = 60 * 60 * 1000;
  // Check if the difference is less than one hour
  return differenceMs < oneHourMs;
}

export const ProfileInfo = ({
  snipppUser,
  onUpdateUser,
}: ProfileInfoParams) => {
  const { userid } = useParams();
  const { name, bio, profile_picture, last_login } = snipppUser;
  const [userProfile] = useLocalStorage<GoogleUser | null>("userProfile", null);
  const [isEditing, setIsEditing] = useState(false);
  const [newProfile, setNewProfile] = useState({
    name: name,
    bio: bio,
  });
  const { showNotif } = useNotif();

  const isOnline = isWithinOneHour(last_login);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setNewProfile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewProfile({
      name: name,
      bio: bio,
    });
  };

  const handleSaveProfile = async () => {
    try {
      const success = await editUserProfile({
        id: userid as string,
        name: newProfile.name,
        bio: newProfile.bio,
      });

      if (success) {
        setIsEditing(false);
        console.log("Profile updated successfully");
        showNotif("Profile Updated", "success", 5000);
        onUpdateUser({
          name: newProfile.name,
          bio: newProfile.bio,
        } as Partial<SnipppProfile>);
      } else {
        console.log("Profile update failed");
        showNotif("Profile Update Failed", "error");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      showNotif("Error updating profile", "error");
    }
  };

  return (
    <div className="flex w-full flex-col gap-4 rounded-sm bg-base-50 p-4 shadow-md lg:w-2/3 lg:flex-row lg:gap-10">
      <img
        src={profile_picture}
        className={`aspect-square w-full rounded-sm border-4 lg:w-96 ${isOnline ? "animate-online" : "border-transparent"}`}
        alt="Profile"
      />
      <div
        id="allInfo"
        className="flex h-full flex-1 flex-col justify-between gap-4"
      >
        {isEditing ?
          <div
            id="editInfo"
            className="flex h-full w-full flex-1 flex-grow flex-col gap-4"
          >
            <input
              name="name"
              value={newProfile.name}
              onChange={handleChange}
              className="w-full border p-2 text-3xl font-semibold"
            />
            <textarea
              name="bio"
              value={newProfile.bio}
              onChange={handleChange}
              className="min-h-52 w-full flex-grow resize-none border p-2"
            />
          </div>
        : <div className="flex h-full w-full flex-1 flex-grow flex-col gap-4">
            <span className="text-3xl font-semibold">{name}</span>
            <h1
              dangerouslySetInnerHTML={{ __html: formatDescription(bio) }}
            ></h1>
          </div>
        }
        {userProfile && userProfile.id == userid && !isEditing && (
          <div
            id="editButton"
            className="ml-auto"
          >
            <SnipppButton
              size="sm"
              onClick={handleEditClick}
            >
              <img
                src="/edit.svg"
                className="group-hover:invert dark:invert"
              />
            </SnipppButton>
          </div>
        )}
        {isEditing && (
          <div
            id="Save-Cancel"
            className="ml-auto flex gap-4"
          >
            <SnipppButton
              size="sm"
              onClick={handleCancel}
              colorType="delete"
            >
              <img
                src="/x.svg"
                className="invert group-hover:invert-0 dark:invert-0"
              />
            </SnipppButton>
            <SnipppButton
              size="sm"
              onClick={handleSaveProfile}
            >
              SAVE
            </SnipppButton>
          </div>
        )}
      </div>
    </div>
  );
};
