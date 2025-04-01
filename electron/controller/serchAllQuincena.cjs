const {
  Quincena,
  Day,
  Sender,
  Adult,
  Dirty,
  Vx,
  Moneda,
  Live7,
  Page,
} = require("../db.cjs");
// const { BrowserWindow } = require("electron");

const getAllsQuincenas = async () => {
  try {
    const pages = await Quincena.findAll({
      attributes: ["name", "id"],
      include: [
        {
          model: Day,
          as: "dias",
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: Sender,
              as: "Senders",
              limit: 1, // Solo trae el último Day
              order: [["createdAt", "DESC"]],
              include: [
                {
                  model: Page,
                  as: "paginaS",
                  attributes: [
                    "id",
                    "name",
                    "coins",
                    "moneda",
                    "mensual",
                    "valor",
                    "tope",
                  ],
                },
              ],
              attributes: ["id", "coins", "dayId", "pageId"],
            },
            {
              model: Dirty,
              as: "Dirtys",
              limit: 1, // Solo trae el último Day
              order: [["createdAt", "DESC"]],
              include: [
                {
                  model: Page,
                  as: "paginaD",
                  attributes: [
                    "id",
                    "name",
                    "coins",
                    "moneda",
                    "mensual",
                    "valor",
                    "tope",
                  ],
                },
              ],
              attributes: ["id", "dolares", "mostrar", "dayId", "pageId"],
            },
            {
              model: Adult,
              as: "Adults",
              order: [["createdAt", "DESC"]],
              include: [
                {
                  model: Page,
                  as: "paginaA",
                  attributes: [
                    "id",
                    "name",
                    "coins",
                    "moneda",
                    "mensual",
                    "valor",
                    "tope",
                  ],
                },
              ],
            },
            {
              model: Vx,
              as: "Vxs",
              limit: 1, // Solo trae el último Day
              order: [["createdAt", "DESC"]],
              include: [
                {
                  model: Page,
                  as: "paginaV",
                  order: [["createdAt", "DESC"]],
                  attributes: [
                    "id",
                    "name",
                    "coins",
                    "moneda",
                    "mensual",
                    "valor",
                    "tope",
                  ],
                },
              ],
              attributes: ["id", "creditos", "dayId", "pageId"],
            },
            {
              model: Live7,
              as: "Lives",
              limit: 1, // Solo trae el último Day
              order: [["createdAt", "DESC"]],
              include: [
                {
                  model: Page,
                  as: "paginaL",
                  attributes: [
                    "id",
                    "name",
                    "coins",
                    "moneda",
                    "mensual",
                    "valor",
                    "tope",
                  ],
                },
              ],
              attributes: ["id", "creditos", "dayId", "pageId"],
            },
          ],
          attributes: ["id", "name"],
        },
        {
          model: Moneda,
          as: "Monedas",
          attributes: ["id", "dolar", "euro", "lb", "pago"],
        },
      ],
    });

    return pages.map((x) => x.get({ plain: true }));
  } catch (error) {
    return {
      success: false,
      message: "Error al obtener las quincenas",
      error: error.message,
    };
  }
};

module.exports = { getAllsQuincenas };
