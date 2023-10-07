import React from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { TiDeleteOutline } from "react-icons/ti";
import { UserWithoutPassType } from "../../schemas/user/user";
import { useUserStore } from "../stores/userStore";
import { fetchUserFoftDelete } from "../services/contacts";
type UserProps = {
  user: UserWithoutPassType;
};
const User = ({ user }: UserProps) => {
  const setToggleEdit = useUserStore((state) => state.setToggleEdit);
  const setEditedUser = useUserStore((state) => state.setEditedUser);
  const setSelectedUser = useUserStore((state) => state.setSelectedUser);
  const setUsers = useUserStore((state) => state.setUsers);
  const fetchUsers = useUserStore((state) => state.fetchUsers);

  const handleSoftDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (token) {
      try {
        let userId = user._id as string;
        console.log(userId);

        const data = await fetchUserFoftDelete(userId);
        console.log(data);
        if (data.deleted == true) {
          const result = await fetchUsers();
          setUsers(result);
        }
      } catch (err) {
        console.log("cant delete user");
      }
    }
  };
  return (
    <div className="w-250px p-2 m-1 bg-slate-600 w-[300px] text-white flex">
      <div
        className="flex-auto flex flex-col"
        onClick={() => setSelectedUser(user)}
      >
        <p>firstname : {user.firstname}</p>
        <p>lastname : {user.lastname}</p>
        <p>username : {user.username}</p>
      </div>
      <div className="flex">
        <AiOutlineEdit
          size="20px"
          onClick={() => {
            setToggleEdit(true);
            setEditedUser(user);
          }}
        />
        <TiDeleteOutline
          size="20px"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
            handleSoftDelete(e)
          }
        />
      </div>
    </div>
  );
};

export default User;
