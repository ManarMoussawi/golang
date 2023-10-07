import React, { useEffect } from "react";
import CreateContactForm from "../components/CreateContactForm";
import Contact from "../components/Contact";
import ContactInfo from "../components/ContactInfo";
import EditContactForm from "../components/EditContactForm";
import { useContactStore } from "../stores/contactStore";
import { createRandomContact } from "../services/contacts";
import Table from "../components/Table";
const Contacts = () => {
  const toggleCreateContact = useContactStore(
    (state) => state.toggleCreateContact
  );
  const setToggleCreateContact = useContactStore(
    (state) => state.setToggleCreateContact
  );
  const toggleSelectContact = useContactStore(
    (state) => state.toggleSelectContact
  );
  const toggleTable = useContactStore((state) => state.toggleTable);
  const setTableContacts = useContactStore((state) => state.setTableContacts);

  const toggleEditContact = useContactStore((state) => state.toggleEditContact);
  const setToggleTable = useContactStore((state) => state.setToggleTable);
  const startAtContact = useContactStore((state) => state.startAtContact);
  const perPageContacts = useContactStore((state) => state.perPageContacts);
  const text = useContactStore((state) => state.text);
  const scope = useContactStore((state) => state.scope);
  const checkByMe = useContactStore((state) => state.checkByMe);
  const setCheckByMe = useContactStore((state) => state.setCheckByMe);
  const setScope = useContactStore((state) => state.setScope);
  const fetchContacts = useContactStore((state) => state.fetchContacts);

  const setContacts = useContactStore((state) => state.setContacts);
  const countContacts = useContactStore((state) => state.countContacts);
  const setCountContact = useContactStore((state) => state.setCountContact);
  const setText = useContactStore((state) => state.setText);
  const contacts = useContactStore((state) => state.contacts);
  const setPerPageContacts = useContactStore(
    (state) => state.setPerPageContacts
  );
  const setStartAtContact = useContactStore((state) => state.setStartAtContact);
  const handleSearch = async () => {
    const data = await fetchContacts({
      perPageContacts,
      startAtContact,
      scope,
      text,
      checkByMe,
    });
    const filteredContacts = data?.filteredContacts;
    const tableFilteredContacts = data?.tableFilteredContacts;
    setTableContacts(tableFilteredContacts);
    const count = data?.count as number;
    setCountContact(count);
    if (count < startAtContact + 1) {
      setStartAtContact(0);
    }
    console.log(
      "filtered contact ",
      filteredContacts,
      filteredContacts?.length
    );
    setContacts(filteredContacts);
  };

  useEffect(() => {
    const firstfetchContact = async () => {
      const data = await fetchContacts({
        perPageContacts,
        startAtContact,
        scope,
        text,
        checkByMe,
      });
      setContacts(data?.filteredContacts);
    };
    firstfetchContact();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [text, scope, perPageContacts, startAtContact, checkByMe, toggleTable]);
  useEffect(() => {
    setStartAtContact(0);
  }, [text, scope]);
  useEffect(() => {
    if (scope !== "all") {
      setCheckByMe(false);
    }
  }, [scope]);

  return (
    <div className="flex justify-between">
      <div className="flex-2 flex flex-col">
        <div className="flex flex-col mx-4">
          <input
            type="text"
            placeholder="search in contacts"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
            className="w-[200px] border-2 p-1 "
          />
          <div className="flex flex-row m-2">
            <label>Select contact scope</label>
            <select
              className="border-2 w-[100px] mx-2 "
              onChange={(e) => {
                setScope(e.target.value);
              }}
            >
              <option value="all">All</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
            <label
              htmlFor="byMe"
              className={`${
                scope !== "all" ? "text-blue-100" : "text-gray-600"
              }`}
            >
              By me
            </label>
            <input
              type="checkbox"
              checked={scope === "all" ? checkByMe : false}
              onChange={() => {
                setCheckByMe(!checkByMe);
              }}
              id="byMe"
              disabled={scope !== "all"}
            />
          </div>
          <button
            className="w-[120px] bg-gray-600 rounded-lg text-white mt-6 p-1"
            onClick={() => {
              setToggleCreateContact(true);
            }}
          >
            Add contact +
          </button>
        </div>
        <div>
          <label htmlFor="perPage">Contacts per page </label>
          <input
            type="number"
            value={perPageContacts}
            id="perPage"
            min={2}
            max={10}
            className="border-2 w-[45px] pl-1"
            onKeyDown={(e) => {
              if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") {
                e.preventDefault();
              }
            }}
            onKeyPress={(e) => e.preventDefault()}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPerPageContacts(parseInt(e.target.value, 10));
              setStartAtContact(0);
            }}
          />
        </div>
        <div>
          <label className="mx-2">Table view </label>
          <input
            type="checkbox"
            checked={toggleTable}
            onChange={() => {
              setToggleTable(!toggleTable);
            }}
          />
          <button
            className="w-[120px] bg-gray-600 text-white p-1 mx-2 rounded-md"
            onClick={async () => {
              for (let i = 0; i < 10; i++) {
                const data = await createRandomContact();
                if (data.created == true) {
                  setStartAtContact(0);
                  const data = await fetchContacts({
                    perPageContacts,
                    startAtContact: 0,
                    scope: "all",
                    text: "",
                    checkByMe: false,
                  });
                  setContacts(data?.filteredContacts);
                  setTableContacts(data?.tableFilteredContacts);
                }
              }
            }}
          >
            Create Random contact
          </button>
        </div>
        <div className="flex-flex-col m-4 w-[320px] border-r-2 h-[450px] ">
          {contacts.length !== 0 && (
            <div className="flex justify-center items-center  ">
              <button
                className="w-[60px] bg-gray-600 text-white p-1 disabled:bg-slate-200"
                onClick={() => {
                  setStartAtContact(startAtContact - perPageContacts);
                }}
                disabled={startAtContact == 0}
              >
                prev
              </button>
              <div className="px-2 mx-2">
                {startAtContact / perPageContacts + 1} of
                {Math.ceil(countContacts / perPageContacts)}
              </div>
              <button
                className="w-[60px] bg-gray-600  text-white p-1 disabled:bg-slate-200"
                onClick={() => {
                  setStartAtContact(startAtContact + perPageContacts);
                }}
                disabled={
                  contacts.length == 0 ||
                  startAtContact / perPageContacts + 1 ===
                    Math.ceil(countContacts / perPageContacts)
                }
              >
                next
              </button>
            </div>
          )}
          {contacts.length == 0 && startAtContact == 0 && (
            <p className="font-semi-bold mt-3 text-lg">No contacts </p>
          )}

          {contacts.length != 0 && (
            <div>
              <p className="text-2xl">List of Contacts</p>
              {contacts.map((contact, index) => (
                <div key={index}>
                  <Contact contact={contact} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className=" flex-1 flex flex-col">
        <div className="flex">
          <div>{toggleSelectContact && <ContactInfo />}</div>
          <div>{toggleCreateContact && <CreateContactForm />}</div>
          <div>{toggleEditContact && <EditContactForm />}</div>
        </div>

        <div>{toggleTable && <Table />}</div>
      </div>
    </div>
  );
};

export default Contacts;
