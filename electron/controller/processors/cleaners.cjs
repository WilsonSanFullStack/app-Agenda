const limpiarAdultwork = (data) => {
  const resultado = [...data];
  let ultimoGbpIndex = -1;
  let ultimoGbpParcialIndex = -1;
  
  // Primera pasada: identificar los últimos valores válidos
  resultado.forEach((day, index) => {
    if (!day?.adultwork) return;
    
    const { gbp, gbpParcial } = day.adultwork;
    
    if (gbp !== undefined && gbp !== 0) {
      ultimoGbpIndex = index;
    }
    
    if (gbpParcial !== undefined && gbpParcial !== 0) {
      ultimoGbpParcialIndex = index;
    }
  });
  
  // Segunda pasada: limpiar según las reglas
  resultado.forEach((day, index) => {
    if (!day?.adultwork) return;
    
    const tieneGbpParcial = day.adultwork.gbpParcial !== undefined;
    
    if (tieneGbpParcial && index !== ultimoGbpParcialIndex) {
      delete day.adultwork.gbpParcial;
      delete day.adultwork.pesosParcial;
    }
  });
  
  return resultado;
};
module.exports = { limpiarAdultwork}