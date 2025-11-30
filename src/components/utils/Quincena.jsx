import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { yearsFive, quincenasYear } from "../../date";
import { AiOutlineArrowRight, AiOutlineArrowLeft } from "react-icons/ai";

export const Quincena = ({ setError }) => {
  const navigate = useNavigate();
  const [quincenas, setQuincenas] = useState([]);
  const [q, setQ] = useState([]);
  const [creado, setCreado] = useState(false);
  const [loading, setLoading] = useState(false);

  const currentYear = new Date().getFullYear();
  const [yearS, setYearS] = useState(currentYear);
  const [yearFives, setYearFives] = useState([]);

  // 🔧 FUNCIONES REUTILIZABLES
  const handleApiResponse = (response) => {
    return Array.isArray(response) ? response : [];
  };

  const handleObjectResponse = (response) => {
    return response && typeof response === 'object' ? response : {};
  };

  useEffect(() => {
    // 🔧 Proteger el event listener
    if (window.Electron?.onAbrirRegistroQuincena) {
      window.Electron.onAbrirRegistroQuincena(() => {
        setError("Cambiando vista a Registro Quincena");
        navigate("/register/quincena");
      });
    }

    // 🔧 Limpiar event listener
    return () => {
      if (window.Electron?.removeAbrirRegistroQuincena) {
        window.Electron.removeAbrirRegistroQuincena();
      }
    };
  }, [navigate, setError]);

  const crearQuincena = async (data) => {
    if (!data || !data.name) {
      setError("Datos de quincena inválidos");
      return;
    }

    try {
      setLoading(true);
      const respuesta = await window.Electron.addQuincena(data);
      const safeRespuesta = handleObjectResponse(respuesta);
      
      if (safeRespuesta.error) {
        setError(safeRespuesta.error);
      } else {
        setCreado((prev) => !prev);
        setError("✅ Quincena creada");
        const nuevasQuincenas = await fetchQ(yearS);
        setQ(nuevasQuincenas);
      }
    } catch (error) {
      setError("Error al crear la quincena: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchQ = async (year) => {
    try {
      const result = await window.Electron.getQuincenaYear(year);
      return handleApiResponse(result);
    } catch (error) {
      setError("Error fetching data: " + error.message);
      return [];
    }
  };

  const handleQuincena = async (year) => {
    try {
      setLoading(true);
      const creadas = await fetchQ(year);
      setQ(creadas);
      
      // 🔧 Proteger la llamada a quincenasYear
      const quincenaDate = quincenasYear ? quincenasYear(year, creadas) : [];
      setQuincenas(handleApiResponse(quincenaDate));
    } catch (error) {
      console.error("Error en handleQuincena:", error);
      setQuincenas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleQuincena(yearS);
    
    // 🔧 Proteger event listener
    if (window.Electron?.onQuincenaActualizada) {
      window.Electron.onQuincenaActualizada(() => {
        setError("🔄 Quincena actualizada, recargando datos...");
        handleQuincena(yearS);
      });
    }

    return () => {
      if (window.Electron?.removeQuincenaActualizada) {
        window.Electron.removeQuincenaActualizada();
      }
    };
  }, [creado, yearS, setError]);

  useEffect(() => {
    // 🔧 Proteger yearsFive
    const year5 = yearsFive ? yearsFive(yearS) : [];
    setYearFives(handleApiResponse(year5));
    
    // 🔧 Proteger quincenasYear
    const quincenaDate = quincenasYear ? quincenasYear(yearS, q) : [];
    setQuincenas(handleApiResponse(quincenaDate));
  }, [yearS, q]);

  // 🔧 Función para manejar cambio de año con límites
  const handleYearChange = (newYear) => {
    if (newYear >= 2000 && newYear <= 2100) { // 🔧 Límites razonables
      setYearS(newYear);
    }
  };

  const handlePrev = () => handleYearChange(yearS - 1);
  const handleNext = () => handleYearChange(yearS + 1);

  // 🔧 Datos protegidos para renderizado
  const safeQuincenas = handleApiResponse(quincenas);
  const safeYearFives = handleApiResponse(yearFives);

  return (
    <div className="pt-12 text-white px-4">
      {/* Botones de años */}
      <div className="flex flex-wrap justify-center gap-2 items-center mb-6">
        <button
          type="button"
          className="p-2 text-center rounded-xl bg-blue-200 hover:bg-yellow-100 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          onClick={handlePrev}
          disabled={yearS <= 2000}
        >
          <AiOutlineArrowLeft className="text-blue-600 text-xl" />
        </button>

        {safeYearFives.map((year) => (
          <button
            key={year}
            type="button"
            className={`w-12 py-2 rounded-lg font-semibold transition-colors
              ${
                yearS === year
                  ? "bg-emerald-600"
                  : "bg-gray-600 hover:bg-gray-700"
              }`}
            onClick={() => handleYearChange(year)}
          >
            {year}
          </button>
        ))}

        <button
          type="button"
          className="p-2 text-center rounded-xl bg-blue-200 hover:bg-yellow-100 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          onClick={handleNext}
          disabled={yearS >= 2100}
        >
          <AiOutlineArrowRight className="text-blue-600 text-xl" />
        </button>
      </div>

      {/* Estado de carga */}
      {loading && (
        <div className="text-center py-4">
          <p className="text-slate-300">Cargando quincenas...</p>
        </div>
      )}

      {/* Lista de quincenas */}
      <section className="text-center">
        <h1 className="text-xl font-bold mb-6">📅 Quincenas {yearS}</h1>
        
        {safeQuincenas.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-slate-800/50 rounded-lg p-6 max-w-md mx-auto"
          >
            <p className="text-slate-300">
              {q.length === 0 
                ? "No hay quincenas creadas para este año" 
                : "Todas las quincenas de este año ya han sido creadas"
              }
            </p>
          </motion.div>
        )}

        <div className="flex flex-wrap justify-center gap-4">
          {safeQuincenas.map((qItem, i) => (
            <motion.div
              key={qItem.name || i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="border border-slate-500 bg-slate-800/70 rounded-lg p-4 w-48 shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="font-semibold text-amber-400 mb-3">
                {qItem.name || "Quincena sin nombre"}
              </h2>
              
              {/* 🔧 Información adicional si está disponible */}
              {qItem.fechaInicio && (
                <p className="text-slate-400 text-sm mb-2">
                  {qItem.fechaInicio}
                </p>
              )}
              
              <button
                type="button"
                onClick={() => crearQuincena(qItem)}
                disabled={loading}
                className={`w-full px-3 py-2 rounded-md text-sm border transition-colors ${
                  loading
                    ? "border-gray-500 text-gray-400 cursor-not-allowed"
                    : "border-emerald-400 text-emerald-300 hover:bg-emerald-500 hover:text-white"
                }`}
              >
                {loading ? "Creando..." : "Crear"}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Información del estado actual */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center text-slate-400 text-sm"
      >
        <p>
          Quincenas creadas: {handleApiResponse(q).length} / {safeQuincenas.length}
        </p>
        {q.length > 0 && (
          <p className="mt-1">
            💡 Las quincenas ya creadas no aparecen en la lista
          </p>
        )}
      </motion.div>
    </div>
  );
};