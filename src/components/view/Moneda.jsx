import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaDollarSign, FaEuroSign, FaPoundSign } from "react-icons/fa";

export const Moneda = ({ moneda, isPago }) => {
  const [monedas, setMoneda] = useState(moneda || []);

  useEffect(() => {
    setMoneda(moneda || []);
  }, [moneda]);

  // Animación para el contenedor
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  // Animación para cada chip
  const chipVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className="flex flex-wrap justify-center gap-3 w-full rounded-xl p-3 bg-slate-800/80 shadow-md"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {monedas?.map((m) => {
        const shouldHighlight = isPago ? m.pago : !m.pago;

        return (
          <motion.div
            key={m.id}
            className={`flex flex-wrap items-center gap-3 rounded-lg px-4 py-2 text-sm border transition 
              ${
                shouldHighlight
                  ? "bg-emerald-900/50 border-emerald-500 shadow-lg shadow-emerald-500/30 scale-[1.03]"
                  : "bg-slate-900/60 border-slate-700"
              }`}
            variants={chipVariants}
            whileHover={{ scale: 1.05 }}
          >
            {/* Dólar */}
            <div className="flex items-center gap-1 text-emerald-300">
              <FaDollarSign className="text-emerald-400" />
              <span>{m.dolar}</span>
            </div>

            {/* Euro */}
            <div className="flex items-center gap-1 text-sky-300">
              <FaEuroSign className="text-sky-400" />
              <span>{m.euro}</span>
            </div>

            {/* Libra */}
            <div className="flex items-center gap-1 text-indigo-300">
              <FaPoundSign className="text-indigo-400" />
              <span>{m.gbp}</span>
            </div>

            {/* Estado */}
            <span
              className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                m.pago
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/40"
              }`}
            >
              {m.pago ? "PAGO" : "ESTADÍSTICAS"}
            </span>
          </motion.div>
        );
      })}
    </motion.div>
  );
};
