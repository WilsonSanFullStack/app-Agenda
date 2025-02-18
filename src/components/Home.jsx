import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const Home = () => {
  const [fecha, setfecha] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
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
  const data = [
    { name: "adulwork", creditos: 99.99, pesos: 10999999, coins: 0 },
    { name: "dirty", creditos: 199.99, pesos: 20999999, coins: 0 },
    { name: "vxmodel", creditos: 299.99, pesos: 30999999, coins: 0 },
    { name: "7live", creditos: 399.99, pesos: 40999999, coins: 0 },
    { name: "sender", creditos: 499.99, pesos: 50999999, coins: 9999 },
    { name: "prestamos", pesos: 60999999, coins: 0, creditos: 0 },
  ];
  const total = {
    name: "TOTAL",
    coins: data.reduce((x, z) => x + z?.coins, 0),
    creditos: data.reduce((x, z) => x + z?.creditos, 0),
    pesos: data.reduce((x, z) => x + z?.pesos, 0),
  };
  console.log(total);
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
      <section></section>
      {fecha.day > 15 ? (
        <div className="grid grid-cols-7 w-fit border-2 border-slate-400">
          {quincenas.segundaQuincena.map((dia) => {
            return (
              <div
                key={dia}
                className="text-xs w-64 h-64 px-0.5 py-0.5 border-2 m-0.5 border-purple-400 hover:border-emerald-500"
              >
                <h1 className="text-9xl absolute m-11 opacity-40 text-emerald-600">
                  {dia}
                </h1>
                <table class="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr class="bg-emerald-500">
                      <th class="border border-gray-300 px-0.5 py-0.5">
                        Nombre
                      </th>
                      <th class="border border-gray-300 px-0.5 py-0.5">
                        Coins
                      </th>
                      <th class="border border-gray-300 px-0.5 py-0.5">
                        Créditos
                      </th>
                      <th class="border border-gray-300 px-0.5 py-0.5">
                        Pesos
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((x) => {
                      return (
                        <tr>
                          <td class="border border-gray-300 px-0.5 py-0.5">
                            {x?.name}
                          </td>
                          <td class="border border-gray-300 px-0.5 py-0.5">
                            {Intl.NumberFormat("es-CO", {
                              style: "currency",
                              currency: "COP",
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }).format(x?.coins) | "-"}
                          </td>
                          <td class="border border-gray-300 px-0.5 py-0.5">
                            {Intl.NumberFormat("es-CO", {
                              style: "currency",
                              currency: "COP",
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }).format(x?.creditos)}
                          </td>
                          <td class="border border-gray-300 px-0.5 py-0.5">
                            {Intl.NumberFormat("es-CO", {
                              style: "currency",
                              currency: "COP",
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }).format(x?.pesos)}
                          </td>
                        </tr>
                      );
                    })}
                    {/* <tr>
                      <td class="border border-gray-300 px-0.5 py-0.5">
                        adulwork
                      </td>
                      <td class="border border-gray-300 px-0.5 py-0.5">-</td>
                      <td class="border border-gray-300 px-0.5 py-0.5">
                        99.99
                      </td>
                      <td class="border border-gray-300 px-0.5 py-0.5">
                        $ 10.999.999
                      </td>
                    </tr> */}
                    {/* <tr>
                      <td class="border border-gray-300 px-0.5 py-0.5">
                        dirty
                      </td>
                      <td class="border border-gray-300 px-0.5 py-0.5">-</td>
                      <td class="border border-gray-300 px-0.5 py-0.5">
                        99.99
                      </td>
                      <td class="border border-gray-300 px-0.5 py-0.5">
                        $ 10.999.999
                      </td>
                    </tr> */}
                    {/* <tr>
                      <td class="border border-gray-300 px-0.5 py-0.5">
                        vxmodel
                      </td>
                      <td class="border border-gray-300 px-0.5 py-0.5">-</td>
                      <td class="border border-gray-300 px-0.5 py-0.5">
                        99.99
                      </td>
                      <td class="border border-gray-300 px-0.5 py-0.5">
                        $ 10.999.999
                      </td>
                    </tr> */}
                    {/* <tr>
                      <td class="border border-gray-300 px-0.5 py-0.5">
                        7live
                      </td>
                      <td class="border border-gray-300 px-0.5 py-0.5">-</td>
                      <td class="border border-gray-300 px-0.5 py-0.5">
                        99.99
                      </td>
                      <td class="border border-gray-300 px-0.5 py-0.5">
                        $ 10.999.999
                      </td>
                    </tr> */}
                    {/* <tr>
                      <td class="border border-gray-300 px-0.5 py-0.5">
                        sender
                      </td>
                      <td class="border border-gray-300 px-0.5 py-0.5">9999</td>
                      <td class="border border-gray-300 px-0.5 py-0.5">
                        99.99
                      </td>
                      <td class="border border-gray-300 px-0.5 py-0.5">
                        $ 10.999.999
                      </td>
                    </tr> */}
                    {/* <tr>
                      <td class="border border-gray-300 px-0.5 py-0.5">
                        prestamos
                      </td>
                      <td class="border border-gray-300 px-0.5 py-0.5">-</td>
                      <td class="border border-gray-300 px-0.5 py-0.5">
                        -
                      </td>
                      <td class="border border-gray-300 px-0.5 py-0.5">
                        $ 10.999.999
                      </td>
                    </tr> */}
                    <tr>
                      <td class="border border-gray-300 px-0.5 py-0.5">
                        TOTAL
                      </td>
                      <td class="border border-gray-300 px-0.5 py-0.5">
                        {total.coins}
                      </td>
                      <td class="border border-gray-300 px-0.5 py-0.5">
                        {total.creditos}
                      </td>
                      <td class="border border-gray-300 px-0.5 py-0.5">
                        {Intl.NumberFormat("es-CO", {
                          style: "currency",
                          currency: "COP",
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(total.pesos)}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* <section className="grid grid-cols-2">
                  <div>
                    <h1>adulwork</h1>
                    <section className="border-2 w-36">
                      <div className="grid grid-cols-2">
                        <h1 className="text-right w-fit">creditos:</h1>{" "}
                        <h1 className="text-left mx-1 w-24">99.99</h1>
                      </div>
                      <div className="grid grid-cols-2">
                        <h1 className="text-right w-fit">pesos</h1>
                        <h1 className="text-left w-24">$ 10.999.999</h1>
                      </div>
                    </section>
                  </div>

                  <div>
                    <h1>dirty</h1>
                    <section className="border-2 w-36">
                      <div className="grid grid-cols-2">
                        <h1 className="text-right w-fit">creditos:</h1>{" "}
                        <h1 className="text-left mx-1 w-24">99.99</h1>
                      </div>
                      <div className="grid grid-cols-2">
                        <h1 className="text-right w-fit">pesos</h1>
                        <h1 className="text-left w-24">$ 10.999.999</h1>
                      </div>
                    </section>
                  </div>

                  <div>
                    <h1>vxmodel</h1>
                    <section className="border-2 w-36">
                      <div className="grid grid-cols-2">
                        <h1 className="text-right w-fit">creditos:</h1>{" "}
                        <h1 className="text-left mx-1 w-24">99.99</h1>
                      </div>
                      <div className="grid grid-cols-2">
                        <h1 className="text-right w-fit">pesos</h1>
                        <h1 className="text-left w-24">$ 10.999.999</h1>
                      </div>
                    </section>
                  </div>

                  <div>
                    <h1>7live</h1>
                    <section className="border-2 w-36">
                      <div className="grid grid-cols-2">
                        <h1 className="text-right w-fit">creditos:</h1>{" "}
                        <h1 className="text-left mx-1 w-24">99.99</h1>
                      </div>
                      <div className="grid grid-cols-2">
                        <h1 className="text-right w-fit">pesos</h1>
                        <h1 className="text-left w-24">$ 10.999.999</h1>
                      </div>
                    </section>
                  </div>

                  <div>
                    <h1>sender</h1>
                    <section className="border-2 w-36">
                      <div className="grid grid-cols-2">
                        <h1 className="text-right w-fit">coins:</h1>
                        <h1 className="text-left mx-1 w-24">9999</h1>
                      </div>
                      <div className="grid grid-cols-2">
                        <h1 className="text-right w-fit">creditos:</h1>{" "}
                        <h1 className="text-left mx-1 w-24">99.99</h1>
                      </div>
                      <div className="grid grid-cols-2">
                        <h1 className="text-right w-fit">pesos</h1>
                        <h1 className="text-left w-24">$ 10.999.999</h1>
                      </div>
                    </section>
                  </div>
                </section> */}

                <div className="w-full bg-slate-600 shadow-md rounded-lg">
                  <h2 className="text-xl font-semibold text-center ">
                    Gráfico de Créditos y Pesos
                  </h2>
                  <ResponsiveContainer width="100%" height={500}>
                    <BarChart data={data}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="pesos" fill="#10B981" name="Pesos" />
                      <Bar dataKey="creditos" fill="#10b981" name="Créditos" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-7 w-96 border-2 border-slate-400">
          {quincenas.primeraQuincena.map((dia) => {
            return <div key={dia}>{dia}</div>;
          })}
        </div>
      )}
    </div>
  );
};
