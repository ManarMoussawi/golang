import { useEffect, useState } from "react";
import { useContactStore } from "../stores/contactStore";
import { fetchUserFullName } from "../services/contacts";
const ContactInfo = () => {
  const [fullname, setFullname] = useState("");
  const setSelectedContact = useContactStore(
    (state) => state.setSelectedContact
  );
  const selectedContact = useContactStore((state) => state.selectedContact);
  const setToggleSelectContact = useContactStore(
    (state) => state.setToggleSelectContact
  );

  let userId = selectedContact?.createdBy as string;

  useEffect(() => {
    const setTheFullName = async () => {
      const full_name = await fetchUserFullName(userId);
      setFullname(full_name);
    };
    setTheFullName();
  }, [selectedContact]);

  let browserCreatedAt = "",
    browserUpdatedAt = "";
  if (selectedContact?.createdAt != undefined) {
    browserCreatedAt = new Date(selectedContact.createdAt)
      .toLocaleString()
      .toString();
  }
  if (selectedContact?.updatedAt != undefined) {
    browserUpdatedAt = new Date(selectedContact.updatedAt)
      .toLocaleString()
      .toString();
  }

  return (
    <div>
      <div className=" p-2 m-1  bg-slate-600 w-[310px] text-white flex items-start">
        <div className="flex-auto flex flex-col ">
          <p className=" font-extrabold text-pink-400">contact Information</p>
          <p>firstname : {selectedContact?.firstname}</p>
          <p>lastname : {selectedContact?.lastname}</p>
          <div>
            <h1 className="font-bold underline">Email(s)</h1>
            {selectedContact?.emails.map((email, index) => (
              <p key={index}>{email.email}</p>
            ))}
          </div>
          <div>
            <h1 className="font-bold underline">Phone Number(s)</h1>
            {selectedContact?.phoneNumbers.map((phone, index) => (
              <p key={index}>{phone.phone}</p>
            ))}
          </div>
          <p>scope : {selectedContact?.scope}</p>
          <p>created at : {browserCreatedAt}</p>
          <p>updated at :{browserUpdatedAt}</p>
          <p>created by : {fullname}</p>
          <p>updated by :{fullname}</p>
        </div>
        <button
          className="text-xl font-bold"
          onClick={() => {
            setToggleSelectContact(false);
            setSelectedContact(undefined);
          }}
        >
          X
        </button>
      </div>
    </div>
  );
};

export default ContactInfo;
