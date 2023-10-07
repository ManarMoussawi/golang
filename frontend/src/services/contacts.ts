// import { serverAdress } from "../variables";
// import { CreateUserType, EditUserBodyType } from "../../schemas/user/user";
// import { z } from "zod";
// import { customAlphabet } from "nanoid/non-secure";
// import {
//   CreateContactType,
//   CreateContactSchema,
//   EmailError,
//   PhoneError,
// } from "../../schemas/contact/contact";

// export const getFetch = async (
//   path: string,
//   params: (string | undefined)[],
//   perPageContacts?: number,
//   startAtContact?: number,
//   scope?: string,
//   text?: string,
//   checkByMe?: boolean,
//   toggleTable?: boolean
// ) => {
//   const paramPath = params.join("/");
//   let query = [];
//   if (toggleTable !== undefined) {
//     query.push(`toggleTable=${toggleTable}`);
//   }
//   if (perPageContacts !== undefined) {
//     query.push(`perPageContacts=${perPageContacts}`);
//   }
//   if (startAtContact !== undefined) {
//     query.push(`startAtContact=${startAtContact}`);
//   }
//   if (scope !== undefined) {
//     query.push(`scope=${scope}`);
//   }
//   if (scope !== undefined) {
//     query.push(`text=${text}`);
//   }
//   if (checkByMe !== undefined) {
//     query.push(`checkByMe=${checkByMe}`);
//   }
//   let queryString = "";
//   if (query.length > 0) {
//     queryString = `?${query.join("&")}`;
//   }
//   const token = localStorage.getItem("token");
//   const res = await fetch(`${serverAdress}${path}${paramPath}${queryString}`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   const data = await res.json();
//   return data;
// };

// export const postFetch = async (
//   path: string,
//   params: (string | undefined)[],
//   body: {}
// ) => {
//   let paramPath = params.join("/");
//   if (params.length > 0) {
//     paramPath = `\${paramPath}`;
//   }
//   const token = localStorage.getItem("token");
//   // console.log(body);
//   // console.log(`${serverAdress}${path}${paramPath}`);
//   const res = await fetch(`${serverAdress}${path}/${paramPath}`, {
//     // await fetch(`${serverAdress}${path}${paramPath}`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(body),
//   });

//   const data = await res.json();
//   return data;
// };

// export const parseContactInputs = async ({
//   firstname,
//   lastname,
//   emails,
//   phoneNumbers,
//   scope,
// }: CreateContactType) => {
//   const createContactBody = {
//     firstname,
//     lastname,
//     emails,
//     phoneNumbers,
//     scope,
//   };
//   let errObject = {
//     fn: "",
//     ln: "",
//     email: [{ email: "" }],
//     phone: [{ phone: "" }],
//   };
//   const parsedResult = CreateContactSchema.safeParse(createContactBody);

//   if (parsedResult.success == false) {
//     const error = parsedResult.error.format();
//     if (error.firstname?._errors[0]) {
//       errObject.fn = error.firstname?._errors[0] || "";
//     }
//     if (error.lastname?._errors[0]) {
//       errObject.ln = error.lastname?._errors[0] || "";
//     }
//     const handleEmailErrors = () => {
//       const Emailkeys = Object.keys(error.emails || {});
//       Emailkeys.pop();
//       const numEmailkeys = Emailkeys.map((key) => z.coerce.number().parse(key));
//       let allEmailErrors: EmailError[] = [];
//       for (let i = 0; i < emails.length; i++) {
//         let emailError: EmailError;
//         if (numEmailkeys.includes(i)) {
//           emailError = { email: error.emails?.[i].email?._errors[0] || "" };
//         } else {
//           emailError = { email: "" };
//         }
//         allEmailErrors.push(emailError);
//       }
//       errObject.email = allEmailErrors;
//     };
//     if (error.emails) {
//       handleEmailErrors();
//     }
//     const handlePhoneNumErrors = () => {
//       const phoneKeys = Object.keys(error.phoneNumbers || {});
//       phoneKeys.pop();
//       const numPhoneKeys = phoneKeys.map((key) => z.coerce.number().parse(key));
//       let allPhoneErrors: PhoneError[] = [];
//       for (let i = 0; i < phoneNumbers.length; i++) {
//         let phoneError;
//         if (numPhoneKeys.includes(i)) {
//           phoneError = {
//             phone: error.phoneNumbers?.[i].phone?._errors[0] || "",
//           };
//         } else {
//           phoneError = { phone: "" };
//         }
//         allPhoneErrors.push(phoneError);
//       }
//       errObject.phone = allPhoneErrors;
//     };
//     if (error.phoneNumbers) {
//       handlePhoneNumErrors();
//     }
//     return { errorExists: true, errObject };
//   } else {
//     return { errorExists: false, errObject };
//   }
// };

// export const loginFetch = async (username: string, password: string) => {
//   // await postFetch("/users/login", [], { username, password });

//   const data = await postFetch("/users/login", [], { username, password });
//   return data;
// };

// export const fetchAndDeleteContact = async (id: string) => {
//   const data = await getFetch(
//     "/contacts/delete/",
//     [id],
//     undefined,
//     undefined,
//     undefined,
//     undefined,
//     undefined
//   );
//   return data;
// };

// export const fetchUserFullName = async (userId?: string) => {
//   const data = await getFetch("/users/fullname/", [userId]);
//   return data.fullname;
// };

// export const fetchCreateContact = async (
//   firstname: string,
//   lastname: string,
//   emails: { email: string }[],
//   phoneNumbers: { phone: string }[],
//   scope: string
// ) => {
//   const data = await postFetch("/contacts/create", [], {
//     firstname,
//     lastname,
//     emails,
//     phoneNumbers,
//     scope,
//   });
//   return data;
// };

// export const fetchEditContact = async (
//   contactId: string,
//   body: CreateContactType
// ) => {
//   const data = await postFetch("/contacts/edit", [contactId], body);
//   return data;
// };

// export const fetchEditUser = async (userId: string, body: EditUserBodyType) => {
//   const data = await postFetch("/users/edit", [userId], body);
//   return data;
// };

// export const fetchCreateUser = async (createdUserObj: CreateUserType) => {
//   const data = await postFetch("/users/create", [], createdUserObj);
//   return data;
// };

// export const fetchUserFoftDelete = async (userId: string) => {
//   const data = await getFetch("/users/delete", [userId]);
//   return data;
// };

// export const createRandomName = () => {
//   const nameLength = Math.floor(Math.random() * 6) + 5;
//   const randomName = customAlphabet("abcdefghijklmnopqrstuvwxwz", nameLength)();
//   return randomName;
// };

// export const createRandomEmail = () => {
//   const alphabet = "abcdefghijklmnopqrstuvwxwz";
//   const firstPartEmailLength = Math.floor(Math.random() * 6) + 2;
//   const secondPartEmailLength = Math.floor(Math.random() * 5) + 2;
//   const thirdPartEmailLength = Math.floor(Math.random() * 4) + 2;
//   const email = `${customAlphabet(
//     alphabet,
//     firstPartEmailLength
//   )()}@${customAlphabet(alphabet, secondPartEmailLength)()}.${customAlphabet(
//     alphabet,
//     thirdPartEmailLength
//   )()}`;

//   return email;
// };

// export const createRandomPhone = () => {
//   const code = ["03", "70", "05", "01"];
//   const numberAlphabet = "0123456789";
//   const randomCode = code[Math.floor(Math.random() * 4)];
//   const randomSecondPart = customAlphabet(numberAlphabet, 6)();
//   const randomPhone = `${randomCode}${randomSecondPart}`;
//   return randomPhone;
// };

// export const createRandomContact = async () => {
//   const numberEmails = Math.floor(Math.random() * 2) + 1;
//   const numberPhones = Math.floor(Math.random() * 2) + 1;
//   const scopeValue = ["private", "public"];
//   let emails = [];
//   let phoneNumbers = [];
//   const firstname = createRandomName();
//   const lastname = createRandomName();
//   for (let i = 0; i < numberEmails; i++) {
//     emails.push({ email: createRandomEmail() });
//   }
//   for (let i = 0; i < numberPhones; i++) {
//     phoneNumbers.push({ phone: createRandomPhone() });
//   }
//   let scope = scopeValue[Math.floor(Math.random() * 2)];

//   const data = await fetchCreateContact(
//     firstname,
//     lastname,
//     emails,
//     phoneNumbers,
//     scope
//   );
//   return data;
// };

import { serverAdress } from "../variables";
import { CreateUserType, EditUserBodyType } from "../../schemas/user/user";
import { z } from "zod";
import { customAlphabet } from "nanoid/non-secure";
import {
  CreateContactType,
  CreateContactSchema,
  EmailError,
  PhoneError,
} from "../../schemas/contact/contact";

export const getFetch = async (
  path: string,
  params: (string | undefined)[],
  perPageContacts?: number,
  startAtContact?: number,
  scope?: string,
  text?: string,
  checkByMe?: boolean,
  toggleTable?: boolean
) => {
  let paramPath = params.join("/");
  if (params.length > 0) {
    paramPath = `/${paramPath}`;
  }
  let query = [];
  if (toggleTable !== undefined) {
    query.push(`toggleTable=${toggleTable}`);
  }
  if (perPageContacts !== undefined) {
    query.push(`perPageContacts=${perPageContacts}`);
  }
  if (startAtContact !== undefined) {
    query.push(`startAtContact=${startAtContact}`);
  }
  if (scope !== undefined) {
    query.push(`scope=${scope}`);
  }
  if (scope !== undefined) {
    query.push(`text=${text}`);
  }
  if (checkByMe !== undefined) {
    query.push(`checkByMe=${checkByMe}`);
  }
  let queryString = "";
  if (query.length > 0) {
    queryString = `?${query.join("&")}`;
  }
  const token = localStorage.getItem("token");
  console.log("inside get fetch");
  console.log(`${serverAdress}${path}${paramPath}${queryString}`);
  console.log("path", `${serverAdress}${path}${paramPath}${queryString}`);

  const res = await fetch(`${serverAdress}${path}${paramPath}${queryString}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  console.log("resss", res);
  const data = await res.json();
  console.log("dataaaa", data);
  return data;
};

export const postFetch = async (
  path: string,
  params: (string | undefined)[],
  body: {}
) => {
  console.log("inside post fetch");
  let paramPath = params.join("/");
  if (params.length > 0) {
    paramPath = `/${paramPath}`;
  }

  const token = localStorage.getItem("token");
  console.log(`${serverAdress}${path}${paramPath}`);
  const res = await fetch(`${serverAdress}${path}${paramPath}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return data;
};

export const parseContactInputs = async ({
  firstname,
  lastname,
  emails,
  phoneNumbers,
  scope,
}: CreateContactType) => {
  const createContactBody = {
    firstname,
    lastname,
    emails,
    phoneNumbers,
    scope,
  };
  let errObject = {
    fn: "",
    ln: "",
    email: [{ email: "" }],
    phone: [{ phone: "" }],
  };
  const parsedResult = CreateContactSchema.safeParse(createContactBody);

  if (parsedResult.success == false) {
    const error = parsedResult.error.format();
    if (error.firstname?._errors[0]) {
      errObject.fn = error.firstname?._errors[0] || "";
    }
    if (error.lastname?._errors[0]) {
      errObject.ln = error.lastname?._errors[0] || "";
    }
    const handleEmailErrors = () => {
      const Emailkeys = Object.keys(error.emails || {});
      Emailkeys.pop();
      const numEmailkeys = Emailkeys.map((key) => z.coerce.number().parse(key));
      let allEmailErrors: EmailError[] = [];
      for (let i = 0; i < emails.length; i++) {
        let emailError: EmailError;
        if (numEmailkeys.includes(i)) {
          emailError = { email: error.emails?.[i].email?._errors[0] || "" };
        } else {
          emailError = { email: "" };
        }
        allEmailErrors.push(emailError);
      }
      errObject.email = allEmailErrors;
    };
    if (error.emails) {
      handleEmailErrors();
    }
    const handlePhoneNumErrors = () => {
      const phoneKeys = Object.keys(error.phoneNumbers || {});
      phoneKeys.pop();
      const numPhoneKeys = phoneKeys.map((key) => z.coerce.number().parse(key));
      let allPhoneErrors: PhoneError[] = [];
      for (let i = 0; i < phoneNumbers.length; i++) {
        let phoneError;
        if (numPhoneKeys.includes(i)) {
          phoneError = {
            phone: error.phoneNumbers?.[i].phone?._errors[0] || "",
          };
        } else {
          phoneError = { phone: "" };
        }
        allPhoneErrors.push(phoneError);
      }
      errObject.phone = allPhoneErrors;
    };
    if (error.phoneNumbers) {
      handlePhoneNumErrors();
    }
    return { errorExists: true, errObject };
  } else {
    return { errorExists: false, errObject };
  }
};

export const loginFetch = async (username: string, password: string) => {
  const data = await postFetch("/users/login", [], { username, password });
  console.log("data", data);
  return data;
};

export const fetchAndDeleteContact = async (id: string) => {
  const data = await getFetch(
    "/contacts/delete",
    [id],
    undefined,
    undefined,
    undefined,
    undefined,
    undefined
  );
  return data;
};

export const fetchUserFullName = async (userId?: string) => {
  const data = await getFetch("/users/fullname/", [userId]);
  return data.fullname;
};

export const fetchCreateContact = async (
  firstname: string,
  lastname: string,
  emails: { email: string }[],
  phoneNumbers: { phone: string }[],
  scope: string
) => {
  const data = await postFetch("/contacts/create", [], {
    firstname,
    lastname,
    emails,
    phoneNumbers,
    scope,
  });
  return data;
};

export const fetchEditContact = async (
  contactId: string,
  body: CreateContactType
) => {
  const data = await postFetch("/contacts/edit", [contactId], body);
  return data;
};

export const fetchEditUser = async (userId: string, body: EditUserBodyType) => {
  const data = await postFetch("/users/edit", [userId], body);
  return data;
};

export const fetchCreateUser = async (createdUserObj: CreateUserType) => {
  const data = await postFetch("/users/create", [], createdUserObj);
  return data;
};

export const fetchUserFoftDelete = async (userId: string) => {
  console.log("inside soft delete");
  const data = await getFetch("/users/delete", [userId]);
  console.log("data in fetchusers");
  return data;
};

export const createRandomName = () => {
  const nameLength = Math.floor(Math.random() * 6) + 5;
  const randomName = customAlphabet("abcdefghijklmnopqrstuvwxwz", nameLength)();
  return randomName;
};

export const createRandomEmail = () => {
  const alphabet = "abcdefghijklmnopqrstuvwxwz";
  const firstPartEmailLength = Math.floor(Math.random() * 6) + 2;
  const secondPartEmailLength = Math.floor(Math.random() * 5) + 2;
  const thirdPartEmailLength = Math.floor(Math.random() * 4) + 2;
  const email = `${customAlphabet(
    alphabet,
    firstPartEmailLength
  )()}@${customAlphabet(alphabet, secondPartEmailLength)()}.${customAlphabet(
    alphabet,
    thirdPartEmailLength
  )()}`;

  return email;
};

export const createRandomPhone = () => {
  const code = ["03", "70", "05", "01"];
  const numberAlphabet = "0123456789";
  const randomCode = code[Math.floor(Math.random() * 4)];
  const randomSecondPart = customAlphabet(numberAlphabet, 6)();
  const randomPhone = `${randomCode}${randomSecondPart}`;
  return randomPhone;
};

export const createRandomContact = async () => {
  const numberEmails = Math.floor(Math.random() * 2) + 1;
  const numberPhones = Math.floor(Math.random() * 2) + 1;
  const scopeValue = ["private", "public"];
  let emails = [];
  let phoneNumbers = [];
  const firstname = createRandomName();
  const lastname = createRandomName();
  for (let i = 0; i < numberEmails; i++) {
    emails.push({ email: createRandomEmail() });
  }
  for (let i = 0; i < numberPhones; i++) {
    phoneNumbers.push({ phone: createRandomPhone() });
  }
  let scope = scopeValue[Math.floor(Math.random() * 2)];

  const data = await fetchCreateContact(
    firstname,
    lastname,
    emails,
    phoneNumbers,
    scope
  );
  return data;
};
