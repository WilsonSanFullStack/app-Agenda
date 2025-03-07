import React from "react";
import notebook from "../assets/notebook.png";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const navigate = useNavigate();
  // const handleWindowAction =(action) => {
  //   console.log(action)
  //   window.Electron.send("Window-action", action)
  // }
  return (
    <nav className="flex justify-center items-center">
      <ul className="bg-gray-950 flex list-none justify-between items-center w-full h-14 text-white px-2">
        <li>
          <img
            src={notebook}
            alt="logo"
            className="w-12 h-12"
            onClick={() => navigate("/")}
          />
        </li>
        <li>archivo</li>
        <li>archivos</li>
        <li>estadisiticas</li>
        <li onClick={() => navigate("/register/quincena")}>registro</li>
        <li>otros</li>
        <li>
        <button onClick={() => window.Electron.minimize()}>➖</button>
  <button onClick={() => window.Electron.maximize()}>🗖</button>
  <button onClick={() => window.Electron.close()}>❌</button>
        </li>
      </ul>
    </nav>
  );
};
