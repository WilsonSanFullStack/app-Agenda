const { CerradoQ, Page, Quincena } = require("../db.cjs");
const { getDataQ } = require("./getQData.cjs");
const { BrowserWindow } = require("electron");
//buscar siguiente quincena
function buscarQuincenaSiguiente(qName) {
  // Ejemplo de entrada: "octubre-1-2025"
  const [mes, num, anio] = qName.split("-");

  const meses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];

  const mesIndex = meses.indexOf(mes.toLowerCase());
  if (mesIndex === -1) return null; // mes inválido

  if (num === "1") {
    // Si es la primera quincena del mes, retorna la segunda
    return `${meses[mesIndex]}-2-${anio}`;
  }

  if (num === "2") {
    // Si es la segunda quincena, pasa al siguiente mes
    let siguienteMesIndex = mesIndex + 1;
    let siguienteAnio = Number(anio);

    // Si pasa de diciembre → enero, aumenta el año
    if (siguienteMesIndex > 11) {
      siguienteMesIndex = 0;
      siguienteAnio++;
    }

    return `${meses[siguienteMesIndex]}-1-${siguienteAnio}`;
  }

  // Si el formato no es válido
  return null;
}
const cerrarQ = async (data) => {
  try {
    // console.log("data", data);
    //buscamos la quincena y la formatiamos
    const q = await getDataQ(data);
    // console.log("q", q);
    //! //sacamos los valores del datavalues
    //! const quincena = q.get({ plain: true });
    //! console.log("quincena", quincena)
    const qName = q.name;
    // console.log("qName", qName);
    const nextQ = buscarQuincenaSiguiente(qName);
    if (!nextQ) {
      return {
        success: false,
        message: `No se pudo determinar la siguiente quincena para ${qName}`,
      };
    }
    await Quincena.update({ cerrado: true }, { where: { id: data.id } });
    const nextQuincena = await Quincena.findOne({
      where: { name: nextQ },
    });
    //revisamos si la quincena siguiente existe
    if (!nextQuincena) {
      return {
        success: false,
        message: `Debe crear la quincena ${nextQ} antes de poder cerrar la quincena ${qName}.`,
      };
    }
    // buscar si ya existe un día con el mismo name y page
    const existingQ = await CerradoQ.findOne({
      where: { name: qName },
    });
    // si existe, lo borramos
    if (existingQ) {
      await existingQ.destroy();
    }

    const res = await CerradoQ.create({
      name: q.name,
      data: q,
    });
    // console.log("res", res);
    // console.log("nextQuincena", nextQuincena);
    if (nextQuincena) {
      await nextQuincena.setCierre(res);
    }
    // 🔹 marca la actual como cerrada
    // 🔹 Enviar evento a React para actualizar la lista
    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send("quincenaCerrada");
    });
    return {
      success: true,
      message: `Quincena ${qName} cerrada correctamente.`,
      data: res,
    };
  } catch (error) {
    return {
      sucess: false,
      message: "Error al cerrar la Quincena",
      error: error,
    };
  }
};

const abrirQ = async (data) => {
  try {
    const q = await Quincena.findByPk(data.id);
    const quincena = q?.get({ plain: true });
    if (!quincena) {
      return {
        success: false,
        message: "Quincena no encontrada.",
      };
    }

    if (!quincena.cerrado) {
      return {
        success: false,
        message: "La quincena ya esta abierta.",
      };
    }
    await CerradoQ.destroy({where: { name: quincena.name}})

    await Quincena.update({ cerrado: false }, { where: { id: data.id } });
    
    // 🔹 Enviar evento a React para actualizar la lista
    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send("quincenaAbierta");
      });

    return {
      success: true,
      message: `La quincena ${quincena.name} ha sido abierta correctamente.`
    };
    
  } catch (error) {
    return {
      success: false,
      message: "Error al abrir la quincena", error
    }
  }
};

module.exports = { cerrarQ, abrirQ };
