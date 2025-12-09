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

    // Buscar página
    const pag = paginas.find((p) => p.name === dia.page);
    if (!pag) continue;

    // Obtener día anterior
    const anterior = getAnteriorPorPagina(qf, dia.name, pag.name);

    // Inicializar página en df
    if (!df[dia.page]) df[dia.page] = {};

    // Aplicar descuentos
    const diaConDescuento = aplicarDescuento(dia, pag);

    // Verificar si hay créditos en este día
    const tieneCreditos = 
      (diaConDescuento.usd && Math.abs(diaConDescuento.usd) >= 0.01) ||
      (diaConDescuento.euro && Math.abs(diaConDescuento.euro) >= 0.01) ||
      (diaConDescuento.gbp && Math.abs(diaConDescuento.gbp) >= 0.01) ||
      (diaConDescuento.gbpParcial && Math.abs(diaConDescuento.gbpParcial) >= 0.01);
    
    if (tieneCreditos) {
      df.worked = true;
    }

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

    // 🔧 PARA PÁGINAS CON TOPE: Siemmostrar = false inicialmente
    // La decisión final se tomará después de procesar TODOS los días
    if (pag.tope > 0) {
      df[dia.page].mostrar = false;
      df[dia.page]._tieneTope = true;
      df[dia.page]._valorTope = pag.tope;
    } else {
      df[dia.page].mostrar = dia.mostrar !== false;
    }
  }
  
  // 🔧 POST-PROCESAMIENTO: Calcular TOTALES por página y decidir
  const totalesPorPagina = {};
  
  // 1. Calcular el TOTAL final de cada página (no la suma diaria)
  for (const df of qf) {
    for (const [pagina, valores] of Object.entries(df)) {
      if (pagina === "name" || pagina === "worked") continue;
      
      if (valores._tieneTope) {
        if (!totalesPorPagina[pagina]) {
          totalesPorPagina[pagina] = {
            tope: valores._valorTope,
            // 🔧 IMPORTANTE: Usar el VALOR TOTAL, no sumar los días
            total: 0,
            dias: []
          };
        }
        
        // 🔧 Obtener el VALOR TOTAL de esta página para este día
        // (el valor que ya fue procesado por procesarPaginaMensual)
        const valorTotal = 
          (valores.usdTotal || 0) +
          (valores.euroTotal || 0) +
          (valores.gbp || valores.gbpQuincena || 0) +
          (valores.gbpParcial || valores.gbpParcialQuincena || 0) +
          (valores.coinsTotal || 0);
        
        // Solo necesitamos el ÚLTIMO valor total (no sumar entre días)
        // Porque los valores ya están acumulados en *Total
        totalesPorPagina[pagina].total = Math.max(
          totalesPorPagina[pagina].total, 
          valorTotal
        );
        
        // Guardar referencia a este día para luego poder mostrar/ocultar
        totalesPorPagina[pagina].dias.push({
          dia: df.name,
          valores: valores
        });
      }
    }
  }
  
  // 2. Decidir qué mostrar basado en el TOTAL vs TOPE
  for (const [pagina, info] of Object.entries(totalesPorPagina)) {
    const topeAlcanzado = info.total >= info.tope;
    
    if (topeAlcanzado) {
      // 🔧 Si el TOTAL alcanzó o superó el tope: MOSTRAR TODOS los días
      for (const diaInfo of info.dias) {
        const df = qf.find(d => d.name === diaInfo.dia);
        if (df && df[pagina]) {
          df[pagina].mostrar = true;
        }
      }
    } else {
      // 🔧 Si el TOTAL NO alcanzó el tope: NO MOSTRAR ningún día
      for (const diaInfo of info.dias) {
        const df = qf.find(d => d.name === diaInfo.dia);
        if (df && df[pagina]) {
          df[pagina].mostrar = false;
        }
      }
    }
  }

  return qf;
};

module.exports = { procesarDias };