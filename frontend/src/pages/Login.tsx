import { useState } from "react";
import { browserAdress } from "../variables";
import { loginFetch } from "../services/contacts";
import { useAppStore } from "../stores/appStore";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [username_error, setUsername_error] = useState("");
  const [password_error, setPassword_error] = useState("");
  const setIsAdmin = useAppStore((state) => state.setIsAdmin);
  const loginSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (username == "") {
      setUsername_error("Please enter your username");
    } else {
      setUsername_error("");
    }

    if (password == "") {
      setPassword_error("Please enter your password");
    } else setPassword_error("");

    if (username_error == "" && password_error == "") {
      try {
        const data = await loginFetch(username, password);
        if (data.message) {
          setPassword_error(data.message);
        } else {
          const { token, id, firstname, isAdmin } = data;
          setIsAdmin(isAdmin);
          localStorage.setItem("token", token);
          localStorage.setItem("firstname", firstname);
          localStorage.setItem("id", id);
          if (isAdmin == true) {
            window.location.href = `${browserAdress}/users`;
          } else {
            window.location.href = `${browserAdress}/contacts`;
          }
        }
      } catch (err) {
        console.log("cant login");
        window.location.href = `${browserAdress}/login`;
      }
    }
  };
  return (
    <div className="flex justify-center ">
      <div className="w-[300px] h-[400px] border-2 mt-6  bg-gray-600 text-white p-6">
        <h1 className="font-bold capitalize text-2xl">login</h1>
        <form>
          <div>
            <label htmlFor="username">Username:</label>
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
          <div className="text-red-600">{username_error}</div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="text"
              id="password"
              required
              className="text-black outline-none px-1 rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="text-red-600">{password_error}</div>

          <button
            type="submit"
            onClick={(e) => {
              loginSubmit(e);
            }}
            className="w-full bg-white rounded-lg text-black mt-6 p-1"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
