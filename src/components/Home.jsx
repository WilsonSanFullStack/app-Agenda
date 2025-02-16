import React, { useState } from "react";

export const Home = () => {
  const [fecha, setfecha] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  });
  // const fecha = new Date().toDateString();
  const { year, month } = fecha;
  function dividirEnQuincenas(year, month) {
    const daysInMonth = new Date(year, month, 0).getDate(); // Último día del mes

    // Primera quincena: del 1 al 15
    const primeraQuincena = Array.from({ length: 15 }, (_, i) => i + 1);

    // Segunda quincena: del 16 al último día del mes
    const segundaQuincena = Array.from(
      { length: daysInMonth - 15 },
      (_, i) => i + 16
    );

    return { primeraQuincena, segundaQuincena };
  }

  const quincenas = dividirEnQuincenas(year, month);
  console.log("Primera quincena:", quincenas.primeraQuincena);
  console.log("Segunda quincena:", quincenas.segundaQuincena);
  console.log(fecha);
  return (
    <div className="text-center">
      <h1 className="text-4xl uppercase text-center">agenda y estadisticas</h1>
      <p>
        pagina diseñada y elaborada por wilson sanchez con el fin de poner en
        sus manos una herramienta para facilitar las estadisticas webcam
      </p>
      <h2>
        {fecha.day}/{fecha.month}/{fecha.year}
      </h2>
      {fecha.day > 15 ? (
        <div className="grid grid-cols-7 w-96 border-2 border-slate-400">
          {quincenas.segundaQuincena.map((dia) => {
            return <div key={dia}>{dia}</div>;
          })}
        </div>
      ) : (<div className="grid grid-cols-7 w-96 border-2 border-slate-400">
        {quincenas.primeraQuincena.map((dia) => {
          return <div key={dia}>{dia}</div>;
        })}</div>
      )}
    </div>
  );
};
