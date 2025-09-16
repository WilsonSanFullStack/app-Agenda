import { motion } from "framer-motion";
import { label } from "framer-motion/client";
import React, { useEffect, useState } from "react";
import { GrDocumentUpdate } from "react-icons/gr";
import { RiDeleteBinFill } from "react-icons/ri";

export const Arancel = ({ setError }) => {
  const [aranceles, setAranceles] = useState({
    id: "",
    dolar: 0,
    euro: 0,
    gbp: 0,
    porcentaje: 0,
    create: "",
    update: "",
  });
  const getArancel = async () => {
    try {
      const res = await window.Electron.getAranceles();
      return res;
    } catch (error) {
      setError("Error al buscar los aranceles: " + error);
    }
  };
  async function get() {
    const arancel = await getArancel();
    for (let i = 0; i < arancel.length; i++) {
      const yearC = new Date(arancel[i].createdAt).getFullYear();
      const monthC = new Date(arancel[i].createdAt).getMonth() + 1;
      const dayC = new Date(arancel[i].createdAt).getDay();
      const hourC = new Date(arancel[i].createdAt).toLocaleTimeString();
      const yearU = new Date(arancel[i].updatedAt).getFullYear();
      const monthU = new Date(arancel[i].updatedAt).getMonth() + 1;
      const dayU = new Date(arancel[i].updatedAt).getDay();
      const hourU = new Date(arancel[i].updatedAt).toLocaleTimeString();
      setAranceles({
        ...aranceles,
        id: arancel[i].id,
        dolar: arancel[i].dolar,
        euro: arancel[i].euro,
        gbp: arancel[i].gbp,
        porcentaje: arancel[i].porcentaje,
        create: `Hora: ${hourC} Fecha: ${dayC}-${monthC}-${yearC}`,
        update: `Hora: ${hourU} Fecha: ${dayU}-${monthU}-${yearU}`,
      });
    }
  }
  useEffect(() => {
    get();
  }, []);
  const deleteArancel = async (id) => {
    try {
      const res = await window.Electron.deleteAranceles(id);
      if (res.message === "Fue eliminar el arancel") {
        setAranceles({
          id: "",
          dolar: 0,
          euro: 0,
          gbp: 0,
          porcentaje: 0,
          create: "",
          update: "",
        });
      }
    } catch (error) {
      setError("Error al eliminar el arancel: " + error);
    }
  };

  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState({
    dolar: 0,
    euro: 0,
    gbp: 0,
    porcentaje: 0,
  });

  // activar edición
  const startEditing = () => {
    setFormValues({
      dolar: aranceles.dolar,
      euro: aranceles.euro,
      gbp: aranceles.gbp,
      porcentaje: aranceles.porcentaje,
    });
    setIsEditing(true);
  };

  // manejar cambios en inputs
  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  // guardar cambios
  const saveChanges = async () => {
    const data = { id: aranceles.id, arancel: formValues };
    try {
      const res = await window.Electron.updateAranceles(data);
      if (res.id) {
        setAranceles({ ...aranceles, ...formValues });
        setIsEditing(false);
      }
    } catch (error) {
      setError("Error al actualizar el arancel: " + error);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center py-12 px-4">
      {isEditing ? (
        <div className="space-y-3">
          {["dolar", "euro", "gbp", "porcentaje"].map((field) => (
            <div key={field} className="flex flex-col gap-1">
              <label className="text-slate-300 capitalize">{field}</label>
              <input
                type="number"
                name={field}
                value={formValues[field]}
                onChange={handleChange}
                className="px-3 py-2 rounded-lg bg-slate-700 text-white outline-none"
              />
            </div>
          ))}
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-md bg-slate-600 hover:bg-slate-500 text-white"
            >
              Cancelar
            </button>
            <button
              onClick={saveChanges}
              className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              Guardar
            </button>
          </div>
        </div>
      ) : (
        <motion.div
          className="w-full max-w-2xl bg-white/6 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-700 p-6"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* header */}
          <div className="flex items-center justify-between gap-4 border-b border-slate-700 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <motion.h1
                className="text-2xl sm:text-3xl font-bold text-emerald-400 tracking-wide uppercase"
                initial={{ scale: 0.98, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                Aranceles
              </motion.h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => aranceles.id && deleteArancel(aranceles.id)}
                aria-label="Eliminar arancel"
                className="p-2 rounded-md bg-red-600 hover:bg-red-500 transition text-white shadow-sm"
              >
                <RiDeleteBinFill className="text-lg" />
              </button>
            </div>
          </div>

          {/* body: tarjetas */}
          <motion.div
            className="grid grid-cols-1 gap-3"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.06 } },
            }}
          >
            {/* moneda card helper */}
            {[
              {
                label: "Dólar",
                value: Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: "COP",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(aranceles.dolar),
              },
              {
                label: "Euro",
                value: Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: "COP",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(aranceles.euro),
              },
              {
                label: "Libra Esterlina (GBP)",
                value: Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: "COP",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(aranceles.gbp),
              },
              {
                label: "Porcentaje (%)",
                value: aranceles.porcentaje * 100 + " %",
              },
            ].map((m) => (
              <motion.section
                key={m.label}
                className="flex justify-between items-center bg-slate-800/40 px-4 py-3 rounded-lg"
                initial={{ x: -12, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.36, delay: 0.7 + 0 * 0.2 }}
              >
                <h2 className="text-slate-300 font-medium">{m.label}</h2>
                <p className="text-emerald-300 font-semibold tabular-nums">
                  {m.value ?? 0}
                </p>
              </motion.section>
            ))}

            <motion.section
              className="flex flex-col sm:flex-row sm:justify-between gap-3 bg-slate-900/40 px-4 py-3 rounded-lg"
              initial={{ x: -12, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.36, delay: 0.7 + 3 * 0.2 }}
            >
              <div>
                <h3 className="text-slate-400 text-sm italic">Creado</h3>
                <p className="text-slate-200 text-sm">
                  {aranceles.create || "Sin datos"}
                </p>
              </div>
              <div>
                <h3 className="text-slate-400 text-sm italic">
                  Última modificación
                </h3>
                <p className="text-slate-200 text-sm">
                  {aranceles.update || "Sin datos"}
                </p>
              </div>
            </motion.section>

            {/* acciones - centrado */}
            <motion.div
              className="mt-4 flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <button
                onClick={() => startEditing()}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-sky-500 text-slate-300 font-semibold shadow-md hover:scale-[1.01] active:scale-95 transition-transform text-center flex gap-2"
              >
                <GrDocumentUpdate className="text-xl " /> Editar
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};
