import React, { useState } from "react";
import { motion } from "framer-motion";

export const CreatePage = ({ setError }) => {
  const initialPageState = {
    name: "",
    coins: false,
    moneda: "",
    mensual: false,
    valorCoins: 0,
    tope: 0,
    descuento: 0,
  };

  const [page, setPage] = useState(initialPageState);
  const [loading, setLoading] = useState(false);

  const handleObjectResponse = (response) => {
    return response && typeof response === "object" ? response : {};
  };

  const handleName = (e) =>
    setPage({ ...page, name: e.target.value.trim() });

  const handleMoneda = (e) =>
    setPage({ ...page, moneda: e.target.value });

  const handleValor = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setPage({ ...page, valorCoins: Math.max(0, value) });
  };

  const handleTope = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setPage({ ...page, tope: Math.max(0, value) });
  };

  const handleDescuentos = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setPage({ ...page, descuento: Math.max(0, value) });
  };

  const handleCoins = (e) =>
    setPage({ ...page, coins: e.target.checked });

  const handleMensual = (e) =>
    setPage({ ...page, mensual: e.target.checked });

  // 🔧 VALIDACIÓN FINAL
  const validateForm = () => {
    if (!page.name.trim()) {
      setError("El nombre de la página es requerido");
      return false;
    }

    if (!page.moneda) {
      setError("Debe seleccionar una moneda");
      return false;
    }

    if (page.coins && page.valorCoins <= 0) {
      setError("El valor del coin debe ser mayor a 0 cuando usa coins");
      return false;
    }

    if (page.descuento < 0 || page.descuento > 1) {
      setError("El descuento debe estar entre 0 y 1 (0% - 100%)");
      return false;
    }

    return true;
  };

  const createPage = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await window.Electron.addPage(page);
      const safeRes = handleObjectResponse(res);

      if (safeRes.error) {
        setError(safeRes.error);
      } else if (safeRes.dataValues?.id || safeRes.id) {
        setError("✅ Página creada correctamente");
        setPage(initialPageState);
      } else {
        setError("Error inesperado al crear la página");
      }
    } catch (error) {
      setError("Error al crear Page: " + (error.message || error));
    } finally {
      setLoading(false);
    }
  };

  const currencyOptions = [
    { value: "", label: "Seleccione una moneda", hidden: true },
    { value: "USD", label: "Dólar" },
    { value: "EURO", label: "Euro" },
    { value: "GBP", label: "Libra Esterlina" },
    { value: "COP", label: "Pesos Colombianos" },
  ];

  const handleWheel = (e) => e.target.blur();

  return (
    <div className="pt-12 flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md p-8 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-700"
      >
        <h1 className="text-3xl font-bold text-center text-emerald-400 mb-6 tracking-wide">
          Registro de Páginas
        </h1>

        <form onSubmit={createPage} className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block mb-1 text-sm font-medium text-slate-300">
              Nombre *
            </label>
            <input
              className="w-full px-4 py-2 bg-slate-900/70 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-400"
              type="text"
              value={page.name}
              onChange={handleName}
              placeholder="Nombre Página"
              required
              disabled={loading}
            />
          </div>

          {/* Moneda SIEMPRE visible y obligatoria */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <label className="block mb-1 text-sm font-medium text-slate-300">
              Moneda *
            </label>

            <select
              value={page.moneda}
              onChange={handleMoneda}
              required
              disabled={loading}
              className="w-full bg-slate-900/70 text-white px-3 py-2 rounded-lg border border-slate-600 focus:ring-2 focus:ring-emerald-400"
            >
              {currencyOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  hidden={option.hidden}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </motion.div>

          {/* Coins */}
          <div className="flex items-center space-x-2">
            <input
              id="coins"
              className="w-5 h-5 text-emerald-500 border-gray-300 rounded focus:ring-emerald-400"
              type="checkbox"
              checked={page.coins}
              onChange={handleCoins}
              disabled={loading}
            />
            <label htmlFor="coins" className="text-sm text-slate-300">
              ¿Usa Coins?
            </label>
          </div>

          {/* Valor Coin (solo si coins está activo) */}
          {page.coins && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              <label className="block mb-1 text-sm font-medium text-slate-300">
                Valor del Coin *
              </label>
              <input
                onWheel={handleWheel}
                className="w-full px-3 py-2 bg-slate-900/70 text-white border border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-400"
                type="number"
                step="0.01"
                min="0"
                value={page.valorCoins}
                onChange={handleValor}
                required={page.coins}
                disabled={loading}
              />
            </motion.div>
          )}

          {/* Mensual */}
          <div className="flex items-center space-x-2">
            <input
              id="mensual"
              className="w-5 h-5 text-emerald-500 border-gray-300 rounded focus:ring-emerald-400"
              type="checkbox"
              checked={page.mensual}
              onChange={handleMensual}
              disabled={loading}
            />
            <label className="text-sm text-slate-300">¿Es mensual?</label>
          </div>

          {/* Tope */}
          <div>
            <label className="block mb-1 text-sm font-medium text-slate-300">
              Tope
            </label>
            <input
              onWheel={handleWheel}
              className="w-full px-3 py-2 bg-slate-900/70 text-white border border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-400"
              type="number"
              min="0"
              value={page.tope}
              onChange={handleTope}
              disabled={loading}
            />
          </div>

          {/* Descuentos */}
          <div>
            <label className="block mb-1 text-sm font-medium text-slate-300">
              Descuentos Página (0-1)
            </label>
            <input
              onWheel={handleWheel}
              className="w-full px-3 py-2 bg-slate-900/70 text-white border border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-400"
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={page.descuento}
              onChange={handleDescuentos}
              disabled={loading}
            />
            <p className="text-xs text-slate-400 mt-1">
              Ejemplo: 0.60 = 60% de descuento
            </p>
          </div>

          {/* Botón */}
          <motion.button
            whileHover={{ scale: loading ? 1 : 1.05 }}
            whileTap={{ scale: loading ? 1 : 0.95 }}
            type="submit"
            disabled={loading}
            className={`w-full py-3 mt-4 text-lg font-semibold text-white rounded-lg shadow-md transition-all ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-emerald-500 hover:bg-emerald-600"
            }`}
          >
            {loading ? "⏳ Creando..." : "🚀 Cargar Página"}
          </motion.button>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-3 bg-slate-800/50 rounded-lg"
        >
          <p className="text-slate-300 text-sm">
            <strong>Nota:</strong> La moneda es obligatoria.  
            Valor coin solo si activa la opción de coins.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};
