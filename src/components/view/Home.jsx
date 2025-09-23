import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { yearsFive } from "../../date";
import { Moneda } from "./Moneda";
import { div } from "framer-motion/client";

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
        console.log(res);
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
  console.log(page);
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
      <motion.div className="bg-slate-800 rounded-2xl my-4 p-1 w-fit">
        <h1 className="text-2xl mb-2">{qData?.name}</h1>
        {qData?.promedios?.mejorDia && (
          <section className="text-sm border-2 border-slate-900 rounded-2xl py-1">
            <h2>promedios</h2>
            {/* mejor dia */}
            <section className="flex flex-wrap mx-2 justify-center gap-2">
              {/* mejor pagina en creditos */}
              <div className="flex flex-col justify-center items-center gap-1  border border-slate-600 rounded-2xl px-2">
                <h2>mejor pagina creditos</h2>
                <section className="flex flex-wrap justify-center gap-8 text-sm">
                  {/* nombre */}
                  <div>
                    <p>nombre:</p>
                    <p>{qData.promedios.mejorPageCreditos.name}</p>
                  </div>
                  {/* creditos */}
                  <div>
                    <p>Creditos:</p>
                    <p>{qData.promedios.mejorPageCreditos.creditos}</p>
                  </div>
                </section>
              </div>

              <div className="flex flex-wrap justify-center gap-8 border border-slate-600 rounded-2xl px-2">
                <section>
                  {/* nombre */}
                  <div className="flex flex-col-1 justify-center items-center gap-4">
                    <p>mejor dia:</p>
                    <p>{qData?.promedios?.mejorDia?.name}</p>
                  </div>
                  {/* creditos */}
                  <div className="flex flex-wrap justify-center gap-8">
                    {/* coins */}
                    <section>
                      <p>COINS:</p>
                      <p>
                        {Intl.NumberFormat("es-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(qData?.promedios?.mejorDia?.creditos.coins)}
                      </p>
                    </section>
                    {/* usd */}
                    <section>
                      <p>USD:</p>
                      <p>
                        {Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(qData?.promedios?.mejorDia?.creditos?.usd)}
                      </p>
                    </section>
                    {/* euro */}
                    <section>
                      <p>EURO:</p>
                      <p>
                        {Intl.NumberFormat("es-EU", {
                          style: "currency",
                          currency: "EUR",
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(qData?.promedios?.mejorDia?.creditos?.euro)}
                      </p>
                    </section>
                    {/* gbp */}
                    <section>
                      <p>GBP:</p>
                      <p>
                        {Intl.NumberFormat("en-GB", {
                          style: "currency",
                          currency: "GBP",
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(
                          parseFloat(qData?.promedios?.mejorDia?.creditos?.gbp)
                        )}
                      </p>
                    </section>
                    {/* pesos */}
                    <section>
                      <p>PESOS:</p>
                      <p>
                        {Intl.NumberFormat("es-CO", {
                          style: "currency",
                          currency: "COP",
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(qData?.promedios?.mejorDia?.creditos?.pesos)}
                      </p>
                    </section>
                    {/* creditos */}
                    <section>
                      <p>CREDITOS:</p>
                      <p>
                        {Intl.NumberFormat("es-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(
                          qData?.promedios?.mejorDia?.creditos?.creditosTotal
                        )}
                      </p>
                    </section>
                  </div>
                </section>
              </div>

              {/* mejro pagina en pesos */}
              <div className="flex flex-col justify-center items-center gap-1  border border-slate-600 rounded-2xl px-2">
                <h2>mejor pagina en pesos</h2>
                <section className="flex flex-wrap justify-center gap-8">
                  {/* nombre */}
                  <div>
                    <p>nombre:</p>
                    <p>{qData.promedios.mejorPagePesos.name}</p>
                  </div>
                  {/* creditos */}
                  <div>
                    <p>Creditos:</p>
                    <p>{qData.promedios.mejorPagePesos.pesos}</p>
                  </div>
                </section>
              </div>
              {/* promedios de la quincena */}
              <div className="flex flex-col justify-center items-center gap-1  border border-slate-600 rounded-2xl px-2">
                <h2>promedio quincenal</h2>
                <section>
                  {/* creditos */}
                  <div className="flex flex-wrap justify-center gap-8">
                    {/* coins */}
                    <section>
                      <p>COINS:</p>
                      <p>
                        {Intl.NumberFormat("es-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(qData?.promedios?.promedio?.coins)}
                      </p>
                    </section>
                    {/* usd */}
                    <section>
                      <p>USD:</p>
                      <p>
                        {Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(qData?.promedios?.promedio?.usd)}
                      </p>
                    </section>
                    {/* euro */}
                    <section>
                      <p>EURO:</p>
                      <p>
                        {Intl.NumberFormat("es-EU", {
                          style: "currency",
                          currency: "EUR",
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(qData?.promedios?.promedio?.euro)}
                      </p>
                    </section>
                    {/* gbp */}
                    <section>
                      <p>GBP:</p>
                      <p>
                        {Intl.NumberFormat("en-GB", {
                          style: "currency",
                          currency: "GBP",
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(parseFloat(qData?.promedios?.promedio?.gbp))}
                      </p>
                    </section>
                    {/* pesos */}
                    <section>
                      <p>PESOS:</p>
                      <p>
                        {Intl.NumberFormat("es-CO", {
                          style: "currency",
                          currency: "COP",
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(qData?.promedios?.promedio?.pesos)}
                      </p>
                    </section>
                    {/* creditos */}
                    <section>
                      <p>CREDITOS:</p>
                      <p>
                        {Intl.NumberFormat("es-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(qData?.promedios?.promedio?.creditos)}
                      </p>
                    </section>
                  </div>
                </section>
              </div>
            </section>
          </section>
        )}
      </motion.div>
      {/* dias */}
      {qData?.dias && (
        <div>
          {qData?.dias?.map((dia) => {
            return (
              <div key={dia.name} className="w-fit bg-amber-600 flex- flex-wrap justify-center items-center ">
                {/* nombre */}
                <h1>{dia.name}</h1>

                {/* rescorremos las paginas */}
                {page.map((pag) => {
                  const pagina = dia[pag.name];
                  if (!pagina) return null;
                  return (
                    <div key={pag.id} className="flex flex-wrap gap-4 w-fit bg-amber-200">
                      <section className="bg-slate-400">
                        <h2>{pag.name}</h2>
                        {/* coins */}
                        {pag.coins && (
                          <section className="flex flex-wrap justify-center items-center gap-4">
                            {/* total */}
                            {dia[pag.name].coinsTotal > 0 ? (
                              <div>
                                <h2>Total</h2>
                                <section className="flex flex-wrap gap-2 justify-center items-center">
                                  <h4>Coins:</h4>
                                  <p>
                                    {Intl.NumberFormat("es-IN", {
                                      minimumFractionDigits: 0,
                                      maximumFractionDigits: 0,
                                    }).format(dia[pag.name].coinsTotal)}
                                  </p>
                                </section>
                              </div>
                            ) : null}
                            {/* Dia */}
                            {dia[pag.name].coinsDia > 0 ? (
                              <div>
                                <h1>Dia</h1>
                                <section className="flex flex-wrap gap-2 justify-center items-center">
                                  <h4>Coins:</h4>
                                  <p>
                                    {Intl.NumberFormat("es-IN", {
                                      minimumFractionDigits: 0,
                                      maximumFractionDigits: 0,
                                    }).format(dia[pag.name]?.coinsDia)}
                                  </p>
                                </section>
                              </div>
                            ) : null}
                          </section>
                        )}
                        {/* usd */}
                        {pag.moneda === "USD" ? (
                          <div className="flex flex-wrap justify-center items-center gap-4">
                            {/* usd total */}
                            {dia[pag.name].usdTotal && (
                              <div>
                                <section className="flex flex-wrap gap-2 justify-center items-center">
                                  <h4>USD:</h4>
                                  <p>
                                    {Intl.NumberFormat("en-US", {
                                      style: "currency",
                                      currency: "USD",
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }).format(dia[pag.name].usdTotal)}
                                  </p>
                                </section>
                                {/* total pesos */}
                                <section className="flex flex-wrap gap-2 justify-center items-center">
                                  <h4>pesos:</h4>
                                  <p>
                                    {Intl.NumberFormat("es-CO", {
                                      style: "currency",
                                      currency: "COP",
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }).format(dia[pag.name].pesosTotal)}
                                  </p>
                                </section>
                              </div>
                            )}
                            {/* usd dia */}
                            {dia[pag.name].usdDia && (
                              <div>
                                <section className="flex flex-wrap gap-2 justify-center items-center">
                                  <h4>USD:</h4>
                                  <p>
                                    {Intl.NumberFormat("en-US", {
                                      style: "currency",
                                      currency: "USD",
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }).format(dia[pag.name].usdDia)}
                                  </p>
                                </section>
                                {/* total pesos */}
                                <section className="flex flex-wrap gap-2 justify-center items-center">
                                  <h4>pesos:</h4>
                                  <p>
                                    {Intl.NumberFormat("es-CO", {
                                      style: "currency",
                                      currency: "COP",
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }).format(dia[pag.name].pesosDia)}
                                  </p>
                                </section>
                              </div>
                            )}
                          </div>
                        ) : null}
                        {/* euros */}
                        {pag.moneda === "EURO" ? (
                          <div className="flex flex-wrap justify-center items-center gap-4">
                            {/* euros total */}
                            {dia[pag.name].euroTotal && (
                              <div>
                                <section className="flex flex-wrap gap-2 justify-center items-center">
                                  <h4>EURO:</h4>
                                  <p>
                                    {Intl.NumberFormat("es-EU", {
                                      style: "currency",
                                      currency: "EUR",
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }).format(dia[pag.name].euroTotal)}
                                  </p>
                                </section>
                                {/* total pesos */}
                                <section className="flex flex-wrap gap-2 justify-center items-center">
                                  <h4>pesos:</h4>
                                  <p>
                                    {Intl.NumberFormat("es-CO", {
                                      style: "currency",
                                      currency: "COP",
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }).format(dia[pag.name].pesosTotal)}
                                  </p>
                                </section>
                              </div>
                            )}
                            {/* ueros del dia */}
                            {dia[pag.name].euroDia && (
                              <div>
                                <section className="flex flex-wrap gap-2 justify-center items-center">
                                  <h4>EURO:</h4>
                                  <p>
                                    {Intl.NumberFormat("es-EU", {
                                      style: "currency",
                                      currency: "EUR",
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }).format(dia[pag.name].euroDia)}
                                  </p>
                                </section>
                                {/* total pesos */}
                                <section className="flex flex-wrap gap-2 justify-center items-center">
                                  <h4>pesos:</h4>
                                  <p>
                                    {Intl.NumberFormat("es-CO", {
                                      style: "currency",
                                      currency: "COP",
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }).format(dia[pag.name].pesosDia)}
                                  </p>
                                </section>
                              </div>
                            )}
                          </div>
                        ) : null}
                        {/* gbp  */}
                        {pag.moneda === "GBP" ? (
                          <div className="flex flex-wrap justify-center items-center gap-4">
                            {/* gbp */}
                            {dia[pag.name].gbp && (
                              <div>
                                <section className="flex flex-wrap gap-2 justify-center items-center">
                                  <h4>GBP:</h4>
                                  <p>
                                    {Intl.NumberFormat("en-GB", {
                                      style: "currency",
                                      currency: "GBP",
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }).format(dia[pag.name].gbp)}
                                  </p>
                                </section>
                                {/* total pesos */}
                                <section className="flex flex-wrap gap-2 justify-center items-center">
                                  <h4>pesos:</h4>
                                  <p>
                                    {Intl.NumberFormat("es-CO", {
                                      style: "currency",
                                      currency: "COP",
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }).format(dia[pag.name].pesos)}
                                  </p>
                                </section>
                              </div>
                            )}
                            {/* gbp parcial */}
                            {dia[pag.name].gbpParcial && (
                              <div>
                                <section className="flex flex-wrap gap-2 justify-center items-center">
                                  <h4>GBP PARCIAL:</h4>
                                  <p>
                                    {Intl.NumberFormat("en-GB", {
                                      style: "currency",
                                      currency: "GBP",
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }).format(dia[pag.name].gbpParcial)}
                                  </p>
                                </section>
                                {/* pesos parcial*/}
                                <section className="flex flex-wrap gap-2 justify-center items-center">
                                  <h4>pesos:</h4>
                                  <p>
                                    {Intl.NumberFormat("es-CO", {
                                      style: "currency",
                                      currency: "COP",
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }).format(dia[pag.name].pesosParcial)}
                                  </p>
                                </section>
                              </div>
                            )}
                          </div>
                        ) : null}
                        {/* prestamos/adelantos */}
                        {pag.moneda === "COP" ? (
                          <div className="flex flex-col justify-center items-center gap-4">
                            {/* adelantos total */}
                            {dia[pag.name].adelantosTotal && (
                              <section className="flex flex-wrap gap-2 justify-center items-center">
                                <h4>Prestamos:</h4>
                                <p>
                                  {Intl.NumberFormat("es-CO", {
                                    style: "currency",
                                    currency: "COP",
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }).format(dia[pag.name].adelantosTotal)}
                                </p>
                              </section>
                            )}
                            {/* adelantos dia */}
                            {dia[pag.name].adelantosDia && (
                              <section className="flex flex-wrap gap-2 justify-center items-center">
                                <h4>Prestamos Dia:</h4>
                                <p>
                                  {Intl.NumberFormat("es-CO", {
                                    style: "currency",
                                    currency: "COP",
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }).format(dia[pag.name].adelantosDia)}
                                </p>
                              </section>
                            )}
                          </div>
                        ) : null}

                        {/* {dia[pag.name].adelantosTotal && (
                          <div>pag.adelantosTotal</div>
                        )}
                        {dia[pag.name].adelantosDia && (
                          <div>pag.adelantosDia</div>
                        )} */}
                      </section>
                      {/* <pre>{JSON.stringify(pagina, null, 2)}</pre> */}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
