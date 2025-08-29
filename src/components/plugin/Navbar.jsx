import React, { useEffect, useRef, useState } from "react";
import notebook from "../../assets/notebook.png";
import { useNavigate } from "react-router-dom";
import { BsZoomIn, BsZoomOut, BsXCircle } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar = () => {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef(null);

  const optionMenu = {
    Archivo: [
      { name: "Paginas", path: "/paginas" },
      { name: "Opción 2", path: "/" },
      { name: "Opción 3", path: "/" },
    ],
    Editar: [{ name: "Opción 4", path: "/" }],
    Registrar: [
      { name: "Quincena", path: "/register/quincena" },
      { name: "Día", path: "/register/dia" },
      { name: "Moneda", path: "/register/moneda" },
      { name: "Créditos", path: "/register/creditos" },
      { name: "Página", path: "/register/pagina" },
      { name: "Opción 5", path: "/" },
    ],
    Ayuda: [
      { name: "Opción 6", path: "/" },
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
    <nav className="flex justify-between items-center bg-slate-900 shadow-md px-3 py-1 rounded-md">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <img
          src={notebook}
          alt="logo"
          className="cursor-pointer noMover hover:scale-110 transition-transform"
          onClick={() => navigate("/")}
          width={28}
        />
        <h1 className="text-white font-bold tracking-wide text-sm">App Agenda</h1>
      </div>

      {/* Menú */}
      <div className="flex space-x-4 relative" ref={menuRef}>
        {Object.keys(optionMenu).map((menu) => (
          <div key={menu} className="relative">
            <button
              className={`px-3 py-1 text-white hover:bg-slate-800 hover:rounded-lg transition-colors ${
                openMenu === menu ? "bg-slate-800 rounded-lg" : ""
              }`}
              onMouseEnter={() => openMenu && setOpenMenu(menu)}
              onClick={() => setOpenMenu(openMenu === menu ? null : menu)}
            >
              {menu}
            </button>

            {/* Submenú animado */}
            <AnimatePresence>
              {openMenu === menu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 mt-1 w-36 bg-slate-950 shadow-lg rounded-md border border-slate-600 z-50"
                >
                  <ul className="divide-y divide-slate-700">
                    {optionMenu[menu].map((option) => (
                      <li
                        key={option.name}
                        className="px-4 py-2 text-sm text-white hover:bg-slate-700 cursor-pointer transition-colors"
                        onClick={() => {
                          setOpenMenu(null);
                          option.path ? navigate(option.path) : option.action?.();
                        }}
                      >
                        {option.name}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Botones de ventana */}
      <div className="flex space-x-2">
        <button
          onClick={() => window.Electrom.minimize()}
          className="p-1 rounded-md hover:bg-slate-700 transition"
        >
          <BsZoomOut className="text-lg text-yellow-400" />
        </button>
        <button
          onClick={() => window.Electron.maximize()}
          className="p-1 rounded-md hover:bg-slate-700 transition"
        >
          <BsZoomIn className="text-lg text-green-400" />
        </button>
        <button
          onClick={() => window.Electron.close()}
          className="p-1 rounded-md hover:bg-red-600 transition"
        >
          <BsXCircle className="text-lg text-red-400" />
        </button>
      </div>
    </nav>
  );
};
