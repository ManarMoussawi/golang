import { useEffect, useState } from "react";
import { useContactStore } from "../stores/contactStore";

const Header = ({ columns }: { columns: string[] }) => {
  const tableContacts = useContactStore((state) => state.tableContacts);
  const setTableContacts = useContactStore((state) => state.setTableContacts);
  const sortContacts = (
    colName: keyof (typeof tableContacts)[0],
    order: string
  ) => {
    if (
      order === "asc" &&
      (colName === "firstname" || colName === "lastname")
    ) {
      let sortedContacts = [...tableContacts].sort((a, b) =>
        a[colName].toLowerCase() > b[colName].toLowerCase() ? 1 : -1
      );
      setTableContacts(sortedContacts);
    }
    if (
      order === "desc" &&
      (colName === "firstname" || colName === "lastname")
    ) {
      let sortedContacts = [...tableContacts].sort((a, b) =>
        a[colName].toLowerCase() > b[colName].toLowerCase() ? -1 : 1
      );
      setTableContacts(sortedContacts);
    }
  };
  return (
    <thead className="border-2 w-full ">
      <tr className="flex ">
        {columns.map((col, i) => (
          <th key={i} className="w-[200px] border-2 text-left p-2 ">
            {col}
            {col === "firstname" || col === "lastname" ? (
              <>
                <button
                  className="px-2 hover:text-green-500 "
                  onClick={() => {
                    sortContacts(col, "asc");
                  }}
                >
                  ▼
                </button>
                <button
                  className="px-2 hover:text-green-500"
                  onClick={() => {
                    sortContacts(col, "desc");
                  }}
                >
                  ▲
                </button>
              </>
            ) : (
              ""
            )}
          </th>
        ))}
      </tr>
    </thead>
  );
};
const Content = () => {
  const tableContacts = useContactStore((state) => state.tableContacts);
  return (
    <tbody className="border-2 w-full">
      {tableContacts?.map((contact, index) => {
        return (
          <tr key={index}>
            <td className="w-[200px] border-2 text-left p-2 ">
              {contact.firstname}
            </td>
            <td className="w-[200px] border-2 text-left p-2 ">
              {contact.lastname}
            </td>
            <td className="w-[200px] border-2 text-left p-2 ">
              {contact.emails.map((email, i) => (
                <div key={i}>{email.email}</div>
              ))}
            </td>
            <td className="w-[200px] border-2 text-left p-2 ">
              {contact.phoneNumbers.map((phone, i) => (
                <div key={i}>{phone.phone}</div>
              ))}
            </td>

            <td className="w-[200px] border-2 text-left p-2 ">
              {contact.scope}
            </td>
          </tr>
        );
      })}
    </tbody>
  );
};

const Table = () => {
  const columns = ["firstname", "lastname", "Email(s)", "Phone(s)", "scope"];
  const [sorting, setSorting] = useState({ col: "", order: "asc" });

  const tableContacts = useContactStore((state) => state.tableContacts);
  useEffect(() => {}, [tableContacts]);
  return (
    <div>
      <table className="w-full flex flex-col ">
        <Header columns={columns} />
        <Content />
      </table>
    </div>
  );
};

export default Table;
