const { MONEDAS } = require("./constants.cjs");

//hadler para pocesar las paginas en usd
const procesarUSD = (df, dia, pag, anterior, porcentaje, usd) => {
  const pageData = df[dia.page] || {};

  pageData.usdTotal = dia.usd || 0;
  pageData.pesosTotal = (dia.usd || 0) * porcentaje * usd;

  if (anterior?.[dia.page]?.usdTotal !== undefined) {
    pageData.usdDia = (dia.usd || 0) - anterior[dia.page].usdTotal;
    pageData.pesosDia = pageData.usdDia * porcentaje * usd;
  }

  df[dia.page] = pageData;
  return df;
};
//handler para procesar las paginas en euros
const procesarEURO = (df, dia, pag, anterior, porcentaje, euro) => {
  const pageData = df[dia.page] || {};

  pageData.euroTotal = dia.euro || 0;
  pageData.pesosTotal = (dia.euro || 0) * porcentaje * euro;

  if (anterior?.[dia.page]?.euroTotal !== undefined) {
    pageData.euroDia = (dia.euro || 0) - anterior[dia.page].euroTotal;
    pageData.pesosDia = pageData.euroDia * porcentaje * euro;
  }

  df[dia.page] = pageData;
  return df;
};
//handler para procesar las paginas en gbp
const procesarGBP = (df, dia, pag, anterior, porcentaje, gbp) => {
  const pageData = df[dia.page] || {};

  if (dia.gbpParcial > 0) {
    pageData.gbpParcial = dia.gbpParcial || 0;
    pageData.pesosParcial = (dia.gbpParcial || 0) * porcentaje * gbp;
  }

  pageData.gbp = dia.gbp || 0;
  pageData.pesos = (dia.gbp || 0) * porcentaje * gbp;

  df[dia.page] = pageData;
  return df;
};
//handler para pocersar las paginas en cop o adelantos o prestamos
const procesarCOP = (df, dia, pag, anterior) => {
  const pageData = df[dia.page] || {};

  pageData.adelantosDia = dia.adelantos || 0;
  pageData.adelantosTotal =
    anterior?.[dia.page]?.adelantosTotal !== undefined
      ? (dia.adelantos || 0) + anterior[dia.page].adelantosTotal
      : dia.adelantos || 0;

  df[dia.page] = pageData;
  return df;
};
//aplica los porcentajes de descuento que tenga una pagina 
const aplicarDescuento = (dia, pag) => {
  if (!pag?.descuento) return dia;
  
  const descuento = parseFloat(pag.descuento) || 0;
  const moneda = pag.moneda;
  
  const nuevosDatos = { ...dia };
  
  switch(moneda) {
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
const procesarCoins = (df, dia, pag, anterior) => {
  const pageData = df[dia.page] || {};
  
  pageData.coinsTotal = dia.coins || 0;
  
  if (anterior?.[dia.page]?.coinsTotal !== undefined) {
    pageData.coinsDia = (dia.coins || 0) - anterior[dia.page].coinsTotal;
  }
  
  df[dia.page] = pageData;
  return df;
};
module.exports = {
  procesarCOP,
  procesarUSD,
  procesarEURO,
  procesarGBP,
  procesarCoins,
  aplicarDescuento,
}