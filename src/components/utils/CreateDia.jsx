import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { generarDias, yearsFive } from "../../date";
import { YearQuincenaSelector } from "../plugin/YearQuincenaSelector";

export const CreateDia = ({ setError }) => {
  // 🔧 ESTADO INICIAL PROTEGIDO
  const initialDiaState = {
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
  };

  const initialQuincenaState = {
    year: null,
    name: "",
    inicio: null,
    fin: null,
    coins: null,
    valorCoins: null,
  };

  const [dia, setDia] = useState(initialDiaState);
  const [q, setQ] = useState([]);
  const [quincena, setQuincena] = useState(initialQuincenaState);
  const [dias, setDias] = useState([]);
  const [page, setPage] = useState([]);
  const [loading, setLoading] = useState(false);

  const currentYear = new Date().getFullYear();
  const [yearS, setYearS] = useState(currentYear);
  const [yearFives, setYearFives] = useState([]);

  // 🔧 FUNCIONES REUTILIZABLES
  const handleApiResponse = (response) => {
    return Array.isArray(response) ? response : [];
  };

  const handleObjectResponse = (response) => {
    return response && typeof response === "object" ? response : {};
  };

  // 🔧 MANEJADORES DE AÑO CON LÍMITES
  const handlePrev = () => {
    if (yearS > 2000) setYearS(yearS - 1);
  };

  const handleNext = () => {
    if (yearS < 2100) setYearS(yearS + 1);
  };

  const getQuincenaYear = async (year) => {
    try {
      const quincenas = await window.Electron.getQuincenaYear(year);
      return handleApiResponse(quincenas);
    } catch (error) {
      setError("Error al buscar las quincenas: " + error.message);
      return [];
    }
  };

  const getPagesName = async () => {
    try {
      const pages = await window.Electron.getPageName();
      return handleApiResponse(pages);
    } catch (error) {
      setError("Error al buscar las paginas: " + error.message);
      return [];
    }
  };

  const handleGetQ = async () => {
    try {
      const [quincenas, pages] = await Promise.all([
        getQuincenaYear(yearS),
        getPagesName(),
      ]);
      setQ(quincenas);
      setPage(pages);
    } catch (error) {
      console.error("Error loading data:", error);
      setQ([]);
      setPage([]);
    }
  };

  useEffect(() => {
    // 🔧 Proteger yearsFive
    const years = yearsFive ? yearsFive(yearS) : [];
    setYearFives(handleApiResponse(years));
    handleGetQ();
  }, [yearS]);

  useEffect(() => {
    // 🔧 Proteger generarDias
    const getDias = generarDias ? generarDias(quincena) : [];
    setDias(handleApiResponse(getDias));
  }, [quincena]);

  // 🔧 FUNCIONES DE VALIDACIÓN Y CÁLCULO
  const handleMostrar = () => {
    const currentPage = page.find((pag) => dia.page === pag?.name);
    if (!currentPage) return;

    const tope = parseFloat(currentPage?.tope) || 0;
    const moneda = currentPage?.moneda;

    // Si tiene coins, usar el valor calculado de coins
    let money = 0;
    if (currentPage.coins) {
      const valorCoins = parseFloat(currentPage?.valorCoins) || 0;
      money = dia.coins * valorCoins;
    } else {
      money =
        moneda === "USD"
          ? dia.usd
          : moneda === "EURO"
          ? dia.euro
          : moneda === "GBP"
          ? dia.gbp
          : 0;
    }

    const mostra = tope <= money;
    setDia((prev) => ({ ...prev, mostrar: mostra }));
  };

  const handleName = (selectedName) => {
    setDia({ ...dia, name: selectedName });
  };

  const handlePage = (selectedPage) => {
    if (!selectedPage?.name) return;

    // 🔧 RESETEAR TODOS LOS VALORES MONETARIOS AL CAMBIAR PÁGINA
    setDia({
      ...initialDiaState,
      name: dia.name, // 🔧 Mantener el día seleccionado
      page: selectedPage.name,
      q: dia.q, // 🔧 Mantener la quincena seleccionada
    });
  };

  const handleCoins = (e) => {
    const currentPage = page.find((pag) => pag?.name === dia.page);
    if (!currentPage) return;

    const valorCoins = parseFloat(currentPage?.valorCoins) || 0;
    const moneda = currentPage?.moneda;
    const coinsValue = parseInt(e.target.value) || 0;
    const money = coinsValue * valorCoins;

    // 🔧 ACTUALIZAR SOLO LOS COINS Y LA MONEDA CORRESPONDIENTE
    const updates = {
      coins: coinsValue,
      usd: 0,
      euro: 0,
      gbp: 0,
      gbpParcial: 0,
    };

    if (moneda === "USD") {
      updates.usd = money;
    } else if (moneda === "EURO") {
      updates.euro = money;
    } else if (moneda === "GBP") {
      updates.gbp = money;
    }

    setDia({ ...dia, ...updates });
  };

  const handleUsd = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setDia({ ...dia, usd: Math.max(0, value), coins: 0 }); // 🔧 Resetear coins si se modifica USD manualmente
  };

  const handleEuro = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setDia({ ...dia, euro: Math.max(0, value), coins: 0 }); // 🔧 Resetear coins si se modifica EURO manualmente
  };

  const handleGbp = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setDia({ ...dia, gbp: Math.max(0, value), coins: 0 }); // 🔧 Resetear coins si se modifica GBP manualmente
  };

  const handleGbpParcial = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setDia({ ...dia, gbpParcial: Math.max(0, value) });
  };

  const handleAdelantos = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setDia({ ...dia, adelantos: Math.max(0, value) });
  };

  const handleWorked = () => {
    const hasWork =
      dia.coins > 0 ||
      dia.euro > 0 ||
      dia.usd > 0 ||
      dia.gbp > 0 ||
      dia.gbpParcial > 0 ||
      dia.adelantos > 0;

    setDia({ ...dia, worked: hasWork });
  };

  const handleQuincena = (selectedQuincena) => {
    if (!selectedQuincena?.id) return;

    setQuincena({
      year: selectedQuincena.year || null,
      name: selectedQuincena.name || "",
      inicio: selectedQuincena.inicio || null,
      fin: selectedQuincena.fin || null,
      coins: selectedQuincena.coins || null,
      valorCoins: selectedQuincena.valorCoins || null,
    });
    setDia({ ...dia, q: selectedQuincena.id });
  };

  useEffect(() => {
    handleWorked();
    handleMostrar();
  }, [dia.usd, dia.euro, dia.coins, dia.gbp, dia.gbpParcial, dia.adelantos]);

  // 🔧 VALIDACIÓN DEL FORMULARIO
  const validateForm = () => {
    if (!dia.name) {
      setError("Debe seleccionar un día");
      return false;
    }

    if (!dia.page) {
      setError("Debe seleccionar una página");
      return false;
    }

    if (!dia.q) {
      setError("Debe seleccionar una quincena");
      return false;
    }

    if (!dia.worked) {
      setError("Debe ingresar al menos un valor en alguna moneda");
      return false;
    }

    return true;
  };

  const crearDia = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // 🔧 Verificar si la quincena está cerrada
    if (quincenaCerrada) {
      setError("No se pueden registrar días en una quincena cerrada");
      return;
    }

    setLoading(true);

    try {
      const res = await window.Electron.addDay(dia);
      const safeRes = handleObjectResponse(res);
// console.log(safeRes)
      if (safeRes.error) {
        setError(safeRes.error);
      } else if (safeRes?.dataValues.id||safeRes.id) {
        // console.log(safeRes)
        setError("✅ Día creado correctamente");
        setDia({
          ...initialDiaState,
          q: dia.q, // 🔧 Mantener la quincena seleccionada
        });
      } else {
        setError("Error inesperado al crear el día");
      }
    } catch (error) {
      console.error("Error creating day:", error);
      setError("Error al crear Día: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔧 PARA SABER SI LA QUINCENA ESTÁ CERRADA
  const quincenaSeleccionada = q.find((select) => select?.id === dia.q);
  const quincenaCerrada = quincenaSeleccionada?.cerrado;

  // 🔧 DATOS PROTEGIDOS PARA RENDERIZADO
  const safeDias = handleApiResponse(dias);
  const safePage = handleApiResponse(page);
  const currentPageData = safePage.find((pag) => pag?.name === dia.page);

  // 🔧 FUNCIÓN PARA FORMATEAR MONEDA
  const formatCurrency = (value, currency, locale = "en-US") => {
    const numberValue = typeof value === "number" ? value : 0;

    const formats = {
      USD: { style: "currency", currency: "USD" },
      EURO: { style: "currency", currency: "EUR" },
      GBP: { style: "currency", currency: "GBP" },
      COP: { style: "currency", currency: "COP" },
    };

    const format = formats[currency] || formats.USD;

    return Intl.NumberFormat(locale, {
      ...format,
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(numberValue);
  };

  // 🔧 DESHABILITAR SCROLL EN INPUTS NUMBER
  const handleWheel = (e) => e.target.blur();

  // 🔧 VERIFICAR SI EL FORMULARIO ESTÁ COMPLETO
  const isFormComplete = dia.name && dia.page && dia.q && dia.worked;

  return (
    <div className="pt-12 flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md p-6 md:p-8 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-700"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-center text-emerald-400 mb-6 tracking-wide">
          Registro Créditos Diarios
        </h1>

        <form onSubmit={crearDia} className="space-y-4">
          <YearQuincenaSelector
            yearS={yearS}
            yearFives={handleApiResponse(yearFives)}
            setYearS={setYearS}
            q={handleApiResponse(q)}
            quincena={quincena}
            handleQuincena={handleQuincena}
            handlePrev={handlePrev}
            handleNext={handleNext}
            disabled={loading}
          />

          {/* Días */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-300">
              Seleccione El Día
            </label>
            <select
              className="p-2 border border-slate-600 rounded-lg bg-slate-900 text-white focus:ring-2 focus:ring-emerald-400 focus:outline-none disabled:opacity-50"
              value={dia.name}
              onChange={(e) => {
                const daySelected = safeDias.find(
                  (item) => item === e.target.value
                );
                if (daySelected) handleName(daySelected);
              }}
              disabled={loading || quincenaCerrada}
            >
              <option value="" hidden>
                Seleccione un día
              </option>
              {safeDias.map((diaItem) => (
                <option key={diaItem} value={diaItem}>
                  {diaItem}
                </option>
              ))}
            </select>
          </div>

          {/* Páginas */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-300">
              Seleccione La Página
            </label>
            <select
              className="p-2 border border-slate-600 rounded-lg bg-slate-900 text-white focus:ring-2 focus:ring-emerald-400 focus:outline-none disabled:opacity-50"
              value={dia.page}
              onChange={(e) => {
                const pageSelected = safePage.find(
                  (item) => item?.name === e.target.value
                );
                if (pageSelected) handlePage(pageSelected);
              }}
              disabled={loading || quincenaCerrada}
            >
              <option value="" hidden>
                Seleccione una página
              </option>
              {safePage.map((pag) => (
                <option key={pag?.id} value={pag?.name}>
                  {pag?.name}
                </option>
              ))}
            </select>
          </div>

          {/* Campos condicionales basados en la página seleccionada */}
          {currentPageData && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* COP - Adelantos */}
              {currentPageData.moneda === "COP" && (
                <div>
                  <label className="block mb-1 text-sm font-medium text-slate-300">
                    Adelantos / Préstamos
                  </label>
                  <p className="text-xs text-red-400 mb-2">
                    Haga la sumatoria de los préstamos del día y registre un
                    solo total [5+6+9=20] registra 20
                  </p>
                  <input
                    onWheel={handleWheel}
                    className="no-spin w-full px-4 py-2 bg-slate-900/70 border border-slate-600 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none text-white disabled:opacity-50"
                    type="number"
                    value={dia.adelantos}
                    onChange={handleAdelantos}
                    disabled={loading || quincenaCerrada}
                    min="0"
                    step="0.01"
                  />
                  <p className="text-sm text-slate-300 mt-1">
                    {formatCurrency(dia.adelantos, "COP", "es-CO")}
                  </p>
                </div>
              )}

              {/* COINS - MOSTRAR SOLO SI LA PÁGINA TIENE COINS */}
              {currentPageData.coins && (
                <div>
                  <label className="block mb-1 text-sm font-medium text-slate-300">
                    Coins
                  </label>
                  <input
                    onWheel={handleWheel}
                    className="no-spin w-full px-4 py-2 bg-slate-900/70 border border-slate-600 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none text-white disabled:opacity-50"
                    type="number"
                    value={dia.coins}
                    onChange={handleCoins}
                    disabled={loading || quincenaCerrada}
                    min="0"
                  />
                  <p className="text-sm text-slate-300 mt-1">
                    Valor en {currentPageData.moneda}:{" "}
                    {formatCurrency(
                      currentPageData.moneda === "USD"
                        ? dia.usd
                        : currentPageData.moneda === "EURO"
                        ? dia.euro
                        : currentPageData.moneda === "GBP"
                        ? dia.gbp
                        : 0,
                      currentPageData.moneda
                    )}
                  </p>
                </div>
              )}

              {/* USD - SOLO MOSTRAR SI NO TIENE COINS */}
              {currentPageData.moneda === "USD" && !currentPageData.coins && (
                <div>
                  <label className="block mb-1 text-sm font-medium text-slate-300">
                    Dólares
                  </label>
                  <input
                    onWheel={handleWheel}
                    className="no-spin w-full px-4 py-2 bg-slate-900/70 border border-slate-600 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none text-white disabled:opacity-50"
                    type="number"
                    value={dia.usd}
                    onChange={handleUsd}
                    disabled={loading || quincenaCerrada}
                    min="0"
                    step="0.01"
                  />
                  <p className="text-sm text-slate-300 mt-1">
                    {formatCurrency(dia.usd, "USD")}
                  </p>
                </div>
              )}

              {/* EURO - SOLO MOSTRAR SI NO TIENE COINS */}
              {currentPageData.moneda === "EURO" && !currentPageData.coins && (
                <div>
                  <label className="block mb-1 text-sm font-medium text-slate-300">
                    Euros
                  </label>
                  <input
                    onWheel={handleWheel}
                    className="no-spin w-full px-4 py-2 bg-slate-900/70 border border-slate-600 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none text-white disabled:opacity-50"
                    type="number"
                    value={dia.euro}
                    onChange={handleEuro}
                    disabled={loading || quincenaCerrada}
                    min="0"
                    step="0.01"
                  />
                  <p className="text-sm text-slate-300 mt-1">
                    {formatCurrency(dia.euro, "EURO", "es-EU")}
                  </p>
                </div>
              )}

              {/* GBP - SOLO MOSTRAR SI NO TIENE COINS */}
              {currentPageData.moneda === "GBP" && !currentPageData.coins && (
                <>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-slate-300">
                      Libras Esterlinas
                    </label>
                    <p className="text-xs text-red-400 mb-2">
                      Si ya registró un corte para este día vuélvalo a registrar
                      ahora, de lo contrario ese corte se borrará.
                    </p>
                    <input
                      onWheel={handleWheel}
                      className="no-spin w-full px-4 py-2 bg-slate-900/70 border border-slate-600 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none text-white disabled:opacity-50"
                      type="number"
                      value={dia.gbp}
                      onChange={handleGbp}
                      disabled={loading || quincenaCerrada}
                      min="0"
                      step="0.01"
                    />
                    <p className="text-sm text-slate-300 mt-1">
                      {formatCurrency(dia.gbp, "GBP", "en-GB")}
                    </p>
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-slate-300">
                      Libras Esterlinas Parcial
                    </label>
                    <input
                      onWheel={handleWheel}
                      className="no-spin w-full px-4 py-2 bg-slate-900/70 border border-slate-600 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none text-white disabled:opacity-50"
                      type="number"
                      value={dia.gbpParcial}
                      onChange={handleGbpParcial}
                      disabled={loading || quincenaCerrada}
                      min="0"
                      step="0.01"
                    />
                    <p className="text-sm text-slate-300 mt-1">
                      {formatCurrency(dia.gbpParcial, "GBP", "en-GB")}
                    </p>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* Mensaje si la quincena está cerrada */}
          {quincenaCerrada && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3 bg-red-500/20 border border-red-600 text-red-300 rounded-lg text-sm text-center"
            >
              ⚠️ Lo sentimos, esta quincena está <b>cerrada</b> y no se pueden
              agregar créditos.
            </motion.div>
          )}

          {/* Botón */}
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {quincenaCerrada ? (
              <p className="text-red-400 text-sm font-medium">
                No puedes registrar días en una quincena cerrada.
              </p>
            ) : isFormComplete ? (
              <motion.button
                whileHover={{ scale: loading ? 1 : 1.05 }}
                whileTap={{ scale: loading ? 1 : 0.95 }}
                type="submit"
                disabled={loading}
                className={`px-8 py-3 rounded-xl text-lg font-bold text-white 
                       shadow-lg transition-all duration-200 ${
                         loading
                           ? "bg-gray-600 cursor-not-allowed"
                           : "bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-400 hover:to-sky-400"
                       }`}
              >
                {loading ? "⏳ Cargando..." : "🚀 Cargar Día"}
              </motion.button>
            ) : (
              <p className="text-slate-400 text-sm">
                Complete todos los campos para habilitar el botón
              </p>
            )}
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};
