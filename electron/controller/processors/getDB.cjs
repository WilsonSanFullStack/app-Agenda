const {
  Quincena,
  Day,
  Moneda,
  Page,
  sequelize,
  Aranceles,
  CerradoQ,
} = require("../../db.cjs");
const { Op } = require("sequelize");

//buscamos los datos necesarios de la base de datos
const getDb = async (id) => {
  try {
    //get de las paginas existentes
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
    //get de los aranceles y el porcentaje del estudio
    const arancele = await Aranceles.findAll({
      attributes: ["id", "dolar", "euro", "gbp", "porcentaje"],
      order: [["createdAt", "DESC"]],
      limit: 1,
    });
    //get de la quincena por id con sus dias y monedas
    const qData = await Quincena.findByPk(id, {
      attributes: ["name", "id", "cerrado"],
      include: [
        {
          model: CerradoQ,
          as: "cierre",
          attributes: ["id", "name", "data"],
        },
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
    //objeto plano de la quincena
    const quincena = qData?.get({ plain: true });
    // texto plano de la consulta
    const aranceles = arancele[0]?.get({ plain: true });
    //objeto plano de la consulta
    const paginas = pagina?.map((x) => x?.get({ plain: true }));

    return { success: true, quincena, aranceles, paginas };
  } catch (error) {
    return {
      success: false,
      message: "Error al obtener las quincena",
      error: error,
    };
  }
};
module.exports = {
  getDb,
};
