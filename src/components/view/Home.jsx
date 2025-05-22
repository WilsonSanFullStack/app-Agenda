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
const getAllData = async (data) => {
  try {
    const res = await window.Electron.getAllData(data);
    console.log("getAllData", res);
    return res;
  } catch (error) {
    console.log(error);
  }
};
export const Home = () => {
  //estado para buscar la quincena actual y la quincena anterior
  const [datos, setDatos] = useState({ q: "", qa: "" });
  const [q, setQ] = useState([]);
  const [data, setData] = useState([]);
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

  const [fecha, setfecha] = useState({
    day: new Date().getDate(),
    month: months[new Date().getMonth()], // Enero es 0
    year: new Date().getFullYear(),
  });

  //traemos de la db las quincenas creadas para no mostrarlas
  const handleQuincena = async () => {
    const creadas = await getAllQuincena();
    // await getAllData();
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
  useEffect(() => {
    if (q.length > 0) {
      const today = new Date();
      const day = today.getDate();
      const monthIndex = today.getMonth();
      const year = today.getFullYear();

      // Determinar quincena actual
      const currentQuincena =
        day <= 15
          ? `${months[monthIndex]}-1-${year}` // Primera quincena
          : `${months[monthIndex]}-2-${year}`; // Segunda quincena

      console.log("currentQuincena", currentQuincena);

      // Buscar quincena actual en la lista
      const quincenaActual = q.find(
        (quincena) => quincena.name === currentQuincena
      )?.id;

      // Determinar quincena anterior (solo si la actual es la segunda)
      let quincenaAnterior = "";
      if (currentQuincena.includes("-2-")) {
        const previousQuincenaName = `${months[monthIndex]}-1-${year}`;
        quincenaAnterior =
          q.find((quincena) => quincena.name === previousQuincenaName)?.id ||
          "";
      }

      console.log("quincenaActual", quincenaActual);
      console.log("quincenaAnterior", quincenaAnterior);

      if (quincenaActual) {
        setDatos({ ...datos, q: quincenaActual, qa: quincenaAnterior });
      }
    }
  }, [q, fecha]);

  console.log("q", q);
  console.log("datos", datos);
  const handleData = async () => {
    const getData = await getAllData(datos);
    setData(getData);
  };
  // useEffect(() => {
  //   handleData(datos.q);
  // }, [datos]);
  console.log(data);
  return (
    <div className="text-center">
      <h1 className="text-4xl uppercase text-center">agenda y estadisticas</h1>
      <p>
        pagina diseñada y elaborada por wilson sanchez con el fin de poner en
        sus manos una herramienta para facilitar las estadisticas webcam
      </p>
      <h2>
        {fecha.day} de {fecha.month} del {fecha.year}
      </h2>
      <div className="bg-slate-950 m-2 h-8 border-2 border-slate-700 rounded-lg flex justify-center items-center">
        {q?.map((q) => {
          return (
            <div
              key={q.id}
              className={`${
                datos.q === q.name ? "bg-emerald-800" : "bg-amber-950"
              } mx-2 rounded-lg px-2 cursor-pointer`}
              onClick={() => handleData()}
            >
              {q.name}
            </div>
          );
        })}
      </div>
      {/* <section>
        {data?.map((x) => {
          return <div>{x.name}</div>;
        })}
      </section> */}
    </div>
  );
};
