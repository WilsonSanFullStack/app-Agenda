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
    });

    const aranceles = arancele.map((x) => x.get({ plain: true }));
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
    const porcentaje = aranceles.porcentaje;
    // decicion para saber cual moneda se debe usar
    if (isPago) {
      usd = pago?.dolar - aranceles.dolar || 0;
      euro = pago?.euro - aranceles.euro || 0;
      gbp = pago?.gbp - aranceles.gbp || 0;
    } else {
      usd = estadisticas?.dolar || 0;
      euro = estadisticas?.euro || 0;
      gbp = estadisticas?.gbp || 0;
    }
    // formatiamos la respuesta para no enviar datos innecesarios
    const qFormatted = {
      id: quincena.id,
      name: quincena.name,
      moneda: quincena?.Monedas || [],
      isPago: isPago,
    };
    
    const dias = quincena.dias
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
    if (
      anterior &&
      anterior[dia.page] &&
      anterior[dia.page].usdTotal !== undefined
    ) {
      df[dia.page].usdDia = dia.usd - anterior[dia.page].usdTotal;
    }
  } else if (pag.moneda === "EURO") {
    df[dia.page].euroTotal = dia.euro;
    if (
      anterior &&
      anterior[dia.page] &&
      anterior[dia.page].euroTotal !== undefined
    ) {
      df[dia.page].euroDia = dia.euro - anterior[dia.page].euroTotal;
    }
  } else if (pag.moneda === "GBP") {
    if (dia.gbpParcial > 0) {
      df[dia.page].gbpParcial = dia.gbpParcial;
    }
    df[dia.page].gbp = dia.gbp;
  } else if (pag.moneda === "COP") {
    df[dia.page].adelantosDia = dia.adelantos;
    if (
      anterior &&
      anterior[dia.page] &&
      anterior[dia.page].adelantosTotal !== undefined
    ) {
      df[dia.page].adelantosTotal = dia.adelantos + anterior[dia.page].adelantosTotal;
    }else {
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
      if (i !== data.length - 1 && gbpParcial !== undefined && gbpParcial !== 0) {
        delete day.adultwork.gbpParcial;
      }
      hayGbp = true;
      hayGbpParcial = false;
    }

    // Caso 2: hay gbpParcial
    else if (gbpParcial !== undefined && gbpParcial !== 0) {
      if (hayGbp || hayGbpParcial) {
        // Si hay algo más nuevo adelante, se elimina
        delete day.adultwork.gbpParcial;
      } else {
        // Conservamos el último gbpParcial
        hayGbpParcial = true;
      }
    }
  }

  return data;
}
const qfLimpio = limpiarAdultwork(qf);
//agregamos los dias a la quincena formateada
    qFormatted["dias"] = qfLimpio;
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
