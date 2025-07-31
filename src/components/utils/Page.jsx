import React, { useState } from "react";

export const Page = () => {
  const [page, setPage] = useState({
    name: '',
    coins: false,
    moneda: '',
    mensula: false,
    valor: 0,
    tope: 0,
  });


  const handleMoneda = (e)=>{
    setPage({...page,
      moneda: e.target.value
    })
  }
  return (
    <div className="m-2 p-2 text-center pt-12 ">
      <h1 className="m-2 text-2xl uppercase">registro de paginas</h1>
      <form action="" className="flex justify-center items-center">
        <section className="w-fit bg-slate-800 rounded-2xl p-2">
          <div className="m-1 border-2 border-slate-500 rounded-md" >
            <label className="m-1" htmlFor="name">name</label>
            <input className="m-1 bg-slate-950 rounded-md text-center" type="text" id="name" />
          </div>
          <div className="m-1 border-2 border-slate-500 rounded-md" >
            <label className="m-1" htmlFor="coins">coins</label>
            <input className="m-1 bg-slate-950 rounded-md text-center" type="checkbox" id="coins" />
          </div>
          <div className="m-1 border-2 border-slate-500 rounded-md grid grid-cols-1" >
            <label className="m-1" htmlFor="moneda">moneda</label>
            <select name="moneda" id="moneda" value={page.moneda} onChange={handleMoneda} className="bg-slate-950 m-1 rounded-md p-1">
              <option value="" hidden className="m-0.5">Seleecione una Moneda</option>
              <option value="dolar" className="m-0.5">Dolar</option>
              <option value="euro" className="m-0.5">Euro</option>
              <option value="libra esterlina" className="m-0.5">Libra Esterlina</option>
            </select>
          </div>
          <div className="m-1 border-2 border-slate-500 rounded-md" >
            <label className="m-1" htmlFor="mensual">mensula</label>
            <input className="m-1 bg-slate-950 rounded-md text-center" type="checkbox" id="mensual" />
          </div>
          <div className="m-1 border-2 border-slate-500 rounded-md" >
            <label className="m-1" htmlFor="valor">valor</label>
            <input onWheel={(e) => e.target.blur()} className="m-1 bg-slate-950 rounded-md text-center no-spin" type="number" id="valor" />
          </div>
          <div className="m-1 border-2 border-slate-500 rounded-md" >
            <label className="m-1" htmlFor="tope">tope</label>
            <input onWheel={(e) => e.target.blur()} className="m-1 bg-slate-950 rounded-md text-center no-spin" type="number" id="tope" />
          </div>
        </section>
      </form>
    </div>
  );
};
