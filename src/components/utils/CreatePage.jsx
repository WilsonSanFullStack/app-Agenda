import React, { useState } from "react";
import { motion } from "framer-motion";

export const CreatePage = ({ setError }) => {
  const [page, setPage] = useState({
    name: "",
    coins: false,
    moneda: "",
    mensual: false,
    valorCoins: 0,
    tope: 0,
    descuento: 0,
  });

  const handleMoneda = (e) => setPage({ ...page, moneda: e.target.value });
  const handleName = (e) => setPage({ ...page, name: e.target.value });
  const handleValor = (e) =>
    setPage({ ...page, valorCoins: parseFloat(e.target.value) });
  const handleTope = (e) =>
    setPage({ ...page, tope: parseFloat(e.target.value) });
  const handleDescuentos = (e) =>
    setPage({ ...page, descuento: parseFloat(e.target.value) });
  const handleCoins = (e) => setPage({ ...page, coins: e.target.checked });
  const handleMensual = (e) => setPage({ ...page, mensual: e.target.checked });

  const createPage = async (e) => {
    e.preventDefault();
    try {
      const res = await window.Electron.addPage(page);
      if (res.error) {
        setError(res.error);
      } else {
        setError("Página creada correctamente ✅");
        setPage({
          name: "",
          coins: false,
          moneda: "",
          mensual: false,
          valorCoins: 0,
          tope: 0,
          descuento: 0,
        });
      }
    } catch (error) {
      setError("Error al crear Page: " + error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md p-8 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-700"
      >
        <h1 className="text-3xl font-bold text-center text-emerald-400 mb-6 tracking-wide">
          Registro de Páginas
        </h1>

        <form onSubmit={createPage} className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block mb-1 text-sm font-medium text-slate-300">
              Nombre
            </label>
            <input
              className="w-full px-4 py-2 bg-slate-900/70 border border-slate-600 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none text-white"
              type="text"
              value={page.name}
              onChange={handleName}
              placeholder="Nombre Página"
            />
          </div>

          {/* Coins */}
          <div className="flex items-center space-x-2">
            <input
              className="w-5 h-5 text-emerald-500 border-gray-300 rounded focus:ring-emerald-400"
              type="checkbox"
              checked={page.coins}
              onChange={handleCoins}
            />
            <label className="text-sm text-slate-300">¿Usa Coins?</label>
          </div>

          {/* Moneda */}
          <div>
            <label className="block mb-1 text-sm font-medium text-slate-300">
              Moneda
            </label>
            <select
              value={page.moneda}
              onChange={handleMoneda}
              className="w-full bg-slate-900/70 text-white px-3 py-2 rounded-lg border border-slate-600 focus:ring-2 focus:ring-emerald-400"
            >
              <option value="" hidden>
                Seleccione una moneda
              </option>
              <option value="USD">Dólar</option>
              <option value="EURO">Euro</option>
              <option value="GBP">Libra Esterlina</option>
            </select>
          </div>

          {/* Mensual */}
          <div className="flex items-center space-x-2">
            <input
              className="w-5 h-5 text-emerald-500 border-gray-300 rounded focus:ring-emerald-400"
              type="checkbox"
              checked={page.mensual}
              onChange={handleMensual}
            />
            <label className="text-sm text-slate-300">¿Es mensual?</label>
          </div>

          {/* Valor Coin */}
          <div>
            <label className="block mb-1 text-sm font-medium text-slate-300">
              Valor del Coin
            </label>
            <input
              onWheel={(e) => e.target.blur()}
              className="no-spin w-full px-3 py-2 bg-slate-900/70 text-center text-white border border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-400"
              type="number"
              step="0.01"
              min="0"
              value={page.valorCoins}
              onChange={handleValor}
              placeholder="0.11"
            />
          </div>

          {/* Tope */}
          <div>
            <label className="block mb-1 text-sm font-medium text-slate-300">
              Tope
            </label>
            <input
              onWheel={(e) => e.target.blur()}
              className="w-full no-spin px-3 py-2 bg-slate-900/70 text-center text-white border border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-400"
              type="number"
              value={page.tope}
              onChange={handleTope}
              placeholder="50"
            />
          </div>

          {/* Descuentos */}
          <div>
            <label className="block mb-1 text-sm font-medium text-slate-300">
              Descuentos Página
            </label>
            <input
              onWheel={(e) => e.target.blur()}
              className="w-full no-spin px-3 py-2 bg-slate-900/70 text-center text-white border border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-400"
              type="number"
              value={page.descuento}
              onChange={handleDescuentos}
              placeholder="0.60"
            />
          </div>

          {/* Botón */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-3 mt-4 text-lg font-semibold text-white bg-emerald-500 rounded-lg shadow-md hover:bg-emerald-600 transition-all duration-300"
          >
            Cargar Página
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};
