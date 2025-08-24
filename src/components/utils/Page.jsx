import React, { useState } from "react";

export const Page = ({ setError }) => {
  const [page, setPage] = useState({
    name: "",
    coins: false,
    moneda: "",
    mensual: false,
    valorCoins: 0,
    tope: 0,
    descuento: 0,
  });

  const handleMoneda = (e) => {
    setPage({ ...page, moneda: e.target.value });
  };
  const handleName = (e) => {
    setPage({ ...page, name: e.target.value });
  };
  const handleValor = (e) => {
    setPage({ ...page, valorCoins: parseFloat(e.target.value) });
  };
  const handleTope = (e) => {
    setPage({ ...page, tope: parseFloat(e.target.value) });
  };
  const handleDescuentos = (e) => {
    setPage({ ...page, descuento: parseFloat(e.target.value) });
  };
  const handleCoins = (e) => {
    setPage({ ...page, coins: e.target.checked });
  };
  const handleMensual = (e) => {
    setPage({ ...page, mensual: e.target.checked });
  };
  console.log(page);
  const createPage = async () => {
    try {
      const res = await window.Electron.addPage(page);
      if (res.error) {
        setError(error);
      } else {
        setError("Page creado correctamente");
        setPage({
          name: "",
          coins: false,
          moneda: "",
          mensual: false,
          valorCoins: 0,
          tope: 0,
          descuento: 0,
        });
      }
    } catch (error) {
      setError("Error al crear Page: " + error);
    }
  };
  return (
    <div className="m-2 p-2 text-center pt-12 ">
      <h1 className="m-2 text-2xl uppercase">registro de paginas</h1>
      <form onSubmit={createPage} className="flex justify-center items-center">
        <fieldset className="w-fit bg-slate-800 rounded-2xl p-2">
          <div className="m-1 border-2 border-slate-500 rounded-md">
            <label className="m-1">Name</label>
            <input
              className="m-1 bg-slate-950 rounded-md text-center"
              type="text"
              onChange={handleName}
              placeholder="Nombre Pagina"
            />
          </div>
          <div className="m-1 border-2 border-slate-500 rounded-md">
            <label className="m-1" htmlFor="coins">
              Coins
            </label>
            <input
              className="m-1 bg-slate-950 rounded-md text-center"
              type="checkbox"
              id="coins"
              onChange={handleCoins}
            />
          </div>
          <div className="m-1 border-2 border-slate-500 rounded-md grid grid-cols-1">
            <label className="m-1" htmlFor="moneda">
              Monedas
            </label>
            <select
              name="moneda"
              id="moneda"
              value={page.moneda}
              onChange={handleMoneda}
              className="bg-slate-950 m-1 rounded-md p-1"
            >
              <option value="" hidden className="m-0.5">
                Selecione Una Moneda
              </option>
              <option value="USD" className="m-0.5">
                Dolar
              </option>
              <option value="EURO" className="m-0.5">
                Euro
              </option>
              <option value="GBP" className="m-0.5">
                Libra Esterlina
              </option>
            </select>
          </div>
          <div className="m-1 border-2 border-slate-500 rounded-md">
            <label className="m-1" htmlFor="mensual">
              Mensual
            </label>
            <input
              className="m-1 bg-slate-950 rounded-md text-center"
              type="checkbox"
              id="mensual"
              onChange={handleMensual}
            />
          </div>
          <div className="m-1 border-2 border-slate-500 rounded-md">
            <label className="m-1" htmlFor="valor">
              Valor Del Coins
            </label>
            <input
              onWheel={(e) => e.target.blur(0)}
              className="m-1 bg-slate-950 rounded-md text-center no-spin"
              type="number"
              step="0.01" // <- permite hasta dos decimales
              min="0"
              id="valor"
              onChange={handleValor}
              placeholder="0.11"
            />
          </div>
          <div className="m-1 border-2 border-slate-500 rounded-md">
            <label className="m-1" htmlFor="tope">
              Tope
            </label>
            <input
              onWheel={(e) => e.target.blur()}
              className="m-1 bg-slate-950 rounded-md text-center no-spin"
              type="number"
              id="tope"
              onChange={handleTope}
              placeholder="50"
            />
          </div>
          <div className="m-1 border-2 border-slate-500 rounded-md">
            <label className="m-1" htmlFor="tope">
              Descuentos Pagina
            </label>
            <input
              onWheel={(e) => e.target.blur()}
              className="m-1 bg-slate-950 rounded-md text-center no-spin"
              type="number"
              id="tope"
              onChange={handleDescuentos}
              placeholder="0.60"
            />
          </div>
        </fieldset>
        <section>
          {page.name !== "" &&
          page.coins !== null &&
          page.moneda !== "" &&
          page.mensual !== null &&
          page.valorCoins >= 0 &&
          page.tope >= 0 &&
          page.descuento >= 0 ? (
            <button
              type="submit"
              className=" text-2xl  border-2 border-slate-700 m-2 p-2 rounded-lg bg-slate-950 hover:bg-emerald-500 active:bg-sky-500 "
            >
              Cargar
            </button>
          ) : null}
        </section>
      </form>
    </div>
  );
};
