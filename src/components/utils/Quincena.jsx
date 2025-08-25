import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const Quincena = ({ setError }) => {
  const navigate = useNavigate();
  const [quincenas, setQuincenas] = useState([]);
  const [q, setQ] = useState([]);
  const [creado, setCreado] = useState(false);

  const currentYear = new Date().getFullYear();
  const [yearS, setYearS] = useState(currentYear);

  useEffect(() => {
    window.Electron.onAbrirRegistroQuincena(() => {
      setError("Cambiando vista a Registro Quincena");
      navigate("/register/quincena");
    });
  }, []);

  const crearQuincena = async (data) => {
    try {
      const respuesta = await window.Electron.addQuincena(data);
      if (respuesta.error) {
        setError(respuesta.error);
      } else {
        setCreado((prev) => !prev);
        setError("✅ Quincena creada");
        const nuevasQuincenas = await fetchQ(yearS);
        setQ(nuevasQuincenas || []);
      }
    } catch (error) {
      setError("Error al crear la quincena: " + error);
    }
  };

  const fetchQ = async (y) => {
    try {
      const result = await window.Electron.getQuincenaYear(y);
      return result;
    } catch (error) {
      setError("Error fetching data: " + error);
    }
  };

  const handleQuincena = async (y) => {
    const creadas = await fetchQ(y);
    setQ(creadas || []);
    nombres(y);
  };

  useEffect(() => {
    handleQuincena(yearS);
    window.Electron.onQuincenaActualizada(() => {
      setError("🔄 Quincena actualizada, recargando datos...");
      fetchQ(yearS);
    });
    return () => {
      window.Electron.removeQuincenaActualizada();
    };
  }, [creado]);

  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

  const nombres = (yearC) => {
    const quincena = [];
    const meses = Array.from({ length: 12 }, (_, i) =>
      new Date(2000, i, 1).toLocaleString("es-ES", { month: "long" })
    );

    meses.forEach((mes, index) => {
      const year = yearC || currentYear;
      const ultimoDiaMes = new Date(year, index + 1, 0).getDate();

      if (!q?.some((x) => x.name === `${mes}-1-${year}`)) {
        quincena.push({
          year,
          name: `${mes}-1-${year}`,
          inicio: new Date(year, index, 1),
          fin: new Date(year, index, 15),
        });
      }
      if (!q?.some((x) => x.name === `${mes}-2-${year}`)) {
        quincena.push({
          year,
          name: `${mes}-2-${year}`,
          inicio: new Date(year, index, 16),
          fin: new Date(year, index, ultimoDiaMes),
        });
      }
    });

    setQuincenas(quincena);
  };
useEffect(() => {
    nombres(yearS);
  }, [q, yearS]);
  return (
    <div className="pt-12 text-white">
      {/* Botones de años */}
      <div className="flex flex-wrap justify-center gap-1">
        {years.map((y) => (
          <button
            key={y}
            type="button"
            className={`w-12 py-1 rounded-lg font-semibold transition-colors
              ${
                yearS === y ? "bg-emerald-600" : "bg-gray-600 hover:bg-gray-700"
              }`}
            onClick={() => setYearS(y)}
          >
            {y}
          </button>
        ))}
      </div>

      {/* Lista de quincenas */}
      <section className="text-center mt-6">
        <h1 className="text-xl font-bold mb-4">📅 Quincenas {yearS}</h1>
        <div className="flex flex-wrap justify-center gap-3">
          {quincenas.map((qItem, i) => (
            <motion.div
              key={qItem.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="border border-slate-500 bg-slate-800/70 rounded-lg p-3 w-48 shadow-md"
            >
              <h2 className="font-semibold text-amber-400">{qItem.name}</h2>
              <button
                type="button"
                onClick={() => crearQuincena(qItem)}
                className="mt-2 px-3 py-1 rounded-md text-sm border border-emerald-400 text-emerald-300 hover:bg-emerald-500 hover:text-white transition-colors"
              >
                Crear
              </button>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};
