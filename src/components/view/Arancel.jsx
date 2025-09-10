import React, { useEffect, useState } from "react";
import { GrDocumentUpdate } from "react-icons/gr";
import { RiDeleteBinFill } from "react-icons/ri";

export const Arancel = ({ setError }) => {
  const [aranceles, setAranceles] = useState({
    id: "",
    dolar: 0,
    euro: 0,
    gbp: 0,
  });
  const getArancel = async () => {
    try {
      const res = await window.Electron.getAranceles();
      return res;
    } catch (error) {
      setError("Error al buscar los aranceles: " + error);
    }
  };
  useEffect(() => {
    const arancel = getArancel();
    setAranceles({
      ...aranceles,
      id: arancel.id,
      dolar: arancel.dolar,
      euro: arancel.euro,
      gbp: arancel.gbp,
    });
  }, []);
  const deleteArancel = async (id) => {
    try {
      const res = await window.Electron.deleteAranceles(id);
      if (res.message === "Fue eliminar el arancel") {
        setAranceles({ id: "", dolar: 0, euro: 0, gbp: 0 });
      }
    } catch (error) {
      setError("Error al eliminar el arancel: " + error);
    }
  };
  return (
    <div>
      <div>
        {/* update */}
        <section>
          <GrDocumentUpdate />
        </section>
        {/* delete  */}
        <section>
          <button onClick={() => deleteArancel(aranceles.id)}>
          <RiDeleteBinFill />
          </button>
        </section>
      </div>
      <h1>Aranceles</h1>
      {aranceles && (
        <div>
          {/* usd */}
          <section>
            <h1>Dolar: </h1>
            <p>{aranceles.dolar}</p>
          </section>
          {/* euro */}
          <section>
            <h1>Euro: </h1>
            <p>{aranceles.euro}</p>
          </section>
          {/* gbp */}
          <section>
            <h1>Libra Esterlina (GBP): </h1>
            <p>{aranceles.gbp}</p>
          </section>
        </div>
      )}
    </div>
  );
};
