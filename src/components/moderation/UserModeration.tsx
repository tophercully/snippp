import { useEffect, useState } from "react";
import { fetchAllUsers, setUserRole } from "../../backend/user/userFunctions";
import { SnipppProfile } from "../../typeInterfaces";
import { LoadingSpinner } from "../LoadingSpinner";
import formatPostgresDate from "../../utils/formatPostgresDate";
import { useNotif } from "../../hooks/Notif";
import ConfirmationPopup from "../popups/ConfirmationPopup";

const UserModeration = () => {
  const [selectedUser, setSelectedUser] = useState<SnipppProfile | undefined>(
    undefined,
  );
  const [allUsers, setAllUsers] = useState<SnipppProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showRoleConfirmation, setShowRoleConfirmation] = useState(false);
  const { showNotif } = useNotif();
  const [roleToSet, setRoleToSet] = useState<
    "user" | "admin" | "moderator" | "banned" | undefined
  >(undefined);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      const result = await fetchAllUsers();
      setAllUsers(result);
      setSelectedUser(result[0]);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    setRoleToSet(selectedUser?.role || undefined);
  }, [selectedUser]);

  // Filter users based on search term
  const filteredUsers = allUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleRoleChange = async (role: string) => {
    if (selectedUser) {
      //try set user role and notify if successful or failed
      try {
        await setUserRole({
          userId: selectedUser.userId,
          newRole: role as "user" | "admin" | "moderator" | "banned",
        });
        showNotif("User role updated successfully!", "success", 5000);
        // Refetch all users
        const result = await fetchAllUsers();
        setAllUsers(result);
      } catch (error) {
        showNotif("Failed to update user role", "error", 5000);
      }
    }
  };

  return (
    <>
      {allUsers.length > 0 && selectedUser ?
        <div className="w-full">
          <h2 className="font-semibold">{`Select User (total ${allUsers.length})`}</h2>

          <div className="flex h-[60svh] gap-4">
            <div className="flex w-1/2 flex-col">
              <input
                type="text"
                placeholder="Search users"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 shadow-md"
              />
              <ul className="w-full overflow-y-auto shadow-md">
                {filteredUsers.map((user) => (
                  <li
                    key={user.userId}
                    onClick={() => setSelectedUser(user)}
                    className={`cursor-pointer ${user == selectedUser ? "invert" : "invert-0"} bg-base-50 px-1 py-2 hover:bg-base-150`}
                  >
                    {user.name} - {user.role}
                  </li>
                ))}
              </ul>
            </div>

            {selectedUser && (
              <div className="grid w-full grid-cols-2 gap-4 text-wrap break-words bg-base-100 p-4 shadow-md">
                <p>
                  Profile Picture:{" "}
                  <img
                    className="h-fit w-1/2"
                    src={selectedUser.profile_picture}
                  ></img>
                </p>
                <p>Name: {selectedUser.name}</p>
                <p>User ID: {selectedUser.userId}</p>
                <p>Email: {selectedUser.email}</p>
                <p>
                  Created At:{" "}
                  {formatPostgresDate(selectedUser.created_at as string)}
                </p>
                <p>
                  Last Login:{" "}
                  {formatPostgresDate(selectedUser.last_login as string)}
                </p>
                <p>Bio: {selectedUser.bio}</p>
                <p>Role: {selectedUser.role}</p>
                <form className="flex flex-col gap-2">
                  <h3>Set user role:</h3>
                  <select
                    value={
                      roleToSet as "user" | "admin" | "moderator" | "banned"
                    }
                    onChange={(e) => setRoleToSet(e.target.value as any)}
                    className="w-full p-2"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="moderator">Moderator</option>
                    <option value="banned">Banned</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowRoleConfirmation(true)}
                    className="w-full bg-black p-2 text-white"
                  >
                    Save
                  </button>
                </form>
              </div>
            )}
          </div>
          <ConfirmationPopup
            isOpen={showRoleConfirmation}
            onClose={() => setShowRoleConfirmation(false)}
            onConfirm={() => handleRoleChange(roleToSet as string)}
            title={`Assign ${selectedUser?.name} as ${roleToSet}?`}
            description="Are you sure?"
            confirmButtonText="Set Role"
          />
        </div>
      : <div className="flex w-full flex-col items-center">
          <LoadingSpinner />
          <p>Loading users</p>
        </div>
      }
    </>
  );
};

export default UserModeration;
