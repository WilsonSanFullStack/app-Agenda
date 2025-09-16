import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { yearsFive } from "../../date";
import { Moneda } from "./Moneda";

export const Home = ({ setError }) => {
  const currentYear = new Date().getFullYear();
  const [yearS, setYearS] = useState(currentYear);
  const [yearFives, setYearFives] = useState([]);
  const [q, setQ] = useState([]);
  const [quincena, setQuincena] = useState({});
  const [qData, setQData] = useState({});
  const [pago, setPago] = useState({
    pago: false,
    id: "",
  });

  const handlePago = () => {
    const y = pago.pago;
    setPago({ ...pago, pago: !y });
  };
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

  const getQData = async () => {
    try {
      if (pago.id !== "") {
        const res = await window.Electron.getDataQ(pago);
        console.log(res);
        setQData(res);
      }
    } catch (error) {
      setError("Error al cargar la quincena." + error);
    }
  };

  useEffect(() => {
    getQData(pago);
  }, [pago]);
  console.log("qData", qData);

  const moneda = qData?.moneda;
  const isPago = qData?.isPago;

  return (
    <div className="min-h-screen pt-12 bg-slate-900">
      {/* Cabecera compacta */}
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
              <option key={quincena.id} value={quincena.name}>
                {quincena.name}
              </option>
            ))}
          </select>
        </div>
      </motion.section>

      {/* Monedas */}
      <motion.div
        className="mt-3 max-w-5xl mx-auto"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Moneda moneda={moneda} isPago={isPago} />
      </motion.div>
    </div>
  );
};
