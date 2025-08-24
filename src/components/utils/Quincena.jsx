import React, { useState, useEffect, use } from "react";
import { useNavigate } from "react-router-dom";

export const Quincena = ({ setError }) => {
  const navigate = useNavigate();
  const [quincenas, setQuincenas] = useState([]);
  //estado para almacenas las quincenas ya creadas
  const [q, setQ] = useState([]);
  const [creado, setCreado] = useState(false);
  //estado para guardar el year actual y luego seleccionar el deseado
  //vemos cual es el year actual
  const currentYear = new Date().getFullYear(); //year actual
  const [yearS, setYearS] = useState(currentYear);
  //para cambiar el year actual y mostrar las quincenas de ese year
  const handleYearS = (y) => {
    setYearS(y);
  };
  //use effect para navegar a la creacion de quincenas
  useEffect(() => {
    window.Electron.onAbrirRegistroQuincena(() => {
      setError("Cambiando vista a Registro Quincena");
      navigate("/register/quincena"); // 🔹 Cambia la vista
    });
  }, []);

  const crearQuincena = async (data) => {
    try {
      const respuesta = await window.Electron.addQuincena(data);
      if (respuesta.error) {
        setError(error);
      } else {
        setCreado((prev) => (prev = !prev));
        setError("Quincena creada");
        // Actualizar la lista de quincenas después de crear una nueva
        const nuevasQuincenas = await fetchQ(yearS);
        setQ(nuevasQuincenas || []);
      }
    } catch (error) {
      setError("Error al crear la quincena: " + error);
    }
  };

  const fetchQ = async () => {
    try {
      const result = await window.Electron.getQuincenaYear(yearS);
      return result;
    } catch (error) {
      setError("Error fetching data:", error);
    }
  };

  const handleQuincena = async (yearS) => {
    const creadas = await fetchQ(yearS);
    setQ(creadas || []);
    nombres(yearS);
  };
  useEffect(() => {
    handleQuincena(yearS);
    // 📌 Escuchar evento de Electron para actualizar quincenas
    window.Electron.onQuincenaActualizada(() => {
      setError("Quincena actualizada, recargando datos...");
      fetchQ(yearS);
    });

    return () => {
      window.Electron.removeQuincenaActualizada();
    };
  }, [creado]);

  //seleccion de los years que vamos a mostrar para crear quincenas
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i); //rango de 10 years atras y adelante

  //creacion de nombres de la quincenas y el resto de propiedades
  const nombres = (yearC) => {
    const quincena = [];
    const meses = Array.from({ length: 12 }, (_, i) =>
      new Date(2000, i, 1).toLocaleString("es-ES", { month: "long" })
    );

    meses.forEach((mes, index) => {
      const year =
        yearC !== undefined && yearC !== currentYear ? yearC : currentYear;
      const ultimoDiaMes = new Date(year, index + 1, 0).getDate(); // ultimo día del mes

      // primera quincena: 1 al 15
      if (
        Array.isArray(q) &&
        q !== undefined &&
        q !== null &&
        !q?.some((x) => x.name === `${mes}-1-${year}`)
      ) {
        quincena.push({
          year: yearC,
          name: `${mes}-1-${year}`,
          inicio: new Date(year, index, 1), // 1 del mes
          fin: new Date(year, index, 15), // 15 del mes
        });
      }

      // segunda quincena: 16 al último día
      if (!q?.some((x) => x.name === `${mes}-2-${year}`)) {
        quincena.push({
          year: yearC,
          name: `${mes}-2-${year}`,
          inicio: new Date(year, index, 16), // 16 del mes
          fin: new Date(year, index, ultimoDiaMes), // último día
        });
      }
    });

    setQuincenas(quincena);
  };

  console.log(yearS);
  useEffect(() => {
    nombres(yearS);
  }, [q, yearS]);

  return (
    <div>
      <form className="pt-12">
        <div className="flex flex-wrap  mx-2 px-1">
          {years?.map((y) => {
            return (
              <button
                key={y}
                className="bg-gray-500 m-1 p-1 rounded-lg cursor-pointer w-12"
                onClick={() => handleYearS(y)}
              >
                {`${y}`}
              </button>
            );
          })}
        </div>
        <section className="text-center text-white mt-2">
          <h1>quincenas para {yearS}</h1>
          <section className="text-white flex flex-wrap justify-center gap-2">
            {quincenas?.map((q) => {
              return (
                <div
                  key={q.name}
                  className="border-2 w-48 m-1 p-1 border-slate-500 rounded-lg"
                >
                  <h1 key={q.name}>{q.name}</h1>
                  {q?.creada ? (
                    <></>
                  ) : (
                    <button
                      key={q.name + 1}
                      onChange={handleQuincena}
                      onClick={() => crearQuincena(q)}
                      className=" focus:bg-red-500 active:bg-amber-700 hover:bg-emerald-500 border-2 border-amber-400 w-fit m-0.5 p-0.5 text-white rounded-md"
                    >
                      Crear
                    </button>
                  )}
                </div>
              );
            })}
          </section>
        </section>
      </form>
    </div>
  );
};
