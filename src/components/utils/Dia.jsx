import { motion } from "framer-motion";
import React, { useState } from "react";
export const Dia = ({ setError }) => {
  const [dia, setdia] = useState({
    name: "",
    usd: 0,
    euro: 0,
    gbp: 0,
    gbpParcial: 0,
    mostrar: 0,
    adelantos: 0,
    worked: 0,
    q: ''
  });
  const [q, setQ] = useState([])
  const [dias, setDias] = useState([])

  const getQuincenaYear = async ()

  const handleName = (e) => {
    setdia({ ...dia, name: e.target.value });
  };
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
    setdia({ ...dia, adelantos: parseFloat(e.target.value) });
  };
  const handleMostrar = (e) => {
    setdia({ ...dia, mostrar: e.target.checked });
  };
  const handleWorked = (e) => {
    setdia({ ...dia, worked: e.target.checked });
  };

  const crearDia = async (e) => {
    e.preventDefault();
    try {
      const res = await window.Electrom.addDay(dia);
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
          q: ''
        });
      }
    } catch (error) {
      setError("Error al crear Dia: " + error);
    }
  };

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
          {/* Moneda */}
          <div>
            <label className="block mb-1 text-sm font-medium text-slate-300">
              Nombre
            </label>
            <select
              value={dia.name}
              onChange={handleName}
              className="w-full bg-slate-900/70 text-white px-3 py-2 rounded-lg border border-slate-600 focus:ring-2 focus:ring-emerald-400"
            >
              <option value="" hidden>
                Seleccione un dia
              </option>
              <option value="USD">Dólar</option>
              <option value="EURO">Euro</option>
              <option value="GBP">Libra Esterlina</option>
            </select>
          </div>
          {/* Nombre */}
          <div>
            <label className="block mb-1 text-sm font-medium to-slate-300">
              Nombre
            </label>
            <input
            className="w-full px-4 py-2 bg-slate-900/70 border border-slate-600 rounded-lg shadow-sm focus:ring-emerald-400 focus:outline-none text-white"
            type="text" 
            value={page.name}
            onChange={handleName}
            placeholder=""
            />
          </div>
        </form>
      </motion.div>
    </div>
  );
};
