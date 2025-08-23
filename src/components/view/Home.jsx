import React, { useEffect, useState } from "react";
const crearQuincena = async (data) => {
  try {
    const respuesta = await window.Electron.addQuincena(data);
    if (respuesta.error) {
      console.log(error);
    } else {
      console.log("Quincena creada:", respuesta);
    }
  } catch (error) {
    console.log(error);
  }
};
const getQuincena = async (date) => {
  try {
    const respuesta = await window.Electron.getQuincena(date);
    return respuesta;
  } catch (error) {
    console.log(error);
  }
};
export const Home = () => {
  const [q, setQ] = useState([]);
  const [data, setData] = useState([]);
  const testData = {
    name: "julio-1-2025",
    inicio: "2025-07-01",
    fin: "2025-07-15",
  };
  const date = "mayo-2-25";
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getQuincena(date);
        setData(result || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    const crear = async () => await crearQuincena(testData, date);
    crear();
  }, []);
  console.log("data", data);
  console.log("q", q);
  return <div>Home</div>;
};
