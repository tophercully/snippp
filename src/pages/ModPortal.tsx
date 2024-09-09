import { useNavigate, useParams } from "react-router-dom";
import CurationPanel from "../components/moderation/CurationPanel";
import UserModeration from "../components/moderation/UserModeration";
import { Navbar } from "../components/nav/Navbar";
import { useLocalStorage } from "@uidotdev/usehooks";
import { GoogleUser, SnipppProfile } from "../typeInterfaces";
import { useEffect, useState } from "react";
import { fetchUserProfile } from "../backend/user/userFunctions";
import { LoadingSpinner } from "../components/LoadingSpinner";
import ExistingStaffPicks from "../components/moderation/ExistingStaffPicks";

const ModPortal = () => {
  const { panel } = useParams();
  const navigate = useNavigate();
  const [userProfile] = useLocalStorage<GoogleUser | null>("userProfile", null);
  const [isAllowed, setIsAllowed] = useState(false);
  const [isValidating, setIsValidating] = useState(true);

  // Check priviledges
  useEffect(() => {
    const checkUser = async () => {
      if (userProfile) {
        const result = (await fetchUserProfile(
          userProfile.id,
        )) as SnipppProfile;
        if (result?.role == "moderator" || result.role == "admin") {
          setIsAllowed(true);
          setIsValidating(false);
        } else {
          setIsValidating(false);
        }
      } else {
        // lack of user is denied too
        setIsValidating(false);
      }
    };
    checkUser();
  }, [userProfile]);

  return (
    <div className="relative flex min-h-[100svh] w-[99svw] flex-col items-center justify-start gap-12 bg-base-50 p-2 pb-32 pt-32 font-satoshi md:p-16 md:pt-32 dark:bg-base-800">
      <Navbar />
      {isValidating ?
        <div className="flex flex-col items-center justify-center">
          <LoadingSpinner />
          <p>Validating Moderator</p>
        </div>
      : <>
          {isAllowed ?
            <>
              <h1 className="w-full self-start justify-self-start text-2xl font-bold">
                Snippp Platform Moderation
              </h1>
              <div
                id="content"
                className="flex h-[60svh] w-full items-center justify-center"
              >
                <>
                  {!panel && (
                    <div className="flex h-full w-1/3 items-center justify-center gap-8">
                      <button
                        onClick={() => navigate("/mod/users")}
                        className="h-fit text-nowrap bg-black p-8 text-xl text-white"
                      >
                        User Moderation
                      </button>
                      <button
                        onClick={() => navigate("/mod/staffpicks")}
                        className="h-fit text-nowrap bg-black p-8 text-xl text-white"
                      >
                        Manage Staff Picks
                      </button>
                    </div>
                  )}
                  {panel == "users" && <UserModeration />}
                  {panel == "staffpicks" && (
                    <div className="flex w-full flex-col gap-4">
                      <CurationPanel />
                      <ExistingStaffPicks />
                    </div>
                  )}
                </>
              </div>
            </>
          : <h1 className="bg-error p-4 text-white">You're not allowed here</h1>
          }
        </>
      }
    </div>
  );
};

export default ModPortal;
