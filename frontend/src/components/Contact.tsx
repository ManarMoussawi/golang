import { useState } from "react";
import { ContactType } from "../../schemas/contact/contact";
import { AiOutlineEdit } from "react-icons/ai";
import { TiDeleteOutline } from "react-icons/ti";
import { useContactStore } from "../stores/contactStore";
import { browserAdress } from "../variables";
import { fetchAndDeleteContact } from "../services/contacts";

type ContactProps = {
  contact: ContactType;
};

const Contact = ({ contact }: ContactProps) => {
  const perPageContacts = useContactStore((state) => state.perPageContacts);
  const scope = useContactStore((state) => state.scope);
  let startAtContact = useContactStore((state) => state.startAtContact);
  const setStartAtContact = useContactStore((state) => state.setStartAtContact);

  const setTableContacts = useContactStore((state) => state.setTableContacts);
  const setToggleEditContact = useContactStore(
    (state) => state.setToggleEditContact
  );
  const setToggleSelectContact = useContactStore(
    (state) => state.setToggleSelectContact
  );
  const setContacts = useContactStore((state) => state.setContacts);
  const setSelectedContact = useContactStore(
    (state) => state.setSelectedContact
  );
  const setEditedContact = useContactStore((state) => state.setEditedContact);
  const fetchContacts = useContactStore((state) => state.fetchContacts);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDeleteContact = async () => {
    const token = localStorage.getItem("token");
    let id = contact._id as string;
    if (token) {
      try {
        const data = await fetchAndDeleteContact(id);
        if (data.isDeleted) {
          setStartAtContact(0);
          let dataFetched = await fetchContacts({
            perPageContacts,
            startAtContact,
            scope,
            text: "",
            checkByMe: false,
          });
          setContacts(dataFetched?.filteredContacts);
          setTableContacts(dataFetched?.tableFilteredContacts);
        }
        setConfirmDelete(false);
      } catch (err) {
        console.log(err);
      }
    } else {
      window.location.href = `${browserAdress}/login`;
    }
  };
  const id = localStorage.getItem("id");

  return (
    <div className="flex flex-col  w-[300px]">
      <div
        className={` mt-4 text-white  min-h-[50px] flex p-2 ${
          contact.scope == "public" ? "bg-green-900" : "bg-red-900"
        }`}
      >
        <div
          onClick={() => {
            setToggleSelectContact(true);
            setSelectedContact(contact);
          }}
          className=" flex-1 flex flex-col justify-start items-start"
        >
          <div>
            <p>
              {contact.firstname} {contact.lastname}
            </p>
            <p>{contact.scope}</p>
          </div>
        </div>
        {id === contact.createdBy && (
          <div className="flex">
            <AiOutlineEdit
              size="20px"
              onClick={() => {
                setToggleEditContact(true);
                setEditedContact(contact);
              }}
            />
            <TiDeleteOutline
              size="20px"
              onClick={() => setConfirmDelete(true)}
            />
          </div>
        )}
      </div>
      {confirmDelete && (
        <div className="bg-gray-600 px-2 text-white">
          <h1>Are you sure you want to delete contact?</h1>
          <button
            className="bg-white text-gray-700 px-3 border-2 border-gray-700 rounded-xl mr-6"
            onClick={() => handleDeleteContact()}
          >
            yes
          </button>
          <button
            className="bg-white text-gray-700 px-3 border-2 border-gray-700 rounded-xl"
            onClick={() => setConfirmDelete(false)}
          >
            no
          </button>
        </div>
      )}
    </div>
  );
};

export default Contact;
