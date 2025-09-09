import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { yearsFive } from "../../date";

export const Home = ({ setError }) => {
  const currentYear = new Date().getFullYear();
  const [yearS, setYearS] = useState(currentYear);
  const [yearFives, setYearFives] = useState([]);
  const [q, setQ] = useState([]);
  const [quincena, setQuincena] = useState({});

  const handlePrev = () => setYearS(yearS - 1);

  const handleNext = () => setYearS(yearS + 1);

  const getQuincenaYear = async (year) => {
    try {
      const quincenas = await window.Electron.getQuincenaYear(year);
      return quincenas;
    } catch (error) {
      setError("Error al buscar las quincenas: " + error);
    }
  };

  const handleGetQ = async () => {
    const quincenas = await getQuincenaYear(yearS);
    setQ(quincenas);
  };

  useEffect(() => {
    const years = yearsFive(yearS);
    setYearFives(years);
    handleGetQ(yearS);
  }, [yearS, currentYear]);

  const getQData = async (id) => {
    try {
      const res = await window.Electron.getDataQ(id);
      console.log(res);
      return res;
    } catch (error) {
      setError("Error al cargar la quincena." + error);
    }
  };

  return (
    <div className="min-h-screen pt-10 bg-slate-900">
      {/* Año y quincena */}
      <motion.section
        className="flex flex-wrap gap-4 justify-center items-center rounded-xl shadow-lg bg-slate-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {/* Año */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-3 rounded-lg">
          <label className="text-white font-medium">Seleccione el Año</label>
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={handlePrev}
              className="px-3 py-1 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition"
            >
              ◀
            </motion.button>
            <select
              value={yearS}
              className="px-4 py-2 rounded-lg bg-slate-800 text-white border border-slate-600 focus:ring-emerald-400 focus:outline-none"
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
              type="button"
              onClick={handleNext}
              className="px-3 py-1 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition"
            >
              ▶
            </motion.button>
          </div>
        </div>

        {/* Quincena */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-3 rounded-lg">
          <label className="text-white font-medium ">
            Seleccione la Quincena
          </label>
          <div className="flex items-center gap-2">
            <select
              className="px-3 py-1 rounded-lg bg-slate-800 text-white border border-slate-600 focus:ring-emerald-400 focus:outline-none"
              value={quincena.name}
              onChange={(e) => {
                const qSelected = q.find(
                  (item) => item.name === e.target.value
                );
                if (qSelected) getQData(qSelected.id);
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
        </div>
      </motion.section>
    </div>
  );
};
