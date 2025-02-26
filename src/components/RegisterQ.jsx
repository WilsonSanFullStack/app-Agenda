import React, { useState } from "react";
import Calendar from "react-calendar";

export const RegisterQ = () => {
  const [q, setQ] = useState({ name: "", inicio: "", fin: "", creada: "" });
  const handleQuincena = (event) => {
    setQ({
      ...q,
      name: event.target.value,
    });
  };
  const currentYear = new Date().getFullYear(); //year actual

  const [yearS, setYearS] = useState(currentYear);
  const handleYearS = (y) => {
    console.log('vista', y)
    setYearS(y);
  };
  // const yeah = handleYear()
  console.log("useState", yearS);
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i); //rango de 10 years atras y adelante
  const nombres = (yearC) => {
    const quincenas = [];
    const meses = Array.from({ length: 12 }, (_, i) =>
      new Date(2000, i, 1).toLocaleString("es-ES", { month: "long" })
    );
    meses.forEach((mes, index) => {
      const year = yearC!==undefined & yearC !== currentYear?yearC:currentYear;
      console.log(year);
      const ultimoDiaMes = new Date(year, index + 1, 0).getDate(); //ultimo dia del mes
      //primera quincena 1 al 15
      quincenas.push({
        name: `${mes}-1-${year}`,
        inicio: `01/${String(index + 1).padStart(2, "0")}/${year}`,
        fin: `15/${String(index + 1).padStart(2, "0")}/${year}`,
        creada: false,
      });

      //segunda quincena 16 al ultimo dia del mes
      quincenas.push({
        name: `${mes}-2-${year}`,
        inicio: `16/${String(index + 1).padStart(2, "0")}/${year}`,
        fin: `${ultimoDiaMes}/${String(index + 1).padStart(2, "0")}/${year}`,
        creada: false,
      });
    });
    return quincenas;
  };

  const quincenas = nombres(yearS);
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
        })}</div>
        <section className="text-center text-white">
          <h1>quincenas para {yearS}</h1>
          <section className="text-white">
            {quincenas?.map((q) => {
              return (
                <div key={q.name}>
                  <h1 key={q.name}>{q.name}</h1>
                  {q.creada ? (
                    <></>
                  ) : (
                    <button
                      key={q.name + 1}
                      onChange={handleQuincena}
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
