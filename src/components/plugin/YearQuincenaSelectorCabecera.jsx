import { motion } from "framer-motion";
import React from "react";


export const YearQuincenaSelectorCabecera = ({
  yearS,
  setYearS,
  yearFives,
  handlePrev,
  handleNext,
  quincena,
  q,
  getQuincenaById,
}) => {
  return (
    //* Cabecera compacta
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
          whileTap={{ scale: 0.9 }}
          onClick={handlePrev}
          className="px-2 py-1 bg-slate-700 text-white rounded hover:bg-slate-600 text-xs"
        >
          ◀
        </motion.button>
        <select
          value={yearS}
          className="px-3 py-1 rounded bg-slate-700 text-white border border-slate-600 text-sm"
          onChange={(e) => setYearS(Number(e.target.value))}
        >
          {yearFives.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleNext}
          className="px-2 py-1 bg-slate-700 text-white rounded hover:bg-slate-600 text-xs"
        >
          ▶
        </motion.button>
      </div>

      {/* Quincena */}
      <div className="flex items-center gap-2">
        <label className="text-white text-sm">Quincena:</label>
        <select
          className="px-3 py-1 rounded bg-slate-700 text-white border border-slate-600 text-sm"
          value={quincena.name}
          onChange={(e) => {
            const qSelected = q.find((item) => item.name === e.target.value);
            if (qSelected) getQuincenaById(qSelected.id);
          }}
        >
          <option value="" hidden>
            Seleccione
          </option>
          {q.map((quincena) => (
            <option key={quincena.id} value={quincena.name}>
              {quincena.name}
            </option>
          ))}
        </select>
      </div>
    </motion.section>
  );
};
