import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { yearsFive, quincenasYear } from "../../date";
import { AiOutlineArrowRight } from "react-icons/ai";
import { AiOutlineArrowLeft } from "react-icons/ai";

export const Quincena = ({ setError }) => {
  const navigate = useNavigate();
  const [quincenas, setQuincenas] = useState([]);
  const [q, setQ] = useState([]);
  const [creado, setCreado] = useState(false);

  const currentYear = new Date().getFullYear();
  const [yearS, setYearS] = useState(currentYear);
  const [yearFives, setYearFives] = useState([]);

  useEffect(() => {
    window.Electron.onAbrirRegistroQuincena(() => {
      setError("Cambiando vista a Registro Quincena");
      navigate("/register/quincena");
    });
  }, []);

  const crearQuincena = async (data) => {
    try {
      const respuesta = await window.Electron.addQuincena(data);
      if (respuesta.error) {
        setError(respuesta.error);
      } else {
        setCreado((prev) => !prev);
        setError("✅ Quincena creada");
        const nuevasQuincenas = await fetchQ(yearS);
        setQ(nuevasQuincenas || []);
      }
    } catch (error) {
      setError("Error al crear la quincena: " + error);
    }
  };

  const fetchQ = async (year) => {
    try {
      const result = await window.Electron.getQuincenaYear(year);
      return result;
    } catch (error) {
      setError("Error fetching data: " + error);
    }
  };

  const handleQuincena = async (year) => {
    const creadas = await fetchQ(year);
    setQ(creadas || []);
    const quincenaDate = quincenasYear(yearS, q);
    setQuincenas(quincenaDate)
  };

  useEffect(() => {
    handleQuincena(yearS);
    window.Electron.onQuincenaActualizada(() => {
      setError("🔄 Quincena actualizada, recargando datos...");
      fetchQ(yearS);
    });
    return () => {
      window.Electron.removeQuincenaActualizada();
    };
  }, [creado]);

  useEffect(() => {
    const year5 = yearsFive(yearS);
    setYearFives(year5);
    const quincenaDate = quincenasYear(yearS, q);
    setQuincenas(quincenaDate)
  }, [yearS, q]);
  return (
    <div className="pt-12 text-white">
      {/* Botones de años */}
      <div className="flex flex-wrap justify-center gap-1">
        <button
          type="button"
          className="p-0.5 text-center rounded-xl bg-blue-200 hover:bg-yellow-100"
          onClick={() => setYearS(yearS - 1)}
        >
          <AiOutlineArrowLeft className="text-blue-600 text-2xl" />
        </button>

        {yearFives?.map((year) => (
          <button
            key={year}
            type="button"
            className={`w-12 py-1 rounded-lg font-semibold transition-colors
              ${
                yearS === year
                  ? "bg-emerald-600"
                  : "bg-gray-600 hover:bg-gray-700"
              }`}
            onClick={() => setYearS(year)}
          >
            {year}
          </button>
        ))}
        <button
          type="button"
          className="p-0.5 text-center rounded-xl bg-blue-200 hover:bg-yellow-100"
          onClick={() => setYearS(yearS + 1)}
        >
          <AiOutlineArrowRight className="text-blue-600 text-2xl" />
        </button>
      </div>

      {/* Lista de quincenas */}
      <section className="text-center mt-6">
        <h1 className="text-xl font-bold mb-4">📅 Quincenas {yearS}</h1>
        <div className="flex flex-wrap justify-center gap-3">
          {quincenas.map((qItem, i) => (
            <motion.div
              key={qItem.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="border border-slate-500 bg-slate-800/70 rounded-lg p-3 w-48 shadow-md"
            >
              <h2 className="font-semibold text-amber-400">{qItem.name}</h2>
              <button
                type="button"
                onClick={() => crearQuincena(qItem)}
                className="mt-2 px-3 py-1 rounded-md text-sm border border-emerald-400 text-emerald-300 hover:bg-emerald-500 hover:text-white transition-colors"
              >
                Crear
              </button>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};
