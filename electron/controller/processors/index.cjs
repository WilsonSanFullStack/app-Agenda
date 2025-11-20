const { limpiarAdultwork } = require("./cleaners.cjs");
const { MONEDAS } = require("./constants.cjs");
const {
  aplicarDescuento,
  procesarCOP,
  procesarUSD,
  procesarEURO,
  procesarCoins,
  procesarGBP,
} = require("./handlers.cjs");
const {
  parseFecha,
  getAnteriorPorPagina,
  crearDiaFormateado,
} = require("./Helpers.cjs");

//se procesa la quincena completa trayendo los helpers handlers y cleaners
const procesarQuincena = (quincena, paginas, tasas) => {
  const { dias } = quincena;
  const { porcentaje, usd, euro, gbp } = tasas;

  // Ordenar días
  const diasOrdenados = [...dias].sort(
    (a, b) => parseFecha(a?.name) - parseFecha(b?.name)
  );

  const qf = [];

  for (const dia of diasOrdenados) {
    // Encontrar o crear día formateado
    let df =
      qf.find((d) => d.name === dia.name) || crearDiaFormateado(dia.name);
    if (!qf.includes(df)) qf.push(df);

    // Actualizar worked
    if (dia.worked) df.worked = true;

    // Buscar página
    const pag = paginas.find((p) => p.name === dia.page);
    if (!pag) continue;

    // Obtener día anterior
    const anterior = getAnteriorPorPagina(qf, dia.name, pag.name);

    // Inicializar página en df
    if (!df[dia.page]) df[dia.page] = {};

    // Aplicar descuentos
    const diaConDescuento = aplicarDescuento(dia, pag);

    // Procesar coins
    if (pag.coins) {
      df = procesarCoins(df, diaConDescuento, pag, anterior);
    }

    // Procesar por moneda
    switch (pag.moneda) {
      case MONEDAS.USD:
        df = procesarUSD(df, diaConDescuento, pag, anterior, porcentaje, usd);
        break;
      case MONEDAS.EURO:
        df = procesarEURO(df, diaConDescuento, pag, anterior, porcentaje, euro);
        break;
      case MONEDAS.GBP:
        df = procesarGBP(df, diaConDescuento, pag, anterior, porcentaje, gbp);
        break;
      case MONEDAS.COP:
        df = procesarCOP(df, diaConDescuento, pag, anterior);
        break;
    }

    // Procesar topes
    if (pag.tope > 0) {
      df[dia.page].mostrar = dia.mostrar;
    }
  }

  return limpiarAdultwork(qf);
};

module.exports = { procesarQuincena };
