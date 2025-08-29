import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { generarDias, yearsFive } from "../../date";

export const Dia = ({ setError }) => {
  const [dia, setdia] = useState({
    name: "",
    usd: 0,
    euro: 0,
    gbp: 0,
    gbpParcial: 0,
    mostrar: 0,
    adelantos: 0,
    worked: 0,
    q: "",
  });
  const [q, setQ] = useState([]);
  const [quincena, setQuincena] = useState({
    year: null,
    name: "",
    inicio: null,
    fin: null,
  });
  const [dias, setDias] = useState([]);
  const currentYear = new Date().getFullYear();
  const [yearS, setYearS] = useState(currentYear);
  const [yearFives, setYearFives] = useState([]);

  const handlePrev = () => setYearS(yearS - 1);
  const handleNext = () => setYearS(yearS + 1);

  const getQuincenaYear = async (year) => {
    try {
      const quincenas = await window.Electron.getQuincenaYear(year);
      return quincenas;
    } catch (error) {
      setError("Error fetching data: " + error);
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

  useEffect(() => {
    const getDias = generarDias(quincena);
    setDias(getDias);
  }, [quincena]);
  // console.log(getQuincenaYear(2025));
  const handleName = (e) => {
    setdia({ ...dia, name: e.target.value });
  };
  const handleUsd = (e) => {
    setdia({ ...dia, usd: parseFloat(e.target.value) });
  };
  const handleEuro = (e) => {
    setdia({ ...dia, euro: parseFloat(e.target.value) });
  };
  const handleGbp = (e) => {
    setdia({ ...dia, gbp: parseFloat(e.target.value) });
  };
  const handleGbpParcial = (e) => {
    setdia({ ...dia, gbpParcial: parseFloat(e.target.value) });
  };
  const handleAdelantos = (e) => {
    setdia({ ...dia, adelantos: parseFloat(e.target.value) });
  };
  const handleMostrar = (e) => {
    setdia({ ...dia, mostrar: e.target.checked });
  };
  const handleWorked = (e) => {
    setdia({ ...dia, worked: e.target.checked });
  };
  const handleQuincena = (e) => {
    console.log("e", e);
    setQuincena({
      ...quincena,
      name: e.name,
      inicio: e.inicio,
      fin: e.fin,
      year: e.year,
    });
  };

  const crearDia = async (e) => {
    e.preventDefault();
    try {
      const res = await window.Electron.addDay(dia);
      if (res.error) {
        setError(res.error);
      } else {
        setError("Dia creado correctamente ✅");
        setdia({
          name: "",
          usd: 0,
          euro: 0,
          gbp: 0,
          gbpParcial: 0,
          mostrar: 0,
          adelantos: 0,
          worked: 0,
          q: "",
        });
      }
    } catch (error) {
      setError("Error al crear Dia: " + error);
    }
  };
  console.log("yearS", yearS);
  console.log("yearFive", yearFives);
  console.log("q", q);
  console.log("quincena", quincena);
  console.log("dias", dias);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md p-8 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-700"
      >
        <h1 className="text-3xl font-bold text-center text-emerald-400 mb-6 tracking-wide">
          Registro Creditos diarios
        </h1>

        <form onSubmit={crearDia} className="space-y-4">
          {/* year */}
          <div className="flex items-center gap-2">
            <label htmlFor="">Seleccione El Año</label>
            {/* Botón anterior */}
            <button
              type="button"
              onClick={handlePrev}
              className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              ◀
            </button>

            {/* Select dinámico */}
            <select
              value={yearS}
              className="p-2 border rounded bg-gray-700"
              onChange={(e) => setYearS(Number(e.target.value))}
            >
              {yearFives.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            {/* Botón siguiente */}
            <button
              type="button"
              onClick={handleNext}
              className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              ▶
            </button>
          </div>

          {/* quincenas */}
          <div className="flex items-center gap-2">
            <label htmlFor="">Seleccione La Quincena</label>
            <select
              className="p-2 border rounded bg-gray-700"
              value={quincena.name}
              onChange={(e) => {
                const qSelected = q.find(
                  (item) => item.name === e.target.value
                );
                if (qSelected) handleQuincena(qSelected);
              }}
            >
              {q.map((quincena) => (
                <option key={quincena.id} value={quincena.name}>
                  {quincena.name}
                </option>
              ))}
            </select>
          </div>

          {/* dias */}
          <div className="flex items-center gap-2">
            <label htmlFor="">Seleccione El Dia</label>
            <select className="p-2 border rounded bg-gray-700">
              {dias?.map((dia) => (
                <option
                  key={dia}
                  value={dia}
                  // onClick={() => handleQuincena(quincena)}
                >
                  {dia}
                </option>
              ))}
            </select>
          </div>

          {/* Nombre */}
          <div>
            <label className="block mb-1 text-sm font-medium to-slate-300">
              Nombre
            </label>
            <input
              className="w-full px-4 py-2 bg-slate-900/70 border border-slate-600 rounded-lg shadow-sm focus:ring-emerald-400 focus:outline-none text-white"
              type="text"
              value={dia.name}
              onChange={handleName}
              placeholder=""
            />
          </div>
        </form>
      </motion.div>
    </div>
  );
};
