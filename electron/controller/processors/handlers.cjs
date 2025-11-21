const { MONEDAS } = require("./constants.cjs");
const {
  obtenerUltimosValoresQuincenaAnterior,
  esSegundaQuincena,
} = require("./Helpers.cjs");

//handler para procesar datos con paginas mensuales
const procesarPaginaMensual = (df, dia, pag, anterior, porcentaje, tasas, cierre, nombreQuincenaActual) => {
  const { usd, euro, gbp } = tasas;
  const pageData = df[dia.page] || {};
  const moneda = pag.moneda;
  
  // Solo aplicar ajuste si es página mensual Y segunda quincena
  const ajustarQuincenaAnterior = pag.mensual === true && esSegundaQuincena(nombreQuincenaActual);
  const ultimosValoresAnteriores = ajustarQuincenaAnterior 
    ? obtenerUltimosValoresQuincenaAnterior(cierre, dia.page)
    : null;
  switch(moneda) {
    case 'USD':
      return procesarUSDMensual(pageData, dia, anterior, porcentaje, usd, ultimosValoresAnteriores);
    case 'EURO':
      return procesarEUROMensual(pageData, dia, anterior, porcentaje, euro, ultimosValoresAnteriores);
    case 'GBP':
      return procesarGBPMensual(pageData, dia, anterior, porcentaje, gbp, ultimosValoresAnteriores);
    case 'COP':
      return procesarCOPMensual(pageData, dia, anterior, ultimosValoresAnteriores);
    default:
      return pageData;
  }
};
//hadler para pocesar las paginas en usd
const procesarUSDMensual = (pageData, dia, anterior, porcentaje, usd, ultimosValores) => {
  const valorBase = dia.usd || 0;
  
  // SOLUCIÓN: Solo crear propiedades *Ajustado si hay ultimosValores
  if (ultimosValores) {
    pageData.usdTotal = valorBase;
    const valorAjustado = valorBase - (ultimosValores.datos.usdTotal || 0);
    pageData.usdQuincena = valorAjustado;
    pageData.pesosTotal = valorAjustado * porcentaje * usd;
    
    if (anterior?.[dia.page]?.usdTotal !== undefined) {
      pageData.usdDia = valorBase - anterior[dia.page].usdTotal;
      pageData.pesosDia = pageData.usdDia * porcentaje * usd;
    } else {
      // Si es el primer día de la segunda quincena
      pageData.usdDia = valorAjustado;
      pageData.pesosDia = valorAjustado * porcentaje * usd;
    }
  } else {
    // Comportamiento normal para páginas no mensuales
    pageData.usdTotal = valorBase;
    pageData.pesosTotal = valorBase * porcentaje * usd;
    
    if (anterior?.[dia.page]?.usdTotal !== undefined) {
      pageData.usdDia = valorBase - anterior[dia.page].usdTotal;
      pageData.pesosDia = pageData.usdDia * porcentaje * usd;
    }
  }

  return pageData;
};
//handler para procesar las paginas en euros
const procesarEUROMensual = (pageData, dia, anterior, porcentaje, euro, ultimosValores) => {
  const valorBase = dia.euro || 0;
  
  if (ultimosValores) {
    pageData.euroTotal = valorBase;
    const valorAjustado = valorBase - (ultimosValores.datos.euroTotal || 0);
    pageData.euroQuincena = valorAjustado;
    pageData.pesosTotal = valorAjustado * porcentaje * euro;
    
    if (anterior?.[dia.page]?.euroTotal !== undefined) {
      pageData.euroDia = valorBase - anterior[dia.page].euroTotal;
      pageData.pesosDia = pageData.euroDia * porcentaje * euro;
    } else {
      pageData.euroDia = valorAjustado;
      pageData.pesosDia = valorAjustado * porcentaje * euro;
    }
  } else {
    pageData.euroTotal = valorBase;
    pageData.pesosTotal = valorBase * porcentaje * euro;
    
    if (anterior?.[dia.page]?.euroTotal !== undefined) {
      pageData.euroDia = valorBase - anterior[dia.page].euroTotal;
      pageData.pesosDia = pageData.euroDia * porcentaje * euro;
    }
  }

  return pageData;
};
//handler para procesar las paginas en gbp
const procesarGBPMensual = (pageData, dia, anterior, porcentaje, gbp, ultimosValores) => {
  // Procesar GBP parcial
  if (dia.gbpParcial > 0) {
    const gbpParcialBase = dia.gbpParcial || 0;
    
    if (ultimosValores?.datos.gbpParcial !== undefined) {
      const gbpParcialAjustado = gbpParcialBase - ultimosValores.datos.gbpParcial;
      pageData.gbpParcialQuincena = gbpParcialAjustado;
      pageData.pesosParcial = gbpParcialAjustado * porcentaje * gbp;
    } else {
      pageData.gbpParcial = gbpParcialBase;
      pageData.pesosParcial = gbpParcialBase * porcentaje * gbp;
    }
  }

  // Procesar GBP normal
  const gbpBase = dia.gbp || 0;
  
  if (ultimosValores?.datos.gbp !== undefined) {
    const gbpAjustado = gbpBase - ultimosValores.datos.gbp;
    pageData.gbpQuincena = gbpAjustado;
    pageData.pesos = gbpAjustado * porcentaje * gbp;
  } else {
    pageData.gbp = gbpBase;
    pageData.pesos = gbpBase * porcentaje * gbp;
  }

  return pageData;
};
//handler para pocersar las paginas en cop o adelantos o prestamos
const procesarCOPMensual = (pageData, dia, anterior, ultimosValores) => {
  const adelantosBase = dia.adelantos || 0;
  
  // Para COP, el ajuste es diferente - acumulamos desde cero en segunda quincena
  if (ultimosValores) {
    pageData.adelantosDia = adelantosBase;
    pageData.adelantosTotal = adelantosBase; // Reiniciamos en segunda quincena
  } else {
    pageData.adelantosDia = adelantosBase;
    pageData.adelantosTotal = anterior?.[dia.page]?.adelantosTotal !== undefined 
      ? adelantosBase + anterior[dia.page].adelantosTotal
      : adelantosBase;
  }

  return pageData;
};
//aplica los porcentajes de descuento que tenga una pagina
const aplicarDescuento = (dia, pag) => {
  if (!pag?.descuento) return dia;

  const descuento = parseFloat(pag.descuento) || 0;
  const moneda = pag.moneda;

  const nuevosDatos = { ...dia };

  switch (moneda) {
    case MONEDAS.USD:
      nuevosDatos.usd = (nuevosDatos.usd || 0) * descuento;
      break;
    case MONEDAS.EURO:
      nuevosDatos.euro = (nuevosDatos.euro || 0) * descuento;
      break;
    case MONEDAS.GBP:
      nuevosDatos.gbp = (nuevosDatos.gbp || 0) * descuento;
      nuevosDatos.gbpParcial = (nuevosDatos.gbpParcial || 0) * descuento;
      break;
  }

  return nuevosDatos;
};
//handler para pocesar los coins de una pagina
const procesarCoinsMensual = (df, dia, pag, anterior, cierre, nombreQuincenaActual) => {
  const pageData = df[dia.page] || {};
  const ajustarQuincenaAnterior = pag.mensual && esSegundaQuincena(nombreQuincenaActual);
  const ultimosValoresAnteriores = ajustarQuincenaAnterior 
    ? obtenerUltimosValoresQuincenaAnterior(cierre, dia.page)
    : null;

  const coinsBase = dia.coins || 0;

  if (ultimosValoresAnteriores) {
    pageData.coinsTotal = coinsBase;
    const coinsAjustado = coinsBase - (ultimosValoresAnteriores.datos.coinsTotal || 0);
    pageData.coinsQuincena = coinsAjustado;
    
    if (anterior?.[dia.page]?.coinsTotal !== undefined) {
      pageData.coinsDia = coinsBase - anterior[dia.page].coinsTotal;
    } else {
      pageData.coinsDia = coinsAjustado;
    }
  } else {
    pageData.coinsTotal = coinsBase;
    
    if (anterior?.[dia.page]?.coinsTotal !== undefined) {
      pageData.coinsDia = coinsBase - anterior[dia.page].coinsTotal;
    }
  }

  return df;
};

module.exports = {
  procesarPaginaMensual,
  procesarCoinsMensual,
  aplicarDescuento,
};
