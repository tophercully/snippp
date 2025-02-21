"use client";
import { useSessionStorage } from "@uidotdev/usehooks";

import { useEffect, useState } from "react";
import { editUserProfile, UserStats } from "../../backend/user/userFunctions";

import { formatDescription } from "../../utils/formatDescription";
import { SnipppProfile } from "../../types/typeInterfaces";
import { useParams } from "next/navigation";
import { useUser } from "../../contexts/UserContext";
import { useNotif } from "../../contexts/NotificationContext";
import SnipppButton from "../universal/SnipppButton";
import api from "../../backend/api";

import Distribution from "../statsTools/Distribution";

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
  const { options } = useParams();
  const userid = options ? options[0] : null;
  const { name, bio, profile_picture, last_login } = snipppUser;
  const { userProfile } = useUser();
  const [isEditing, setIsEditing] = useSessionStorage(
    "isEditingProfile",
    false,
  );
  const [newProfile, setNewProfile] = useState({
    name: name,
    bio: bio,
  });
  const [stats, setStats] = useState<UserStats | null>();

  const { showNotif } = useNotif();

  const isOnline = isWithinOneHour(last_login);

  useEffect(() => {
    const getStats = async () => {
      const result = await api.users.getStatsById(userid ? userid : "");
      setStats(result);
    };
    getStats();
  }, []);

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
    <div className="flex w-full flex-col flex-wrap gap-4 rounded-sm p-4 shadow-md lg:flex-row lg:gap-10 dark:text-base-50">
      {/* <div className="relative aspect-square w-full rounded-full lg:w-96"> */}
      <img
        src={profile_picture}
        className={`aspect-square h-32 rounded-md border-4 object-contain ${isOnline ? "animate-online" : "border-transparent"}`}
        alt="Profile"
        // style={{ objectPosition: "top" }}
      />
      {/* </div> */}
      <div
        id="allInfo"
        className="flex flex-1 flex-col justify-between gap-4"
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
              className="w-full rounded-sm border p-2 text-3xl font-semibold dark:bg-base-900 dark:text-base-100"
            />
            <textarea
              name="bio"
              value={newProfile.bio}
              onChange={handleChange}
              className="min-h-52 w-full flex-grow resize-none rounded-sm border p-2 dark:bg-base-900 dark:text-base-100"
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
            className="ml-auto flex items-center gap-4"
          >
            <SnipppButton
              size="sm"
              onClick={handleCancel}
              colorType="delete"
              tooltip="Cancel"
            >
              <img
                src="/x.svg"
                className="h-6 invert group-hover:invert-0 dark:invert-0"
              />
            </SnipppButton>
            <SnipppButton
              size="sm"
              onClick={handleSaveProfile}
            >
              <span className="text-sm">SAVE</span>
            </SnipppButton>
          </div>
        )}
      </div>
      {stats && (
        <div
          id="stats"
          className="flex h-full w-full flex-col gap-4"
        >
          {/* <div className="flex h-fit w-full max-w-[80vw] flex-col gap-4">
            <StatCard
              title="SNIPPETS CREATED"
              value={simplifyNumber(stats?.totalSnippets)}
              icon={<Scissors />}
            />
            <StatCard
              title="COPIES RECEIVED"
              value={simplifyNumber(stats?.totalSnippetCopies)}
              icon={<Plus />}
            />
            <StatCard
              title="FAVORITES RECEIVED"
              value={simplifyNumber(stats?.totalFavorites)}
              icon={<Heart />}
            />
          </div> */}
          {Object.keys(stats?.languageDistribution as any).length != 0 && (
            <Distribution
              small={true}
              data={stats?.languageDistribution as { [key: string]: number }}
              title="Language Distribution"
            />
          )}
          {Object.keys(stats?.frameworkDistribution as any).length != 0 && (
            <Distribution
              small={true}
              data={stats?.frameworkDistribution as { [key: string]: number }}
              title="Framework Distribution"
            />
          )}
        </div>
      )}
    </div>
  );
};
