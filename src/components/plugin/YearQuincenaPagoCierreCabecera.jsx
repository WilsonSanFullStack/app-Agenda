import { motion } from 'framer-motion'
import React from 'react'

export const YearQuincenaPagoCierreCabecera = ({
  yearS,
  setYearS,
  yearFives,
  handlePrev,
  handleNext,
  pago,
  setPago,
  handlePago,
  q,
  quincena,
  setQuincena,
  handleCierre,
}) => {
  console.log(q)
  return (
    <motion.section
    //* Cabecera compacta
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
        {/* estadisticas o pago */}
        <div className="flex items-center space-x-2">
          <input
            id="pago"
            className="w-5 h-5 text-emerald-500 border-gray-300 rounded focus:ring-emerald-400"
            type="checkbox"
            checked={pago.pago}
            onChange={handlePago}
          />
          <label htmlFor="pago" className="text-sm text-slate-300">
            ¿Para Pago?
          </label>
        </div>
        {/* cerrado de quincena */}
        <div className="mt-3">
  <button
  //! logica de cerrado por implementar
    onClick={handleCierre}
    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300
      ${
        q?.find((select) => select.id === pago.id)?.cerrado
          ? "bg-red-600 hover:bg-red-700 text-white"
          : "bg-emerald-600 hover:bg-emerald-700 text-white"
      }`}
  >
    {q?.find((select) => select.id === pago.id)?.cerrado
      ? "ABRIR QUINCENA"
      : "CERRAR QUINCENA"}
  </button>
</div>
        {/* Quincena */}
        <div className="flex items-center gap-2">
          <label className="text-white text-sm">Quincena:</label>
          <select
            className="px-3 py-1 rounded bg-slate-700 text-white border border-slate-600 text-sm"
            value={quincena.name}
            onChange={(e) => {
              const qSelected = q.find((item) => item.name === e.target.value);
              if (qSelected) setPago({ ...pago, id: qSelected.id });
            }}
          >
            <option value="" hidden>
              Seleccione
            </option>
            {q.map((quincena) => (
              <option
                key={quincena.id}
                value={quincena.name}
                className={`${quincena.cerrado ? "bg-red-500" : null}`}
              >
                {quincena.name}
              </option>
            ))}
          </select>
        </div>
      </motion.section>
  )
}
