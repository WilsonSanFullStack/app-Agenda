const {
  Quincena,
  Day,
  Moneda,
  Page,
  sequelize,
  Aranceles,
} = require("../db.cjs");
const { Op } = require("sequelize");

const getDataQ = async (data) => {
  console.log("data id quincena", data);
  try {
    const pagina = await Page.findAll({
      attributes: [
        "id",
        "name",
        "coins",
        "valorCoins",
        "moneda",
        "mensual",
        "tope",
        "descuento",
      ],
    });
    const arancele = await Aranceles.findAll({
      attributes: ["id", "dolar", "euro", "gbp", "porcentaje"],
      order: [["createdAt", "DESC"]],
      limit: 1,
    });

    const aranceles = arancele[0].get({ plain: true });
    const paginas = pagina.map((x) => x.get({ plain: true }));

    const qData = await Quincena.findByPk(data.id, {
      attributes: ["name", "id"],
      include: [
        {
          model: Day,
          as: "dias",
          attributes: [
            "id",
            "name",
            "page",
            "coins",
            "usd",
            "euro",
            "gbp",
            "gbpParcial",
            "mostrar",
            "adelantos",
            "worked",
          ],
        },
        {
          model: Moneda,
          as: "Monedas",
          where: {
            [Op.or]: [{ pago: true }, { pago: false }],
          },
          order: [["createdAt", "DESC"]],
          limit: 2,
          attributes: ["id", "dolar", "euro", "gbp", "pago"],
        },
      ],
    });
    // console.log("pages", pages.get({ plain: true }))
    const quincena = qData.get({ plain: true });
    // console.log(quincena);
    // verificamos si se quiere ver la quincena con valores de pago o estadisticas
    const isPago = data.pago;
    // tomamos la moneda para estadisticas
    const estadisticas =
      quincena?.Monedas?.find((m) => m?.pago === false) || {};
    // tomamos la moneda para pago
    const pago = quincena?.Monedas?.find((m) => m?.pago === true) || {};
    //formatiamos las monedas y los porcentajes que se van a usar para los calculos
    let usd = 0;
    let euro = 0;
    let gbp = 0;
    const porcentaje = parseFloat(aranceles.porcentaje);
    // decicion para saber cual moneda se debe usar
    if (isPago) {
      usd = parseFloat(pago?.dolar - aranceles.dolar) || 0;
      euro = parseFloat(pago?.euro - aranceles.euro) || 0;
      gbp = parseFloat(pago?.gbp - aranceles.gbp) || 0;
    } else {
      usd = parseFloat(estadisticas?.dolar) || 0;
      euro = parseFloat(estadisticas?.euro) || 0;
      gbp = parseFloat(estadisticas?.gbp) || 0;
    }
    // formatiamos la respuesta para no enviar datos innecesarios
    const qFormatted = {
      id: quincena.id,
      name: quincena.name,
      moneda: quincena?.Monedas || [],
      isPago: isPago,
      totales: {
        coins: 0,
        usd: 0,
        euro: 0,
        gbp: 0,
        cop: 0,
        adelantos: 0,
        worked: 0,
        rojo: 0,
      },
      promedios: {
        //mejor pagina en creditos
        mejorPageCreditos: {
          name: "",
          coins: 0,
          creditos: 0,
        },
        mejorPagePesos: {
          name: "",
          pesos: 0,
        },
        mejorDia: {
          name: "",
          creditos: {
            coins: 0,
            usd: 0,
            euro: 0,
            gbp: 0,
            pesos: 0,
          },
        },
          promedio: {
            coins: 0,
            usd: 0,
            euro: 0,
            gbp: 0,
            pesos: 0,
          },
      },
    };

    const dias = quincena.dias;
    // convertir string a fecha
    const parseFecha = (str) => {
      const [dia, mesStr, anioStr] = str.split("-");
      const meses = {
        enero: 0,
        febrero: 1,
        marzo: 2,
        abril: 3,
        mayo: 4,
        junio: 5,
        julio: 6,
        agosto: 7,
        septiembre: 8,
        octubre: 9,
        noviembre: 10,
        diciembre: 11,
      };
      return new Date(2000 + parseInt(anioStr), meses[mesStr], parseInt(dia));
    };

    // buscar el día anterior más cercano en qFormatted.dias
    const getDiaAnterior = (qf, fechaActual) => {
      const fecha = parseFecha(fechaActual);
      for (let i = qf.length - 1; i >= 0; i--) {
        const fechaQf = parseFecha(qf[i].name);
        if (fechaQf < fecha) {
          return qf[i]; // devolvemos el primero anterior encontrado
        }
      }
      return null;
    };

    // ordenar
    dias.sort((a, b) => parseFecha(a.name) - parseFecha(b.name));

    const qf = [];
    //formateo de dias
    for (const dia of dias) {
      const anterior = getDiaAnterior(qf, dia.name);
      // buscamos si ya existe un objeto para ese día
      let df = qf.find((d) => d.name === dia.name);

      // si no existe, lo creamos
      if (!df) {
        df = { name: dia.name, worked: false };
        qf.push(df);
      }

      if (dia.worked) {
        df.worked = true;
      }

      // buscamos el nombre de la página
      const pag = paginas.find((p) => p.name === dia.page);
      if (!pag) continue;

      // inicializamos la página en df si no existe
      if (!df[dia.page]) {
        df[dia.page] = {};
      }

      //revisamos si la pagina tiene descuentos
      if (pag.descuento) {
        const d = parseFloat(pag.descuento);
        pag.moneda === "USD"
          ? (dia.usd = dia.usd * d)
          : pag.moneda === "EURO"
          ? (dia.euro = dia.euro * d)
          : pag.moneda === "GBP"
          ? (dia.gbp = dia.gbp * d) & (dia.gbpParcial = dia.gbpParcial * d)
          : null;
      }

      //revisamos si tiene coins
      if (pag.coins) {
        df[dia.page].coinsTotal = dia.coins;
        if (
          anterior &&
          anterior[dia.page] &&
          anterior[dia.page].coinsTotal !== undefined
        ) {
          df[dia.page].coinsDia = dia.coins - anterior[dia.page].coinsTotal;
        }
      }

      // validamos las monedas
      if (pag.moneda === "USD") {
        df[dia.page].usdTotal = dia.usd;
        df[dia.page].pesosTotal = dia.usd * porcentaje * usd;
        if (
          anterior &&
          anterior[dia.page] &&
          anterior[dia.page].usdTotal !== undefined
        ) {
          df[dia.page].usdDia = dia.usd - anterior[dia.page].usdTotal;
          df[dia.page].pesosDia =
            (dia.usd - anterior[dia.page].usdTotal) * porcentaje * usd;
        }
      } else if (pag.moneda === "EURO") {
        df[dia.page].euroTotal = dia.euro;
        df[dia.page].pesosTotal = dia.euro * porcentaje * euro;
        if (
          anterior &&
          anterior[dia.page] &&
          anterior[dia.page].euroTotal !== undefined
        ) {
          df[dia.page].euroDia = dia.euro - anterior[dia.page].euroTotal;
          df[dia.page].pesosDia =
            (dia.euro - anterior[dia.page].euroTotal) * porcentaje * euro;
        }
      } else if (pag.moneda === "GBP") {
        if (dia.gbpParcial > 0) {
          df[dia.page].gbpParcial = dia.gbpParcial;
          df[dia.page].pesosParcial = dia.gbpParcial * porcentaje * gbp;
        }
        df[dia.page].gbp = dia.gbp;
        df[dia.page].pesos = dia.gbp * porcentaje * gbp;
      } else if (pag.moneda === "COP") {
        df[dia.page].adelantosDia = dia.adelantos;
        if (
          anterior &&
          anterior[dia.page] &&
          anterior[dia.page].adelantosTotal !== undefined
        ) {
          df[dia.page].adelantosTotal =
            dia.adelantos + anterior[dia.page].adelantosTotal;
        } else {
          df[dia.page].adelantosTotal = dia.adelantos;
        }
      }

      // revisamos si tiene topes
      if (pag.tope > 0) {
        df[dia.page].mostrar = dia.mostrar;
      }
    }
    // limpiar gbpParcial en adultwork
    function limpiarAdultwork(data) {
      let hayGbp = false;
      let hayGbpParcial = false;

      for (let i = data.length - 1; i >= 0; i--) {
        const day = data[i];
        if (!day.adultwork) continue;

        const { gbp, gbpParcial } = day.adultwork;

        // Caso 1: hay gbp
        if (gbp !== undefined && gbp !== 0) {
          // Si no es el último día y tiene gbpParcial, se elimina
          if (
            i !== data.length - 1 &&
            gbpParcial !== undefined &&
            gbpParcial !== 0
          ) {
            delete day.adultwork.gbpParcial;
            delete day.adultwork.pesosParcial;
          }
          hayGbp = true;
          hayGbpParcial = false;
        }

        // Caso 2: hay gbpParcial
        else if (gbpParcial !== undefined && gbpParcial !== 0) {
          if (hayGbp || hayGbpParcial) {
            // Si hay algo más nuevo adelante, se elimina
            delete day.adultwork.gbpParcial;
            delete day.adultwork.pesosParcial;
          } else {
            // Conservamos el último gbpParcial
            hayGbpParcial = true;
          }
        }
      }

      return data;
    }
    const qfLimpio = limpiarAdultwork(qf);
    // tomar el último día
    const ultimoDia = qfLimpio[qfLimpio.length - 1];
    // inicializar mejores páginas
    let mejorCreditos = { name: "", creditos: 0 };
    let mejorPesos = { name: "", pesos: 0 };
    // llenar con los valores del último día
    for (const [pagina, valores] of Object.entries(ultimoDia)) {
      if (pagina === "name" || pagina === "worked") continue;

      if (valores.coinsTotal) qFormatted.totales.coins += valores.coinsTotal;
      if (valores.usdTotal) qFormatted.totales.usd += valores.usdTotal;
      if (valores.euroTotal) qFormatted.totales.euro += valores.euroTotal;
      if (valores.gbp) qFormatted.totales.gbp += valores.gbp;
      if (valores.gbpParcial) qFormatted.totales.gbp += valores.gbpParcial;
      if (valores.pesosTotal)
        qFormatted.totales.cop += valores.pesosTotal || valores.pesos;
      if (valores.pesos) qFormatted.totales.cop += valores.pesos;
      if (valores.pesosParcial) qFormatted.totales.cop += valores.pesosParcial;
      if (valores.adelantosTotal)
        qFormatted.totales.adelantos += valores.adelantosTotal;

      // 🔹 Detectar mejor página en créditos (prioridad: usd, euro, gbp, gbpParcial, coinsTotal)
      const creditos =
        valores.usdTotal ||
        valores.euroTotal ||
        valores.gbp ||
        valores.gbpParcial ||
        valores.coinsTotal ||
        0;

      if (creditos > mejorCreditos.creditos) {
        mejorCreditos = { name: pagina, creditos };
      }

      // 🔹 Detectar mejor página en pesos
      const pesos =
        valores.pesosTotal || valores.pesos || valores.pesosParcial || 0;

      if (pesos > mejorPesos.pesos) {
        mejorPesos = { name: pagina, pesos };
      }
    }
    // guardar en promedios
    qFormatted.promedios.mejorPageCreditos = mejorCreditos;
    qFormatted.promedios.mejorPagePesos = mejorPesos;
    // worked = contar en todos los días
    qFormatted.totales.worked = qfLimpio.filter((d) => d.worked).length;
    //agregamos los dias a la quincena formateada
    qFormatted["dias"] = qfLimpio;
    //calculamos el rojo
    qFormatted.totales.rojo =
      qFormatted.totales.cop - qFormatted.totales.adelantos;
      //promedios.promedio.coins 
      qFormatted.promedios.promedio.coins = qFormatted.totales.coins / qFormatted.totales.worked
      //promedios.promedio.euro 
      qFormatted.promedios.promedio.euro = qFormatted.totales.euro / qFormatted.totales.worked
      //promedios.promedio.gbp 
      qFormatted.promedios.promedio.gbp = qFormatted.totales.gbp / qFormatted.totales.worked
      //promedios.promedio.pesos 
      qFormatted.promedios.promedio.pesos = qFormatted.totales.cop / qFormatted.totales.worked
      //promedios.promedio.usd 
      qFormatted.promedios.promedio.usd = qFormatted.totales.usd / qFormatted.totales.worked

      // inicializamos el mejor día
let mejorDia = {
  name: "",
  creditos: {
    coins: 0,
    usd: 0,
    euro: 0,
    gbp: 0,
    pesos: 0,
  },
};

// recorrer todos los días
for (const dia of qfLimpio) {
  let totalUsd = 0;
  let totalEuro = 0;
  let totalGbp = 0;
  let totalGbpParcial = 0;
  let totalCoins = 0;
  let totalPesos = 0;

  for (const [pagina, valores] of Object.entries(dia)) {
    if (pagina === "name" || pagina === "worked") continue;

    totalUsd += valores.usdDia || 0;
    totalEuro += valores.euroDia || 0;
    totalGbp += valores.gbp || 0;
    totalGbpParcial += valores.gbpParcial || 0;
    totalCoins += valores.coinsDia || 0;

    // en pesos puede venir en varias formas
    totalPesos +=
      (valores.pesosDia || 0) +
      (valores.pesos || 0) +
      (valores.pesosParcial || 0);
  }

  // sumatoria de créditos de este día
  const sumaCreditos = totalUsd + totalEuro + totalGbp + totalGbpParcial;

  // si es mejor que el guardado, lo reemplazamos
  if (sumaCreditos > 
      (mejorDia.creditos.usd + mejorDia.creditos.euro + mejorDia.creditos.gbp)) {
    mejorDia = {
      name: dia.name,
      creditos: {
        coins: totalCoins,
        usd: totalUsd,
        euro: totalEuro,
        gbp: totalGbp + totalGbpParcial, // 🔹 sumamos ambos
        pesos: totalPesos,
      },
    };
  }
}

// guardar en promedios
qFormatted.promedios.mejorDia = mejorDia;
      
    //retornamos la quincena formateada
    return qFormatted;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Error al obtener las quincena",
      error: error.message,
    };
  }
};

module.exports = { getDataQ };
