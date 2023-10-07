import React, { useState, useEffect, ChangeEvent } from "react";
import {
  ContactType,
  EmailError,
  PhoneError,
} from "../../schemas/contact/contact";
import { useContactStore } from "../stores/contactStore";

type contactFormProps = {
  handleSubmitContact: (
    firstname: string,
    lastname: string,
    emails: EmailError[],
    phoneNumbers: PhoneError[],
    scope: string
  ) => Promise<{
    FN_Error: string;
    LN_Error: string;
    Email_Error: EmailError[];
    Phone_Error: PhoneError[];
  } | void>;

  title: string;
  buttonTitle: string;
  errorObject: {
    FN_Error: string;
    LN_Error: string;
    Email_Error: EmailError[];
    Phone_Error: PhoneError[];
  };
  type: string;
};

const ContactForm = ({
  handleSubmitContact,
  title,
  buttonTitle,
  errorObject,
  type,
}: contactFormProps) => {
  const editedContact = useContactStore(
    (state) => state.editedContact
  ) as ContactType;
  const setEditedContact = useContactStore((state) => state.setEditedContact);

  const setToggleCreateContact = useContactStore(
    (state) => state.setToggleCreateContact
  );
  const setToggleEditContact = useContactStore(
    (state) => state.setToggleEditContact
  );

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phoneNumbers, setPhoneNumbers] = useState([{ phone: "" }]);
  const [emails, setEmails] = useState([{ email: "" }]);
  const [scope, setScope] = useState("public");

  const handleAddEmail = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setEmails([...emails, { email: "" }]);
  };

  const handleAddPhone = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setPhoneNumbers([...phoneNumbers, { phone: "" }]);
  };

  const displayLabel = (label: string) => {
    return <label>{label}</label>;
  };
  const inputField = (
    value: string,
    onchange: React.ChangeEventHandler<HTMLInputElement> | undefined
  ) => {
    return (
      <div className="mt-1">
        <input
          type="text"
          required
          value={value}
          className="text-black outline-none px-1 rounded-md"
          onChange={onchange}
        />
      </div>
    );
  };
  const radioInputField = (value: string) => {
    return (
      <div>
        <input
          type="radio"
          value={value}
          name="scope"
          onChange={(e) => {
            setScope(value);
          }}
          className="mr-2"
        />
      </div>
    );
  };
  const handleChangeEmail = (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedEmails = emails.map((email, i) =>
      i === index ? { email: e.target.value } : { email: emails[i].email }
    );
    setEmails(updatedEmails);
  };

  const handleChangePhone = (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedPhoneNumber = phoneNumbers.map((phonenumber, i) =>
      index === i ? { phone: e.target.value } : { phone: phoneNumbers[i].phone }
    );
    setPhoneNumbers(updatedPhoneNumber);
  };

  useEffect(() => {
    if (editedContact !== undefined && type === "edit") {
      setFirstname(editedContact.firstname);
      setLastname(editedContact.lastname);
      setPhoneNumbers(editedContact.phoneNumbers);
      setEmails(editedContact.emails);
      setScope(editedContact.scope);
    }
  }, [editedContact]);
  return (
    <div className="flex justify-center ">
      <div className="w-[300px] min-h-[400px] border-2  bg-gray-600 text-white p-6">
        <h1 className="font-bold capitalize text-2xl">{title}</h1>
        <form>
          <div>
            {displayLabel("first name")}
            {inputField(firstname, (e) => {
              setFirstname(e.target.value);
            })}
          </div>
          <div className="text-pink-500">{errorObject.FN_Error}</div>

          <div>
            {displayLabel("last name")}
            {inputField(lastname, (e) => {
              setLastname(e.target.value);
            })}
          </div>
          <div className="text-pink-500">{errorObject.LN_Error}</div>

          <div className="flex flex-col">
            {displayLabel("Email(s)")}

            <div className="flex items-end">
              <div>
                {emails.map((email, index) => (
                  <div key={index}>
                    {inputField(emails[index].email, (e) =>
                      handleChangeEmail(e, index)
                    )}
                    <div className="text-pink-500">
                      {errorObject.Email_Error[index]?.email}
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" onClick={(e) => handleAddEmail(e)}>
                +
              </button>
            </div>
          </div>

          <div className="flex flex-col">
            {displayLabel("Phone(s)")}

            <div className="flex items-end">
              <div>
                {phoneNumbers.map((phoneNumber, index) => (
                  <div key={index}>
                    {inputField(phoneNumbers[index].phone, (e) =>
                      handleChangePhone(e, index)
                    )}
                    <div className="text-pink-500">
                      {errorObject.Phone_Error[index]?.phone}
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={(e) => handleAddPhone(e)}>+</button>
            </div>
          </div>

          <div>
            {displayLabel("Public")}
            <input
              type="radio"
              value="public"
              name="scope"
              onChange={(e) => {
                setScope("public");
              }}
              className="mr-2"
            />
            {/* {radioInputField("public")} */}
            {displayLabel("Private")}
            {/* {radioInputField("private")} */}

            <input
              type="radio"
              value="private"
              id="private"
              name="scope"
              onChange={(e) => setScope("private")}
            />
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                handleSubmitContact(
                  firstname,
                  lastname,
                  emails,
                  phoneNumbers,
                  scope
                );
              }}
              className="w-[120px] bg-white rounded-lg text-black  mt-6"
            >
              {buttonTitle}
            </button>
            <button
              className="w-[120px] bg-white rounded-lg text-black mt-6 "
              onClick={() => {
                if (type === "create") {
                  setToggleCreateContact(false);
                }
                if (type === "edit") {
                  setEditedContact(undefined);
                  setToggleEditContact(false);
                }
              }}
            >
              cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
