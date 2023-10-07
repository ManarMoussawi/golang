import { create } from "zustand";

import { UserWithoutPassType } from "../../schemas/user/user";
import { browserAdress, serverAdress } from "../variables";
interface userStore {
  users: UserWithoutPassType[] | undefined;
  toggleCreate: boolean;
  toggleEdit: boolean;
  editedUser: UserWithoutPassType | undefined;
  selectedUser: UserWithoutPassType | undefined;
  setUsers: (data: UserWithoutPassType[] | undefined) => void;
  fetchUsers: () => Promise<UserWithoutPassType[] | undefined>;
  setToggleCreate: (value: boolean) => void;
  setToggleEdit: (value: boolean) => void;
  setEditedUser: (value: UserWithoutPassType | undefined) => void;
  setSelectedUser: (value: UserWithoutPassType | undefined) => void;
}

export const useUserStore = create<userStore>()((set) => ({
  users: [],
  toggleCreate: false,
  toggleEdit: false,
  editedUser: undefined,
  selectedUser: undefined,

  setUsers: (data) => set({ users: data }),
  fetchUsers: async () => {
    let token = localStorage.getItem("token");
    const res = await fetch(`${serverAdress}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (data.message) {
      window.location.href = `${browserAdress}/login`;
    }
    let users = data.users;
    const updatedUsers = users.map((user: UserWithoutPassType) => ({
      ...user,
      dateOfBirth: new Date(user.dateOfBirth),
    }));

    return updatedUsers;
  },

  setToggleCreate: (value) => set({ toggleCreate: value }),
  setToggleEdit: (value) => set({ toggleEdit: value }),
  setEditedUser: (value) => set({ editedUser: value }),
  setSelectedUser: (value) => set({ selectedUser: value }),
}));
