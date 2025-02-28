import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const RegisterQ = () => {
  const navigate = useNavigate();
  //use effect para navegar a la creacion de quincenas
  useEffect(() => {
    window.Electron.onAbrirRegistroQuincena(() => {
      console.log("Cambiando vista a Registro Quincena");
      navigate("/register/quincena"); // 🔹 Cambia la vista
    });
  }, []);
  const crearQuincena = async (data) => {
    try {
      const respuesta = await window.Electron.addQuincena(data);
      if (respuesta.error) {
        console.log(respuesta.error);
      } else {
        console.log(respuesta);
        await getAllQuincena();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getAllQuincena = async () => {
    try {
      const respuesta = await window.Electron.getQuincena();
      return respuesta;
    } catch (error) {
      console.log(error);
    }
  };
  const [quincenas, setQuincenas] = useState([]);
  //estado para almacenas las quincenas ya creadas
  const [q, setQ] = useState([]);
  //traemos de la db las quincenas creadas para no mostrarlas
  const handleQuincena = async () => {
    const creadas = await getAllQuincena();
    setQ(creadas);
  };

  useEffect(() => {
    handleQuincena();
    // 📌 Escuchar evento de Electron para actualizar quincenas
    window.Electron.onQuincenaActualizada(() => {
      console.log("Quincena actualizada, recargando datos...");
      getAllQuincena();
    });

    nombres(yearS);
    return () => {
      window.Electron.removeQuincenaActualizada();
    };
  }, []);
  // useEffect(() => {
  //   getAllQuincena();

  // }, []);
  //vemos cual es el year actual
  const currentYear = new Date().getFullYear(); //year actual
  //estado para guardar el year actual y luego seleccionar el deseado
  const [yearS, setYearS] = useState(currentYear);
  //para cambiar el year actual y mostrar las quincenas de ese year
  const handleYearS = (y) => {
    setYearS(y);
  };

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
        (yearC !== undefined) & (yearC !== currentYear) ? yearC : currentYear;
      const ultimoDiaMes = new Date(year, index + 1, 0).getDate(); //ultimo dia del mes
      //primera quincena 1 al 15
      if (!q?.some((x) => x.name === `${mes}-1-${year}`)) {
        quincena.push({
          name: `${mes}-1-${year}`,
          inicio: `01/${String(index + 1).padStart(2, "0")}/${year}`,
          fin: `15/${String(index + 1).padStart(2, "0")}/${year}`,
        });
      }

      //segunda quincena 16 al ultimo dia del mes
      if (!q?.some((x) => x.name === `${mes}-2-${year}`)) {
        quincena.push({
          name: `${mes}-2-${year}`,
          inicio: `16/${String(index + 1).padStart(2, "0")}/${year}`,
          fin: `${ultimoDiaMes}/${String(index + 1).padStart(2, "0")}/${year}`,
        });
      }
    });
    setQuincenas(quincena)
  };
  //ejecucion de la creacion de nombres de quincenas

  console.log(quincenas);
  return (
    <div>
      <form className="">
        <div className="flex justify-between items-center mx-2 px-1">
          {years?.map((y) => {
            return (
              <button
                key={y}
                className="bg-gray-500 m-1 p-1 rounded-lg cursor-pointer"
                onClick={() => handleYearS(y)}
              >
                {`${y}`}{" "}
              </button>
            );
          })}
        </div>
        <section className="text-center text-white">
          <h1>quincenas para {yearS}</h1>
          <section className="text-white">
            {quincenas?.map((q) => {
              return (
                <div key={q.name}>
                  <h1 key={q.name}>{q.name}</h1>
                  {q?.creada ? (
                    <></>
                  ) : (
                    <button
                      key={q.name + 1}
                      onChange={handleQuincena}
                      onClick={() => crearQuincena(q)}
                      className=" focus:bg-red-500 active:bg-amber-700 hover:bg-emerald-500 border-2 border-amber-400 w-fit m-0.5 p-0.5 text-white"
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
