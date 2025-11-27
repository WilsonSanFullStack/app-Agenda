const path = require("path");

const { getDb } = require(path.join(__dirname, "processors", "getDB.cjs"));
const { procesarQuincena } = require(path.join(__dirname, "processors", "index.cjs"));

const getDataQ = async (data) => {
  // console.log("data id quincena", data);
  try {
    const { success, quincena, aranceles, paginas } = await getDb(data.id);
    if (!success) {
      return {
        success: false,
        message: "Error al obtener la quincena",
      };
    }

    const { Monedas, cerrado } = quincena;
    const { dolar, euro, gbp, porcentaje } = aranceles;
     // Obtener AMBAS monedas (estadísticas y pago)
    const estadisticas = Monedas.find((e) => e.pago === false) || { dolar: 0, euro: 0, gbp: 0, pago: false };
    const pago = Monedas.find((e) => e.pago === true) || { dolar: 0, euro: 0, gbp: 0, pago: true };
    // Ajustar monedas de pago (restar aranceles)
    const pagoAjustado = {
      dolar: parseFloat(pago.dolar - dolar) || 0,
      euro: parseFloat(pago.euro - euro) || 0,
      gbp: parseFloat(pago.gbp - gbp) || 0
    };
    // Determinar qué moneda usar para los cálculos
    const isPago = data.pago || cerrado;
    const monedaCalculos = isPago ? pagoAjustado : estadisticas;

    const tasas = {
      porcentaje,
      usd: monedaCalculos.dolar,
      euro: monedaCalculos.euro,
      gbp: monedaCalculos.gbp
    };

    // Procesar quincena completa - enviar AMBAS monedas
    const resultado = procesarQuincena(
      quincena, 
      paginas, 
      tasas, 
      data.pago, 
      cerrado,
      {
        estadisticas: estadisticas,
        pago: pagoAjustado
      }
    );

      // console.log("resultado in get", resultado);
      
return resultado
  } catch (error) {
    console.error("❌ Error en getDataQ:", error);
    return {
      success: false,
      message: "Error al obtener las quincena",
      error: error,
    };
  }
};

module.exports = { getDataQ };