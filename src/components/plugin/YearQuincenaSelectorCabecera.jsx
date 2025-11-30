import { motion } from "framer-motion";
import React from "react";

export const YearQuincenaSelectorCabecera = ({
  yearS,
  setYearS,
  yearFives = [],
  handlePrev,
  handleNext,
  quincena = {},
  q = [],
  getQuincenaById,
  disabled = false,
}) => {
  // 🔧 FUNCIONES REUTILIZABLES
  const handleApiResponse = (response) => {
    return Array.isArray(response) ? response : [];
  };

  // 🔧 DATOS PROTEGIDOS
  const safeYearFives = handleApiResponse(yearFives);
  const safeQ = handleApiResponse(q);
  const safeQuincena = quincena && typeof quincena === "object" ? quincena : {};

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

    if (qSelected?.id && getQuincenaById) {
      getQuincenaById(qSelected.id);
    }
  };

  return (
    <motion.section
      className="flex flex-wrap justify-between items-center gap-4 px-4 py-3 rounded-xl shadow-md bg-slate-800 max-w-5xl mx-auto"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
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
          disabled={disabled}
          className={`px-3 py-1 rounded border text-sm ${
            disabled
              ? "bg-slate-600 text-slate-400 cursor-not-allowed"
              : "bg-slate-700 text-white border-slate-600"
          }`}
        >
          {safeYearFives.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
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
              className={quincenaItem?.cerrado ? "bg-red-500 text-white" : ""}
            >
              {quincenaItem?.name || "Sin nombre"}
              {quincenaItem?.cerrado ? " 🔒" : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Información de estado */}
      {safeQuincena.name && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 text-xs"
        >
          <span
            className={`px-2 py-1 rounded ${
              safeQuincena.cerrado
                ? "bg-red-500 text-white"
                : "bg-emerald-500 text-white"
            }`}
          >
            {safeQuincena.cerrado ? "Cerrada" : "Abierta"}
          </span>

          {safeQuincena.dias && Array.isArray(safeQuincena.dias) && (
            <span className="text-slate-300">
              {safeQuincena.dias.length} días
            </span>
          )}
        </motion.div>
      )}

      {/* Estado cuando no hay quincenas */}
      {safeQ.length === 0 && !disabled && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-slate-400 text-xs"
        >
          No hay quincenas para este año
        </motion.div>
      )}
    </motion.section>
  );
};
