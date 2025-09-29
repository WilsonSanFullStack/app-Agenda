import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { yearsFive } from "../../date";
import { Moneda } from "./Moneda";

export const Home = ({ setError }) => {
  const currentYear = new Date().getFullYear();
  const [yearS, setYearS] = useState(currentYear);
  const [yearFives, setYearFives] = useState([]);
  const [q, setQ] = useState([]);
  const [quincena, setQuincena] = useState({});
  const [qData, setQData] = useState({});
  const [page, setPage] = useState([]);
  const [pago, setPago] = useState({
    pago: false,
    id: "",
  });

  const handlePago = () => {
    const y = pago.pago;
    setPago({ ...pago, pago: !y });
  };
  const handlePrev = () => setYearS(yearS - 1);
  const handleNext = () => setYearS(yearS + 1);

  const getQuincenaYear = async (year) => {
    try {
      const quincenas = await window.Electron.getQuincenaYear(year);
      return quincenas;
    } catch (error) {
      setError("Error al buscar las quincenas: " + error);
    }
  };
  const getPages = async () => {
    try {
      const res = await window.Electron.getPage();
      setPage(res);
    } catch (error) {
      setError("Error al obtener las paginas: " + error);
    }
  };
  const handleGetQ = async () => {
    const quincenas = await getQuincenaYear(yearS);
    setQ(quincenas);
  };

  useEffect(() => {
    const years = yearsFive(yearS);
    setYearFives(years);
    handleGetQ(yearS);
  }, [yearS, currentYear]);

  const getQData = async () => {
    try {
      if (pago.id !== "") {
        const res = await window.Electron.getDataQ(pago);
        // console.log(res);
        setQData(res);
      }
    } catch (error) {
      setError("Error al cargar la quincena." + error);
    }
  };

  useEffect(() => {
    getQData(pago);
    getPages();
  }, [pago]);
  console.log("qData", qData);

  const moneda = qData?.moneda;
  const isPago = qData?.isPago;
  // console.log(page);
  return (
    <div className="min-h-screen pt-12 bg-slate-900">
      {/* Cabecera compacta */}
      <motion.section
        className="flex flex-wrap justify-between items-center gap-4 px-4 py-3 rounded-xl shadow-md bg-slate-800 max-w-5xl mx-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {/* Año */}
        <div className="flex items-center gap-2">
          <label className="text-white text-sm">Año:</label>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handlePrev}
            className="px-2 py-1 bg-slate-700 text-white rounded hover:bg-slate-600 text-xs"
          >
            ◀
          </motion.button>
          <select
            value={yearS}
            className="px-3 py-1 rounded bg-slate-700 text-white border border-slate-600 text-sm"
            onChange={(e) => setYearS(Number(e.target.value))}
          >
            {yearFives.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleNext}
            className="px-2 py-1 bg-slate-700 text-white rounded hover:bg-slate-600 text-xs"
          >
            ▶
          </motion.button>
        </div>
        {/* estadisticas o pago */}
        <div className="flex items-center space-x-2">
          <input
            id="pago"
            className="w-5 h-5 text-emerald-500 border-gray-300 rounded focus:ring-emerald-400"
            type="checkbox"
            checked={pago.pago}
            onChange={handlePago}
          />
          <label htmlFor="pago" className="text-sm text-slate-300">
            ¿Para Pago?
          </label>
        </div>
        {/* Quincena */}
        <div className="flex items-center gap-2">
          <label className="text-white text-sm">Quincena:</label>
          <select
            className="px-3 py-1 rounded bg-slate-700 text-white border border-slate-600 text-sm"
            value={quincena.name}
            onChange={(e) => {
              const qSelected = q.find((item) => item.name === e.target.value);
              if (qSelected) setPago({ ...pago, id: qSelected.id });
            }}
          >
            <option value="" hidden>
              Seleccione
            </option>
            {q.map((quincena) => (
              <option key={quincena.id} value={quincena.name}>
                {quincena.name}
              </option>
            ))}
          </select>
        </div>
      </motion.section>

      {/* Monedas */}
      <motion.div
        className="mt-3 max-w-5xl mx-auto"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Moneda moneda={moneda} isPago={isPago} />
      </motion.div>

      {/* promedios compactos */}
      <motion.div className="bg-slate-900 rounded-xl my-2 px-3 py-2 w-full max-w-6xl mx-auto shadow">
        <h1 className="text-xl font-bold text-center text-slate-100 mb-2">
          {qData?.name}
        </h1>

        {qData?.promedios && (
          <motion.section
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs text-slate-200"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Mejor página en créditos */}
            <div className="bg-slate-800 p-2 rounded-lg border border-slate-700 text-center">
              <p className="text-slate-400">Mejor pág. créditos</p>
              <p className="font-semibold">
                {qData.promedios.mejorPageCreditos.name}
              </p>
              <p className="text-indigo-300">
                {page.find(
                  (pag) => pag.name === qData?.promedios?.mejorPageCreditos?.name
                )?.moneda === "USD"
                  ? Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(qData.promedios.mejorPageCreditos.creditos)
                  : page.find(
                      (pag) =>
                        pag.name === qData?.promedios?.mejorPageCreditos?.name
                    )?.moneda === "EURO"
                  ? Intl.NumberFormat("es-EU", {
                      style: "currency",
                      currency: "EUR",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(qData?.promedios?.mejorPageCreditos?.creditos)
                  : page.find(
                      (pag) =>
                        pag.name === qData?.promedios?.mejorPageCreditos?.name
                    )?.moneda === "GBP"
                  ? Intl.NumberFormat("en-GB", {
                      style: "currency",
                      currency: "GBP",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(qData?.promedios?.mejorPageCreditos?.creditos)
                  : null}
              </p>
            </div>

            {/* Mejor día */}
            <div className="bg-slate-800 p-1 rounded-lg border border-slate-700">
              <p className="text-slate-400 text-center">Mejor día</p>
              <p className="font-semibold text-center">
                {qData.promedios.mejorDia.name}
              </p>
              <div className="grid grid-cols-3 gap-1 mt-1">
                <p>
                  Coins:{" "}
                  <span className="font-medium">
                    {Intl.NumberFormat("es-IN").format(
                      qData.promedios.mejorDia.creditos.coins
                    )}
                  </span>
                </p>
                <p>
                  USD:{" "}
                  <span className="font-medium">
                    {Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(qData.promedios.mejorDia.creditos.usd)}
                  </span>
                </p>
                <p>
                  EUR:{" "}
                  <span className="font-medium">
                    {Intl.NumberFormat("es-EU", {
                      style: "currency",
                      currency: "EUR",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(qData.promedios.mejorDia.creditos.euro)}
                  </span>
                </p>
                <p>
                  GBP:{" "}
                  <span className="font-medium">
                    {Intl.NumberFormat("en-GB", {
                      style: "currency",
                      currency: "GBP",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(qData.promedios.mejorDia.creditos.gbp)}
                  </span>
                </p>
                <p>
                  PESOS:{" "}
                  <span className="font-medium">
                    {Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(qData.promedios.mejorDia.creditos.pesos)}
                  </span>
                </p>
                <p>
                  TOTAL:{" "}
                  <span className="font-medium">
                    {Intl.NumberFormat("es-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(qData.promedios.mejorDia.creditos.creditosTotal)}
                  </span>
                </p>
              </div>
            </div>

            {/* Mejor página en pesos */}
            <div className="bg-slate-800 p-2 rounded-lg border border-slate-700 text-center">
              <p className="text-slate-400">Mejor pág. pesos</p>
              <p className="font-semibold">
                {qData.promedios.mejorPagePesos.name}
              </p>
              <p className="text-yellow-300">
                {Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: "COP",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(qData.promedios.mejorPagePesos.pesos)}
              </p>
            </div>

            {/* Promedio quincenal */}
            <div className="bg-slate-800 p-2 rounded-lg border border-slate-700">
              <p className="text-slate-400 text-center">Promedio quincenal</p>
              <div className="grid grid-cols-3 gap-1 mt-1">
                <p>
                  Coins:{" "}
                  <span className="font-medium">
                    {Intl.NumberFormat("es-IN", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(qData.promedios.promedio.coins)}
                  </span>
                </p>
                <p>
                  USD:{" "}
                  <span className="font-medium">
                    {Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(qData.promedios.promedio.usd)}
                  </span>
                </p>
                <p>
                  EUR:{" "}
                  <span className="font-medium">
                    {Intl.NumberFormat("es-EU", {
                      style: "currency",
                      currency: "EUR",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(qData.promedios.promedio.euro)}
                  </span>
                </p>
                <p>
                  GBP:{" "}
                  <span className="font-medium">
                    {Intl.NumberFormat("en-GB", {
                      style: "currency",
                      currency: "GBP",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(qData.promedios.promedio.gbp)}
                  </span>
                </p>
                <p>
                  PESOS:{" "}
                  <span className="font-medium">
                    {Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(qData.promedios.promedio.pesos)}
                  </span>
                </p>
                <p>
                  TOTAL:{" "}
                  <span className="font-medium">
                    {Intl.NumberFormat("es-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(qData.promedios.promedio.creditos)}
                  </span>
                </p>
              </div>
            </div>
          </motion.section>
        )}
      </motion.div>

      {/* Dias como cards compactas */}
{qData?.dias && (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 pb-2">
    {qData.dias.map((dia) => (
      <motion.div
        key={dia.name}
        className="bg-slate-800 rounded-xl p-1 shadow-md border border-slate-700"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Encabezado del día */}
        <h2 className="text-sm font-bold text-center text-amber-300 mb-2">
          {dia.name}
        </h2>

        {/* Recorremos las páginas */}
        <div className="space-y-2">
          {page.map((pag) => {
            const pagina = dia[pag.name];
            if (!pagina) return null;

            return (
              <div
                key={pag.id}
                className="bg-slate-700 rounded-lg p-2"
              >
                {/* Nombre de la página */}
                <p className="text-xs font-semibold text-slate-200 mb-1">
                  {pag.name}
                </p>

                {/* Valores compactos */}
                <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-300">
                  {/* Coins */}
                  {pagina.coinsTotal > 0 && (
                    <span>Coins: {pagina.coinsTotal}</span>
                  )}
                  {pagina.coinsDia > 0 && (
                    <span>Día Coins: {pagina.coinsDia}</span>
                  )}

                  {/* USD */}
                  {pagina.usdTotal > 0 && (
                    <span>
                      USD:{" "}
                      {Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                      }).format(pagina.usdTotal)}
                    </span>
                  )}
                  {pagina.usdDia > 0 && (
                    <span>
                      USD día:{" "}
                      {Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                      }).format(pagina.usdDia)}
                    </span>
                  )}

                  {/* Euros */}
                  {pagina.euroTotal > 0 && (
                    <span>
                      EUR:{" "}
                      {Intl.NumberFormat("es-EU", {
                        style: "currency",
                        currency: "EUR",
                        maximumFractionDigits: 0,
                      }).format(pagina.euroTotal)}
                    </span>
                  )}
                  {pagina.euroDia > 0 && (
                    <span>
                      EUR día:{" "}
                      {Intl.NumberFormat("es-EU", {
                        style: "currency",
                        currency: "EUR",
                        maximumFractionDigits: 0,
                      }).format(pagina.euroDia)}
                    </span>
                  )}

                  {/* GBP */}
                  {pagina.gbp > 0 && (
                    <span>
                      GBP:{" "}
                      {Intl.NumberFormat("en-GB", {
                        style: "currency",
                        currency: "GBP",
                        maximumFractionDigits: 0,
                      }).format(pagina.gbp)}
                    </span>
                  )}
                  {pagina.gbpParcial > 0 && (
                    <span>
                      GBP Parcial:{" "}
                      {Intl.NumberFormat("en-GB", {
                        style: "currency",
                        currency: "GBP",
                        maximumFractionDigits: 0,
                      }).format(pagina.gbpParcial)}
                    </span>
                  )}

                  {/* Pesos */}
                  {pagina.pesosTotal > 0 && (
                    <span>
                      COP:{" "}
                      {Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        maximumFractionDigits: 0,
                      }).format(pagina.pesosTotal)}
                    </span>
                  )}
                  {pagina.pesosDia > 0 && (
                    <span>
                      COP día:{" "}
                      {Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        maximumFractionDigits: 0,
                      }).format(pagina.pesosDia)}
                    </span>
                  )}
                  {pagina.pesosParcial > 0 && (
                    <span>
                      COP Parcial:{" "}
                      {Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        maximumFractionDigits: 0,
                      }).format(pagina.pesosParcial)}
                    </span>
                  )}

                  {/* Prestamos */}
                  {pagina.adelantosTotal > 0 && (
                    <span>
                      Préstamos:{" "}
                      {Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        maximumFractionDigits: 0,
                      }).format(pagina.adelantosTotal)}
                    </span>
                  )}
                  {pagina.adelantosDia > 0 && (
                    <span>
                      Préstamos día:{" "}
                      {Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        maximumFractionDigits: 0,
                      }).format(pagina.adelantosDia)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    ))}
  </div>
)}


      {/* Totales compactos */}
      {qData.totales && (
        <motion.div
          className="bg-slate-900 rounded-xl px-1 pb-2 w-full max-w-6xl mx-auto shadow"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-lg font-semibold text-center text-slate-100 mb-2">
            TOTAL QUINCENA
          </h2>

          <section className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-xs text-slate-200">
            {/* coins */}
            {qData.totales.coins > 0 && (
              <div className="bg-slate-800 p-2 rounded-lg border border-slate-700 text-center">
                <p className="text-slate-400">COINS</p>
                <p className="font-bold">
                  {Intl.NumberFormat("es-IN").format(qData.totales.coins)}
                </p>
              </div>
            )}

            {/* usd */}
            {qData.totales.usd > 0 && (
              <div className="bg-slate-800 p-2 rounded-lg border border-slate-700 text-center">
                <p className="text-slate-400">USD</p>
                <p className="font-bold">
                  {Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  }).format(qData.totales.usd)}
                </p>
              </div>
            )}

            {/* euro */}
            {qData.totales.euro > 0 && (
              <div className="bg-slate-800 p-2 rounded-lg border border-slate-700 text-center">
                <p className="text-slate-400">EURO</p>
                <p className="font-bold">
                  {Intl.NumberFormat("es-EU", {
                    style: "currency",
                    currency: "EUR",
                    maximumFractionDigits: 0,
                  }).format(qData.totales.euro)}
                </p>
              </div>
            )}

            {/* gbp */}
            {qData.totales.gbp > 0 && (
              <div className="bg-slate-800 p-2 rounded-lg border border-slate-700 text-center">
                <p className="text-slate-400">GBP</p>
                <p className="font-bold">
                  {Intl.NumberFormat("en-GB", {
                    style: "currency",
                    currency: "GBP",
                    maximumFractionDigits: 0,
                  }).format(qData.totales.gbp)}
                </p>
              </div>
            )}

            {/* cop */}
            {qData.totales.cop > 0 && (
              <div className="bg-slate-800 p-2 rounded-lg border border-slate-700 text-center">
                <p className="text-slate-400">PESOS</p>
                <p className="font-bold text-yellow-300">
                  {Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                    maximumFractionDigits: 0,
                  }).format(qData.totales.cop)}
                </p>
              </div>
            )}

            {/* adelantos */}
            {qData.totales.adelantos > 0 && (
              <div className="bg-slate-800 p-2 rounded-lg border border-slate-700 text-center">
                <p className="text-slate-400">PRÉSTAMOS</p>
                <p className="font-bold text-red-300">
                  {Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                    maximumFractionDigits: 0,
                  }).format(qData.totales.adelantos)}
                </p>
              </div>
            )}

            {/* rojo */}
            {qData.totales.rojo > 0 && (
              <div className="bg-slate-800 p-2 rounded-lg border border-slate-700 text-center">
                <p className="text-slate-400">
                  {qData.totales.rojo > 0 ? "A FAVOR" : "EN CONTRA"}
                </p>
                <p
                  className={`font-bold ${
                    qData.totales.rojo > 0
                      ? "text-green-300"
                      : "text-red-500"
                  }`}
                >
                  {Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                    maximumFractionDigits: 0,
                  }).format(qData.totales.rojo)}
                </p>
              </div>
            )}

            {/* días trabajados */}
            {qData.totales.worked > 0 && (
              <div className="bg-slate-800 p-2 rounded-lg border border-slate-700 text-center">
                <p className="text-slate-400">DÍAS</p>
                <p className="font-bold">
                  {Intl.NumberFormat("es-IN").format(qData.totales.worked)}
                </p>
              </div>
            )}
          </section>
        </motion.div>
      )}
    </div>
  );
};
