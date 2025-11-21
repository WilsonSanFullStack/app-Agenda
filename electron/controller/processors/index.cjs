const { limpiarAdultwork } = require("./cleaners.cjs");
const { MONEDAS } = require("./constants.cjs");
const {
  aplicarDescuento,
  procesarPaginaMensual,
  procesarCoinsMensual,
} = require("./handlers.cjs");
const {
  parseFecha,
  getAnteriorPorPagina,
  crearDiaFormateado,
} = require("./Helpers.cjs");

//se procesa la quincena completa trayendo los helpers handlers y cleaners
const procesarQuincena = (quincena, paginas, tasas ) => {
  const { dias, name, cierre = null} = quincena;
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
      df = procesarCoinsMensual(df, diaConDescuento, pag, anterior, cierre, name);
    }

    // Procesar por moneda
     df[dia.page] = procesarPaginaMensual(
      df, 
      diaConDescuento, 
      pag, 
      anterior, 
      porcentaje, 
      { usd, euro, gbp },
      cierre,
      name,
    );

    // Procesar topes
    if (pag.tope > 0) {
      df[dia.page].mostrar = dia.mostrar;
    }
  }

  return limpiarAdultwork(qf);
};

module.exports = { procesarQuincena };
