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

  //traemos de la db las quincenas creadas para mostrarlas
  const handleQuincena = async () => {
    const creadas = await getAllQuincena();
    // await getAllData();
    setQ(creadas);
  };

  // useEffect para obtener los dias y quincenas al cargar el componente
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

  // useEffect para obtener los dias y quincenas al cargar el componente
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
  const handleClick = async (id) => {
    console.log("id", id);
    setDatos({ ...datos, q: id });
    if (datos.q === id) {
      const getData = await getAllData(datos);
      setData(getData);
      setDatos({ ...datos, q: "" });
    }
  };
  const handleData = async () => {
    const getData = await getAllData(datos);
    setData(getData);
  };
  useEffect(() => {
    handleData(datos.q);
  }, [datos]);
  console.log("data", data);
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
              onClick={() => handleClick(q.id)}
            >
              {q.name}
            </div>
          );
        })}
      </div>
      <section>
        <h1>{data?.name}</h1>

        <div className="grid grid-cols-5 gap-1">
          {data?.dias?.length > 0 ? (
            data.dias?.map((dia) => {
                return (
                  <div key={dia?.name} className=" p-2 border rounded shadow">
                    <h1 className="font-bold text-lg">{dia?.name}</h1>
                    <div className="grid grid-cols-2 gap-1">
                      {/* adult work */}
                      <section>
                        <h2 className="text-sm text-gray-600">Adult Work</h2>

                        <div>
                          {dia.adult.map((x) => {
                            return (
                              <div key={x.id}>
                                <h2>{x.corte ? "Corte" : "No Corte"}</h2>
                                <h2>
                                  {Intl.NumberFormat("en-GB", {
                                    style: "currency",
                                    currency: "GBP",
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }).format(parseFloat(x.lbr))}
                                </h2>
                                <h2>
                                  {Intl.NumberFormat("es-ES", {
                                    style: "currency",
                                    currency: "COP",
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }).format(parseFloat(x.pesos))}
                                </h2>
                              </div>
                            );
                          })}{" "}
                        </div>
                      </section>
                      {/* sender */}
                      <section className="mt-2">
                        <h2 className="text-sm text-gray-600">Sender</h2>
                        <div>
                          Coins Total:{" "}
                          {Intl.NumberFormat("es-IN", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(dia.sender.totalCoins)}
                        </div>
                        <div>
                          Euros Total:{" "}
                          {Intl.NumberFormat("es-EU", {
                            style: "currency",
                            currency: "EUR",
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(dia.sender.totalEuros)}
                        </div>
                        {dia.sender.coinsDias !== 0 ? (
                          <div>
                            Coins Día:{" "}
                            {Intl.NumberFormat("es-IN", {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }).format(dia.sender.coinsDias)}
                          </div>
                        ) : null}
                        {dia.sender.eurosDias !== 0 ? (
                          <div>
                            Euros Día:{" "}
                            {Intl.NumberFormat("es-EU", {
                              style: "currency",
                              currency: "EUR",
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }).format(dia.sender.eurosDias)}
                          </div>
                        ) : null}
                      </section>
                      {/* dirty */}
                      {dia.dirty.mostrar ? (
                        <section>
                          <div>{console.log(dia.dirty)} </div>
                          <h2 className="text-sm text-gray-600">Dirty</h2>
                          <h2>
                            {Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }).format(dia.dirty.dolares)}
                          </h2>
                        </section>
                      ) : null}
                      {/* vx */}
                      <section>
                        <h2 className="text-sm text-gray-600">VX</h2>
                        <h2>
                          {Intl.NumberFormat("es-EU", {
                              style: "currency",
                              currency: "EUR",
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }).format(dia.vx.creditos)}
                        </h2>
                      </section>
                      {/* live7 */}
                      <section>
                        <h2 className="text-sm text-gray-600">7 live</h2>
                        <h2>
                          {Intl.NumberFormat("es-EU", {
                              style: "currency",
                              currency: "EUR",
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }).format(dia.live7.creditos)}
                        </h2>
                      </section>
                    </div>
                  </div>
                );
              })
          ) : (
            <div>No hay datos</div>
          )}
        </div>
      </section>
    </div>
  );
};
