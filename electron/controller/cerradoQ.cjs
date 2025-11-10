const { CerradoQ, Page, Quincena } = require("../db.cjs");
const { getDataQ } = require("./getQData.cjs");
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
    //buscamos la quincena y la formatiamos
    const q = await getDataQ(data);
    //sacamos los valores del datavalues
    const quincena = q.get({ plain: true });
    const qName = quincena.name;
    const nextQ = buscarQuincenaSiguiente(qName);
    if (!nextQ) {
      return {
        success: false,
        message: `No se pudo determinar la siguiente quincena para ${qName}`,
      };
    }
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
      name: quincena.name,
      data: quincena,
    });
    
    if (nextQuincena) {
      await nextQuincena.setQuincena(res)
    }
    console.log(res)
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

module.exports = { cerrarQ };
