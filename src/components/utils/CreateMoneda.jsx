import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { yearsFive } from "../../date";
import { YearQuincenaSelector } from "../plugin/YearQuincenaSelector";

export const CreateMoneda = ({ setError }) => {
  // 🔧 ESTADO INICIAL PROTEGIDO
  const initialMonedasState = {
    dolar: null,
    euro: null,
    gbp: null,
    pago: false,
    quincena: null,
  };

  const [monedas, setMonedas] = useState(initialMonedasState);
  const [loading, setLoading] = useState(false);

  const currentYear = new Date().getFullYear();
  const [yearS, setYearS] = useState(currentYear);
  const [yearFives, setYearFives] = useState([]);
  const [q, setQ] = useState([]);
  const [quincena, setQuincena] = useState({});

  // 🔧 FUNCIONES REUTILIZABLES
  const handleApiResponse = (response) => {
    return Array.isArray(response) ? response : [];
  };

  const handleObjectResponse = (response) => {
    return response && typeof response === 'object' ? response : {};
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

  const handleGetQ = async () => {
    try {
      const quincenas = await getQuincenaYear(yearS);
      setQ(quincenas);
    } catch (error) {
      console.error("Error loading quincenas:", error);
      setQ([]);
    }
  };

  useEffect(() => {
    // 🔧 Proteger yearsFive
    const years = yearsFive ? yearsFive(yearS) : [];
    setYearFives(handleApiResponse(years));
    handleGetQ();
  }, [yearS]);

  // 🔧 MANEJADORES DE CAMBIOS CON VALIDACIÓN
  const handleQuincena = (selectedQuincena) => {
    if (selectedQuincena?.id) {
      setMonedas({ ...monedas, quincena: selectedQuincena.id });
      setQuincena(selectedQuincena);
    }
  };

  const handleDolar = (e) => {
    const value = e.target.value === "" ? null : parseFloat(e.target.value);
    setMonedas({ ...monedas, dolar: value >= 0 ? value : null });
  };

  const handleEuro = (e) => {
    const value = e.target.value === "" ? null : parseFloat(e.target.value);
    setMonedas({ ...monedas, euro: value >= 0 ? value : null });
  };

  const handleGbp = (e) => {
    const value = e.target.value === "" ? null : parseFloat(e.target.value);
    setMonedas({ ...monedas, gbp: value >= 0 ? value : null });
  };

  const handleChecked = (e) =>
    setMonedas({ ...monedas, pago: e.target.checked });

  // 🔧 VALIDACIÓN DEL FORMULARIO
  const validateForm = () => {
    if (!monedas.quincena) {
      setError("Debe seleccionar una quincena");
      return false;
    }

    if (monedas.dolar === null || monedas.euro === null || monedas.gbp === null) {
      setError("Todos los campos de moneda son requeridos");
      return false;
    }

    if (monedas.dolar < 0 || monedas.euro < 0 || monedas.gbp < 0) {
      setError("Los valores de moneda no pueden ser negativos");
      return false;
    }

    return true;
  };

  const handleMoneda = async (e) => {
    e.preventDefault();
    
    // 🔧 Validar antes de enviar
    if (!validateForm()) {
      return;
    }

    // 🔧 Verificar si la quincena está cerrada
    if (quincenaCerrada) {
      setError("No se pueden registrar monedas en una quincena cerrada");
      return;
    }

    setLoading(true);

    try {
      const monedaResponse = await window.Electron.addMoneda(monedas);
      const safeResponse = handleObjectResponse(monedaResponse);
      
      if (safeResponse.error) {
        setError("Error al registrar las monedas: " + safeResponse.error);
      } else if (safeResponse.id||safeResponse.dataValues.id) {
        setError("✅ Monedas registradas correctamente");
        setMonedas(initialMonedasState);
        setQuincena({});
        handleGetQ(); // 🔧 Recargar quincenas para actualizar estado
      } else {
        setError("Error inesperado al registrar las monedas");
      }
    } catch (error) {
      console.error("Error creating moneda:", error);
      setError("Error al registrar las monedas: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔧 PARA SABER SI LA QUINCENA ESTÁ CERRADA
  const quincenaSeleccionada = q.find((select) => select?.id === monedas.quincena);
  const quincenaCerrada = quincenaSeleccionada?.cerrado;

  // 🔧 CAMPOS DEL FORMULARIO
  const currencyFields = [
    {
      id: "dolar",
      label: "Dólar",
      value: monedas.dolar,
      onChange: handleDolar,
    },
    {
      id: "euro",
      label: "Euro",
      value: monedas.euro,
      onChange: handleEuro,
    },
    {
      id: "gbp",
      label: "Libra Esterlina",
      value: monedas.gbp,
      onChange: handleGbp,
    },
  ];

  // 🔧 VERIFICAR SI EL FORMULARIO ESTÁ COMPLETO
  const isFormComplete = 
    monedas.dolar !== null && 
    monedas.euro !== null && 
    monedas.gbp !== null && 
    monedas.quincena !== null;

  // 🔧 DESHABILITAR SCROLL EN INPUTS NUMBER
  const handleWheel = (e) => e.currentTarget.blur();
  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center py-12 px-4">
      <motion.form
        onSubmit={handleMoneda}
        className="w-full max-w-2xl bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-700 p-6 md:p-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.h1
          className="text-2xl md:text-3xl font-bold text-center text-emerald-400 mb-6 md:mb-8 tracking-wide uppercase"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Registro de Monedas
        </motion.h1>

        {/* Año y quincena */}
        <motion.section
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
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
        </motion.section>

        {/* Inputs */}
        <motion.section
          className="mt-8 grid gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {currencyFields.map((field, i) => (
            <motion.div
              key={field.id}
              className="flex items-center justify-between gap-4 border-b border-slate-700 pb-2"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 + i * 0.2 }}
            >
              <label
                htmlFor={field.id}
                className="text-lg md:text-xl text-slate-200 font-semibold"
              >
                {field.label}
              </label>
              <input
                id={field.id}
                type="number"
                value={field.value ?? ""}
                onChange={field.onChange}
                onWheel={handleWheel}
                onKeyDown={handleKeyDown}
                step="0.01"
                min="0"
                disabled={loading || quincenaCerrada}
                className="no-spin w-28 md:w-32 text-center text-lg md:text-xl bg-slate-900 text-white border border-slate-600 rounded-lg px-3 py-1 focus:ring-2 focus:ring-emerald-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="0.00"
              />
            </motion.div>
          ))}

          {/* Checkbox */}
          <motion.div
            className="flex items-center justify-between gap-4"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <label
              htmlFor="pago"
              className="text-lg md:text-xl text-slate-200 font-semibold"
            >
              Marque si es para pago
            </label>
            <input
              id="pago"
              type="checkbox"
              checked={monedas.pago}
              onChange={handleChecked}
              disabled={loading || quincenaCerrada}
              className="h-5 w-5 md:h-6 md:w-6 accent-emerald-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </motion.div>
        </motion.section>

        {/* Mensaje si la quincena está cerrada */}
        {quincenaCerrada && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3 bg-red-500/20 border border-red-600 text-red-300 rounded-lg text-sm text-center mt-4"
          >
            ⚠️ Lo sentimos, esta quincena está <b>cerrada</b> y no se pueden agregar monedas.
          </motion.div>
        )}

        {/* Botón */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          {quincenaCerrada ? (
            <p className="text-red-400 text-sm font-medium">
              No puedes registrar monedas en una quincena cerrada.
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
              {loading ? "⏳ Cargando..." : "🚀 Cargar Monedas"}
            </motion.button>
          ) : (
            <p className="text-slate-400 text-sm">
              Complete todos los campos para habilitar el botón
            </p>
          )}
        </motion.div>

        {/* Información del estado actual */}
        {monedas.quincena && !quincenaCerrada && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-3 bg-slate-800/50 rounded-lg text-center"
          >
            <p className="text-slate-300 text-sm">
              Quincena seleccionada: <span className="text-emerald-300">{quincena.name || "Sin nombre"}</span>
            </p>
          </motion.div>
        )}
      </motion.form>
    </div>
  );
};