import React, { useEffect, useState } from "react";

const getAllQuincena = async () => {
  try {
    const respuesta = await window.Electron.getQuincena();
    return respuesta;
  } catch (error) {
    console.log(error);
  }
};
const getAllDay = async () => {
  try {
    const respuesta = await window.Electron.getDay();
    return respuesta;
  } catch (error) {
    console.log(error);
  }
};
export const Dia = () => {
  const [q, setQ] = useState([]);
  const [selectedQuincena, setSelectedQuincena] = useState({
    name: "",
    id: "",
  });
  const [days, setDays] = useState([]);
  const [d, setD] = useState([]);

  const handleQ = async () => {
    const quincena = await getAllQuincena();
    const days = await getAllDay();
    setQ(quincena);
    setD(days || []);
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
      setSelectedQuincena({name: foundQuincena.name, id: foundQuincena.id });
    }
  }, [q]);
  // Efecto para calcular los días según la quincena seleccionada
  useEffect(() => {
    if (!selectedQuincena.name) return;

    const parts = selectedQuincena?.name;
    const partsspli = parts.split("-")
    console.log(partsspli)
    if (partsspli.length !== 3) return;

    const monthName = partsspli[0]; // Nombre del mes
    const quincena = partsspli[1]; // '1' o '2'
    const year = parseInt(partsspli[2]); // Año en número

    const monthIndex = months.indexOf(monthName);
    if (monthIndex === -1) return;

    const lastDay = new Date(year, monthIndex + 1, 0).getDate(); // Último día del mes

    const newDays = (
      quincena === "1"
        ? Array.from(
            { length: 15 },
            (_, i) =>
              `${i + 1}-${monthName.slice(0, 3)}-${year.toString().slice(2, 4)}`
          ).filter((day) => Array.isArray(d) && !d?.some((d) => d.name === day)) // Evita duplicados
        : Array.from(
            { length: lastDay - 15 },
            (_, i) =>
              `${i + 16}-${monthName.slice(0, 3)}-${year
                .toString()
                .slice(2, 4)}`
          )
    ).filter((day) => Array.isArray(d) && !d?.some((d) => d.name === day)); // Evita duplicados
    setDays(newDays || []); // Agrega solo los nuevos días
  }, [selectedQuincena, d]);


  const CreateDay = async ({dia, q}) => {
    try {
      console.log(dia, q)
      const data = {dia: dia,
        q: q
      }
      console.log(data)
      const respuesta = await window.Electron.addDay(data);
      if (respuesta.error) {
        console.log("respuesta negativa", respuesta.error);
        // setSelectedQuincena({name: "", id: ""})
      } else {
        console.log("respuesta positiva", respuesta);
        const days = await getAllDay();
        setD(days || []);
        // setSelectedQuincena({name: "", id: ""})
      }
    } catch (error) {
      // setSelectedQuincena({name: "", id: ""})
      console.log("error en create day", error);
    }
  };
  return (
    <div>
      <form>
        <section className="text-center m-1 p-1 pt-10">
          <h1>Seleccione una quincena</h1>
          <select
            className="bg-slate-950 m-1 rounded-md p-1"
            value={selectedQuincena.name}
            onChange={(e) => {
              const selected = q.find((x) => x.name === e.target.value);
              if (selected) {
                setSelectedQuincena({ name: selected.name, id: selected.id });
              }
            }}          >
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
                  onClick={() => CreateDay({dia: x, q: selectedQuincena.id})}
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
