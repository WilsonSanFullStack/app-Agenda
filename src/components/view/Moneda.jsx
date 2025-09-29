import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaDollarSign, FaEuroSign, FaPoundSign } from "react-icons/fa";

export const Moneda = ({ moneda, isPago }) => {
  const [monedas, setMoneda] = useState(moneda || {});

  useEffect(() => {
    setMoneda(moneda || {});
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
  const shouldHighlight = isPago;

  return (
    <motion.div
      className="flex flex-wrap justify-center gap-3 w-full rounded-xl p-3 bg-slate-800/80 shadow-md"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {moneda?.pago?.usd > 0 && moneda?.pago?.euro>0&&moneda?.pago?.gbp>0?(<motion.div
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
          <span>{moneda?.pago?.usd}</span>
        </div>

        {/* Euro */}
        <div className="flex items-center gap-1 text-sky-300">
          <FaEuroSign className="text-sky-400" />
          <span>{moneda?.pago?.euro}</span>
        </div>

        {/* Libra */}
        <div className="flex items-center gap-1 text-indigo-300">
          <FaPoundSign className="text-indigo-400" />
          <span>{moneda?.pago?.gbp}</span>
        </div>

        {/* Estado */}
        <span
          className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${
            shouldHighlight
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
              : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/40"
          }`}
        >
          PAGO
        </span>
      </motion.div>):null}


      {moneda?.estadisticas?.usd > 0 && moneda?.estadisticas?.euro>0&&moneda?.estadisticas?.gbp>0?(<motion.div
        className={`flex flex-wrap items-center gap-3 rounded-lg px-4 py-2 text-sm border transition 
              ${
                !shouldHighlight
                  ? "bg-emerald-900/50 border-emerald-500 shadow-lg shadow-emerald-500/30 scale-[1.03]"
                  : "bg-slate-900/60 border-slate-700"
              }`}
        variants={chipVariants}
        whileHover={{ scale: 1.05 }}
      >
        {/* Dólar */}
        <div className="flex items-center gap-1 text-emerald-300">
          <FaDollarSign className="text-emerald-400" />
          <span>{moneda?.estadisticas?.usd}</span>
        </div>

        {/* Euro */}
        <div className="flex items-center gap-1 text-sky-300">
          <FaEuroSign className="text-sky-400" />
          <span>{moneda?.estadisticas?.euro}</span>
        </div>

        {/* Libra */}
        <div className="flex items-center gap-1 text-indigo-300">
          <FaPoundSign className="text-indigo-400" />
          <span>{moneda?.estadisticas?.gbp}</span>
        </div>

        {/* Estado */}
        <span
          className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${
            !shouldHighlight
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
              : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/40"
          }`}
        >
          ESTADISTICAS
        </span>
      </motion.div>):null}
        {/* Estado */}
        {moneda?.porcentaje > 0?(<span
          className="ml-2 px-2 py-0.5 rounded-full text-2xl font-bold text-yellow-500"
        >
          {moneda?.porcentaje*100}%
        </span>):null}
    </motion.div>
  );
};
