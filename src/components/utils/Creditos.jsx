import React, { useEffect, useState } from "react";

const postSender = async (data) => {
  try {
    const sender = await window.Electron.addSender(data);
    if (sender.error) {
      console.log(error);
    } else {
      console.log(sender);
    }
  } catch (error) {
    console.log(error);
  }
};
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
const getAllPage = async () => {
  try {
    const res = await window.Electron.getPage();
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
  const [day, setDay] = useState({});
  const [page, setPage] = useState([]);
  const [coins, setCoins] = useState(0);

  useEffect(() => {
    const quincenas = async () => {
      const quincenas = await getAllQuincena();
      const pages = await getAllPage();
      setQ(quincenas);
      setPage(pages);
    };
    quincenas();
  }, []);
  useEffect(() => {
    if (quincena) {
      const id = quincena.id;
      const dias = async () => {
        const quincenaId = await getQuincenaById(id);
        setD(quincenaId);
      };
      dias();
    }
  }, [quincena]);

  const handlePaginas = (e) => {
    const p = page.find((x) => x.name === e.target.value);
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
    const day = d.dias.find((x) => x.name === e.target.value);
    if (day) {
      setDay(day);
    }
  };
  console.log("paginas", paginas);
  console.log("quincena", quincena);
  console.log("quincenaId", d);
  console.log("day", day);
  console.log("pages", page);
  console.log("paginas", paginas);
  console.log("coins", coins);
  const handleCoins = (e) => {};
  const handleCortes = async () => {
    switch (paginas.name) {
      case "sender":
        const data = { page: paginas.id, day: day.id, coins: coins };
        await postSender(data);

        break;

      default:
        break;
    }
  };
  return (
    <div className="text-center">
      <h1 className="text-4xl uppercase m-2 mb-6">registro de creditos</h1>
      <section>
        <select
          value={quincena.name}
          onChange={handleQuincena}
          className="bg-slate-950 m-1 rounded-md p-1"
        >
          <option value="" hidden>
            Seleccione una quincena
          </option>
          {q?.map((q) => {
            return (
              <option key={q.id} value={q.name}>
                {q.name}
              </option>
            );
          })}
        </select>
      </section>

      <section>
        <select
          value={day.name}
          onChange={handleDay}
          className="bg-slate-950 m-1 rounded-md p-1"
        >
          <option value="" hidden>
            Seleccione un dia
          </option>
          {d?.dias?.map((d) => {
            return (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            );
          })}
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
          {page?.map((p) => {
            return (
              <option key={p.name} value={p.name} className="m-0.5">
                {p.name}
              </option>
            );
          })}
        </select>

        <section>
          {paginas.name && (
            <form>
              <div className="flex justify-center items-center">
              <h1 className="text-2xl m-2 text-center w-fit bg-slate-950 px-4 rounded-lg uppercase">{paginas.name}</h1>
              </div>
              {paginas.name === "sender" ? (
                <section>
                  <label className="m-2" htmlFor="coins">digite los coins</label>
                  <input
                  id="coins"
                    onWheel={(e) => e.target.blur()}
                    type="number"
                    className="bg-slate-950 no-spin"
                  />
                </section>
              ) : paginas.name === "adultwork" ? (
                <section>
                  <div>
                    <label className="m-2" htmlFor="adultwork">
                      Digite las Libras Esterlinas
                    </label>
                    <input
                      id="adultwork"
                      onWheel={(e) => e.target.blur()}
                      type="number"
                      className="bg-slate-950 no-spin"
                    />
                  </div>
                  <div className="m-2">
                    <label className="m-2 text-2xl" htmlFor="adult">Es un corte</label>
                    <input id="adult" type="checkbox" className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 mx-6"/>
                  </div>
                </section>
              ) : paginas.name === "dirty" ? (
                <section>
                  <label className="m-2" htmlFor="dirty">Digite los Dolares</label>
                  <input
                  id="dirty"
                    onWheel={(e) => e.target.blur()}
                    type="number"
                    className="bg-slate-950 no-spin"
                  />
                </section>
              ) : paginas.name === "vx" ? (
                <section>
                  <label className="m-2" htmlFor="vx">Digite los Euros</label>
                  <input
                  id="vx"
                    onWheel={(e) => e.target.blur()}
                    type="number"
                    className="bg-slate-950 no-spin"
                  />
                </section>
              ) : paginas.name === "7live" ? (
                <section>
                  <label className="m-2" htmlFor="7live">Digite los Euros</label>
                  <input
                  id="7live"
                    onWheel={(e) => e.target.blur()}
                    type="number"
                    className="bg-slate-950 no-spin"
                  />
                </section>
              ) : null}
            </form>
          )}
        </section>
      </section>
    </div>
  );
};
