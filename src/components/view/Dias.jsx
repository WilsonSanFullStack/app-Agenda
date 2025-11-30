import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { yearsFive } from "../../date";
import { YearQuincenaSelectorCabecera } from "../plugin/YearQuincenaSelectorCabecera";

export const Dias = ({ setError }) => {
  const currentYear = new Date().getFullYear();
  const [yearS, setYearS] = useState(currentYear);
  const [yearFives, setYearFives] = useState([]);
  const [q, setQ] = useState([]);
  const [quincena, setQuincena] = useState({});
  const [qid, setQid] = useState({});
  const [loading, setLoading] = useState(false);

  // 🔧 FUNCIONES REUTILIZABLES
  const handleApiResponse = (response) => {
    return Array.isArray(response) ? response : [];
  };

  const handleObjectResponse = (response) => {
    return response && typeof response === 'object' ? response : {};
  };

  const handlePrev = () => setYearS(yearS - 1);
  const handleNext = () => setYearS(yearS + 1);

  const getQuincenaYear = async (year) => {
    try {
      const quincenas = await window.Electron.getQuincenaYear(year);
      return handleApiResponse(quincenas);
    } catch (error) {
      setError("Error al buscar las quincenas: " + error.message);
      return [];
    }
  };

  const handleGetQ = async () => {
    try {
      setLoading(true);
      const quincenas = await getQuincenaYear(yearS);
      setQ(quincenas);
    } catch (error) {
      setError("Error al cargar quincenas: " + error.message);
      setQ([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const years = yearsFive(yearS);
    setYearFives(handleApiResponse(years));
    handleGetQ();
  }, [yearS]);

  const getQuincenaById = async (id) => {
    if (!id) {
      setQid({});
      return {};
    }

    try {
      setLoading(true);
      const res = await window.Electron.getQuincenaById(id);
      const safeRes = handleObjectResponse(res);
      setQid(safeRes);
      return safeRes;
    } catch (error) {
      setError("Error al buscar la quincena: " + error.message);
      setQid({});
      return {};
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (quincena?.id) {
      getQuincenaById(quincena.id);
    } else {
      setQid({});
    }
  }, [quincena]);

  return (
    <div className="mt-10">
      <h1 className="text-3xl font-bold text-center text-emerald-400 mb-6 tracking-wide">
        Registros sin formatenar
      </h1>
      {/* Cabecera compacta */}
      <YearQuincenaSelectorCabecera
        yearS={yearS}
        setYearS={setYearS}
        yearFives={yearFives}
        handlePrev={handlePrev}
        handleNext={handleNext}
        quincena={quincena}
        q={q}
        getQuincenaById={getQuincenaById}
        disabled={loading}
      />

      {qid.id && (
        <div>
          <h1 className="text-3xl font-bold text-center text-emerald-400 mb-6 tracking-wide">
            {qid.name}
          </h1>
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
              {qid?.dias?.map((dia) => (
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
