import { Link } from "react-router-dom";
import { useAppStore } from "../stores/appStore";
const Header = () => {
  let isAdmin = useAppStore((state) => state.isAdmin);
  const token = localStorage.getItem("token");
  return (
    <div className="flex w-full p-4 bg-gray-600 align-middle justify-end ">
      <div className="flex">
        <Link to="/">
          <p className="text-lg mr-4 text-white">Home</p>
        </Link>
        {!token ? (
          <Link to="/login">
            <p className="text-lg mr-4 text-white">Login</p>
          </Link>
        ) : (
          <Link to="/logout">
            <p className="text-lg mr-4 text-white">Logout</p>
          </Link>
        )}
        {token && isAdmin && (
          <Link to="/users">
            <p className="text-lg mr-4 text-white">users</p>
          </Link>
        )}
        {token && !isAdmin && (
          <Link to="/contacts">
            <p className="text-lg mr-4 text-white">Contact</p>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
