import { motion, number } from "framer-motion";
import React, { useEffect, useState } from "react";
import { generarDias, yearsFive } from "../../date";
import { YearQuincenaSelector } from "../plugin/YearQuincenaSelector";

export const CreateDia = ({ setError }) => {
  const [dia, setDia] = useState({
    name: "",
    page: "",
    coins: 0,
    usd: 0,
    euro: 0,
    gbp: 0,
    gbpParcial: 0,
    mostrar: true,
    adelantos: 0,
    worked: false,
    q: "",
  });
  const [q, setQ] = useState([]);
  const [quincena, setQuincena] = useState({
    year: null,
    name: "",
    inicio: null,
    fin: null,
    coins: null,
    valorCoins: null,
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

  const handleMostrar = () => {
    const tope = parseFloat(page?.find((pag) => dia.page === pag.name)?.tope);
    const moneda = page?.find((pag) => dia.page === pag.name)?.moneda;
    const money =
      moneda === "USD"
        ? dia.usd
        : moneda === "EURO"
        ? dia.euro
        : moneda === "GBP"
        ? dia.gbp
        : 0;
    const mostra = tope <= money;
    setDia((prev) => ({ ...prev, mostrar: mostra }));
  };
  const handleName = (e) => {
    setDia({ ...dia, name: e });
  };
  const handlePage = (e) => {
    setDia({
      ...dia,
      page: e.name,
      coins: 0,
      usd: 0,
      euro: 0,
      gbp: 0,
      gbpParcial: 0,
      mostrar: true,
      adelantos: 0,
      worked: false,
    });
  };
  const handleUsd = (e) => {
    setDia({ ...dia, usd: parseFloat(e.target.value || 0) });
  };
  const handleCoins = (e) => {
    //buscamos el valor de los coins
    const valorCoins = page.find((pag) => pag.name === dia.page)?.valorCoins;
    //buscamos la moneda a la cual convertir los coins
    const moneda = page.find((pag) => pag.name === dia.page)?.moneda;
    //conversion de coins a moneda
    const money = parseInt(e.target.value) * valorCoins || 0;
    //revisamos a que moneda pertenecen el dinero de los coins
    if (moneda === "USD") {
      //si es usd
      setDia({ ...dia, usd: money, coins: parseInt(e.target.value) || 0 });
    } else if (moneda === "EURO") {
      //si es euro
      setDia({ ...dia, euro: money, coins: parseInt(e.target.value) || 0 });
    } else if (moneda === "GBP") {
      //si es liras esterlinas
      setDia({ ...dia, gbp: money, coins: parseInt(e.target.value) || 0 });
    }
  };
  const handleEuro = (e) => {
    setDia({ ...dia, euro: parseFloat(e.target.value) || 0 });
  };
  const handleGbp = (e) => {
    setDia({ ...dia, gbp: parseFloat(e.target.value) || 0 });
  };
  const handleGbpParcial = (e) => {
    setDia({ ...dia, gbpParcial: parseFloat(e.target.value) || 0 });
  };
  const handleAdelantos = (e) => {
    setDia({ ...dia, adelantos: parseFloat(e.target.value) || 0 });
  };
  const handleWorked = () => {
    if (
      dia.coins > 0 ||
      dia.euro > 0 ||
      dia.usd > 0 ||
      dia.gbp > 0 ||
      dia.gbpParcial > 0
    ) {
      setDia({ ...dia, worked: true });
    } else {
      setDia({ ...dia, worked: false });
    }
  };
  const handleQuincena = (e) => {
    setQuincena({
      ...quincena,
      name: e.name,
      inicio: e.inicio,
      fin: e.fin,
      year: e.year,
    });
    setDia({ ...dia, q: e.id });
  };
  useEffect(() => {
    handleWorked();
    handleMostrar();
  }, [dia.usd, dia.euro, dia.coins, dia.gbp, dia.gbpParcial, dia.mostrar]);
  const crearDia = async (e) => {
    e.preventDefault();
    try {
      const res = await window.Electron.addDay(dia);
      if (res.error) {
        console.log(res.error);
        setError(res.error);
      } else {
        setError("Dia creado correctamente ✅");
        setDia({
          ...dia,
          page: "",
          coins: 0,
          usd: 0,
          euro: 0,
          gbp: 0,
          gbpParcial: 0,
          mostrar: true,
          adelantos: 0,
          worked: false,
        });
      }
    } catch (error) {
      setError("Error al crear Dia: " + error);
    }
  };
  console.log(dia);
  //para saber si la quincena esta cerrada
  const quincenaSeleccionada = q?.find((select) => select.id === dia.q);
  const quincenaCerrada = quincenaSeleccionada?.cerrado;
  return (
    <div className="pt-12 flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
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
          <YearQuincenaSelector
        yearS={yearS}
        yearFives={yearFives}
        setYearS={setYearS}
        q={q}
        quincena={quincena}
        handleQuincena={handleQuincena}
        handlePrev={handlePrev}
        handleNext={handleNext}
      />

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
                : "hidden"
            }`}
          >
            <label className="block mb-1 text-sm font-medium to-slate-300">
              Adelantos / Prestamos
            </label>
            <p className="text-sm text-red-400">
              Haga la sumaroria de los prestamos del dia y registre un solo
              total [5+6+9=20] resgistra 20
            </p>
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
              // min={0}
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
                : "hidden"
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
              placeholder="0"
              // min={0}
            />
            <p className="block mb-1 text-sm font-medium to-slate-300">
              {Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              }).format(typeof dia.usd !== "number")
                ? 0
                : dia.usd}
            </p>
          </div>
          {/* coins */}
          <div
            className={`${
              page.find((pag) => pag.name === dia.page)?.coins
                ? "opacity-100"
                : "hidden"
            }`}
          >
            <label className="block mb-1 text-sm font-medium to-slate-300">
              Coins
            </label>
            <input
              onWheel={(e) => e.target.blur()}
              className="no-spin w-full px-4 py-2 bg-slate-900/70 border border-slate-600 rounded-lg shadow-sm focus:ring-emerald-400 focus:outline-none text-white"
              type="number"
              value={dia.coins}
              disabled={
                page.find((pag) => pag.name === dia.page)?.coins ? false : true
              }
              onChange={handleCoins}
              placeholder=""
              // min={0}
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

          {/* euros */}
          <div
            className={`${
              page.find((pag) => pag.name === dia.page)?.moneda === "EURO"
                ? "opacity-100"
                : "hidden"
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
                page.find((pag) => pag.name === dia.page)?.moneda === "EURO" &&
                !page.find((pag) => pag.name === dia.page)?.coins
                  ? false
                  : true
              }
              onChange={handleEuro}
              placeholder=""
              // min={0}
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
                : "hidden"
            }`}
          >
            <label className="block mb-1 text-sm font-medium to-slate-300">
              Libras Esterlinas
            </label>
            <p className="text-sm text-red-400">
              si ya registro un corte para este dia vuelvalo a registrar ahora
              de lo contrario ese corte se borrara.
            </p>
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
              // min={0}
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
                : "hidden"
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
              // min={0}
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
          {/* mensaje si la quincena esta cerrada */}
          {quincenaCerrada && (
            <div className="p-3 bg-red-500/20 border border-red-600 text-red-300 rounded-lg text-sm text-center mt-4">
              ⚠️ Lo sentimos, esta quincena está <b>cerrada</b> y no se pueden
              agregar créditos.
            </div>
          )}
          {/* Botón */}
          <motion.div
            className="mt-10 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            {quincenaCerrada ? (
              <p className="text-red-400 text-sm mt-2 font-medium">
                No puedes registrar días en una quincena cerrada.
              </p>
            ) : dia.name &&
              dia.page &&
              dia.q &&
              (dia.worked ||
                dia.usd > 0 ||
                dia.euro > 0 ||
                dia.coins > 0 ||
                dia.adelantos > 0 ||
                dia.gbp > 0 ||
                dia.gbpParcial > 0 ||
                dia.mostrar === true) ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-8 py-3 rounded-xl text-lg font-bold text-white 
                 bg-gradient-to-r from-emerald-500 to-sky-500 
                 hover:from-emerald-400 hover:to-sky-400 
                 active:scale-95 shadow-lg shadow-emerald-500/30 
                 transition-all duration-200"
              >
                Cargar
              </motion.button>
            ) : (
              <p className="text-slate-500 text-sm mt-2">
                Complete todos los campos para habilitar el botón
              </p>
            )}
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};
