import React, { useEffect, useState } from "react";

const postLive7 = async (data) => {
  try {
    const live7 = await window.Electron.addLive7(data);
    if (live7.error) {
      console.log(error);
    } else {
      console.log(live7);
    }
  } catch (error) {
    console.log(error);
  }
};
const postVx = async (data) => {
  try {
    const vx = await window.Electron.addVx(data);
    if (vx.error) {
      console.log(error);
    } else {
      console.log(vx);
    }
  } catch (error) {
    console.log(error);
  }
};
const postAdult = async (data) => {
  try {
    const adult = await window.Electron.addAdult(data);
    if (adult.error) {
      console.log(error);
    } else {
      console.log(adult);
    }
  } catch (error) {
    console.log(error);
  }
};
const postDirty = async (data) => {
  try {
    const dirty = await window.Electron.addDirty(data);
    if (dirty.error) {
      console.log(error);
    } else {
      console.log(dirty);
    }
  } catch (error) {
    console.log(error);
  }
};
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
  const [coins, setCoins] = useState(null);
  const [dirty, setDirty] = useState({
    dolar: null,
    mostrar: false,
  });
  const [vx, setVx] = useState(null);
  const [live7, setLive7] = useState(null);
  const [adult, setAdult] = useState({
    lb: null,
    corte: false,
  });

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

  const handleCoins = (e) => {
    setCoins(e.target.value);
  };
  const handleVx = (e) => {
    const vx = e.target.value;
    setVx(vx);
  };
  const handleLive7 = (e) => {
    setLive7(e.target.value);
  };
  const handleDirty = (e) => {
    setDirty({
      ...dirty,
      dolar: e.target.value,
      mostrar: e.target.value > 49.99,
    });
  };
  const handleAdultLb = (e) => {
    setAdult({ ...adult, lb: e.target.value });
  };
  const handleAdultCorte = (e) => {
    setAdult({ ...adult, corte: e.target.checked });
  };
  const handleCortes = async () => {
    switch (paginas.name) {
      case "sender":
        const p = paginas.id;
        const dia = day.id;
        const newCoin = { page: p, day: dia, coins: coins };
        await postSender(newCoin);
        setCoins(null);
        break;

      case "dirty":
        const page = paginas.id;
        const d = day.id;
        const dolares = dirty.dolar;
        const mostrar = dirty.mostrar;
        const newDirty = {
          page: page,
          day: d,
          dolares: dolares,
          mostrar: mostrar,
        };
        await postDirty(newDirty);
        setDirty({ dolar: null, mostrar: false });
        break;

      case "adultwork":
        const pa = paginas.id;
        const di = day.id;
        const lb = adult.lb;
        const corte = adult.corte;
        const newAdult = {
          page: pa,
          day: di,
          lb: lb,
          corte: corte,
        };
        await postAdult(newAdult);
        setAdult({ lb: null, corte: false });
        break;

      case "vx":
        const pag = paginas.id;
        const days = day.id;
        const euros = vx;
        const newVx = {
          page: pag,
          day: days,
          euros: euros,
        };
        await postVx(newVx);
        setVx(null);
        break;

      case "7live":
        const pages = paginas.id;
        const dias = day.id;
        const creditos = live7;
        const newLive7 = {
          page: pages,
          day: dias,
          creditos: creditos,
        };
        await postLive7(newLive7);

        setLive7(null);

        break;

      default:
        break;
    }
    setPaginas({
      name: "",
      id: "",
      coins: false,
      moneda: "",
      mensual: false,
      valor: 0,
      tope: 0,
    });
  };

  const form = {
    sender: (
      <form
        onSubmit={handleCortes}
        key={page?.find((x) => x?.name === "sender")?.id}
      >
        <div className="flex justify-center items-center">
          <h1 className="text-2xl m-2 text-center w-fit bg-slate-950 px-4 rounded-lg uppercase">
            {paginas.name}
          </h1>
        </div>
        <section id="sender">
          <label className="m-2" htmlFor="coins">
            digite los coins
          </label>
          <input
            id="coins"
            onWheel={(e) => e.target.blur()}
            type="number"
            value={coins ?? ""}
            onChange={handleCoins}
            className="bg-slate-950 no-spin"
            onKeyDown={(e) => {
              if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault(); // Bloquea flechas del teclado
              }
            }}
          />
        </section>
        <section>
          {coins > 0 ? (
            <button
              type="submit"
              className="border-2 border-slate-700 m-2 px-2 rounded-lg bg-slate-950 hover:bg-emerald-500 active:bg-sky-500 "
            >
              Cargar
            </button>
          ) : (
            <div className="m-2 px-2 text-red-500">Ingrese valor</div>
          )}
        </section>
      </form>
    ),
    adultwork: (
      <form
        onSubmit={handleCortes}
        key={page?.find((x) => x?.name === "adultwork")?.id}
      >
        <div className="flex justify-center items-center">
          <h1 className="text-2xl m-2 text-center w-fit bg-slate-950 px-4 rounded-lg uppercase">
            {paginas.name}
          </h1>
        </div>
        <section id="adultwork">
          <div>
            <label className="m-2" htmlFor="adultwork">
              Digite las Libras Esterlinas
            </label>
            <input
              id="adultwork"
              onWheel={(e) => e.target.blur()}
              value={adult.lb ?? ""}
              onChange={handleAdultLb}
              type="number"
              className="bg-slate-950 no-spin"
              onKeyDown={(e) => {
                if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                  e.preventDefault(); // Bloquea flechas del teclado
                }
              }}
            />
          </div>
          <div className="m-2">
            <label className="m-2 text-2xl" htmlFor="adult">
              Es un corte
            </label>
            <input
              id="adult"
              checked={adult.corte}
              onChange={handleAdultCorte}
              type="checkbox"
              className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 mx-6"
              onKeyDown={(e) => {
                if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                  e.preventDefault(); // Bloquea flechas del teclado
                }
              }}
            />
          </div>
        </section>
        <section>
          {adult.lb > 0 ? (
            <button
              type="submit"
              className="border-2 border-slate-700 m-2 px-2 rounded-lg bg-slate-950 hover:bg-emerald-500 active:bg-sky-500 "
            >
              Cargar
            </button>
          ) : (
            <div className="m-2 px-2 text-red-500">Ingrese valor</div>
          )}
        </section>
      </form>
    ),
    dirty: (
      <form
        onSubmit={handleCortes}
        key={page?.find((x) => x?.name === "dirty")?.id}
      >
        <div className="flex justify-center items-center">
          <h1 className="text-2xl m-2 text-center w-fit bg-slate-950 px-4 rounded-lg uppercase">
            {paginas.name}
          </h1>
        </div>
        <section id="dirty">
          <label className="m-2" htmlFor="dirty">
            Digite los Dolares
          </label>
          <input
            id="dirty"
            onWheel={(e) => e.target.blur()}
            value={dirty.dolar ?? ""}
            onChange={handleDirty}
            type="number"
            className="bg-slate-950 no-spin decoration-0"
            onKeyDown={(e) => {
              if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault(); // Bloquea flechas del teclado
              }
            }}
          />
        </section>
        <section>
          {dirty.dolar > 0 ? (
            <button
              type="submit"
              className="border-2 border-slate-700 m-2 px-2 rounded-lg bg-slate-950 hover:bg-emerald-500 active:bg-sky-500 "
            >
              Cargar
            </button>
          ) : (
            <div className="m-2 px-2 text-red-500">Ingrese valor</div>
          )}
        </section>
      </form>
    ),
    vx: (
      <form
        onSubmit={handleCortes}
        key={page?.find((x) => x?.name === "vx")?.id}
      >
        <div className="flex justify-center items-center">
          <h1 className="text-2xl m-2 text-center w-fit bg-slate-950 px-4 rounded-lg uppercase">
            {paginas.name}
          </h1>
        </div>
        <section id="vx">
          <label className="m-2" htmlFor="vx">
            Digite los Euros
          </label>
          <input
            id="vx"
            onWheel={(e) => e.target.blur()}
            value={vx ?? ""}
            onChange={handleVx}
            type="number"
            className="bg-slate-950 no-spin"
            onKeyDown={(e) => {
              if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault(); // Bloquea flechas del teclado
              }
            }}
          />
        </section>
        <section>
          {vx > 0 ? (
            <button
              type="submit"
              className="border-2 border-slate-700 m-2 px-2 rounded-lg bg-slate-950 hover:bg-emerald-500 active:bg-sky-500 "
            >
              Cargar
            </button>
          ) : (
            <div className="m-2 px-2 text-red-500">Ingrese valor</div>
          )}
        </section>
      </form>
    ),
    "7live": (
      <form
        onSubmit={handleCortes}
        key={page?.find((x) => x?.name === "7live")?.id}
      >
        <div className="flex justify-center items-center">
          <h1 className="text-2xl m-2 text-center w-fit bg-slate-950 px-4 rounded-lg uppercase">
            {paginas.name}
          </h1>
        </div>
        <section id="7live">
          <label className="m-2" htmlFor="7live">
            Digite los Euros
          </label>
          <input
            id="7live"
            onWheel={(e) => e.target.blur()}
            value={live7 ?? ""}
            onChange={handleLive7}
            type="number"
            className="bg-slate-950 no-spin"
            onKeyDown={(e) => {
              if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault(); // Bloquea flechas del teclado
              }
            }}
          />
        </section>
        <section>
          {live7 > 0 ? (
            <button
              type="submit"
              className="border-2 border-slate-700 m-2 px-2 rounded-lg bg-slate-950 hover:bg-emerald-500 active:bg-sky-500 "
            >
              Cargar
            </button>
          ) : (
            <div className="m-2 px-2 text-red-500">Ingrese valor</div>
          )}
        </section>
      </form>
    ),
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
          {d?.dias
            ?.sort((a, b) => parseInt(a.name) - parseInt(b.name))
            .map((d) => {
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
      </section>

      <section>{paginas.name && form[paginas.name]}</section>
    </div>
  );
};
