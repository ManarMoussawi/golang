import React from "react";
import { browserAdress } from "../variables";
const Logout = () => {
  return (
    <div className="text black">
      <p className="mx-6">are you sure you want to logout</p>
      <button
        className="w-[80px] bg-black rounded-lg text-white mt-6 p-1 mx-3"
        onClick={() => {
          localStorage.clear();
          window.location.href = browserAdress;
        }}
      >
        yes
      </button>
      <button
        className="w-[80px] bg-black rounded-lg text-white mt-6 p-1"
        onClick={() => {
          window.location.href = browserAdress;
        }}
      >
        no
      </button>
    </div>
  );
};

export default Logout;
