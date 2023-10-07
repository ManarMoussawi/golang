import React, { useState } from "react";
import { useUserStore } from "../stores/userStore";
import { CreateUserType, CreateUserSchema } from "../../schemas/user/user";
import { browserAdress } from "../variables";
import { fetchCreateUser } from "../services/contacts";
const CreateUserForm = () => {
  const setToggleCreate = useUserStore((state) => state.setToggleCreate);
  const setUsers = useUserStore((state) => state.setUsers);
  const fetchUsers = useUserStore((state) => state.fetchUsers);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  const [error_FN, setError_Fn] = useState("");
  const [error_LN, setError_LN] = useState("");
  const [error_DOB, setError_DOB] = useState("");
  const [error_PASS, setError_PASS] = useState("");
  const [error_UserName, setError_UserName] = useState("");

  const resetErrors = () => {
    setError_Fn("");
    setError_LN("");
    setError_UserName("");
    setError_PASS("");
    setError_DOB("");
  };
  const parseInputs = ({
    firstname,
    lastname,
    dateOfBirth,
    username,
    password,
  }: {
    firstname: string;
    lastname: string;
    dateOfBirth: string;
    username: string;
    password: string;
  }) => {
    const result = CreateUserSchema.safeParse({
      firstname,
      lastname,
      dateOfBirth: new Date(dateOfBirth),
      username,
      password,
    });
    if (!result.success) {
      const formatted = result.error.format();
      if (formatted.firstname) {
        setError_Fn(formatted.firstname._errors[0]);
      }
      if (formatted.lastname) {
        setError_LN(formatted.lastname._errors[0]);
      }
      if (formatted.username) {
        setError_UserName(formatted.username._errors[0]);
      }
      if (formatted.password) {
        setError_PASS(formatted.password._errors[0]);
      }
      if (formatted.dateOfBirth) {
        setError_DOB(formatted.dateOfBirth._errors[0]);
      }
      return true;
    }
    return false;
  };

  const createSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const createdUserObj: CreateUserType = {
      firstname,
      lastname,
      username,
      password,
      dateOfBirth: new Date(dateOfBirth),
    };
    let token = localStorage.getItem("token");
    if (token) {
      resetErrors();
      const errorExists = parseInputs({
        firstname,
        lastname,
        username,
        password,
        dateOfBirth,
      });

      if (!errorExists) {
        try {
          const data = await fetchCreateUser(createdUserObj);
          console.log("dataaaaaaaaaaaaa", data);
          if (data.created) {
            const result = await fetchUsers();
            setUsers(result);
            setToggleCreate(false);
          } else if (data.message) {
            setError_UserName(data.message);
            parseInputs(data.bodyFromServer);
          } else {
            parseInputs(data.bodyFromServer);
          }
        } catch (err) {
          console.log("error in connecting to server to create user");
        }
      }
    } else {
      window.location.href = `${browserAdress}/login`;
    }
  };

  return (
    <div className="flex justify-center ">
      <div className="w-[300px] min-h-[400px] border-2 mt-6  bg-gray-600 text-white p-6">
        <h1 className="font-bold capitalize text-2xl">Create new user</h1>
        <form>
          <div>
            <label>first name</label>
            <input
              type="text"
              required
              value={firstname}
              className="text-black outline-none px-1 rounded-md"
              onChange={(e) => {
                setFirstname(e.target.value);
              }}
            />
          </div>
          <div className="text-red-900">{error_FN}</div>

          <div>
            <label>last name</label>
            <input
              type="text"
              id="lastname"
              value={lastname}
              className="text-black outline-none px-1 rounded-md"
              onChange={(e) => {
                setLastname(e.target.value);
              }}
            />
          </div>
          <div className="text-red-900">{error_LN}</div>

          <div className="flex flex-col">
            <label>Date Of Birth</label>
            <input
              type="date"
              required
              value={dateOfBirth}
              className="text-black outline-none px-1 rounded-md w-[190px]"
              onChange={(e) => {
                setDateOfBirth(e.target.value);
              }}
            />
          </div>
          <div className="text-red-900">{error_DOB}</div>

          <div>
            <label>Username</label>
            <input
              type="text"
              required
              value={username}
              className="text-black outline-none px-1 rounded-md"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </div>
          <div className="text-red-900">{error_UserName}</div>
          <div>
            <label>Password</label>
            <input
              type="text"
              required
              className="text-black outline-none px-1 rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="text-red-900">{error_PASS}</div>
          <div className="flex">
            <button
              type="submit"
              onClick={(e) => createSubmit(e)}
              className="w-full bg-white rounded-lg text-black mt-6 mx-1"
            >
              Create
            </button>
            <button
              className="w-full bg-white rounded-lg text-black mt-6 mx-1"
              onClick={() => setToggleCreate(false)}
            >
              cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserForm;
