import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { yearsFive } from "../../date";
import { h1 } from "framer-motion/client";

export const Dias = () => {
  const currentYear = new Date().getFullYear();
  const [yearS, setYearS] = useState(currentYear);
  const [yearFives, setYearFives] = useState([]);
  const [q, setQ] = useState([]);
  const [quincena, setQuincena] = useState({});
  const [qid, setQid] = useState({});

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

  console.log(quincena);
  const getQuincenaById = async (id) => {
    try {
      const res = await window.Electron.getQuincenaById(id);
      console.log("res", res);
      setQid(res);
      return res;
    } catch (error) {
      setError("Error al buscar la quincena: " + error);
    }
  };

  return (
    <div className="mt-10">
      <h1 className="text-3xl font-bold text-center text-emerald-400 mb-6 tracking-wide">Registros sin formatenar</h1>
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

      {qid.id && (
        <div>
          <h1 className="text-3xl font-bold text-center text-emerald-400 mb-6 tracking-wide">{qid.name}</h1>
          <section className="flex justify-center items-center gap-6">
            <p className="text-2xl font-bold text-center text-yellow-400 mb-2 tracking-wide">
              inicio:{" "}
              {`${new Date(qid.inicio).getDate()}-${
                new Date(qid.inicio).getMonth() + 1
              }-${new Date(qid.inicio).getFullYear()}`}
            </p>
            <p className="text-2xl font-bold text-center text-red-400 mb-2 tracking-wide">
              fin:{" "}
              {`${new Date(qid.fin).getDate()}-${
                new Date(qid.fin).getMonth() + 1
              }-${new Date(qid.fin).getFullYear()}`}
            </p>
          </section>
          {qid.dias && (
            <div className="flex flex-wrap justify-center items-center gap-4 mt-6 p-2">
              {qid.dias.map((dia) => (
                <motion.div
                  key={dia.id}
                  className="bg-slate-800 rounded-xl shadow-md p-4 border border-slate-700"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Encabezado del día */}
                  <h2 className="text-lg font-semibold text-white mb-2">
                    {dia.name}
                  </h2>
                  <p className="text-xs text-slate-400 mb-3">
                    Página: {dia.page}
                  </p>

                  {/* Valores en lista comprimida */}
                  <div className="space-y-1 text-sm">
                    {dia.coins ? (
                      <p className="flex justify-between">
                        <span className="text-slate-400">Coins:</span>
                        <span className="text-white font-medium">
                          {dia.coins}
                        </span>
                      </p>
                    ) : null}
                    {dia.usd ? (
                      <p className="flex justify-between">
                        <span className="text-slate-400">USD:</span>
                        <span className="text-green-400 font-medium">
                          ${dia.usd}
                        </span>
                      </p>
                    ) : null}
                    {dia.euro ? (
                      <p className="flex justify-between">
                        <span className="text-slate-400">Euro:</span>
                        <span className="text-blue-400 font-medium">
                          €{dia.euro}
                        </span>
                      </p>
                    ) : null}
                    {dia.gbp ? (
                      <p className="flex justify-between">
                        <span className="text-slate-400">GBP:</span>
                        <span className="text-purple-400 font-medium">
                          £{dia.gbp}
                        </span>
                      </p>
                    ) : null}
                    {dia.gbpParcial ? (
                      <p className="flex justify-between">
                        <span className="text-slate-400">GBP Parcial:</span>
                        <span className="text-purple-300 font-medium">
                          {dia.gbpParcial}
                        </span>
                      </p>
                    ) : null}
                    {dia.adelantos ? (
                      <p className="flex justify-between">
                        <span className="text-slate-400">Adelantos:</span>
                        <span className="text-orange-400 font-medium">
                          {dia.adelantos}
                        </span>
                      </p>
                    ) : null}
                    <p className="flex justify-between">
                      <span className="text-slate-400">Mostrar:</span>
                      <span
                        className={
                          dia.mostrar ? "text-green-400" : "text-red-400"
                        }
                      >
                        {dia.mostrar ? "Sí" : "No"}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-400">Worked:</span>
                      <span
                        className={
                          dia.worked ? "text-green-400" : "text-red-400"
                        }
                      >
                        {dia.worked ? "Sí" : "No"}
                      </span>
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
