import React, { useEffect, useState } from "react";

const getAllQuincena = async () => {
  try {
    const respuesta = await window.Electron.getQuincena();
    return respuesta;
  } catch (error) {
    console.log(error);
  }
};
export const Dia = () => {
  const [q, setQ] = useState([]);
  const [selectedQuincena, setSelectedQuincena] = useState("");
  const [days, setDays] = useState([]);

  const handleQ = async () => {
    const quincena = await getAllQuincena();
    setQ(quincena);
  };

  useEffect(() => {
    handleQ();
  }, []);

  const months = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];
  useEffect(() => {
    if (q.length === 0) return; // No ejecutar hasta que `q` tenga datos

    // Obtener fecha actual
    const today = new Date();
    const day = today.getDate();
    const monthIndex = today.getMonth(); // Enero es 0
    const year = today.getFullYear();

    // Determinar quincena actual
    const currentQuincena =
      day <= 15
        ? `${months[monthIndex]}-1-${year}` // Primera quincena
        : `${months[monthIndex]}-2-${year}`; // Segunda quincena

    // Buscar si la quincena actual existe en el array `q`
    const foundQuincena = q?.find((x) => x?.name === currentQuincena);

    if (foundQuincena) {
      setSelectedQuincena(foundQuincena.name);
    }
  }, [q]);
  // Efecto para calcular los días según la quincena seleccionada
  useEffect(() => {
    if (!selectedQuincena) return;

    const parts = selectedQuincena.split("-");
    if (parts.length !== 3) return;

    const monthName = parts[0]; // Nombre del mes
    const quincena = parts[1]; // '1' o '2'
    const year = parseInt(parts[2]); // Año en número

    const monthIndex = months.indexOf(monthName);
    if (monthIndex === -1) return;

    const lastDay = new Date(year, monthIndex + 1, 0).getDate(); // Último día del mes

    const newDays =
      quincena === "1"
        ? Array.from(
            { length: 15 },
            (_, i) =>
              `${i + 1}-${monthName.slice(0, 3)}-${year.toString().slice(2, 4)}`
          )
        : Array.from(
            { length: lastDay - 15 },
            (_, i) =>
              `${i + 16}-${monthName.slice(0, 3)}-${year
                .toString()
                .slice(2, 4)}`
          );

    setDays(newDays);
  }, [selectedQuincena]);

  const CreateDay = async(data) => {
    try {
      console.log("data", typeof(data) )
      const respuesta = await window.Electron.addDay(data)
      if (respuesta.error) {
        console.log("respuesta negativa", respuesta.error)
      }else {
        console.log("respuesta positiva", respuesta)
      }
    } catch (error) {
      console.log("error en create day", error)
    }
  }
  return (
    <div>
      <form>
        <section className="text-center m-1 p-1 ">
          <h1>Seleccione una quincena</h1>
          <select
            className="bg-slate-950 m-1 rounded-md p-1"
            value={selectedQuincena}
            onChange={(e) => setSelectedQuincena(e.target.value)}
          >
            {q?.map((x) => {
              return (
                <option key={x.name} value={x.name} className="m-0.5">
                  {x.name}
                </option>
              );
            })}
          </select>
        </section>

        <section className="grid grid-cols-7">
          {days?.map((x) => {
            return (
              <div
                key={x}
                className="text-center border border-slate-300 m-1 p-1 hover:bg-slate-950"
              >
                <h1>{x}</h1>
                <button
                className="border border-slate-400 rounded-lg p-1 hover:bg-emerald-500 hover:uppercase"
                onClick={()=> CreateDay(x)}
                >
                  crear
                </button>
              </div>
            );
          })}
        </section>
      </form>
    </div>
  );
};
