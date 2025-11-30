import React, { useState } from "react";
import { motion } from "framer-motion";

export const CreateAranceles = ({ setError }) => {
  // 🔧 ESTADO INICIAL PROTEGIDO
  const initialArancelesState = {
    dolar: 0,
    euro: 0,
    gbp: 0,
    porcentaje: 0,
  };

  const [aranceles, setAranceles] = useState(initialArancelesState);
  const [loading, setLoading] = useState(false);

  // 🔧 FUNCIÓN REUTILIZABLE
  const handleObjectResponse = (response) => {
    return response && typeof response === "object" ? response : {};
  };

  // 🔧 MANEJADORES DE CAMBIOS CON VALIDACIÓN
  const handleDolar = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setAranceles({ ...aranceles, dolar: Math.max(0, value) });
  };

  const handleEuro = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setAranceles({ ...aranceles, euro: Math.max(0, value) });
  };

  const handleGbp = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setAranceles({ ...aranceles, gbp: Math.max(0, value) });
  };

  const handlePorcentaje = (e) => {
    const value = parseFloat(e.target.value) || 0;
    // 🔧 Limitar porcentaje entre 0 y 1 (0% - 100%)
    const safePorcentaje = Math.max(0, Math.min(1, value));
    setAranceles({ ...aranceles, porcentaje: safePorcentaje });
  };

  // 🔧 VALIDACIÓN DEL FORMULARIO
  const validateForm = () => {
    if (aranceles.dolar <= 0) {
      setError("El valor del dólar debe ser mayor a 0");
      return false;
    }

    if (aranceles.euro <= 0) {
      setError("El valor del euro debe ser mayor a 0");
      return false;
    }

    if (aranceles.gbp <= 0) {
      setError("El valor de la libra esterlina debe ser mayor a 0");
      return false;
    }

    if (aranceles.porcentaje <= 0 || aranceles.porcentaje > 1) {
      setError("El porcentaje debe estar entre 0 y 1 (0% - 100%)");
      return false;
    }

    return true;
  };

  const postAranceles = async () => {
    try {
      const res = await window.Electron.addAranceles(aranceles);
      return handleObjectResponse(res);
    } catch (error) {
      setError("Error al cargar los aranceles: " + error.message);
      return { error: error.message };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔧 Validar antes de enviar
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const res = await postAranceles();

      if (res.error) {
        setError(res.error);
      } else if (res.id||res.dataValues.id) {
        setError("✅ Aranceles registrados correctamente");
        setAranceles(initialArancelesState);
      } else {
        setError("Error inesperado al registrar los aranceles");
      }
    } catch (error) {
      console.error("Error submitting aranceles:", error);
      setError("Error al cargar los aranceles: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔧 CAMPOS DEL FORMULARIO
  const formFields = [
    {
      id: "dolar",
      label: "Dólar",
      value: aranceles.dolar,
      onChange: handleDolar,
      delay: 0,
      placeholder: "0.00",
    },
    {
      id: "euro",
      label: "Euro",
      value: aranceles.euro,
      onChange: handleEuro,
      delay: 1,
      placeholder: "0.00",
    },
    {
      id: "gbp",
      label: "Libra Esterlina (GBP)",
      value: aranceles.gbp,
      onChange: handleGbp,
      delay: 2,
      placeholder: "0.00",
    },
    {
      id: "porcentaje",
      label: "Porcentaje del estudio",
      value: aranceles.porcentaje,
      onChange: handlePorcentaje,
      delay: 3,
      placeholder: "0.80",
    },
  ];

  // 🔧 DESHABILITAR SCROLL EN INPUTS NUMBER
  const handleWheel = (e) => e.currentTarget.blur();
  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault();
  };

  // 🔧 VERIFICAR SI EL FORMULARIO ESTÁ COMPLETO
  const isFormComplete =
    aranceles.dolar > 0 &&
    aranceles.euro > 0 &&
    aranceles.gbp > 0 &&
    aranceles.porcentaje > 0;

  // 🔧 FORMATEAR PORCENTAJE PARA MOSTRAR
  const displayPorcentaje = (aranceles.porcentaje * 100).toFixed(1) + "%";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center py-12 px-4">
      <motion.form
        onSubmit={handleSubmit}
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
          Registro de Aranceles
        </motion.h1>

        {/* Información adicional */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-6 p-4 bg-slate-800/50 rounded-lg"
        >
          <p className="text-slate-300 text-sm text-center">
            <strong>Nota:</strong> Los valores deben ser mayores a 0. El
            porcentaje debe estar entre 0 y 1 (ej: 0.80 = 80%).
          </p>
        </motion.div>

        {/* Inputs */}
        <motion.section
          className="grid gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {formFields.map((field) => (
            <motion.div
              key={field.id}
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-slate-700 pb-4"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 + field.delay * 0.2 }}
            >
              <label
                htmlFor={field.id}
                className="text-lg md:text-xl text-slate-200 font-semibold"
              >
                {field.label}
                {field.id === "porcentaje" && (
                  <span className="text-emerald-300 ml-2 text-sm">
                    ({displayPorcentaje})
                  </span>
                )}
              </label>

              <div className="flex items-center gap-3">
                <input
                  id={field.id}
                  type="number"
                  value={field.value}
                  onChange={field.onChange}
                  onWheel={handleWheel}
                  onKeyDown={handleKeyDown}
                  step={field.id === "porcentaje" ? "0.01" : "0.01"}
                  min="0"
                  max={field.id === "porcentaje" ? "1" : undefined}
                  placeholder={field.placeholder}
                  disabled={loading}
                  className="w-full md:w-32 text-center text-lg md:text-xl bg-slate-900 text-white border border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-400 focus:outline-none no-spin disabled:opacity-50"
                />

                {/* Mostrar valor formateado para monedas */}
                {field.id !== "porcentaje" && field.value > 0 && (
                  <span className="text-slate-300 text-sm hidden md:block">
                    {Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(field.value)}
                  </span>
                )}
              </div>
            </motion.div>
          ))}

          {/* Resumen de valores */}
          {isFormComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-slate-800/40 rounded-lg border border-slate-600"
            >
              <h3 className="text-slate-300 font-semibold mb-2 text-center">
                Resumen de Aranceles
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-slate-400">Dólar:</div>
                <div className="text-emerald-300 text-right">
                  {Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                  }).format(aranceles.dolar)}
                </div>

                <div className="text-slate-400">Euro:</div>
                <div className="text-emerald-300 text-right">
                  {Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                  }).format(aranceles.euro)}
                </div>

                <div className="text-slate-400">Libra Esterlina:</div>
                <div className="text-emerald-300 text-right">
                  {Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                  }).format(aranceles.gbp)}
                </div>

                <div className="text-slate-400">Porcentaje:</div>
                <div className="text-emerald-300 text-right">
                  {displayPorcentaje}
                </div>
              </div>
            </motion.div>
          )}

          {/* Botón */}
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            {isFormComplete ? (
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
                {loading ? "⏳ Registrando..." : "🚀 Cargar Aranceles"}
              </motion.button>
            ) : (
              <div className="space-y-2">
                <p className="text-slate-400 text-sm">
                  Complete todos los campos con valores mayores a 0
                </p>
                <div className="flex justify-center gap-4 text-xs text-slate-500">
                  <span>💰 Dólar {">"} 0</span>
                  <span>💶 Euro {">"} 0</span>
                  <span>💷 GBP {">"} 0</span>
                  <span>📊 % {">"} 0</span>
                </div>
              </div>
            )}
          </motion.div>
        </motion.section>
      </motion.form>
    </div>
  );
};
