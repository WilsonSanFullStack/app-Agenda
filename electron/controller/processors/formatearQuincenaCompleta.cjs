const path = require("path");

// Importar handlers
const {
  encontrarMejorPagina,
  encontrarMejorDia,
  calcularPromedios,
  calcularTotalesDia
} = require(path.join(__dirname, "handlers.cjs"));

// Importar helpers
const { calcularInteresQuincenaAnterior } = require(path.join(__dirname, "helpers.cjs"));

const formatearQuincenaCompleta = (quincena, qfLimpio, porcentaje, isPago, monedasCompletas) => {
  // 1. Estructura base - ahora recibe monedasCompletas con ambas
  const qFormatted = crearEstructuraBase(quincena, porcentaje, isPago, monedasCompletas);
  
  // 2. Calcular totales acumulados
  const { totales, totalesPorDia } = calcularTotalesAcumulados(qfLimpio);
  
   // 3. Calcular interés por rojo anterior (si existe)
   const calculoInteres = calcularInteresQuincenaAnterior(quincena, quincena.cierre)

  // 4. Encontrar mejores páginas y día
  const { mejorCreditos, mejorPesos } = encontrarMejorPagina(qfLimpio);
  const mejorDia = encontrarMejorDia(qfLimpio);
  
  // 5. Calcular promedios
  const diasTrabajados = qfLimpio.filter(d => d.worked).length;
  const promedios = calcularPromedios(totales, diasTrabajados);
  
   // 6. Calcular rojo final (incluyendo interés si aplica)
  const rojoBase = totales.cop - totales.adelantos;
  const rojoFinal = calculoInteres.tieneInteres 
    ? rojoBase + calculoInteres.rojoTotal // rojoTotal ya incluye el interés
    : rojoBase;

  // 7. Construir respuesta final
  return {
    ...qFormatted,
    totales: {
      ...totales,
      worked: diasTrabajados,
      rojo: rojoFinal
    },
    // Nueva propiedad para mostrar el cálculo del interés
    interes: calculoInteres.tieneInteres ? {
      rojoAnterior: calculoInteres.rojoAnterior,
      interes: calculoInteres.interes,
      rojoConInteres: calculoInteres.rojoTotal,
      descripcion: "Interés del 10% por deuda de quincena anterior"
    } : null,
    promedios: {
      mejorPageCreditos: mejorCreditos,
      mejorPagePesos: mejorPesos,
      mejorDia,
      promedio: promedios
    },
    dias: agregarTotalesDiarios(qfLimpio, totalesPorDia)
  };
};

const crearEstructuraBase = (quincena, porcentaje, isPago, monedasCompletas) => {
  // Si no se enviaron monedas completas, usar valores por defecto
  const monedas = monedasCompletas || {
    estadisticas: { dolar: 0, euro: 0, gbp: 0 },
    pago: { dolar: 0, euro: 0, gbp: 0 }
  };
// console.log("monedas", monedas)
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
      adelantos: 0, worked: 0, rojo: 0
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
    }
  };
};

const calcularTotalesAcumulados = (qfLimpio) => {
  const totales = {
    coins: 0, usd: 0, euro: 0, gbp: 0, cop: 0, adelantos: 0
  };
  
  const totalesPorDia = [];

  for (const dia of qfLimpio) {
    const totalesDia = calcularTotalesDia(dia);
    totalesPorDia.push(totalesDia);
    
    // Acumular totales
    totales.coins += totalesDia.coins;
    totales.usd += totalesDia.usd;
    totales.euro += totalesDia.euro;
    totales.gbp += totalesDia.gbp;
    totales.cop += totalesDia.cop;
    totales.adelantos += totalesDia.adelantos;
  }

  return { totales, totalesPorDia };
};

const agregarTotalesDiarios = (qfLimpio, totalesPorDia) => {
  return qfLimpio.map((dia, index) => ({
    ...dia,
    totalesDia: totalesPorDia[index]
  }));
};
module.exports = { formatearQuincenaCompleta};