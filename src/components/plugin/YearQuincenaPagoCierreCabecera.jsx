import { motion } from "framer-motion";
import React from "react";

export const YearQuincenaPagoCierreCabecera = ({
  key,
  yearS,
  setYearS,
  yearFives = [],
  handlePrev,
  handleNext,
  pago = {},
  setPago,
  handlePago,
  q = [],
  quincena = {},
  setQuincena,
  handleCierre,
  handleAbrirQ,
  disabled = false
}) => {
  // 🔧 PROTECCIÓN: Asegurar que los datos siempre sean arrays u objetos
  const safeQ = Array.isArray(q) ? q : [];
  const safeYearFives = Array.isArray(yearFives) ? yearFives : [];
  const safePago = pago && typeof pago === 'object' ? pago : { id: "", pago: false };
  const safeQuincena = quincena && typeof quincena === 'object' ? quincena : {};

  // 🔧 MANEJADORES SEGUROS
  const handleYearChange = (e) => {
    if (disabled) return;
    const year = Number(e.target.value);
    if (!isNaN(year) && year > 0) {
      setYearS(year);
    }
  };

  const handleQuincenaChange = (e) => {
    if (disabled) return;
    
    const selectedName = e.target.value;
    const qSelected = safeQ.find((item) => item?.name === selectedName);
    
    if (qSelected && setPago) {
      setPago({ ...safePago, id: qSelected.id, pago: false });
    }
  };

  const handleCierreClick = (currentQ) => {
    if (disabled || !handleCierre || !currentQ?.id) return;
    handleCierre(currentQ);
  };

  const handleAbrirClick = (currentQ) => {
    if (disabled || !handleAbrirQ || !currentQ?.id) return;
    handleAbrirQ(currentQ);
  };

  // 🔧 ENCONTRAR QUINCENA ACTUAL
  const currentQ = safeQ.find((select) => select?.id === safePago?.id);
  const isClosed = currentQ?.cerrado || false;

  return (
    <motion.section
      className="flex flex-wrap justify-between items-center gap-4 px-4 py-3 rounded-xl shadow-md bg-slate-800 max-w-5xl mx-auto"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      key={key + 2}
    >
      {/* Año */}
      <div className="flex items-center gap-2">
        <label className="text-white text-sm">Año:</label>
        <motion.button
          whileTap={{ scale: disabled ? 1 : 0.9 }}
          onClick={handlePrev}
          disabled={disabled}
          className={`px-2 py-1 text-white rounded text-xs ${
            disabled 
              ? "bg-slate-600 cursor-not-allowed opacity-50" 
              : "bg-slate-700 hover:bg-slate-600"
          }`}
        >
          ◀
        </motion.button>
        
        <select
          value={yearS}
          onChange={handleYearChange}
          disabled={disabled || safeYearFives.length === 0}
          className={`px-3 py-1 rounded border text-sm ${
            disabled || safeYearFives.length === 0
              ? "bg-slate-600 text-slate-400 cursor-not-allowed"
              : "bg-slate-700 text-white border-slate-600"
          }`}
        >
          {safeYearFives.length === 0 ? (
            <option value={yearS}>No hay años</option>
          ) : (
            safeYearFives.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))
          )}
        </select>
        
        <motion.button
          whileTap={{ scale: disabled ? 1 : 0.9 }}
          onClick={handleNext}
          disabled={disabled}
          className={`px-2 py-1 text-white rounded text-xs ${
            disabled 
              ? "bg-slate-600 cursor-not-allowed opacity-50" 
              : "bg-slate-700 hover:bg-slate-600"
          }`}
        >
          ▶
        </motion.button>
      </div>

      {/* Estadísticas o pago */}
      <div className="flex items-center space-x-2">
        <input
          id="pago"
          className={`w-5 h-5 border-gray-300 rounded focus:ring-2 focus:ring-emerald-400 ${
            disabled ? "opacity-50 cursor-not-allowed" : "text-emerald-500 cursor-pointer"
          }`}
          type="checkbox"
          checked={safePago.pago || false}
          onChange={handlePago}
          disabled={disabled || !safePago.id}
        />
        <label 
          htmlFor="pago" 
          className={`text-sm ${
            disabled ? "text-slate-500" : "text-slate-300"
          }`}
        >
          ¿Para Pago?
        </label>
      </div>

      {/* Cierre de quincena */}
      <div className="mt-3">
        {currentQ ? (
          <motion.button
            whileHover={{ scale: disabled ? 1 : 1.05 }}
            whileTap={{ scale: disabled ? 1 : 0.95 }}
            onClick={() => {
              if (isClosed) {
                handleAbrirClick(currentQ);
              } else {
                handleCierreClick(currentQ);
              }
            }}
            disabled={disabled}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              disabled
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : isClosed
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
            }`}
          >
            {isClosed ? "🔓 ABRIR QUINCENA" : "🔒 CERRAR QUINCENA"}
          </motion.button>
        ) : (
          <button
            disabled
            className="px-4 py-2 rounded-xl text-sm font-medium bg-gray-600 text-gray-400 cursor-not-allowed"
          >
            SELECCIONE QUINCENA
          </button>
        )}
      </div>

      {/* Quincena */}
      <div className="flex items-center gap-2">
        <label className="text-white text-sm">Quincena:</label>
        <select
          value={safeQuincena.name || ""}
          onChange={handleQuincenaChange}
          disabled={disabled || safeQ.length === 0}
          className={`px-3 py-1 rounded border text-sm ${
            disabled || safeQ.length === 0
              ? "bg-slate-600 text-slate-400 cursor-not-allowed"
              : "bg-slate-700 text-white border-slate-600"
          }`}
        >
          <option value="" hidden>
            {safeQ.length === 0 ? "No hay quincenas" : "Seleccione"}
          </option>
          {safeQ.map((quincenaItem) => (
            <option
              key={quincenaItem?.id}
              value={quincenaItem?.name}
              className={`${
                quincenaItem?.cerrado 
                  ? "bg-red-500 text-white" 
                  : "text-white"
              }`}
            >
              {quincenaItem?.name || "Sin nombre"}
              {quincenaItem?.cerrado ? " 🔒" : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Información del estado actual */}
      {currentQ && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-3 text-xs"
        >
          <span className={`px-2 py-1 rounded ${
            isClosed ? "bg-red-500" : "bg-emerald-500"
          } text-white`}>
            {isClosed ? "CERRADA" : "ABIERTA"}
          </span>
          
          {safePago.pago && (
            <span className="px-2 py-1 rounded bg-blue-500 text-white">
              MODO PAGO
            </span>
          )}
        </motion.div>
      )}
    </motion.section>
  );
};