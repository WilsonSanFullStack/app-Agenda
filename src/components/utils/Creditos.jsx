import React, { useEffect, useState } from "react";

const getAllQuincena = async () => {
  try {
    const res = await window.Electron.getQuincena();
    return res;
  } catch (error) {
    console.log(error);
  }
};
const getQuincenaById = async (id) => {
  try {
    const res = await window.Electron.getQuincenaById(id);
    return res;
  } catch (error) {
    console.log(error);
  }
};
export const Creditos = () => {
  const [paginas, setPaginas] = useState({
    name: "",
    id: "",
    coins: false,
    moneda: "",
    mensual: false,
    valor: 0,
    tope: 0,
  });
  const [q, setQ] = useState([]);
  const [quincena, setQuincena] = useState({});
  const [d, setD] = useState([]);
  const [day, setDay] = useState({})
  const pagina = [
    {
      name: "adultwork",
      id: "1",
      coins: false,
      moneda: "libras esterlinas",
      mensual: false,
      valor: 1,
      tope: 0,
    },
    {
      name: "sender",
      id: "2",
      coins: true,
      moneda: "euros",
      mensual: true,
      valor: 0.11,
      tope: 0,
    },
    {
      name: "dirty",
      id: "3",
      coins: false,
      moneda: "dolares",
      mensual: true,
      valor: null,
      tope: 50,
    },
    {
      name: "vx",
      id: "4",
      coins: false,
      moneda: "euros",
      mensual: true,
      valor: 1,
      tope: 0,
    },
    {
      name: "7live",
      id: "5",
      coins: false,
      moneda: "euros",
      mensual: true,
      valor: 1,
      tope: 0,
    },
  ];
  useEffect(() => {
    const quincenas = async () => {
      const quincenas = await getAllQuincena();
      setQ(quincenas);
    };
    quincenas()
  }, []);
  useEffect(()=>{
    if (quincena) {
      const id = quincena.id
      const dias = async () => {
        const quincenaId = await getQuincenaById(id)
        setD(quincenaId)
      }
      dias()
    }
  },[quincena])

  const handlePaginas = (e) => {
    const p = pagina.find((x) => x.name === e.target.value);
    if (p) {
      setPaginas(p);
    }
  };
  const handleQuincena = (e) => {
    const quincena = q.find((x) => x.name === e.target.value);
    if (quincena) {
      setQuincena(quincena);
    }
  };
  const handleDay = (e) => {
    const day = d.dias.find((x)=> x.name === e.target.value)
    if (day) {
      setDay(day)
    }
  }
  console.log("paginas", paginas);
  console.log("quincena", quincena);
  console.log("quincenaId", d);
  console.log("day", day);

  return (
    <div className="text-center">
      <h1 className="text-4xl uppercase m-2 mb-6">registro de creditos</h1>
      <section>
        <select value={quincena.name} onChange={handleQuincena} className="bg-slate-950 m-1 rounded-md p-1">
          <option value="" hidden>
            Seleccione una quincena
          </option>
          {q?.map((q) => {
            return <option key={q.id} value={q.name}>{q.name}</option>;
          })}
        </select>
      </section>

      <section>
        <select value={day.name} onChange={handleDay} className="bg-slate-950 m-1 rounded-md p-1">
          <option value="" hidden>Seleccione un dia</option>
          {d?.dias?.map((d)=> {return <option key={d.id} value={d.name}>{d.name}</option>})}
        </select>
      </section>
      <section>
        <select
          value={paginas.name}
          onChange={handlePaginas}
          className="bg-slate-950 m-1 rounded-md p-1"
        >
          <option value="" hidden>
            Seleccione una pagina
          </option>
          {pagina?.map((p) => {
            return (
              <option key={p.name} value={p.name} className="m-0.5">
                {p.name}
              </option>
            );
          })}
        </select>

        <section>
          {paginas.name && (
            <form key={paginas.id}>
              <h1>{paginas.name}</h1>
              {paginas.coins ? (
                <section>
                  <h1>digite los coins</h1>
                  <input type="number" className="bg-slate-950" />
                </section>
              ) : (
                <section>
                  <h1>
                    {`digite ${
                      paginas.moneda === "libras esterlinas" ? "las" : "los"
                    } ${paginas.moneda}`}
                  </h1>
                  <input type="number" className="bg-slate-950" />
                </section>
              )}
            </form>
          )}
        </section>
      </section>
    </div>
  );
};
