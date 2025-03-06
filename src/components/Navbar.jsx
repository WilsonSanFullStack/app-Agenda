import React from "react";
import notebook from "../assets/notebook.png";

export const Navbar = () => {
  return (
    <nav className="flex justify-center items-center">
      <ul className="bg-gray-950 flex list-none justify-between items-center w-full h-14 text-white px-2">
        <li>
          <img src={notebook} alt="logo" className="w-12 h-12"/>
        </li>
        <li>archivo</li>
        <li>archivo</li>
        <li>archivo</li>
        <li>archivo</li>
      </ul>
    </nav>
  );
};
