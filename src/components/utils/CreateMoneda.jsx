import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { yearsFive } from "../../date";
import { YearQuincenaSelector } from "../plugin/YearQuincenaSelector";

export const CreateMoneda = ({ setError }) => {
  const [monedas, setModenas] = useState({
    dolar: null,
    euro: null,
    gbp: null,
    pago: false,
    quincena: null,
  });

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

  const handleQuincena = (e) => {
    setModenas({ ...monedas, quincena: e.id });
  };
  const handleDolar = (e) => setModenas({ ...monedas, dolar: e.target.value });
  const handleEuro = (e) => setModenas({ ...monedas, euro: e.target.value });
  const handleGbp = (e) => setModenas({ ...monedas, gbp: e.target.value });
  const handleChecked = (e) =>
    setModenas({ ...monedas, pago: e.target.checked });

  const handleMoneda = async () => {
    try {
      const moneda = await window.Electron.addMoneda(monedas);
      if (moneda.error) {
        setError("Error al registrar las monedas" + moneda.error);
        setModenas({
          dolar: null,
          euro: null,
          gbp: null,
          pago: false,
          quincena: null,
        });
      } else {
        setError("Moneda registrada correctamente.");
      }
    } catch (error) {
      setError("Error al registrar las monedas" + error);
    }
  };
  //para saber si la quincena esta cerrada
  const quincenaSeleccionada = q?.find(
    (select) => select.id === monedas.quincena
  );
  const quincenaCerrada = quincenaSeleccionada?.cerrado;
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center py-12">
      <motion.form
        onSubmit={handleMoneda}
        className="w-full max-w-2xl bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-700 p-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.h1
          className="text-3xl font-bold text-center text-emerald-400 mb-8 tracking-wide uppercase"
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
            yearFives={yearFives}
            setYearS={setYearS}
            q={q}
            quincena={quincena}
            handleQuincena={handleQuincena}
            handlePrev={handlePrev}
            handleNext={handleNext}
          />
        </motion.section>

        {/* Inputs */}
        <motion.section
          className="mt-8 grid gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {[
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
          ].map((field, i) => (
            <motion.div
              key={field.id}
              className="flex items-center justify-between gap-4 border-b border-slate-700 pb-2"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 + i * 0.2 }}
            >
              <label
                htmlFor={field.id}
                className="text-xl text-slate-200 font-semibold"
              >
                {field.label}
              </label>
              <input
                id={field.id}
                type="number"
                value={field.value ?? ""}
                onChange={field.onChange}
                onWheel={(e) => e.currentTarget.blur()}
                onKeyDown={(e) => {
                  if (e.key === "ArrowUp" || e.key === "ArrowDown")
                    e.preventDefault();
                }}
                className="no-spin w-32 text-center text-xl bg-slate-900 text-white border border-slate-600 rounded-lg px-3 py-1 focus:ring-emerald-400 focus:outline-none"
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
              className="text-xl text-slate-200 font-semibold"
            >
              Marque si es para pago
            </label>
            <input
              id="pago"
              type="checkbox"
              checked={monedas.pago}
              onChange={handleChecked}
              className="h-6 w-6 accent-emerald-500 cursor-pointer"
            />
          </motion.div>
        </motion.section>
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
          ) : monedas.dolar &&
            monedas.euro &&
            monedas.gbp &&
            monedas.quincena ? (
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
      </motion.form>
    </div>
  );
};
