import { useEffect } from "react";
import CreateUserForm from "../components/CreateUserForm";
import User from "../components/User";
import UserInfo from "../components/UserInfo";
import EditUserForm from "../components/EditUserForm";
import { useUserStore } from "../stores/userStore";

const Users = () => {
  const users = useUserStore((state) => state.users);
  const setUsers = useUserStore((state) => state.setUsers);
  const fetchUsers = useUserStore((state) => state.fetchUsers);
  const setToggleCreate = useUserStore((state) => state.setToggleCreate);
  const toggleCreate = useUserStore((state) => state.toggleCreate);
  const toggleEdit = useUserStore((state) => state.toggleEdit);
  const selectedUser = useUserStore((state) => state.selectedUser);

  const fetchUsersAtBeginning = async () => {
    const data = await fetchUsers();
    setUsers(data);
  };
  useEffect(() => {
    fetchUsersAtBeginning();
  }, []);

  return (
    <div className="flex">
      <div className="flex-1">
        <p className="text-center text-2xl">users</p>
        <button
          className="bg-slate-500 text-white rounded-lg mx-2 p-1"
          onClick={() => setToggleCreate(true)}
        >
          Create new user
        </button>

        <div className="flex justify-around">
          <div>
            {users?.map((user, index) => (
              // <div key={user._id}>
              <div key={index}>
                <User user={user} />
              </div>
            ))}
          </div>
          <div>{toggleCreate && <CreateUserForm />}</div>
          <div>{toggleEdit && <EditUserForm />}</div>
        </div>
      </div>
      <div className="flex-1">
        <div>{selectedUser && <UserInfo />}</div>
        <div></div>
      </div>
    </div>
  );
};

export default Users;
