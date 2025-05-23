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
  sequelize,
} = require("../db.cjs");
const { Op } = require("sequelize"); // Importar Op

// const { BrowserWindow } = require("electron");

const getAllsQuincenas = async (data) => {
  console.log("data id quincena", data)
  try {
    const pages = await Quincena.findAll({
      where: { id: data.q },
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
          where: {
            [Op.or]: [{ pago: true }, { pago: false }],
          },
          order: [["createdAt", "DESC"]],
          limit: 2,
          attributes: ["id", "dolar", "euro", "lb", "pago"],
        },
      ],
    });
    // console.log("pages = ",pages[0].dataValues.dias[0].dataValues.Senders[0])
    const quincena = pages?.map((x) => x.get({ plain: true }));
    // console.log("quincena =",quincena[0])
    // console.log("quincena.dias =", quincena[0].dias[0])
    // console.log("quincena.moneda =",quincena[0].Monedas[0])
    const quincenaOrdenada = {
      id: "",
      name: "",
      dias: [],
      moneda: {
        pago: { id: "", dolar: 0, euro: 0, lb: 0 },
        estadisticas: { id: "", dolar: 0, euro: 0, lb: 0 },
      },
      aranceles: { dolar: 130, euro: 220, lb: 250 },
      porcentaje: 0.8,
      adult: 0.699947813268342,
    };
    for (let q of quincena) {
      if (!q) continue;
      // console.log("q =",q)
      // formatiamos el id y name
      quincenaOrdenada.id = q.id;
      quincenaOrdenada.name = q.name;
      //entrando a las propiedades de monedas
      for (let moneda of q?.Monedas) {
        // console.log("Modenda antes del if ",moneda)
        if (moneda.pago) {
          // console.log("first")
          quincenaOrdenada.moneda.pago.id = moneda?.id;
          quincenaOrdenada.moneda.pago.dolar = moneda?.dolar;
          quincenaOrdenada.moneda.pago.euro = moneda?.euro;
          quincenaOrdenada.moneda.pago.lb = moneda?.lb;
        } else if (moneda.pago === false ) {
          // console.log("secund =", moneda.id)
          quincenaOrdenada.moneda.estadisticas.id = moneda.id;
          // console.log("quincenaOrdenada.moneda.estadisticas.id =", quincenaOrdenada.moneda.estadisticas.id)
          // console.log("dolar = ", moneda.dolar)
          quincenaOrdenada.moneda.estadisticas.dolar = moneda.dolar;
          // console.log("quincenaOrdenada.moneda.estadisticas.id =", quincenaOrdenada.moneda.estadisticas.dolar)
          // console.log("moneda.euro ", moneda.euro)
          quincenaOrdenada.moneda.estadisticas.euro = moneda.euro;
          // console.log("quincenaOrdenada.moneda.estadisticas.euro =", quincenaOrdenada.moneda.estadisticas.euro)
          // console.log("moneda.lb = ", moneda.lb)
          quincenaOrdenada.moneda.estadisticas.lb = moneda.lb;
          // console.log("quincenaOrdenada.moneda.estadisticas.lb = ", quincenaOrdenada.moneda.estadisticas.lb)
        }
      }
      // console.log('fin del for moneda')
      //entrando a las propiedades de dias
      for (let dias of q?.dias) {
        const dia = {
          adult: [],
          sender: {
            id: "",
            coins: 0,
            euros: 0,
            qa: 0,
            pesos: 0
          },
          dirty: {
            id: "",
            dolares: 0,
            mostrar: null,
            qa: 0,
          },
          vx: {
            id: "",
            creditos: 0,
          },
          live7: {
            id: "",
            creditos: 0,
          },
        };

        //entrando a las propiedades de adult
        for (let adult of dias?.Adults) {
          // console.log("adult", adult);
          dia.adult.push({
            id: adult.id,
            lb: adult.lb,
            corte: adult.corte,
            lbr: adult.lb * quincenaOrdenada.adult,
            moneda: adult.paginaA.moneda
          });
        }
        //entrando a las propiedades de sender
        for (let sender of dias?.Senders) {
          // console.log("sender", sender);
          dia.sender.id = sender.id;
            dia.sender.coins= sender.coins;
            dia.sender.qa=0;
            dia.sender.euros = sender.coins * sender.paginaS.valor;
            dia.sender.pesos= 0;

        }
        //entrando a las propiedades de dirty
        for (let dirty of dias?.Dirtys) {
          // console.log("dirty", dirty);
        }
        // entrando a las propiedades de vx
        for (let vx of dias?.Vxs) {
          // console.log("vx", vx);
        }
        // entrando a las propiedades de lives
        for (let lives of dias?.Lives) {
          // console.log("lives", lives);
        }
        quincenaOrdenada.dias.push(dia)
      }
    }

    console.log("quincena", quincena);
    console.log(quincenaOrdenada);
    return quincenaOrdenada;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Error al obtener las quincena",
      error: error.message,
    };
  }
};

module.exports = { getAllsQuincenas };
