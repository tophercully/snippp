import { useEffect, useState } from "react";
import { fetchAllUsers } from "../../backend/user/userFunctions";
import { SnipppProfile } from "../../typeInterfaces";
import { LoadingSpinner } from "../LoadingSpinner";

const ModUsers = () => {
  const [selectedUser, setSelectedUser] = useState<SnipppProfile | null>(null);
  const [allUsers, setAllUsers] = useState<SnipppProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      const result = await fetchAllUsers();
      setAllUsers(result);
      setSelectedUser(result[0]);
    };
    fetchUsers();
  }, []);

  // Filter users based on search term
  const filteredUsers = allUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  console.log(allUsers);

  return (
    <>
      {allUsers.length > 0 ?
        <div className="w-full">
          <h2 className="font-semibold">{`Select User (total ${allUsers.length})`}</h2>

          <div className="flex h-[50svh] gap-4">
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
                <p>Created At: {selectedUser.created_at}</p>
                <p>Last Login: {selectedUser.last_login}</p>
                <p>Bio: {selectedUser.bio}</p>
                <p>Role: {selectedUser.role}</p>
              </div>
            )}
          </div>
        </div>
      : <div className="flex w-full flex-col items-center">
          <LoadingSpinner />
          <p>Loading users</p>
        </div>
      }
    </>
  );
};

export default ModUsers;
