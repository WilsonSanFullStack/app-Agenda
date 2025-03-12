import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const getAllDay = async () => {
  try {
    const respuesta = await window.Electron.getDay();
    console.log("dias getAllDay", respuesta);
    return respuesta;
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

export const Home = () => {
  const [days, setDays] = useState([]);
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

    return () => {
      window.Electron.removeQuincenaActualizada();
    };
  }, []);
  const handleDay = async () => {
    const days = await getAllDay();
    setDays(days);
  };
  useEffect(() => {
    handleDay();
  }, []);
  console.log("dias", days);
  const [fecha, setfecha] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    day: new Date().getDate(),
  });

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
      <section>
        {days?.map((dia) => {
          return (
            <div key={dia.id}>
              <h1>{dia.name}</h1>
            </div>
          );
        })}
      </section>
    </div>
  );
};
