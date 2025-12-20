const path = require("path");
const { MONEDAS } = require(path.join(__dirname, "constants.cjs"));
const limpiarAdultwork = (data, pago, cerrado, paginas) => {
  const pagina = paginas.find(p => p.coins === false && p.valorCoins === 0 && p.moneda === MONEDAS.GBP && p.mensual === false && p.tope === 0 && p.descuento > 0 )
  const resultado = [...data];
  if (pago === true || cerrado === true) {
    resultado.forEach(day => {
      if (day[pagina?.name]) {
        // Eliminar todas las propiedades relacionadas con parcial
        delete day[pagina?.name].gbpParcial;
        delete day[pagina?.name].gbpParcialAjustado;
        delete day[pagina?.name].pesosParcial;
        
        // Asegurar que solo queden gbp y pesos
        // (no eliminamos gbpAjustado por si acaso se necesita para cálculos)
      }
    });
    return resultado;
  }
  // console.log("resultado", resultado)
  // console.log("paginas", paginas)
  // console.log("pagina", pagina)
  let ultimoGbpIndex = -1;
  let ultimoGbpParcialIndex = -1;
  
  // Primera pasada: identificar los últimos valores válidos
  resultado.forEach((day, index) => {
    if (!day[pagina?.name]) return;
    // console.log("first")
    const { gbp, gbpParcial } = day[pagina?.name];
    // console.log("gbp", gbp, "gbpParcial", gbpParcial)
    
    if (gbp !== undefined && gbp !== 0) {
      ultimoGbpIndex = index;
      // console.log("ultimoGbpIndex", ultimoGbpIndex)
    }
    
    if (gbpParcial !== undefined && gbpParcial !== 0) {
      ultimoGbpParcialIndex = index;
      // console.log("ultimoGbpParcialIndex", ultimoGbpParcialIndex)
    }
  });
  
  // Segunda pasada: limpiar según las reglas
  resultado.forEach((day, index) => {
    if (!day[pagina?.name]) return;
    
    const tieneGbpParcial = day[pagina?.name].gbpParcial !== undefined;
    // console.log("tieneGbpParcial", tieneGbpParcial)
    // console.log("tieneGbpParcial && index !== ultimoGbpParcialIndex", tieneGbpParcial && index !== ultimoGbpParcialIndex)
    if (tieneGbpParcial && index !== ultimoGbpParcialIndex) {
      delete day[pagina?.name].gbpParcial;
      delete day[pagina?.name].pesosParcial;
    }
    if (tieneGbpParcial && ultimoGbpIndex > ultimoGbpParcialIndex) {
      delete day[pagina?.name].gbpParcial;
      delete day[pagina?.name].pesosParcial;
    }
  });
  
  return resultado;
};
module.exports = { limpiarAdultwork}