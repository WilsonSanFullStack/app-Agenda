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
    <div className="text-center pt-12">
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
                  <h1 className="font-bold text-lg align-text-top">
                    {dia?.name}
                  </h1>
                  <div className="grid grid-cols-1 gap-1 text-sm">
                    {/* adult work */}
                    <section className="bg-gray-200 p-1 rounded">
                      <h2 className="text-sm text-gray-600">Adult Work</h2>

                      <div className=" bg-gray-400">
                        {dia.adult.map((x) => {
                          return (
                            <div key={x.id}>
                              <div className="flex flex-row justify-between px-2">
                                <h2>{x.corte ? "Corte" : "Parcial"}</h2>
                                {Intl.NumberFormat("en-GB", {
                                  style: "currency",
                                  currency: "GBP",
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }).format(parseFloat(x.lbr))}
                              </div>
                              <div className="flex flex-row justify-between px-2">
                                <h2>Pesos</h2>
                                {Intl.NumberFormat("es-ES", {
                                  style: "currency",
                                  currency: "COP",
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }).format(parseFloat(x.pesos))}
                              </div>
                            </div>
                          );
                        })}{" "}
                      </div>
                    </section>
                    {/* sender */}
                    <section className="">
                      <h2 className="text-sm text-gray-600">Sender</h2>
                      {dia.sender.coinsDias &&
                      dia.sender.coinsDias &&
                      dia.sender.eurosDias !== 0 ? (
                        <h2>Dia</h2>
                      ) : null}
                      {dia.sender.coinsDias !== 0 ? (
                        <div className="flex flex-row justify-between px-2">
                          <h2>Coins:</h2>
                          {Intl.NumberFormat("es-IN", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(dia.sender.coinsDias)}
                        </div>
                      ) : null}
                      {dia.sender.eurosDias !== 0 ? (
                        <div className="flex flex-row justify-between px-2">
                          <h2>Euros:</h2>
                          {Intl.NumberFormat("es-EU", {
                            style: "currency",
                            currency: "EUR",
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(dia.sender.eurosDias)}
                        </div>
                      ) : null}
                      {dia.sender.pesosDias !== 0 ? (
                        <div className="flex flex-row justify-between px-2">
                          <h2>Pesos:</h2>
                          {Intl.NumberFormat("es-EU", {
                            style: "currency",
                            currency: "EUR",
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(dia.sender.pesosDias)}
                        </div>
                      ) : null}
                      <h2>Total</h2>
                      <div className="flex flex-row justify-between px-2">
                        <h2>Coins:</h2>
                        {Intl.NumberFormat("es-IN", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(dia.sender.totalCoins)}
                      </div>
                      <div className="flex flex-row justify-between px-2">
                        <h2>Euros:</h2>
                        {Intl.NumberFormat("es-EU", {
                          style: "currency",
                          currency: "EUR",
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(dia.sender.totalEuros)}
                      </div>
                      <div className="flex flex-row justify-between px-2">
                        <h2>Pesos:</h2>
                        {Intl.NumberFormat("es-EU", {
                          style: "currency",
                          currency: "EUR",
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(dia.sender.totalPesos)}
                      </div>
                    </section>
                    {/* dirty */}
                    {dia.dirty ? (
                      <section>
                        <h2 className="text-sm text-gray-600">Dirty</h2>
                        <div>
                          Dolares Dia:{" "}
                          {Intl.NumberFormat("es-ES", {
                            style: "currency",
                            currency: "COP",
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(dia.dirty.pesosDia)}
                        </div>
                        <div>
                          Dolares Dia:
                          {Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(
                            dia.dirty.mostrar
                              ? dia.dirty.total
                              : 50 - dia.dirty.total
                          )}
                        </div>

                        <div>
                          {dia.dirty.mostrar ? "Dolares Total: " : "Faltan: "}
                          {Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(
                            dia.dirty.mostrar
                              ? dia.dirty.total
                              : 50 - dia.dirty.total
                          )}
                        </div>
                        <div>
                          {dia.dirty.mostrar
                            ? `Total Pesos: 
                          ${Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(dia.dirty.pesos)}`
                            : null}
                        </div>
                      </section>
                    ) : null}

                    {/* vx */}
                    <section>
                      <h2 className="text-sm text-gray-600">VX</h2>
                      <div>
                        Creditos Dia:{" "}
                        {Intl.NumberFormat("es-EU", {
                          style: "currency",
                          currency: "EUR",
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(dia.vx.creditosDia)}
                      </div>
                      <div>
                        Euros Dia:{" "}
                        {Intl.NumberFormat("es-ES", {
                          style: "currency",
                          currency: "COP",
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(dia.vx.pesosDia)}
                      </div>
                      <div>
                        Total Creditos:{" "}
                        {Intl.NumberFormat("es-EU", {
                          style: "currency",
                          currency: "EUR",
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(dia.vx.creditos)}
                      </div>
                      <div>
                        Total Euros:{" "}
                        {Intl.NumberFormat("es-ES", {
                          style: "currency",
                          currency: "COP",
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(dia.vx.pesos)}
                      </div>
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

      <table className="table-auto border-collapse border border-gray-300 w-full text-sm">
        <thead className="bg-gray-500 text-white">
          {/* Fila 1: categorías */}
          <tr>
            <th rowSpan="2" className="border border-gray-400 px-2 py-1">
              Día
            </th>
            <th colSpan="3" className="border border-gray-300 px-2 py-1">
              AdultWork
            </th>
            <th colSpan="3" className="border border-gray-300 px-2 py-1">
              Sender (Día)
            </th>
            <th colSpan="3" className="border border-gray-300 px-2 py-1">
              Sender (Total)
            </th>
            <th colSpan="2" className="border border-gray-300 px-2 py-1">
              Vx (Día)
            </th>
            <th colSpan="2" className="border border-gray-300 px-2 py-1">
              Vx (Total)
            </th>
            <th colSpan="2" className="border border-gray-300 px-2 py-1">
              7Live (Día)
            </th>
            <th colSpan="2" className="border border-gray-300 px-2 py-1">
              7Live (Total)
            </th>
            <th colSpan="2" className="border border-gray-300 px-2 py-1">
              Dirty (Día)
            </th>
            <th colSpan="2" className="border border-gray-300 px-2 py-1">
              Dirty (Total)
            </th>
          </tr>
          {/* Fila 2: subencabezados */}
          <tr>
            {/* AdultWork */}
            <th className="border border-gray-300 px-2 py-1">Corte</th>
            <th className="border border-gray-300 px-2 py-1">Libras</th>
            <th className="border border-gray-300 px-2 py-1">Pesos</th>

            {/* Sender Día */}
            <th className="border border-gray-300 px-2 py-1">Coins</th>
            <th className="border border-gray-300 px-2 py-1">Euros</th>
            <th className="border border-gray-300 px-2 py-1">Pesos</th>

            {/* Sender Total */}
            <th className="border border-gray-300 px-2 py-1">Coins</th>
            <th className="border border-gray-300 px-2 py-1">Euros</th>
            <th className="border border-gray-300 px-2 py-1">Pesos</th>

            {/* VX */}
            <th className="border border-gray-300 px-2 py-1">Creditos</th>
            <th className="border border-gray-300 px-2 py-1">Pesos</th>
            {/* VX */}
            <th className="border border-gray-300 px-2 py-1">Creditos</th>
            <th className="border border-gray-300 px-2 py-1">Pesos</th>

            {/* 7Live */}
            <th className="border border-gray-300 px-2 py-1">Creditos</th>
            <th className="border border-gray-300 px-2 py-1">Pesos</th>
            {/* 7Live */}
            <th className="border border-gray-300 px-2 py-1">Creditos</th>
            <th className="border border-gray-300 px-2 py-1">Pesos</th>

            {/* Dirty Día */}
            <th className="border border-gray-300 px-2 py-1">Dólares</th>
            <th className="border border-gray-300 px-2 py-1">Pesos</th>

            {/* Dirty Total */}
            <th className="border border-gray-300 px-2 py-1">Dólares</th>
            <th className="border border-gray-300 px-2 py-1">Pesos</th>
          </tr>
        </thead>

        <tbody>
  {data?.dias?.map((dia) => {
    const adults = dia.adult?.length ? dia.adult : [null]; // Si no hay adultos, al menos 1 null para renderizar
    return adults.map((adult, idx) => (
      <tr key={`${dia.name}-${idx}`}>
        {/* Día solo en la primera fila */}
        {idx === 0 ? (
          <td className="border border-gray-300 px-2 py-1" rowSpan={adults.length}>
            {dia.name}
          </td>
        ) : null}

        {/* AdultWork */}
        <td className="border border-gray-300 px-2 py-1">
          {adult?.corte != null ? (adult.corte ? "Corte" : "Parcial") : "-"}
        </td>
        <td className="border border-gray-300 px-2 py-1">
          {adult?.lbr != null
            ? Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(adult.lbr)
            : "-"}
        </td>
        <td className="border border-gray-300 px-2 py-1">
          {adult?.pesos != null
            ? Intl.NumberFormat("es-ES", { style: "currency", currency: "COP" }).format(adult.pesos)
            : "-"}
        </td>

        {/* Solo en la primera fila mostramos el resto de datos */}
        {idx === 0 ? (
          <>
            {/* Sender Día */}
            <td className="border border-gray-300 px-2 py-1">{dia.sender?.coinsDias ?? "-"}</td>
            <td className="border border-gray-300 px-2 py-1">
              {dia.sender?.eurosDias != null
                ? Intl.NumberFormat("es-EU", { style: "currency", currency: "EUR" }).format(dia.sender.eurosDias)
                : "-"}
            </td>
            <td className="border border-gray-300 px-2 py-1">
              {dia.sender?.pesosDias != null
                ? Intl.NumberFormat("es-ES", { style: "currency", currency: "COP" }).format(dia.sender.pesosDias)
                : "-"}
            </td>

            {/* Sender Total */}
            <td className="border border-gray-300 px-2 py-1">{dia.sender?.totalCoins ?? "-"}</td>
            <td className="border border-gray-300 px-2 py-1">
              {dia.sender?.totalEuros != null
                ? Intl.NumberFormat("es-EU", { style: "currency", currency: "EUR" }).format(dia.sender.totalEuros)
                : "-"}
            </td>
            <td className="border border-gray-300 px-2 py-1">
              {dia.sender?.totalPesos != null
                ? Intl.NumberFormat("es-ES", { style: "currency", currency: "COP" }).format(dia.sender.totalPesos)
                : "-"}
            </td>

            {/* VX Día */}
            <td className="border border-gray-300 px-2 py-1">{dia.vx?.creditos ?? "-"}</td>
            <td className="border border-gray-300 px-2 py-1">{dia.vx?.pesos ?? "-"}</td>

            {/* VX Total */}
            <td className="border border-gray-300 px-2 py-1">{dia.vx?.creditos ?? "-"}</td>
            <td className="border border-gray-300 px-2 py-1">{dia.vx?.pesos ?? "-"}</td>

            {/* 7Live Día */}
            <td className="border border-gray-300 px-2 py-1">{dia.live7?.creditos ?? "-"}</td>
            <td className="border border-gray-300 px-2 py-1">{dia.live7?.pesos ?? "-"}</td>

            {/* 7Live Total */}
            <td className="border border-gray-300 px-2 py-1">{dia.live7?.creditos ?? "-"}</td>
            <td className="border border-gray-300 px-2 py-1">{dia.live7?.pesos ?? "-"}</td>

            {/* Dirty Día */}
            <td className="border border-gray-300 px-2 py-1">{dia.dirty?.pesosDia ?? "-"}</td>
            <td className="border border-gray-300 px-2 py-1">{dia.dirty?.total ?? "-"}</td>

            {/* Dirty Total */}
            <td className="border border-gray-300 px-2 py-1">{dia.dirty?.total ?? "-"}</td>
            <td className="border border-gray-300 px-2 py-1">{dia.dirty?.pesos ?? "-"}</td>
          </>
        ) : (
          <>
            {/* Celdas vacías para mantener estructura */}
            {Array.from({ length: 17 }).map((_, i) => (
              <td key={i} className="border border-gray-300 px-2 py-1">-</td>
            ))}
          </>
        )}
      </tr>
    ));
  })}
</tbody>


      </table>
    </div>
  );
};
