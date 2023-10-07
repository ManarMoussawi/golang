import React, { useEffect, useState } from "react";
import { useUserStore } from "../stores/userStore";
import { EditUserBodyType } from "../../schemas/user/user";
import {
  UserWithoutPassSchema,
  UserWithoutPassType,
} from "../../schemas/user/user";
import { browserAdress } from "../variables";
import { fetchEditUser } from "../services/contacts";

const EditUserForm = () => {
  const setToggleEdit = useUserStore((state) => state.setToggleEdit);
  const editedUser = useUserStore(
    (state) => state.editedUser
  ) as UserWithoutPassType;
  const setUsers = useUserStore((state) => state.setUsers);
  const fetchUsers = useUserStore((state) => state.fetchUsers);

  const getStringDate = (dd: Date | undefined): string => {
    if (dd == undefined) return "";
    const year = dd.getFullYear();
    const month =
      dd.getMonth() < 9 ? `0${dd.getMonth() + 1}` : `${dd.getMonth() + 1}`;
    const day = dd.getDate() < 10 ? `0${dd.getDate()}` : `${dd.getDate()}`;
    const date = `${year}-${month}-${day}`; // return year- month-day to be inserted in input field
    return date;
  };

  const [firstname, setFirstname] = useState(editedUser.firstname);
  const [lastname, setLastname] = useState(editedUser.lastname);
  const [username, setUsername] = useState(editedUser.username);
  const [dateOfBirth, setDateOfBirth] = useState(
    getStringDate(editedUser.dateOfBirth)
  );
  const [error_FN, setError_Fn] = useState("");
  const [error_LN, setError_LN] = useState("");
  const [error_DOB, setError_DOB] = useState("");
  const [error_UserName, setError_UserName] = useState("");
  const bodyEdit: EditUserBodyType = {
    firstname,
    lastname,
    username,
    dateOfBirth,
  };
  const resetErrors = () => {
    setError_Fn("");
    setError_LN("");
    setError_UserName("");
    setError_DOB("");
  };
  const parseInputs = ({
    firstname,
    lastname,
    dateOfBirth,
    username,
  }: EditUserBodyType) => {
    const result = UserWithoutPassSchema.safeParse({
      firstname,
      lastname,
      dateOfBirth: new Date(dateOfBirth),
      username,
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
      if (formatted.dateOfBirth) {
        setError_DOB(formatted.dateOfBirth._errors[0]);
      }
      return true;
    } else {
      return false;
    }
  };
  const handleSaveChange = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    resetErrors();
    let errorExists = true;
    errorExists = parseInputs(bodyEdit);
    if (!errorExists) {
      let token = localStorage.getItem("token");
      if (token) {
        try {
          let userId = editedUser._id as string;
          const data = await fetchEditUser(userId, bodyEdit);
          if (data.isUpdated == true) {
            setToggleEdit(false);
            const result = await fetchUsers();
            setUsers(result);
          } else if (data.message) {
            setError_UserName(data.message);
            parseInputs(data.bodyFromServer);
          } else {
            parseInputs(data.bodyFromServer);
          }
        } catch (err) {
          console.log(err);
        }
      } else {
        window.location.href = `${browserAdress}/login`;
      }
    }
  };

  useEffect(() => {
    setFirstname(editedUser?.firstname);
    setLastname(editedUser?.lastname);
    setUsername(editedUser?.username);
    setDateOfBirth(getStringDate(editedUser?.dateOfBirth));
  }, [editedUser]);

  return (
    <div className="flex justify-center ">
      <div className="w-[300px] min-h-[400px] border-2 mt-6  bg-gray-600 text-white p-6">
        <h1 className="font-bold capitalize text-2xl">
          update user {editedUser?.firstname}
        </h1>
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
          <div className="text-red-800">{error_FN}</div>

          <div>
            <label>last name</label>
            <input
              type="text"
              required
              value={lastname}
              className="text-black outline-none px-1 rounded-md"
              onChange={(e) => {
                setLastname(e.target.value);
              }}
            />
          </div>
          <div className="text-red-800">{error_LN}</div>

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
          <div className="text-red-800">{error_DOB}</div>

          <div>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              required
              value={username}
              className="text-black outline-none px-1 rounded-md"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </div>
          <div className="text-red-800">{error_UserName}</div>

          <div className="flex">
            <button
              type="submit"
              className="w-full bg-white rounded-lg text-black mt-6 mx-1"
              onClick={(e) => handleSaveChange(e)}
            >
              Save changes
            </button>
            <button
              className="w-full bg-white rounded-lg text-black mt-6 mx-1"
              onClick={() => setToggleEdit(false)}
            >
              cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserForm;
