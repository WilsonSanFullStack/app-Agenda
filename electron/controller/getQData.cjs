const { Quincena, Day, Moneda, Page, sequelize } = require("../db.cjs");
const { Op } = require("sequelize");

const getDataQ = async (data) => {
  console.log("data id quincena", data);
  try {
    const pages = await Quincena.findByPk(data, {
      // where: { id: data },
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
    const quincena = pages.get({ plain: true });
    console.log(quincena);
    return quincena;
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
