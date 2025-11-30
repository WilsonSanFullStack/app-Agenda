import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const Page = ({ setError }) => {
  const [pages, setPages] = useState([]);

  const getPages = async () => {
    try {
      const res = await window.Electron.getPage();
      if (Array.isArray(res)) {
        setPages(res);
      } else {
        setPages([]);
      }
    } catch (error) {
      setError("Error al buscar las paginas: " + error);
    }
  };

  const handleDeletePage = async (id, pageName) => {
    try {
      const confirmDelete = window.confirm(
        `¿Estás seguro de que quieres eliminar la página "${pageName}"?`
      );
      
      if (confirmDelete) {
        await window.Electron.deletePage(id);
        // Recargar la lista después de eliminar
        getPages();
        setError(`Página "${pageName}" eliminada correctamente`);
      }
    } catch (error) {
      setError("Error al eliminar la página: " + error);
    }
  };

  useEffect(() => {
    getPages();
  }, []);

  return (
    <motion.div
      className="pt-14 text-center min-h-screen bg-aurora text-white"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <h1 className="text-4xl uppercase font-bold mb-8 tracking-widest">
        Páginas
      </h1>

      <div className="flex flex-wrap justify-center gap-6 px-4">
        {pages?.map((page, index) => (
          <motion.div
            key={page.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 8px 25px rgba(0,0,0,0.4)",
            }}
            className="border border-slate-700 bg-slate-800/70 backdrop-blur-md rounded-2xl p-5 w-72 shadow-lg hover:shadow-2xl transition-all duration-300 relative"
          >
            {/* Botón de eliminar */}
            <button
              onClick={() => handleDeletePage(page.id, page.name)}
              className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors duration-200"
              title={`Eliminar ${page.name}`}
            >
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                />
              </svg>
            </button>

            <section className="uppercase text-xl font-bold text-emerald-400 mb-3">
              {page.name}
            </section>

            <section className="capitalize font-medium flex justify-between mb-2">
              <h3>Moneda:</h3>
              <p className="text-amber-400">{page.moneda}</p>
            </section>

            <section className="capitalize font-medium flex justify-between mb-2">
              <h3>Coins:</h3>
              <p>{page.coins ? "Sí" : "No"}</p>
            </section>

            <section className="capitalize font-medium flex justify-between mb-2">
              <h3>1 coin:</h3>
              <p>{page.valorCoins > 0 ? page.valorCoins : "NO"}</p>
            </section>

            <section className="capitalize font-medium flex justify-between mb-2">
              <h3>Mensual:</h3>
              <p>{page.mensual ? "Sí" : "No"}</p>
            </section>

            <section className="capitalize font-medium flex justify-between mb-2">
              <h3>Descuentos(%):</h3>
              <p
                className={
                  page.descuento > 0 ? "text-emerald-400" : "text-red-400"
                }
              >
                {page.descuento > 0
                  ? `${Intl.NumberFormat("es-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(page.descuento)}`
                  : "No"}
              </p>
            </section>

            <section className="capitalize font-medium flex justify-between">
              <h3>Tope mínimo:</h3>
              <p className={page.tope > 0 ? "text-amber-400" : "text-gray-400"}>
                {page.tope > 0 ? `${page.tope} ${page.moneda}` : "No"}
              </p>
            </section>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};