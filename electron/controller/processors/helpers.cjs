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
module.exports = { parseFecha, getAnteriorPorPagina, crearDiaFormateado };
