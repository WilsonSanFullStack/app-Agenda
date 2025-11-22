const limpiarAdultwork = (data, pago, cerrado) => {
  const resultado = [...data];
  if (pago === true || cerrado === true) {
    resultado.forEach(day => {
      if (day?.adultwork) {
        // Eliminar todas las propiedades relacionadas con parcial
        delete day.adultwork.gbpParcial;
        delete day.adultwork.gbpParcialAjustado;
        delete day.adultwork.pesosParcial;
        
        // Asegurar que solo queden gbp y pesos
        // (no eliminamos gbpAjustado por si acaso se necesita para cálculos)
      }
    });
    return resultado;
  }
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