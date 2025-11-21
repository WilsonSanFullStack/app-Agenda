const { MESES } = require("./constants.cjs");
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
  
  // Buscar el último día que tenga datos para esta página
  for (let i = diasAnteriores.length - 1; i >= 0; i--) {
    const diaAnterior = diasAnteriores[i];
    if (diaAnterior[paginaNombre]) {
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
module.exports = { parseFecha, getAnteriorPorPagina, crearDiaFormateado, obtenerUltimosValoresQuincenaAnterior, esSegundaQuincena };
