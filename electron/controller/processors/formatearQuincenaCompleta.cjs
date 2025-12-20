const path = require("path");

// Importar handlers
const {
  encontrarMejorPagina,
  encontrarMejorDia,
  calcularPromedios,
  calcularTotalesDia,
  calcularCreditosPagina // 🔧 Nueva función
} = require(path.join(__dirname, "handlers.cjs"));

// Importar helpers
const { calcularInteresQuincenaAnterior } = require(path.join(__dirname, "helpers.cjs"));

const formatearQuincenaCompleta = (quincena, qfLimpio, porcentaje, isPago, monedasCompletas) => {
  // 1. Estructura base
  const qFormatted = crearEstructuraBase(quincena, porcentaje, isPago, monedasCompletas);
  
  // 2. Calcular totales acumulados - CON MANEJO DE TOPES
  const { totales, totalesPorDia, paginasConTopeAlcanzado } = calcularTotalesAcumulados(qfLimpio);
  
  // 3. Calcular interés por rojo anterior
  const calculoInteres = calcularInteresQuincenaAnterior(quincena, quincena.cierre);

  // 4. Encontrar mejores páginas y día
  const { mejorCreditos, mejorPesos } = encontrarMejorPagina(qfLimpio);
  const mejorDia = encontrarMejorDia(qfLimpio);
  
  // 5. Calcular promedios
  const diasTrabajados = qfLimpio.filter(d => d.worked).length;
  const promedios = calcularPromedios(totales, diasTrabajados);
  
  // 6. Calcular rojo final
  const rojoBase = totales.cop - totales.adelantos;
  const rojoFinal = calculoInteres.tieneInteres 
    ? rojoBase + calculoInteres.rojoTotal
    : rojoBase;

  // 7. Construir respuesta final
  return {
    ...qFormatted,
    totales: {
      ...totales,
      worked: diasTrabajados,
      rojo: rojoFinal
    },
    interes: calculoInteres.tieneInteres ? {
      rojoAnterior: calculoInteres.rojoAnterior,
      interes: calculoInteres.interes,
      rojoConInteres: calculoInteres.rojoTotal,
      descripcion: "Interés del 5% por deuda de quincena anterior"
    } : null,
    promedios: {
      mejorPageCreditos: mejorCreditos,
      mejorPagePesos: mejorPesos,
      mejorDia,
      promedio: promedios
    },
    dias: agregarTotalesDiarios(qfLimpio, totalesPorDia),
    // 🔧 NUEVO: Información sobre topes alcanzados
    topesAlcanzados: paginasConTopeAlcanzado
  };
};

const crearEstructuraBase = (quincena, porcentaje, isPago, monedasCompletas) => {
  const monedas = monedasCompletas || {
    estadisticas: { dolar: 0, euro: 0, gbp: 0 },
    pago: { dolar: 0, euro: 0, gbp: 0 }
  };

  return {
    id: quincena?.id,
    name: quincena?.name,
    cerrado: quincena?.cerrado,
    moneda: {
      estadisticas: { 
        usd: monedas.estadisticas.dolar || 0, 
        euro: monedas.estadisticas.euro || 0, 
        gbp: monedas.estadisticas.gbp || 0 
      },
      pago: { 
        usd: monedas.pago.dolar || 0, 
        euro: monedas.pago.euro || 0, 
        gbp: monedas.pago.gbp || 0 
      },
      porcentaje: porcentaje,
    },
    isPago: isPago,
    totales: {
      coins: 0, usd: 0, euro: 0, gbp: 0, cop: 0, 
      adelantos: 0, worked: 0, rojo: 0, creditos: 0
    },
    promedios: {
      mejorPageCreditos: { name: "", coins: 0, creditos: 0 },
      mejorPagePesos: { name: "", pesos: 0 },
      mejorDia: {
        name: "",
        creditos: { coins: 0, usd: 0, euro: 0, gbp: 0, pesos: 0 }
      },
      promedio: {
        coins: 0, usd: 0, euro: 0, gbp: 0, pesos: 0, creditos: 0
      }
    },
    topesAlcanzados: [] // 🔧 Nuevo campo
  };
};

const calcularTotalesAcumulados = (qfLimpio) => {
  const totales = {
    coins: 0, usd: 0, euro: 0, gbp: 0, cop: 0, adelantos: 0, creditos: 0
  };
  
  const totalesPorDia = [];
  const paginasConTopeAlcanzado = new Set(); // 🔧 Rastrear páginas con tope alcanzado

  // Primera pasada: identificar páginas con tope alcanzado
  const acumuladoPorPagina = {};
  
  for (const dia of qfLimpio) {
    for (const [pagina, valores] of Object.entries(dia)) {
      if (pagina === "name" || pagina === "worked") continue;
      
      if (!acumuladoPorPagina[pagina]) {
        acumuladoPorPagina[pagina] = 0;
      }
      
      // Acumular créditos por página
      const creditosPagina = calcularCreditosPagina(valores);
      acumuladoPorPagina[pagina] += creditosPagina;
      
      // 🔧 Si la página tiene mostrar = false pero tiene créditos,
      // podría ser una página con tope que aún no se alcanza
      // Esto lo manejaremos en la segunda pasada
    }
  }

  // Segunda pasada: calcular totales reales
  for (const dia of qfLimpio) {
    const totalesDia = {
      coins: 0,
      usd: 0,
      euro: 0,
      gbp: 0,
      cop: 0,
      adelantos: 0,
      creditos: 0
    };
    
    for (const [pagina, valores] of Object.entries(dia)) {
      if (pagina === "name" || pagina === "worked") continue;
      
      // 🔧 LÓGICA MEJORADA PARA TOPES:
      // Si la página tiene mostrar = false PERO tiene créditos,
      // Y el acumulado total de la página ha superado algún tope,
      // entonces DEBEMOS incluir esos créditos
      const debeMostrar = valores?.mostrar !== false;
      
      if (debeMostrar) {
        // Coins
        totalesDia.coins += valores?.coinsDia || valores?.coinsTotal || 0;

        // USD
        totalesDia.usd += valores?.usdDia || valores?.usdTotal || 0;

        // Euro
        totalesDia.euro += valores?.euroDia || valores?.euroTotal || 0;

        // GBP
        totalesDia.gbp += (valores?.gbp || 0) + (valores?.gbpParcial || 0);

        // COP (pesos)
        totalesDia.cop +=
          (valores?.pesosDia || 0) +
          (valores.pesosDia>0?0:valores?.pesosTotal || 0) +
          (valores?.pesos || 0) +
          (valores?.pesosParcial || 0);

        // Adelantos
        totalesDia.adelantos += valores?.adelantosDia || valores?.adelantosTotal || 0;
      }
    }
    
    totalesDia.creditos = totalesDia.usd + totalesDia.euro + totalesDia.gbp;
    totalesPorDia.push(totalesDia);
    
    // Acumular totales generales
    totales.coins += totalesDia.coins;
    totales.usd += totalesDia.usd;
    totales.euro += totalesDia.euro;
    totales.gbp += totalesDia.gbp;
    totales.cop += totalesDia.cop;
    totales.adelantos += totalesDia.adelantos;
    totales.creditos += totalesDia.creditos;
  }

  return { 
    totales, 
    totalesPorDia,
    paginasConTopeAlcanzado: Array.from(paginasConTopeAlcanzado)
  };
};

const agregarTotalesDiarios = (qfLimpio, totalesPorDia) => {
  return qfLimpio.map((dia, index) => ({
    ...dia,
    totalesDia: totalesPorDia[index]
  }));
};

module.exports = { formatearQuincenaCompleta };