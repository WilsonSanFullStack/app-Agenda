import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { GrDocumentUpdate } from "react-icons/gr";
import { RiDeleteBinFill } from "react-icons/ri";

export const Arancel = ({ setError }) => {
  // 🔧 ESTADO INICIAL PROTEGIDO
  const initialArancelState = {
    id: "",
    dolar: 0,
    euro: 0,
    gbp: 0,
    porcentaje: 0,
    create: "",
    update: "",
  };

  const [aranceles, setAranceles] = useState(initialArancelState);
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState({
    dolar: 0,
    euro: 0,
    gbp: 0,
    porcentaje: 0,
  });
  const [loading, setLoading] = useState(false);

  // 🔧 FUNCIONES REUTILIZABLES
  const handleObjectResponse = (response) => {
    return response && typeof response === 'object' ? response : {};
  };

  const getArancel = async () => {
    try {
      const res = await window.Electron.getAranceles();
      return handleObjectResponse(res); // 🔧 Ahora es un objeto, no array
    } catch (error) {
      setError("Error al buscar los aranceles: " + error.message);
      return {}; // 🔧 Objeto vacío en caso de error
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Sin datos";
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Fecha inválida";
      
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hour = date.toLocaleTimeString();
      
      return `Hora: ${hour} Fecha: ${day}-${month}-${year}`;
    } catch (error) {
      console.error("Error formateando fecha:", error);
      return "Error en fecha";
    }
  };
  
  const loadAranceles = async () => {
    try {
      setLoading(true);
      const arancelData = await getArancel();
      
      // 🔧 PROTEGER: Si no hay datos o no tiene id (no existe arancel)
      if (!arancelData || !arancelData.id) {
        setAranceles(initialArancelState);
        return;
      }
      
      setAranceles({
        id: arancelData.id || "",
        dolar: Number(arancelData.dolar) || 0,
        euro: Number(arancelData.euro) || 0,
        gbp: Number(arancelData.gbp) || 0,
        porcentaje: Number(arancelData.porcentaje) || 0,
        create: formatDate(arancelData.createdAt),
        update: formatDate(arancelData.updatedAt),
      });

    } catch (error) {
      console.error("Error cargando aranceles:", error);
      setError("Error al cargar los aranceles: " + error.message);
      setAranceles(initialArancelState);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAranceles();
  }, []);

  const deleteArancel = async (id) => {
    if (!id) {
      setError("No hay arancel para eliminar");
      return;
    }

    try {
      const res = await window.Electron.deleteAranceles(id);
      const safeRes = handleObjectResponse(res);
      
      if (safeRes.success || safeRes.message === "Arancel eliminado correctamente") {
        setAranceles(initialArancelState);
        setError("Arancel eliminado correctamente");
      } else {
        setError(safeRes.message || "Error al eliminar el arancel");
      }
    } catch (error) {
      setError("Error al eliminar el arancel: " + error.message);
    }
  };

  // 🔧 Crear nuevo arancel (cuando no existe ninguno)
  const createArancel = async () => {
    try {
      const data = {
        dolar: Number(formValues.dolar) || 0,
        euro: Number(formValues.euro) || 0,
        gbp: Number(formValues.gbp) || 0,
        porcentaje: Number(formValues.porcentaje) || 0,
      };
      
      const res = await window.Electron.addAranceles(data);
      const safeRes = handleObjectResponse(res);
      
      if (safeRes.id) {
        setAranceles({ 
          ...safeRes,
          create: formatDate(safeRes.createdAt),
          update: formatDate(safeRes.updatedAt)
        });
        setIsEditing(false);
        setError("Arancel creado correctamente");
      } else {
        setError(safeRes.message || "Error al crear el arancel");
      }
    } catch (error) {
      setError("Error al crear el arancel: " + error.message);
    }
  };

  // 🔧 Activar edición
  const startEditing = () => {
    setFormValues({
      dolar: aranceles.dolar || 0,
      euro: aranceles.euro || 0,
      gbp: aranceles.gbp || 0,
      porcentaje: aranceles.porcentaje || 0,
    });
    setIsEditing(true);
  };

  // 🔧 Manejar cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: Number(value) || 0,
    });
  };

  // 🔧 Guardar cambios (editar o crear)
  const saveChanges = async () => {
    if (aranceles.id) {
      // 🔧 EDITAR arancel existente
      try {
        const data = { 
          id: aranceles.id, 
          arancel: {
            dolar: Number(formValues.dolar) || 0,
            euro: Number(formValues.euro) || 0,
            gbp: Number(formValues.gbp) || 0,
            porcentaje: Number(formValues.porcentaje) || 0,
          }
        };
        
        const res = await window.Electron.updateAranceles(data);
        const safeRes = handleObjectResponse(res);
        
        if (safeRes.id) {
          setAranceles({ 
            ...aranceles, 
            ...formValues,
            update: formatDate(new Date())
          });
          setIsEditing(false);
          setError("Arancel actualizado correctamente");
        } else {
          setError(safeRes.message || "Error al actualizar el arancel");
        }
      } catch (error) {
        setError("Error al actualizar el arancel: " + error.message);
      }
    } else {
      // 🔧 CREAR nuevo arancel
      createArancel();
    }
  };

  // 🔧 Cancelar edición
  const cancelEditing = () => {
    setIsEditing(false);
    // Si no hay arancel existente, resetear formValues
    if (!aranceles.id) {
      setFormValues({
        dolar: 0,
        euro: 0,
        gbp: 0,
        porcentaje: 0,
      });
    }
  };

  // 🔧 Campos para el formulario
  const formFields = [
    { name: "dolar", label: "Dólar", type: "number" },
    { name: "euro", label: "Euro", type: "number" },
    { name: "gbp", label: "Libra Esterlina (GBP)", type: "number" },
    { name: "porcentaje", label: "Porcentaje", type: "number", step: "0.01" }
  ];

  // 🔧 Datos para mostrar en tarjetas
  const monedaData = [
    {
      label: "Dólar",
      value: Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(aranceles.dolar || 0),
    },
    {
      label: "Euro",
      value: Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(aranceles.euro || 0),
    },
    {
      label: "Libra Esterlina (GBP)",
      value: Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(aranceles.gbp || 0),
    },
    {
      label: "Porcentaje (%)",
      value: `${((aranceles.porcentaje || 0) * 100).toFixed(2)} %`,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Cargando aranceles...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center py-12 px-4">
      {isEditing ? (
        <motion.div
          className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-700 p-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h2 className="text-2xl font-bold text-emerald-400 mb-6 text-center">
            {aranceles.id ? "Editar Aranceles" : "Crear Aranceles"}
          </h2>
          
          <div className="space-y-4">
            {formFields.map((field) => (
              <div key={field.name} className="flex flex-col gap-1">
                <label className="text-slate-300 capitalize">{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  step={field.step}
                  value={formValues[field.name]}
                  onChange={handleChange}
                  className="px-3 py-2 rounded-lg bg-slate-700 text-white outline-none border border-slate-600 focus:border-emerald-500"
                />
              </div>
            ))}
            
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={cancelEditing}
                className="px-4 py-2 rounded-md bg-slate-600 hover:bg-slate-500 text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={saveChanges}
                className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
              >
                {aranceles.id ? "Guardar" : "Crear"}
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          className="w-full max-w-2xl bg-white/6 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-700 p-6"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Header */}
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

            {aranceles.id && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => deleteArancel(aranceles.id)}
                  aria-label="Eliminar arancel"
                  className="p-2 rounded-md bg-red-600 hover:bg-red-500 transition text-white shadow-sm"
                >
                  <RiDeleteBinFill className="text-lg" />
                </button>
              </div>
            )}
          </div>

          {/* Body: Tarjetas */}
          <motion.div
            className="grid grid-cols-1 gap-3"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.06 } },
            }}
          >
            {monedaData.map((m, index) => (
              <motion.section
                key={m.label}
                className="flex justify-between items-center bg-slate-800/40 px-4 py-3 rounded-lg"
                initial={{ x: -12, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.36, delay: 0.7 + index * 0.2 }}
              >
                <h2 className="text-slate-300 font-medium">{m.label}</h2>
                <p className="text-emerald-300 font-semibold tabular-nums">
                  {m.value}
                </p>
              </motion.section>
            ))}

            {/* Fechas - solo mostrar si existe arancel */}
            {aranceles.id && (
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
            )}

            {/* Acciones */}
            <motion.div
              className="mt-4 flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <button
                onClick={startEditing}
                className="px-5 py-2 rounded-xl font-semibold shadow-md hover:scale-[1.01] active:scale-95 transition-transform text-center flex gap-2 bg-gradient-to-r from-emerald-500 to-sky-500 text-slate-300"
              >
                <GrDocumentUpdate className="text-xl" /> 
                {aranceles.id ? "Editar Arancel" : "Crear Arancel"}
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};