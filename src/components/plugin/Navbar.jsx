import React, { useEffect, useRef, useState } from "react";
import notebook from "../../assets/notebook.png";
import { useNavigate } from "react-router-dom";
import { BsZoomIn, BsZoomOut, BsXCircle } from "react-icons/bs";

export const Navbar = () => {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef(null);
  const optionMenu = {
    Archivo: [
      { name: "opcion 1", path: "/" },
      { name: "opcion 2", path: "/" },
      { name: "opcion 3", path: "/" },
    ],
    Editar: [{ name: "opcion 4", path: "/" }],
    Registrar: [
      { name: "quincena", path: "/register/quincena" },
      { name: "dia", path: "/register/dia" },
      { name: "creditos", path: "/register/creditos" },
      { name: "pagina", path: "/register/pagina" },
      { name: "option 5", path: "/" },
    ],
    Ayuda: [
      { name: "option 6", path: "/" },
      {
        name: "Abrir Consola",
        action: () => {
          if (window.Electron && window.Electron.openDevTools) {
            window.Electron.openDevTools();
          }
        },
      },
    ],
  };

  // Cerrar menú si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <nav className="flex justify-between bg-slate-900 mover">
      <div className="p-1">
        <img
          src={notebook}
          alt="logo"
          className=" cursor-progress noMover hover:w-10 hover:h-7"
          onClick={() => navigate("/")}
          width={28}
        />
      </div>
      <div className="flex bg-slate-900 p-0.5 space-x-4 relative" ref={menuRef}>
        {Object.keys(optionMenu).map((menu) => (
          <div key={menu} className="relative">
            {/* boton del menu */}
            <button
              className="px-4 py-1 hover:bg-slate-800 hover:rounded-lg noMover"
              onMouseEnter={() => openMenu && setOpenMenu(menu)} // Cambia al pasar el mouse
              onClick={() => setOpenMenu(openMenu === menu ? null : menu)}
            >
              {menu}
            </button>
            {/* menu deplegable */}
            {openMenu === menu && (
              <div className="absolute left-0 mt-1 w-24 bg-slate-950 shadow-lg rounded-md border border-slate-500">
                <ul>
                  {optionMenu[menu].map((option) => (
                    <li
                      key={option.name}
                      className="px-4 py-2 hover:bg-slate-700 cursor-pointer"
                      onClick={() => {
                        setOpenMenu(null);
                        option.path ? navigate(option.path) : option.action?.();
                      }}
                    >
                      {option.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="w-fit p-1">
        <button
          onClick={() => window.Electron.minimize()}
          className="p-1 hover:bg-slate-500 hover:rounded-md"
        >
          <BsZoomOut className="text-lg cursor-zoom-out noMover " />
        </button>
        <button
          onClick={() => window.Electron.maximize()}
          className="p-1 hover:bg-slate-500 hover:rounded-md"
        >
          <BsZoomIn className="text-lg cursor-zoom-in noMover" />
        </button>
        <button
          onClick={() => window.Electron.close()}
          className="p-1 hover:bg-slate-500 hover:rounded-md"
        >
          <BsXCircle className="text-lg cursor-pointer noMover" />
        </button>
      </div>
    </nav>
  );
};
