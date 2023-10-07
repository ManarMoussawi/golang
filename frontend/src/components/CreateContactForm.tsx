import { useContactStore } from "../stores/contactStore";
import { browserAdress } from "../variables";
import { fetchCreateContact } from "../services/contacts";
import ContactForm from "./ContactForm";
import { parseContactInputs } from "../services/contacts";

const CreateContactForm = () => {
  const perPageContacts = useContactStore((state) => state.perPageContacts);
  const fetchContacts = useContactStore((state) => state.fetchContacts);
  const setContacts = useContactStore((state) => state.setContacts);
  const setToggleCreateContact = useContactStore(
    (state) => state.setToggleCreateContact
  );

  const setTableContacts = useContactStore((state) => state.setTableContacts);
  const startAtContact = useContactStore((state) => state.startAtContact);
  const setStartAtContact = useContactStore((state) => state.setStartAtContact);
  const errorObject = useContactStore((state) => state.errorObject_create);

  const setErrorObject = useContactStore(
    (state) => state.setErrorObject_create
  );

  const resetErrors = () => {
    setErrorObject("FN_Error", "");
    setErrorObject("LN_Error", "");
    setErrorObject("Email_Error", [{ email: "" }]);
    setErrorObject("Phone_Error", [{ phone: "" }]);
  };

  const handleCreateContact = async (
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
          const data = await fetchCreateContact(
            firstname,
            lastname,
            emails,
            phoneNumbers,
            scope
          );
          if (data.created == true) {
            setStartAtContact(0);
            const data = await fetchContacts({
              perPageContacts,
              startAtContact,
              scope,
              text: "",
              checkByMe: false,
            });
            setContacts(data?.filteredContacts);
            setTableContacts(data?.tableFilteredContacts);
            setToggleCreateContact(false);
          } else {
            parseContactInputs(data.body);
          }
        } catch (err) {
          console.log("error in connecting to create contact");
        }
      } else {
        window.location.href = `${browserAdress}/login`;
      }
    } else {
      let err = contactParseResult.errObject;
      setErrorObject("FN_Error", err.fn);
      setErrorObject("LN_Error", err.ln);
      setErrorObject("Email_Error", err.email);
      setErrorObject("Phone_Error", err.phone);
    }
  };

  return (
    <div>
      <ContactForm
        type="create"
        handleSubmitContact={handleCreateContact}
        title="Create Contact Form"
        buttonTitle="Create New Contact"
        errorObject={errorObject}
      />
    </div>
  );
};

export default CreateContactForm;
