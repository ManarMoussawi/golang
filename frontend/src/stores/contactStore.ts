import { create } from "zustand";
import {
  ContactType,
  EmailError,
  PhoneError,
  ErrorObject,
} from "../../schemas/contact/contact";
import { browserAdress } from "../variables";
import { getFetch } from "../services/contacts";
interface store {
  toggleCreateContact: boolean;
  toggleEditContact: boolean;
  toggleSelectContact: boolean;
  toggleTable: boolean;
  selectedContact: ContactType | undefined;
  editedContact: ContactType | undefined;
  contacts: ContactType[];
  tableContacts: ContactType[];
  startAtContact: number;
  countContacts: number;
  perPageContacts: number;
  text: string;
  scope: string;
  checkByMe: boolean;
  errorObject_create: {
    FN_Error: string;
    LN_Error: string;
    Email_Error: EmailError[];
    Phone_Error: PhoneError[];
  };
  errorObject_edit: {
    FN_Error: string;
    LN_Error: string;
    Email_Error: EmailError[];
    Phone_Error: PhoneError[];
  };

  setCountContact: (value: number) => void;
  setStartAtContact: (value: number) => void;
  setToggleCreateContact: (value: boolean) => void;
  setToggleEditContact: (value: boolean) => void;
  setToggleSelectContact: (value: boolean) => void;
  setSelectedContact: (value: ContactType | undefined) => void;
  setToggleTable: (value: boolean) => void;
  setEditedContact: (value: ContactType | undefined) => void;
  setContacts: (value: ContactType[] | undefined) => void;
  setTableContacts: (value: ContactType[] | undefined) => void;
  setText: (value: string) => void;
  setScope: (value: string) => void;
  setCheckByMe: (value: boolean) => void;
  setErrorObject_create: (
    field: keyof ErrorObject,
    value: string | EmailError[] | PhoneError[]
  ) => void;
  setErrorObject_edit: (
    field: keyof ErrorObject,
    value: string | EmailError[] | PhoneError[]
  ) => void;

  fetchContacts: ({
    perPageContacts,
    startAtContact,
    scope,
    text,
    checkByMe,
  }: {
    perPageContacts: number;
    startAtContact: number;
    scope: string;
    text: string;
    checkByMe: boolean;
  }) => Promise<
    | {
        filteredContacts: ContactType[];
        count: number;
        tableFilteredContacts: ContactType[];
      }
    | undefined
  >;

  setPerPageContacts: (value: number) => void;
}

export const useContactStore = create<store>()((set) => ({
  toggleCreateContact: false,
  toggleEditContact: false,
  toggleSelectContact: false,
  toggleTable: false,
  selectedContact: undefined,
  editedContact: undefined,
  contacts: [],
  tableContacts: [],
  startAtContact: 0,
  countContacts: 0,
  perPageContacts: 4,
  text: "",
  scope: "all",
  checkByMe: false,
  errorObject_create: {
    FN_Error: "",
    LN_Error: "",
    Email_Error: [{ email: "" }],
    Phone_Error: [{ phone: "" }],
  },
  errorObject_edit: {
    FN_Error: "",
    LN_Error: "",
    Email_Error: [{ email: "" }],
    Phone_Error: [{ phone: "" }],
  },
  setStartAtContact: (value) => set({ startAtContact: value }),
  setCountContact: (value) => set({ countContacts: value }),
  setToggleCreateContact: (value) => set({ toggleCreateContact: value }),
  setToggleEditContact: (value) => set({ toggleEditContact: value }),
  setToggleSelectContact: (value) => set({ toggleSelectContact: value }),

  setSelectedContact: (value) => set({ selectedContact: value }),
  setToggleTable: (value) => set({ toggleTable: value }),
  setEditedContact: (value) => set({ editedContact: value }),
  setContacts: (values) => set({ contacts: values }),
  setTableContacts: (values) => set({ tableContacts: values }),
  setPerPageContacts: (value) => {
    set({ perPageContacts: value });
  },
  setText: (value) => set({ text: value }),
  setScope: (value) => set({ scope: value }),
  setCheckByMe: (value) => set({ checkByMe: value }),
  setErrorObject_create: (field, value) =>
    set((state) => ({
      errorObject_create: { ...state.errorObject_create, [field]: value },
    })),
  setErrorObject_edit: (field, value) =>
    set((state) => ({
      errorObject_edit: { ...state.errorObject_edit, [field]: value },
    })),

  fetchContacts: async ({
    perPageContacts,
    startAtContact,
    scope,
    text,
    checkByMe,
  }) => {
    try {
      const data = await getFetch(
        "/contacts/search",
        [],
        perPageContacts,
        startAtContact,
        scope,
        text,
        checkByMe
      );
      console.log("dataaaaaa", data);
      if (data.message) {
        window.location.href = `${browserAdress}/login`;
        return;
      }
      return {
        filteredContacts: data.filteredContacts,
        count: data.count,
        tableFilteredContacts: data.tableFilteredContacts,
      };
    } catch (err) {
      console.log("cant fetch contacts");
    }
  },
}));
