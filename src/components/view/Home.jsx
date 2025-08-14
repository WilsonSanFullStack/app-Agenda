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

      <table className="table-auto border-collapse border border-gray-100 w-full text-sm">
        <thead className="bg-gray-500 text-gray-300">
          {/* Fila 1: categorías */}
          <tr>
            <th rowSpan="2" className="border border-gray-900 px-2 py-1">
              Día
            </th>
            <th
              colSpan="3"
              className="border border-slate-900 bg-purple-400 px-2 py-1"
            >
              AdultWork
            </th>
            <th colSpan="3" className="border border-gray-300 px-2 py-1">
              Sender
            </th>

            <th colSpan="2" className="border border-gray-300 px-2 py-1">
              Vx
            </th>

            <th colSpan="2" className="border border-gray-300 px-2 py-1">
              7Live
            </th>

            <th colSpan="2" className="border border-gray-300 px-2 py-1">
              Dirty
            </th>

            <th colSpan="4" className="border border-gray-300 px-2 py-1">
              Total Dia
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

            {/* VX */}
            <th className="border border-gray-300 px-2 py-1">Creditos</th>
            <th className="border border-gray-300 px-2 py-1">Pesos</th>

            {/* 7Live */}
            <th className="border border-gray-300 px-2 py-1">Creditos</th>
            <th className="border border-gray-300 px-2 py-1">Pesos</th>

            {/* Dirty Día */}
            <th className="border border-gray-300 px-2 py-1">Dólares</th>
            <th className="border border-gray-300 px-2 py-1">Pesos</th>
            {/* total del dia creditos */}
            <th className="border border-gray-300 px-2 py-1">Libras</th>
            <th className="border border-gray-300 px-2 py-1">Euros</th>
            <th className="border border-gray-300 px-2 py-1">Dolares</th>
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
                  <td
                    className="border border-gray-300 px-2 py-1"
                    rowSpan={adults.length}
                  >
                    {dia.name}
                  </td>
                ) : null}

                {/* AdultWork */}
                <td className="border border-gray-300 px-2 py-1">
                  {adult?.corte != null
                    ? adult.corte
                      ? "Corte"
                      : "Parcial"
                    : "-"}
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  {adult?.lbr != null
                    ? Intl.NumberFormat("en-GB", {
                        style: "currency",
                        currency: "GBP",
                      }).format(adult.lbr)
                    : "-"}
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  {adult?.pesos != null
                    ? Intl.NumberFormat("es-ES", {
                        style: "currency",
                        currency: "COP",
                      }).format(adult.pesos)
                    : "-"}
                </td>

                {/* Solo en la primera fila mostramos el resto de datos */}
                {idx === 0 ? (
                  <>
                    {/* Sender Día */}
                    <td className="border border-gray-300 px-2 py-1">
                      {dia.sender?.coinsDias ?? "-"}
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      {dia.sender?.eurosDias != null
                        ? Intl.NumberFormat("es-EU", {
                            style: "currency",
                            currency: "EUR",
                          }).format(dia.sender.eurosDias)
                        : "-"}
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      {dia.sender?.pesosDias != null
                        ? Intl.NumberFormat("es-ES", {
                            style: "currency",
                            currency: "COP",
                          }).format(dia.sender.pesosDias)
                        : "-"}
                    </td>

                    {/* VX Día */}
                    <td className="border border-gray-300 px-2 py-1">
                      {dia.vx?.creditosDia ?? "-"}
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      {dia.vx?.pesosDia ?? "-"}
                    </td>

                    {/* 7Live Día */}
                    <td className="border border-gray-300 px-2 py-1">
                      {dia.live7?.creditosDia ?? "-"}
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      {dia.live7?.pesosDia ?? "-"}
                    </td>

                    {/* Dirty Día */}
                    <td className="border border-gray-300 px-2 py-1">
                      {dia.dirty?.dia ?? "-"}
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      {dia.dirty?.pesosDia ?? "-"}
                    </td>
                    {/* Totales */}
                    <td className="border border-gray-300 px-2 py-1">
                      {dia.total?.libras != null
                        ? Intl.NumberFormat("en-GB", {
                            style: "currency",
                            currency: "GBP",
                          }).format(dia.total.libras)
                        : "-"}
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      {dia.total?.euros != null
                        ? Intl.NumberFormat("es-EU", {
                            style: "currency",
                            currency: "EUR",
                          }).format(dia.total.euros)
                        : "-"}
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      {dia.total?.dolares != null
                        ? Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                          }).format(dia.total.dolares)
                        : "-"}
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      {dia.total?.pesos != null
                        ? Intl.NumberFormat("es-ES", {
                            style: "currency",
                            currency: "COP",
                          }).format(dia.total.pesos)
                        : "-"}
                    </td>
                  </>
                ) : (
                  <>
                    {/* Celdas vacías para mantener estructura */}
                    {Array.from({ length: 17 }).map((_, i) => (
                      <td key={i} className="border border-gray-300 px-2 py-1">
                        -
                      </td>
                    ))}
                  </>
                )}
              </tr>
            ));
          })}
        </tbody>
        <tfoot className="bg-gray-200 font-bold">
  <tr>
    <td className="border border-gray-300 px-2 py-1 text-center" colSpan="1">
      Total Quincena
    </td>

    {/* AdultWork */}
    <td className="border border-gray-300 px-2 py-1">-</td>
    <td className="border border-gray-300 px-2 py-1">
      {Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(
        data.totalQuincena?.adultwork?.lbr ?? 0
      )}
    </td>
    <td className="border border-gray-300 px-2 py-1">
      {Intl.NumberFormat("es-ES", { style: "currency", currency: "COP" }).format(
        data.totalQuincena?.adultwork?.pesos ?? 0
      )}
    </td>

    {/* Sender */}
    <td className="border border-gray-300 px-2 py-1">
      {data.totalQuincena?.sender?.coins ?? 0}
    </td>
    <td className="border border-gray-300 px-2 py-1">
      {Intl.NumberFormat("es-EU", { style: "currency", currency: "EUR" }).format(
        data.totalQuincena?.sender?.euros ?? 0
      )}
    </td>
    <td className="border border-gray-300 px-2 py-1">
      {Intl.NumberFormat("es-ES", { style: "currency", currency: "COP" }).format(
        data.totalQuincena?.sender?.pesos ?? 0
      )}
    </td>

    {/* VX */}
    <td className="border border-gray-300 px-2 py-1">
      {data.totalQuincena?.vx?.creditos ?? 0}
    </td>
    <td className="border border-gray-300 px-2 py-1">
      {data.totalQuincena?.vx?.pesos ?? 0}
    </td>

    {/* 7Live */}
    <td className="border border-gray-300 px-2 py-1">
      {data.totalQuincena?.live7?.creditos ?? 0}
    </td>
    <td className="border border-gray-300 px-2 py-1">
      {data.totalQuincena?.live7?.pesos ?? 0}
    </td>

    {/* Dirty */}
    <td className="border border-gray-300 px-2 py-1">
      {data.totalQuincena?.dirty?.dolares ?? 0}
    </td>
    <td className="border border-gray-300 px-2 py-1">
      {data.totalQuincena?.dirty?.pesos ?? 0}
    </td>

    {/* Totales generales */}
    <td className="border border-gray-300 px-2 py-1">
      {Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(
        data.totalQuincena?.total?.libras ?? 0
      )}
    </td>
    <td className="border border-gray-300 px-2 py-1">
      {Intl.NumberFormat("es-EU", { style: "currency", currency: "EUR" }).format(
        data.totalQuincena?.total?.euros ?? 0
      )}
    </td>
    <td className="border border-gray-300 px-2 py-1">
      {Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
        data.totalQuincena?.total?.dolares ?? 0
      )}
    </td>
    <td className="border border-gray-300 px-2 py-1">
      {Intl.NumberFormat("es-ES", { style: "currency", currency: "COP" }).format(
        data.totalQuincena?.total?.pesos ?? 0
      )}
    </td>
  </tr>
</tfoot>
      </table>
    </div>
  );
};
