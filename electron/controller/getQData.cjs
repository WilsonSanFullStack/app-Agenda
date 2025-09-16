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
    console.log(quincena);
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
      dias: [],
    };
    const dias = {
      name: "",
      
    }
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
