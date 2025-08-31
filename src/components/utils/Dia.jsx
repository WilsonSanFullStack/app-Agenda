import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { generarDias, yearsFive } from "../../date";

export const Dia = ({ setError }) => {
  const [dia, setdia] = useState({
    name: "",
    page: "",
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
  const [page, setPage] = useState([]);
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
      setError("Error al buscar las quincenas: " + error);
    }
  };
  const getPagesName = async () => {
    try {
      const pages = await window.Electron.getPageName();
      return pages;
    } catch (error) {
      setError("Error al buscar las paginas: " + error);
    }
  };
  const handleGetQ = async () => {
    const quincenas = await getQuincenaYear(yearS);
    const pages = await getPagesName();
    setQ(quincenas);
    setPage(pages);
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
    setdia({ ...dia, name: e });
  };
  const handlePage = (e) => {
    setdia({ ...dia, page: e.name });
  };
  // handleDisable()
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
    setdia({ ...dia, adelantos: parseFloat(e.target.value) || 0 });
  };
  const handleMostrar = (e) => {
    setdia({ ...dia, mostrar: e.target.checked });
  };
  const handleWorked = (e) => {
    setdia({ ...dia, worked: e.target.checked });
  };
  const handleQuincena = (e) => {
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
  console.log("dia", dia);
  console.log("page", page);
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
              className="p-2 border rounded bg-gray-800"
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
              className="p-2 border rounded bg-gray-800"
              value={quincena.name}
              onChange={(e) => {
                const qSelected = q.find(
                  (item) => item.name === e.target.value
                );
                if (qSelected) handleQuincena(qSelected);
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

          {/* dias */}
          <div className="flex items-center gap-2">
            <label htmlFor="">Seleccione El Dia</label>
            <select
              className="p-2 border rounded bg-gray-800"
              onChange={(e) => {
                const daySelected = dias.find(
                  (item) => item === e.target.value
                );
                if (daySelected) handleName(daySelected);
              }}
            >
              <option value="" hidden>
                Seleccione
              </option>
              {dias?.map((dia) => (
                <option key={dia} value={dia}>
                  {dia}
                </option>
              ))}
            </select>
          </div>
          {/* paginas */}
          <div className="flex items-center gap-2">
            <label htmlFor="">Seleccione La Pagina</label>
            <select
              className="p-2 border rounded bg-gray-800"
              onChange={(e) => {
                const pageSelected = page.find(
                  (item) => item.name === e.target.value
                );
                if (pageSelected) handlePage(pageSelected);
              }}
            >
              <option value="" hidden>
                Seleccione
              </option>
              {page?.map((pag) => (
                <option key={pag.id} value={pag.name}>
                  {pag.name}
                </option>
              ))}
            </select>
          </div>

          {/* cop */}
          <div
            className={`${
              page.find((pag) => pag.name === dia.page)?.moneda === "COP"
                ? "opacity-100"
                : "opacity-30"
            }`}
          >
            <label className="block mb-1 text-sm font-medium to-slate-300">
              Adelantos / Prestamos
            </label>
            <input
              onWheel={(e) => e.target.blur()}
              className="no-spin w-full px-4 py-2 bg-slate-900/70 border border-slate-600 rounded-lg shadow-sm focus:ring-emerald-400 focus:outline-none text-white"
              type="number"
              value={dia.adelantos}
              disabled={
                page.find((pag) => pag.name === dia.page)?.moneda === "COP"
                  ? false
                  : true
              }
              onChange={handleAdelantos}
              placeholder=""
              min={0}
            />
            <p className="block mb-1 text-sm font-medium to-slate-300">
              {Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              }).format(dia.adelantos) || 0}
            </p>
          </div>
          {/* usd */}
          <div
            className={`${
              page.find((pag) => pag.name === dia.page)?.moneda === "USD"
                ? "opacity-100"
                : "opacity-30"
            }`}
          >
            <label className="block mb-1 text-sm font-medium to-slate-300">
              Dolares
            </label>
            <input
              onWheel={(e) => e.target.blur()}
              className="no-spin w-full px-4 py-2 bg-slate-900/70 border border-slate-600 rounded-lg shadow-sm focus:ring-emerald-400 focus:outline-none text-white"
              type="number"
              value={dia.usd}
              disabled={
                page.find((pag) => pag.name === dia.page)?.moneda === "USD"
                  ? false
                  : true
              }
              onChange={handleUsd}
              placeholder=""
              min={0}
            />
            <p className="block mb-1 text-sm font-medium to-slate-300">
              {Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              }).format(dia.usd) || 0}
            </p>
          </div>
          {/* euros */}
          <div
            className={`${
              page.find((pag) => pag.name === dia.page)?.moneda === "EURO"
                ? "opacity-100"
                : "opacity-30"
            }`}
          >
            <label className="block mb-1 text-sm font-medium to-slate-300">
              Euros
            </label>
            <input
              onWheel={(e) => e.target.blur()}
              className="no-spin w-full px-4 py-2 bg-slate-900/70 border border-slate-600 rounded-lg shadow-sm focus:ring-emerald-400 focus:outline-none text-white"
              type="number"
              value={dia.euro}
              disabled={
                page.find((pag) => pag.name === dia.page)?.moneda === "EURO"
                  ? false
                  : true
              }
              onChange={handleEuro}
              placeholder=""
              min={0}
            />
            <p className="block mb-1 text-sm font-medium to-slate-300">
              {Intl.NumberFormat("es-EU", {
                style: "currency",
                currency: "EUR",
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              }).format(dia.euro) || 0}
            </p>
          </div>
          {/* gbp */}
          <div
            className={`${
              page.find((pag) => pag.name === dia.page)?.moneda === "GBP"
                ? "opacity-100"
                : "opacity-30"
            }`}
          >
            <label className="block mb-1 text-sm font-medium to-slate-300">
              Libras Esterlinas
            </label>
            <input
              onWheel={(e) => e.target.blur()}
              className="no-spin w-full px-4 py-2 bg-slate-900/70 border border-slate-600 rounded-lg shadow-sm focus:ring-emerald-400 focus:outline-none text-white"
              type="number"
              value={dia.gbp}
              disabled={
                page.find((pag) => pag.name === dia.page)?.moneda === "GBP"
                  ? false
                  : true
              }
              onChange={handleGbp}
              placeholder=""
              min={0}
            />
            <p className="block mb-1 text-sm font-medium to-slate-300">
              {Intl.NumberFormat("en-GB", {
                style: "currency",
                currency: "GBP",
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              }).format(dia.gbp) || 0}
            </p>
          </div>
          {/* gbp parcial*/}
          <div
            className={`${
              page.find((pag) => pag.name === dia.page)?.moneda === "GBP"
                ? "opacity-100"
                : "opacity-30"
            }`}
          >
            <label className="block mb-1 text-sm font-medium to-slate-300">
              Libras Esterlinas Parcial
            </label>
            <input
              onWheel={(e) => e.target.blur()}
              className="no-spin w-full px-4 py-2 bg-slate-900/70 border border-slate-600 rounded-lg shadow-sm focus:ring-emerald-400 focus:outline-none text-white"
              type="number"
              value={dia.gbpParcial}
              disabled={
                page.find((pag) => pag.name === dia.page)?.moneda === "GBP"
                  ? false
                  : true
              }
              onChange={handleGbpParcial}
              placeholder=""
              min={0}
            />
            <p className="block mb-1 text-sm font-medium to-slate-300">
              {Intl.NumberFormat("en-GB", {
                style: "currency",
                currency: "GBP",
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              }).format(dia.gbpParcial) || 0}
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
