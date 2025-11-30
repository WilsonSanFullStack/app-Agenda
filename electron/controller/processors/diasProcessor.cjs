const path = require("path");

// Importar handlers
const {
  aplicarDescuento,
  procesarCoinsMensual,
  procesarPaginaMensual,
} = require(path.join(__dirname, "handlers.cjs"));

// Importar helpers
const { getAnteriorPorPagina, parseFecha } = require(path.join(__dirname, "helpers.cjs"));

const procesarDias = (dias, paginas, tasas, nombreQuincena, cierre = null) => {
  //ordenar dias
  const diasOrdenados = [...dias].sort(
    (a, b) => parseFecha(a?.name) - parseFecha(b?.name)
  );

  //? qf = quincena formateada
  const qf = [];

  for (const dia of diasOrdenados) {
    //Buscar o crear dia formateado
    //? df= dia formateado
    let df = qf.find((d) => d.name === dia.name) || {
      name: dia.name,
      worked: false,
    };
    if (!qf.includes(df)) qf.push(df);

    //actualizar worked
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

    //procesar coins
    if (pag.coins) {
      df = procesarCoinsMensual(
        df,
        diaConDescuento,
        pag,
        anterior,
        cierre,
        nombreQuincena
      );
    }

    // procesar por moneda
    df[dia.page] = procesarPaginaMensual(
      df,
      diaConDescuento,
      pag,
      anterior,
      tasas.porcentaje,
      tasas,
      cierre,
      nombreQuincena
    );

    //procesar topes
    if (pag.tope > 0) {
      df[dia.page].mostrar = dia.mostrar;
    }
  }
  return qf;
};

module.exports = { procesarDias };
