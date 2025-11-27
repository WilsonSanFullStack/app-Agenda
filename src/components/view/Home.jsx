import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { yearsFive } from "../../date";
import { Moneda } from "./Moneda";
import { YearQuincenaPagoCierreCabecera } from "../plugin/YearQuincenaPagoCierreCabecera";

export const Home = ({ setError }) => {
  const currentYear = new Date().getFullYear();
  const [reloadKey, setReloadKey] = useState(0);
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

  // 🔧 FUNCIÓN REUTILIZABLE para manejar respuestas API
  const handleApiResponse = (response) => {
    return Array.isArray(response) ? response : [];
  };

  const handlePrev = () => setYearS(yearS - 1);
  const handleNext = () => setYearS(yearS + 1);

  const getQuincenaYear = async (year) => {
    try {
      const quincenas = await window.Electron.getQuincenaYear(year);
      return handleApiResponse(quincenas); // 🔧 Siempre array
    } catch (error) {
      setError("Error al buscar las quincenas: " + error);
      return []; // 🔧 Array vacío en caso de error
    }
  };

  const getPages = async () => {
    try {
      const res = await window.Electron.getPage();
      setPage(handleApiResponse(res)); // 🔧 Siempre array
    } catch (error) {
      setError("Error al obtener las paginas: " + error);
      setPage([]); // 🔧 Array vacío en caso de error
    }
  };

  const handleGetQ = async () => {
    const quincenas = await getQuincenaYear(yearS);
    setQ(quincenas);
  };

  useEffect(() => {
    const years = yearsFive(yearS);
    setYearFives(Array.isArray(years) ? years : []); // 🔧 Proteger yearsFive
    handleGetQ(yearS);
  }, [yearS, currentYear]);

  const getQData = async () => {
    try {
      if (pago.id !== "") {
        const res = await window.Electron.getDataQ(pago);
        // 🔧 Proteger qData - si no es objeto, usar objeto vacío
        setQData(res && typeof res === 'object' ? res : {});
      } else {
        setQData({}); // 🔧 Objeto vacío si no hay pago.id
      }
    } catch (error) {
      setError("Error al cargar la quincena." + error);
      setQData({}); // 🔧 Objeto vacío en caso de error
    }
  };

  useEffect(() => {
    getQData();
    getPages();
  }, [pago]);

  // console.log("qData", qData);

  // 🔧 PROTEGER acceso a propiedades anidadas
  const moneda = qData?.moneda || {};
  const isPago = qData?.isPago || false;

  const handlePago = () => {
    // 🔧 Verificar que moneda y moneda.pago existan
    if (moneda?.pago?.usd > 0 && moneda?.pago?.euro > 0 && moneda?.pago?.gbp > 0) {
      const y = pago.pago;
      setPago({ ...pago, pago: !y });
    } else {
      setError(
        "No se puede activar el modo pago hasta que se registren las monedas de pago USD, EURO, GBP(Libra Esterlina)."
      );
    }
  };

  const handleCierre = async (currentQ) => {
    if (pago.pago && currentQ?.id) {
      try {
        const res = await window.Electron.cerrarQ({ id: currentQ.id });
        // 🔧 Verificar que la respuesta sea válida
        if (res && res.success) {
          setError(res.message || "Quincena cerrada exitosamente");
        } else {
          setError("Error: Respuesta inválida del servidor");
        }
      } catch (error) {
        setError("Error al cerrar la quincena: " + error);
      }
    } else {
      setError("Debe estar en modo pago y tener una quincena seleccionada para poder cerrar la quincena.");
    }
  };

  const handleAbrirQ = async (currentQ) => {
    if (currentQ?.cerrado && currentQ?.id) {
      try {
        const res = await window.Electron.abrirQ({ id: currentQ.id });
        // 🔧 Verificar que la respuesta sea válida
        if (res && res.success) {
          setError(res.message || "Quincena abierta exitosamente");
          setPago({ ...pago, pago: false });
        } else {
          setError("Error: Respuesta inválida del servidor");
        }
      } catch (error) {
        setError("Error al abrir la quincena: " + error);
      }
    }
  };

  // 🔧 Función para recargar datos
  const reloadData = useCallback(() => {
    handleGetQ(yearS);
    getQData();
    setReloadKey((prev) => prev + 1);
  }, [yearS, pago.id]);

  useEffect(() => {
    // 🔹 Handlers para los eventos
    const handleQuincenaCerrada = (event, data) => {
      setError("🔄 Quincena Cerrada, recargando datos...");
      reloadData();
    };

    const handleQuincenaAbierta = (event, data) => {
      setError("🔄 Quincena Abierta, recargando datos...");
      reloadData();
    };

    // 🔹 Registrar listeners
    if (window.Electron?.onCerrarQ) {
      window.Electron.onCerrarQ(handleQuincenaCerrada);
    }
    if (window.Electron?.onAbrirQ) {
      window.Electron.onAbrirQ(handleQuincenaAbierta);
    }

    // 🔹 Limpiar listeners al desmontar
    return () => {
      if (window.Electron?.removeCerrarQListener) {
        window.Electron.removeCerrarQListener(handleQuincenaCerrada);
      }
      if (window.Electron?.removeAbrirQListener) {
        window.Electron.removeAbrirQListener(handleQuincenaAbierta);
      }
    };
  }, [reloadData, setError]);

  // También recarga cuando cambia el año o el pago
  useEffect(() => {
    reloadData();
  }, [yearS, pago.id, reloadData]);
  return (
    <div key={reloadKey} className="min-h-screen pt-12 bg-slate-900">
      {/* Cabecera compacta */}
      <YearQuincenaPagoCierreCabecera
        key={reloadKey}
        yearS={yearS}
        setYearS={setYearS}
        yearFives={yearFives}
        handlePrev={handlePrev}
        handleNext={handleNext}
        pago={pago}
        setPago={setPago}
        handlePago={handlePago}
        q={q}
        quincena={quincena}
        setQuincena={setQuincena}
        handleCierre={handleCierre}
        handleAbrirQ={handleAbrirQ}
        // disabled={loading}
      />

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
                {page?.find(
                  (pag) =>
                    pag.name === qData?.promedios?.mejorPageCreditos?.name
                )?.moneda === "USD"
                  ? Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(qData.promedios.mejorPageCreditos.creditos)
                  : page?.find(
                      (pag) =>
                        pag.name === qData?.promedios?.mejorPageCreditos?.name
                    )?.moneda === "EURO"
                  ? Intl.NumberFormat("es-EU", {
                      style: "currency",
                      currency: "EUR",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(qData?.promedios?.mejorPageCreditos?.creditos)
                  : page?.find(
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
                    }).format(qData.promedios.mejorDia.creditos.cop)}
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
          {qData?.dias?.map((dia) => (
            <motion.div
              key={dia?.name}
              className="bg-slate-800 rounded-xl p-1 shadow-md border border-slate-700"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Encabezado del día */}
              <h2 className="text-sm font-bold text-center text-amber-300 mb-2">
                {dia.name}
              </h2>
              {/* totales de los dias */}
              <div className="grid grid-cols-3 gap-1 text-[11px] text-slate-300 bg-slate-900 rounded-lg p-2 mb-2">
                {/* Coins */}
                        {dia.totalesDia.coins > 0 && (
                          <span>Coins: {dia.totalesDia.coins}</span>
                        )}
                {/* USD */}
                        {dia.totalesDia.usd > 0 && (
                          <span>
                            USD:{" "}
                            {Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                              maximumFractionDigits: 2,
                            }).format(dia.totalesDia.usd)}
                          </span>
                        )}
                        {/* EURO */}
                        {dia.totalesDia.euro > 0 && (
                          <span>
                            EUR:{" "}
                            {Intl.NumberFormat("es-EU", {
                              style: "currency",
                              currency: "EUR",
                              maximumFractionDigits: 2,
                            }).format(dia.totalesDia.euro)}
                          </span>
                        )}
                        {/* GBP */}
                        {dia.totalesDia.gbp > 0 && (
                          <span>
                            GBP:{" "}
                            {Intl.NumberFormat("en-GB", {
                              style: "currency",
                              currency: "GBP",
                              maximumFractionDigits: 2,
                            }).format(dia.totalesDia.gbp)}
                          </span>
                        )}
                        {/* Pesos */}
                        {dia.totalesDia.cop > 0 && (
                            <span>
                              Ganancia:{" "}
                              {Intl.NumberFormat("es-CO", {
                                style: "currency",
                                currency: "COP",
                                maximumFractionDigits: 2,
                              }).format(dia.totalesDia.cop)}
                            </span>
                          )}
                        {/* adelantos */}
                        {dia.totalesDia.adelantos > 0 && (
                            <span>
                              Prestamos:{" "}
                              {Intl.NumberFormat("es-CO", {
                                style: "currency",
                                currency: "COP",
                                maximumFractionDigits: 2,
                              }).format(dia.totalesDia.adelantos)}
                            </span>
                          )}
                      </div>

              {/* Recorremos las páginas */}
              <div className="space-y-2">
                {page?.map((pag) => {
                  const pagina = dia[pag.name];
                  if (!pagina) return null;

                  return (
                    <div key={pag.id} className="bg-slate-700 rounded-lg p-2">
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
                              maximumFractionDigits: 2,
                            }).format(pagina.usdTotal)}
                          </span>
                        )}
                        {pagina.usdDia > 0 && (
                          <span>
                            USD día:{" "}
                            {Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                              maximumFractionDigits: 2,
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
                              maximumFractionDigits: 2,
                            }).format(pagina.euroTotal)}
                          </span>
                        )}
                        {pagina.euroDia > 0 && (
                          <span>
                            EUR día:{" "}
                            {Intl.NumberFormat("es-EU", {
                              style: "currency",
                              currency: "EUR",
                              maximumFractionDigits: 2,
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
                              maximumFractionDigits: 2,
                            }).format(pagina.gbp)}
                          </span>
                        )}
                        {pagina.gbpParcial > 0 && (
                          <span>
                            GBP Parcial:{" "}
                            {Intl.NumberFormat("en-GB", {
                              style: "currency",
                              currency: "GBP",
                              maximumFractionDigits: 2,
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
                                maximumFractionDigits: 2,
                              }).format(pagina.pesosTotal)}
                            </span>
                          )}
                        {pagina.pesosDia > 0 && (
                          <span>
                            COP día:{" "}
                            {Intl.NumberFormat("es-CO", {
                              style: "currency",
                              currency: "COP",
                              maximumFractionDigits: 2,
                            }).format(pagina.pesosDia)}
                          </span>
                        )}
                        {pagina.pesosParcial > 0 && (
                          <span>
                            COP Parcial:{" "}
                            {Intl.NumberFormat("es-CO", {
                              style: "currency",
                              currency: "COP",
                              maximumFractionDigits: 2,
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
                              maximumFractionDigits: 2,
                            }).format(pagina.adelantosTotal)}
                          </span>
                        )}
                        {pagina.adelantosDia > 0 && (
                          <span>
                            Préstamos día:{" "}
                            {Intl.NumberFormat("es-CO", {
                              style: "currency",
                              currency: "COP",
                              maximumFractionDigits: 2,
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
                    maximumFractionDigits: 2,
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
                    maximumFractionDigits: 2,
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
                    maximumFractionDigits: 2,
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
                    maximumFractionDigits: 2,
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
                    maximumFractionDigits: 2,
                  }).format(qData.totales.adelantos)}
                </p>
              </div>
            )}
            {/* intereses */}
            {qData?.interes?.interes > 0 && (
              <div className="bg-slate-800 p-2 rounded-lg border border-slate-700 text-center">
                <p className="text-slate-400">INTERES 10%</p>
                <p className="font-bold text-red-300">
                  {Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                    maximumFractionDigits: 2,
                  }).format(qData?.interes?.interes)}
                </p>
              </div>
            )}
            {/* rojo quincena anterior */}
            {qData?.interes?.rojoAnterior < 0 && (
              <div className="bg-slate-800 p-2 rounded-lg border border-slate-700 text-center">
                <p className="text-slate-400">DEUDA</p>
                <p className="font-bold text-red-300">
                  {Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                    maximumFractionDigits: 2,
                  }).format(qData?.interes?.rojoAnterior)}
                </p>
              </div>
            )}
            {/* rojo quincena anterior */}
            {qData?.interes?.rojoConInteres < 0 && (
              <div className="bg-slate-800 p-2 rounded-lg border border-slate-700 text-center">
                <p className="text-slate-400">DEUDA + INTERES</p>
                <p className="font-bold text-red-300">
                  {Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                    maximumFractionDigits: 2,
                  }).format(qData?.interes?.rojoConInteres)}
                </p>
              </div>
            )}

            {/* rojo */}
            {qData.totales.rojo && (
              <div className="bg-slate-800 p-2 rounded-lg border border-slate-700 text-center">
                <p className="text-slate-400">
                  {qData.totales.rojo > 0 ? "TIENES" : "DEBE"}
                </p>
                <p
                  className={`font-bold ${
                    qData.totales.rojo > 0 ? "text-green-300" : "text-red-500"
                  }`}
                >
                  {Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                    maximumFractionDigits: 2,
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
