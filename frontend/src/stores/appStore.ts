import { create } from "zustand";

interface appStore {
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
}

export const useAppStore = create<appStore>()((set) => ({
  isAdmin: false,
  setIsAdmin: (value) => set({ isAdmin: value }),
}));
