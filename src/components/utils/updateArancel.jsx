import React, { useState } from "react";
import { motion } from "framer-motion";
export const createAranceles = ({ setError }) => {
  const [aranceles, setAranceles] = useState({
    dolar: 0,
    euro: 0,
    gbp: 0,
    parcial: 0,
  });
  const handleDolar = (e) => {
    setAranceles({ ...aranceles, dolar: e.target.value });
  };
  const handleEuro = (e) => {
    setAranceles({ ...aranceles, euro: e.target.value });
  };
  const handleGbp = (e) => {
    setAranceles({ ...aranceles, gbp: e.target.value });
  };
  const handleParcial = (e) => {
    setAranceles({ ...aranceles, parcial: e.target.value });
  };
  //! const postAranceles = async () => {
  //!   try {
  //!     const res = await window.Electron.addAranceles(aranceles);
  //!     return res;
  //!   } catch (error) {
  //!     setError("Error al cargar los aranceles: " + error);
  //!   }
  //! };
  const handleSubmit = async (e) => {
    e.preventDefault();
    //! await postAranceles();
    setAranceles({
      dolar: 0,
      euro: 0,
      gbp: 0,
      parcial: 0,
    });
  };
  console.log(aranceles);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center py-12">
      <motion.form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white/10 backkdrop-blur-md rounded-2xl shadow-2xl border border-slate-700 p-8"
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
          Edicion de Aranceles
        </motion.h1>
        {/* inputs */}
        <motion.section
          className="mt-8 grid gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {/*dolar */}
          <motion.div
            className="flex items-center justify-between gap-4 border-b border-slate-700 pb-2"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7 + 0 * 0.2 }}
          >
            <label
              htmlFor="dolar"
              className="text-xl text-slate-200 font-semibold "
            >
              Dolar
            </label>
            <input
              id="dolar"
              type="number"
              value={aranceles.dolar}
              onChange={handleDolar}
              onWheel={(e) => e.currentTarget.blur()}
              onKeyDown={(e) => {
                if (e.key === "ArrowUp" || e.key === "ArrowDown")
                  e.preventDefault();
              }}
              className="w-32 text-center text-xl bg-slate-900 text-white border border-slate-600 rounded-lg px-3 py-1 focus:ring-emerald-400 focus:outline-none no-spin"
            />
          </motion.div>
          {/* euro */}
          <motion.div
            className="flex items-center justify-between gap-4 border-b border-slate-700 pb-2"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7 + 1 * 0.2 }}
          >
            <label
              htmlFor="euro"
              className="text-xl text-slate-200 font-semibold"
            >
              Euro
            </label>
            <input
              id="euro"
              type="number"
              value={aranceles.euro}
              onChange={handleEuro}
              onWheel={(e) => e.currentTarget.blur()}
              onKeyDown={(e) => {
                if (e.key === "ArrowUp" || e.key === "ArrowDown")
                  e.preventDefault();
              }}
              className="w-32 text-center text-xl bg-slate-900 text-white border border-slate-600 rounded-lg px-3 py-1 focus:ring-emerald-400 focus:outline-none no-spin"
            />
          </motion.div>
          {/* libras esterlinas gbp */}
          <motion.div
            className="flex items-center justify-between gap-4 border-b border-slate-700 pb-2"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7 + 2 * 0.2 }}
          >
            <label
              htmlFor="gbp"
              className="text-xl text-slate-200 font-semibold"
            >
              Libra Esterlina (GBP)
            </label>
            <input
              id="gbp"
              type="number"
              value={aranceles.gbp}
              onChange={handleGbp}
              onWheel={(e) => e.currentTarget.blur()}
              onKeyDown={(e) => {
                if (e.key === "ArrowUp" || e.key === "ArrowDown")
                  e.preventDefault();
              }}
              className="w-32 text-center text-xl bg-slate-900 text-white border border-slate-600 rounded-lg px-3 py-1 focus:ring-emerald-400 focus:outline-none no-spin"
            />
          </motion.div>
          {/* parcial */}
          <motion.div
            className="flex items-center justify-between gap-4 border-b border-slate-700 pb-2"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7 + 1 * 0.2 }}
          >
            <label
              htmlFor="parcial"
              className="text-xl text-slate-200 font-semibold"
            >
              Descuentos de Adult para parcial
            </label>
            <input
              id="parcial"
              type="number"
              value={aranceles.parcial}
              onChange={handleParcial}
              onWheel={(e) => e.currentTarget.blur()}
              onKeyDown={(e) => {
                if (e.key === "ArrowUp" || e.key === "ArrowDown")
                  e.preventDefault();
              }}
              className="w-32 text-center text-xl bg-slate-900 text-white border border-slate-600 rounded-lg px-3 py-1 focus:ring-emerald-400 focus:outline-none no-spin"
            />
          </motion.div>
          {/* Botón */}
          <motion.div
            className="mt-10 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            {aranceles.dolar &&
            aranceles.euro &&
            aranceles.gbp &&
            aranceles.parcial ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-8 py-3 rounded-xl text-lg font-bold text-white bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-400 hover:to-sky-400 active:scale-95 shadow-lg shadow-emerald-500/30 transition-all duration-200"
              >
                Update
              </motion.button>
            ) : (
              <p className="text-slate-500 text-sm mt-2">
                Complete todos los campos para habilitar el botón
              </p>
            )}
          </motion.div>
        </motion.section>
      </motion.form>
    </div>
  );
};
