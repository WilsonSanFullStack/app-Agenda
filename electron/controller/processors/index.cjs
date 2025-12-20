const path = require("path");

const { limpiarAdultwork } = require(path.join(__dirname, "cleaners.cjs"));
const { procesarDias } = require(path.join(__dirname, "diasProcessor.cjs"));
const { formatearQuincenaCompleta } = require(path.join(__dirname, "formatearQuincenaCompleta.cjs"));


//se procesa la quincena completa trayendo los helpers handlers y cleaners
const procesarQuincena = (quincena, paginas, tasas, pago = false, cerrado = false, monedasCompletas = null) => {
  try {
    const { dias, name: nombreQuincena } = quincena;
    const { porcentaje, usd, euro, gbp } = tasas;

    //1. Procesar dias
    qf = procesarDias(dias, paginas, tasas, nombreQuincena, quincena.cierre);

    //2. limpiar adultwork
   console.log( "2. limpiar adultwork")
    const qfLimpio = limpiarAdultwork(qf, pago, cerrado, paginas)

    //formatear quincena completa con totales y promedios
    const quincenaFormateada = formatearQuincenaCompleta(
      quincena, 
      qfLimpio, 
      porcentaje, 
      pago || cerrado,
      monedasCompletas 
    );
    return quincenaFormateada;
    
  } catch (error) {
    console.error("Error en procesarQuincena:", error);
    throw error;
  }
};

module.exports = { procesarQuincena };
