import React, { useEffect, useRef, useState } from "react";
import notebook from "../../assets/notebook.png";
import { useNavigate } from "react-router-dom";
import { BsZoomIn, BsZoomOut, BsXCircle, BsArrowClockwise, BsArrowCounterclockwise, BsSquare, BsCheck2Square } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar = () => {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const menuRef = useRef(null);

  // 🔧 OPCIONES DEL MENÚ CON PROTECCIÓN
  const optionMenu = {
    Archivo: [
      { name: "Páginas", path: "/paginas" },
      { name: "Aranceles", path: "/aranceles" },
      { name: "Días", path: "/dias" },
    ],
    Registrar: [
      { name: "Quincena", path: "/register/quincena" },
      { name: "Día", path: "/register/dia" },
      { name: "Moneda", path: "/register/moneda" },
      { name: "Aranceles", path: "/register/aranceles" },
      { name: "Página", path: "/register/pagina" },
    ],
    Ventana: [
      {
        name: "Recargar",
        action: () => {
          if (window.Electron?.reload) {
            window.Electron.reload();
          } else {
            window.location.reload();
          }
        },
      },
      {
        name: "Recargar Forzado",
        action: () => {
          if (window.Electron?.reloadForce) {
            window.Electron.reloadForce();
          } else {
            window.location.reload();
          }
        },
      },
      {
        name: "Abrir Consola",
        action: () => {
          if (window.Electron?.openDevTools) {
            window.Electron.openDevTools();
          }
        },
      },
    ],
  };

  // 🔧 MANEJADORES SEGUROS PARA ACCIONES DE VENTANA
  const handleMinimize = () => {
    if (window.Electron?.minimize) {
      window.Electron.minimize();
    }
  };

  const handleMaximize = () => {
    if (window.Electron?.maximize) {
      window.Electron.maximize();
    }
  };

  const handleClose = () => {
    if (window.Electron?.close) {
      window.Electron.close();
    }
  };

  // 🔧 FUNCIONES DE RECARGA
  const handleReload = () => {
    if (window.Electron?.reload) {
      window.Electron.reload();
    } else {
      window.location.reload();
    }
  };

  const handleForceReload = () => {
    if (window.Electron?.reloadForce) {
      window.Electron.reloadForce();
    } else {
      window.location.reload();
    }
  };

  // 🔧 ESCUCHAR EVENTOS DE ESTADO DE VENTANA
  useEffect(() => {
    const handleMaximized = () => setIsMaximized(true);
    const handleUnmaximized = () => setIsMaximized(false);

    if (window.Electron?.onMaximized) {
      window.Electron.onMaximized(handleMaximized);
    }
    if (window.Electron?.onUnmaximized) {
      window.Electron.onUnmaximized(handleUnmaximized);
    }

    return () => {
      if (window.Electron?.removeAllListeners) {
        window.Electron.removeAllListeners('window:maximized');
        window.Electron.removeAllListeners('window:unmaximized');
      }
    };
  }, []);

  // 🔧 Cerrar menú si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 🔧 Cerrar menú al navegar
  const handleNavigation = (path, action) => {
    setOpenMenu(null);
    
    if (path) {
      navigate(path);
    } else if (action && typeof action === 'function') {
      action();
    }
  };

  // 🔧 MANEJADOR SEGURO PARA LOGO
  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    // 🔧 AGREGAR -webkit-app-region: drag PARA PERMITIR ARRASTRAR LA VENTANA
    <nav 
      className="flex justify-between items-center bg-slate-900 shadow-md px-3 py-1 rounded-md select-none"
      style={{ WebkitAppRegion: 'drag' }} // 🔧 IMPORTANTE: Permite arrastrar la ventana
    >
      {/* Logo - No drag para permitir clicks */}
      <div 
        className="flex items-center space-x-2"
        style={{ WebkitAppRegion: 'no-drag' }} // 🔧 IMPORTANTE: Permite clicks
      >
        <motion.img
          src={notebook}
          alt="logo"
          className="cursor-pointer noMover"
          onClick={handleLogoClick}
          width={28}
          height={28}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        />
        <h1 className="text-white font-bold tracking-wide text-sm">
          App Agenda
        </h1>
      </div>

      {/* Menú - No drag para permitir clicks */}
      <div 
        className="flex space-x-4 relative" 
        ref={menuRef}
        style={{ WebkitAppRegion: 'no-drag' }} // 🔧 IMPORTANTE: Permite clicks
      >
        {Object.keys(optionMenu).map((menu) => (
          <div key={menu} className="relative">
            <motion.button
              className={`px-3 py-1 text-white hover:bg-slate-800 hover:rounded-lg transition-colors text-sm font-medium ${
                openMenu === menu ? "bg-slate-800 rounded-lg" : ""
              }`}
              onMouseEnter={() => openMenu && setOpenMenu(menu)}
              onClick={() => setOpenMenu(openMenu === menu ? null : menu)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {menu}
            </motion.button>

            {/* Submenú animado */}
            <AnimatePresence>
              {openMenu === menu && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute left-0 mt-1 w-48 bg-slate-950 shadow-xl rounded-md border border-slate-600 z-50 backdrop-blur-sm"
                >
                  <ul className="divide-y divide-slate-700">
                    {Array.isArray(optionMenu[menu]) && optionMenu[menu].map((option, index) => (
                      <motion.li
                        key={option.name || index}
                        className="px-4 py-2 text-sm text-white hover:bg-slate-700 cursor-pointer transition-colors first:rounded-t-md last:rounded-b-md flex items-center gap-2"
                        onClick={() => handleNavigation(option.path, option.action)}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ 
                          backgroundColor: "rgba(51, 65, 85, 0.8)",
                          x: 2
                        }}
                      >
                        {option.name === "Recargar" && <BsArrowClockwise className="text-blue-400" />}
                        {option.name === "Recargar Forzado" && <BsArrowCounterclockwise className="text-orange-400" />}
                        {option.name === "Abrir Consola" && <span className="text-green-400">⚙️</span>}
                        {option.name}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Botones de ventana - No drag para permitir clicks */}
      <div 
        className="flex space-x-1"
        style={{ WebkitAppRegion: 'no-drag' }} // 🔧 IMPORTANTE: Permite clicks
      >
        {/* Botones de recarga */}
        <motion.button
          onClick={handleReload}
          className="p-1 rounded-md hover:bg-slate-700 transition"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Recargar (Ctrl+R)"
        >
          <BsArrowClockwise className="text-lg text-blue-400" />
        </motion.button>
        
        <motion.button
          onClick={handleForceReload}
          className="p-1 rounded-md hover:bg-slate-700 transition"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Recargar Forzado (Ctrl+Shift+R)"
        >
          <BsArrowCounterclockwise className="text-lg text-orange-400" />
        </motion.button>

        {/* Separador visual */}
        <div className="w-px bg-slate-600 mx-1 my-1"></div>

        {/* Botones de control de ventana */}
        <motion.button
          onClick={handleMinimize}
          className="p-1 rounded-md hover:bg-slate-700 transition"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Minimizar"
        >
          <BsZoomOut className="text-lg text-yellow-400" />
        </motion.button>
        
        <motion.button
          onClick={handleMaximize}
          className="p-1 rounded-md hover:bg-slate-700 transition"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title={isMaximized ? "Restaurar" : "Maximizar"}
        >
          {isMaximized ? (
            <BsCheck2Square className="text-lg text-green-400" />
          ) : (
            <BsSquare className="text-lg text-green-400" />
          )}
        </motion.button>
        
        <motion.button
          onClick={handleClose}
          className="p-1 rounded-md hover:bg-red-600 transition"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Cerrar"
        >
          <BsXCircle className="text-lg text-red-400" />
        </motion.button>
      </div>
    </nav>
  );
};