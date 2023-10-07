import { useEffect } from "react";
import { useContactStore } from "../stores/contactStore";
import { browserAdress } from "../variables";
import { fetchEditContact } from "../services/contacts";
import ContactForm from "./ContactForm";
import { parseContactInputs } from "../services/contacts";

const EditContactForm = () => {
  const startAtContact = useContactStore((state) => state.startAtContact);
  const perPageContacts = useContactStore((state) => state.perPageContacts);
  const text = useContactStore((state) => state.text);
  const scope1 = useContactStore((state) => state.scope);
  const checkByMe = useContactStore((state) => state.checkByMe);
  const errorObject = useContactStore((state) => state.errorObject_edit);
  const editedContact = useContactStore((state) => state.editedContact);

  const setTableContacts = useContactStore((state) => state.setTableContacts);
  const setToggleEditContact = useContactStore(
    (state) => state.setToggleEditContact
  );

  const fetchContacts = useContactStore((state) => state.fetchContacts);
  const setContacts = useContactStore((state) => state.setContacts);
  const setErrorObject = useContactStore((state) => state.setErrorObject_edit);

  const resetErrors = () => {
    setErrorObject("FN_Error", "");
    setErrorObject("LN_Error", "");
    setErrorObject("Email_Error", [{ email: "" }]);
    setErrorObject("Phone_Error", [{ phone: "" }]);
  };

  const handleEdit = async (
    firstname: string,
    lastname: string,
    emails: { email: string }[],
    phoneNumbers: { phone: string }[],
    scope: string
  ) => {
    resetErrors();
    const contactParseResult = await parseContactInputs({
      firstname,
      lastname,
      emails,
      phoneNumbers,
      scope,
    });
    if (!contactParseResult.errorExists) {
      let token = localStorage.getItem("token");
      if (token) {
        try {
          let contactId = editedContact?._id as string;
          let body = {
            firstname,
            lastname,
            emails,
            phoneNumbers,
            scope,
          };
          const data = await fetchEditContact(contactId, body);
          if (data.isUpdated === true) {
            const dataReceived = await fetchContacts({
              perPageContacts,
              startAtContact,
              scope: scope1,
              text,
              checkByMe,
            });
            setContacts(dataReceived?.filteredContacts);
            setTableContacts(dataReceived?.tableFilteredContacts);

            setToggleEditContact(false);
          } else {
            if (data.bodyFromServer) {
              parseContactInputs(data.bodyFromServer);
            }
          }
        } catch (err) {
          console.log(err);
        }
      } else {
        window.location.href = `${browserAdress}/login`;
      }
    } else {
      const err = contactParseResult.errObject;
      setErrorObject("FN_Error", err.fn);
      setErrorObject("LN_Error", err.ln);
      setErrorObject("Email_Error", err.email);
      setErrorObject("Phone_Error", err.phone);
    }
  };
  useEffect(() => {
    resetErrors();
  }, [editedContact]);
  return (
    <div>
      <ContactForm
        type="edit"
        title="Edit Contact Form"
        handleSubmitContact={handleEdit}
        buttonTitle="save changes"
        errorObject={errorObject}
      />
    </div>
  );
};

export default EditContactForm;
