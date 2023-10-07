import { useUserStore } from "../stores/userStore";

const UserInfo = () => {
  const setSelectedUser = useUserStore((state) => state.setSelectedUser);
  const selectedUser = useUserStore((state) => state.selectedUser);
  let browserCreatedAt = "",
    browserUpdatedAt = "";
  if (selectedUser?.createdAt) {
    browserCreatedAt = new Date(selectedUser.createdAt)
      .toISOString()
      .toString();
  }
  if (selectedUser?.editedAt) {
    browserUpdatedAt = new Date(selectedUser.editedAt).toISOString().toString();
  }
  return (
    <div>
      <div className=" p-2 m-1 bg-slate-600 w-[310px] text-white flex items-start">
        <div className="flex-auto flex flex-col ">
          <p className=" font-extrabold text-pink-400">User Information</p>
          <p>firstname : {selectedUser?.firstname}</p>
          <p>lastname : {selectedUser?.lastname}</p>
          <p>username : {selectedUser?.username}</p>
          <p>
            date of birth :
            {selectedUser?.dateOfBirth.toString().substring(0, 16)}
          </p>
          <p>is admin : {selectedUser?.isAdmin.toString()}</p>
          <p>is deleted : {selectedUser?.isDeleted.toString()}</p>
          <p>created at : {browserCreatedAt}</p>
          <p>updated at :{browserUpdatedAt}</p>
          <p>created by : {selectedUser?.createdBy}</p>
          <p>updated by :{selectedUser?.editedBy?.toString()}</p>
        </div>
        <button
          className="text-xl font-bold"
          onClick={() => setSelectedUser(undefined)}
        >
          X
        </button>
      </div>
    </div>
  );
};

export default UserInfo;
