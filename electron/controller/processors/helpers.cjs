const path = require("path");

const { MESES } = require(path.join(__dirname, "constants.cjs"));
//convierte una fecha en formato dd-mm-mma a objeto date
const parseFecha = (str) => {

  const [dia, mesStr, anioStr] = str?.split("-");
  return new Date(2000 + parseInt(anioStr), MESES[mesStr] || 0, parseInt(dia));
};
//obtiene el dia anterior con datos de una pagina especifica
const getAnteriorPorPagina = (qf, nombreDiaActual, pagina) => {
  //obtenermos el indice del dia actual
  const idx = qf.findIndex((d) => d.name === nombreDiaActual);
  if (idx <= 0) return null;
//buscamos el ultimo dia que tenga datos de la pagina especificada
  for (let i = idx - 1; i >= 0; i--) {
    const diaAnterior = qf[i];
    if (diaAnterior[pagina]) {
      return diaAnterior;
    }
  }
  return null;
};
//crea un objeto dia para iniciar el formateo
const crearDiaFormateado = (name, worked = false) => ({
  name,
  worked: Boolean(worked),
});
const obtenerUltimosValoresQuincenaAnterior = (cierre, paginaNombre) => {
  if (!cierre?.data?.dias || !Array.isArray(cierre?.data?.dias)) {
    return null;
  }

  const diasAnteriores = cierre?.data?.dias;
  // console.log("diasAnteriores", diasAnteriores)
  
  // Buscar el último día que tenga datos para esta página
  for (let i = diasAnteriores.length - 1; i >= 0; i--) {
    const diaAnterior = diasAnteriores[i];
    // console.log("diaAnterior", diaAnterior)
    if (diaAnterior[paginaNombre]) {
      // console.log("diaAnterior.name", diaAnterior.name)
      // console.log("diaAnterior[paginaNombre]", diaAnterior[paginaNombre])
      return {
        dia: diaAnterior.name,
        datos: diaAnterior[paginaNombre]
      };
    }
  }
  
  return null;
};
// Función para detectar si es segunda quincena
const esSegundaQuincena = (nombreQuincena) => {
  // Ejemplo: "noviembre-2-2025" sería segunda quincena
  const partes = nombreQuincena.toLowerCase().split('-');
  if (partes.length < 3) return false;
  
  const numeroQuincena = parseInt(partes[1]);
  return numeroQuincena === 2;
};
//calcular el rojo
const calcularInteresQuincenaAnterior = (quincenaActual, cierreAnterior) => {
  if (!cierreAnterior?.data?.interes?.rojoAnterior) {
    return {
      tieneInteres: false,
      rojoAnterior: 0,
      interes: 0,
      rojoTotal: 0
    };
  }

  const rojoAnterior = cierreAnterior?.data?.interes?.rojoAnterior;
  
  // Solo aplicar interés si el rojo es negativo (deuda)
  if (rojoAnterior >= 0) {
    return {
      tieneInteres: false,
      rojoAnterior: 0,
      interes: 0,
      rojoTotal: 0
    };
  }

  // Calcular 10% de interés sobre la deuda
  const interes = Math.abs(rojoAnterior) * 0.05;
  const rojoTotal = rojoAnterior - interes; // Se resta porque rojoAnterior es negativo

  return {
    tieneInteres: true,
    rojoAnterior: rojoAnterior,
    interes: interes,
    rojoTotal: rojoTotal
  };
};
module.exports = { parseFecha, getAnteriorPorPagina, crearDiaFormateado, obtenerUltimosValoresQuincenaAnterior, esSegundaQuincena, calcularInteresQuincenaAnterior };
