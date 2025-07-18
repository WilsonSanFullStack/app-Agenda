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
  console.log("data id quincena", data);
  try {
    const pages = await Quincena.findAll({
      where: { id: data.q },
      attributes: ["name", "id"],
      include: [
        {
          model: Day,
          as: "dias",
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
      order: [
        [
          sequelize.literal(
            `CAST(substr(dias.name, 1, instr(dias.name, '-') - 1) AS INTEGER)`
          ),
          "ASC",
        ],
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
      // console.log("q =", q);
      // formatiamos el id y name
      quincenaOrdenada.id = q.id;
      quincenaOrdenada.name = q.name;
      //entrando a las propiedades de monedas
      for (let moneda of q?.Monedas) {
        if (moneda.pago) {
          quincenaOrdenada.moneda.pago.id = moneda?.id;
          quincenaOrdenada.moneda.pago.dolar = moneda?.dolar;
          quincenaOrdenada.moneda.pago.euro = moneda?.euro;
          quincenaOrdenada.moneda.pago.lb = moneda?.lb;
        } else if (moneda.pago === false) {
          quincenaOrdenada.moneda.estadisticas.id = moneda.id;
          quincenaOrdenada.moneda.estadisticas.dolar = moneda.dolar;
          quincenaOrdenada.moneda.estadisticas.euro = moneda.euro;
          quincenaOrdenada.moneda.estadisticas.lb = moneda.lb;
        }
      }
      //entrando a las propiedades de dias
      for (let dias of q?.dias) {
        // console.log("dias sin formatear", dias);
        const dia = {
          name: dias.name,
          adult: [],
          sender: {
            id: "",
            totalCoins: 0,
            totalEuros: 0,
            coinsDias: 0,
            eurosDias: 0,
            pesosDias: 0,
            totalPesos: 0,
            qa: 0,
          },
          dirty: {
            id: "",
            dolares: 0,
            mostrar: null,
            pesos: 0,
            qa: 0,
          },
          vx: {
            id: "",
            creditos: 0,
            pesos: 0,
            qa: 0,
          },
          live7: {
            id: "",
            creditos: 0,
            pesos: 0,
            qa: 0,
          },
        };

        //entrando a las propiedades de adult
        for (let adult of dias?.Adults) {
          // console.log("adult", adult);
          //quitamos a las libras el porcentaje de la pagina
          const corte = adult.lb * quincenaOrdenada.adult;
          // libras por el porcentaje del studio
          // luego miramos si hay moneda de pago
          // si no hay moneda de pago, usamos la estadistica
          const AdultPesos =
            corte *
              quincenaOrdenada.porcentaje *
              quincenaOrdenada.moneda.pago.lb !==
            0
              ? quincenaOrdenada.moneda.pago.lb - quincenaOrdenada.aranceles.lb
              : quincenaOrdenada.moneda.estadisticas.lb;
          //
          dia.adult.push({
            id: adult.id,
            lb: adult.lb,
            corte: adult.corte,
            lbr: corte,
            pesos: AdultPesos,
          });
        }
        //entrando a las propiedades de sender
        for (let sender of dias?.Senders) {
          console.log("sender", sender);
          console.log(dias.name?.split("-")[0]);
          const diaPrimero = 1;
          const dia16 = 16;
          const curren = dias.name?.split("-")[0];
          if (diaPrimero === curren) {
            dia.sender.id = sender.id;
            dia.sender.totalCoins = sender.coins;
            const euros = sender.coins * sender.paginaS.valor;
            dia.sender.totalEuros = euros;
            const eurosPorcentaje = euros * quincenaOrdenada.porcentaje;
            const pesos =
              eurosPorcentaje * quincenaOrdenada.moneda.pago.euro !== 0
                ? quincenaOrdenada.moneda.pago.euro -
                  quincenaOrdenada.aranceles.euro
                : quincenaOrdenada.moneda.estadisticas.euro;
            dia.sender.totalPesos = pesos;
          } else if (dia16 === curren) {
            dia.sender.id = sender.id;
            const coins = sender.coins - dia.qa;
            dia.sender.totalCoins = coins;
            const euros = coins * sender.paginaS.valor;
            dia.sender.totalEuros = euros;
            const eurosPorcentaje = euros * quincenaOrdenada.porcentaje;
            const pesos =
              eurosPorcentaje * quincenaOrdenada.moneda.pago.euro !== 0
                ? quincenaOrdenada.moneda.pago.euro -
                  quincenaOrdenada.aranceles.euro
                : quincenaOrdenada.moneda.estadisticas.euro;
            dia.sender.totalPesos = pesos;
          } else if (curren > diaPrimero && curren < dia16) {
            // const diaAnterior = 
            console.log(q?.dias.map((x) => {
              console.log("index", x);
              console.log("curren", curren);
              const nameDia = x.name?.split("-")[0];
              console.log("nameDia",nameDia);
              const diaAnterior = curren > nameDia ;
              console.log("diaAnterior",diaAnterior);
              return diaAnterior;
            }));
            console.log("diaAnterior", diaAnterior);
            const coins = sender.coins - dias?.filter((dia) => dia.name?.split("-")[0] === curren-1);
            dia.sender.coins = coins;
            const euros = coins * sender.paginaS.valor;
            dia.sender.euros = euros;
            const eurosPorcentaje = euros * quincenaOrdenada.porcentaje;
            const pesos =
              eurosPorcentaje * quincenaOrdenada.moneda.pago.euro !== 0
                ? quincenaOrdenada.moneda.pago.euro -
                  quincenaOrdenada.aranceles.euro
                : quincenaOrdenada.moneda.estadisticas.euro;
            dia.sender.pesos = pesos;
            
          }
          dia.sender.id = sender.id;
          dia.sender.coins = sender.coins;
          dia.sender.qa = 0;
          dia.sender.euros = sender.coins * sender.paginaS.valor;
          dia.sender.pesos = 0;
        }
        //entrando a las propiedades de dirty
        for (let dirty of dias?.Dirtys) {
          // console.log("dirty", dirty);
          dia.dirty.id = dirty.id;
          dia.dirty.dolares = dirty.dolares;
          dia.dirty.mostrar = dirty.mostrar;
          dia.dirty.qa = 0;
        }
        // entrando a las propiedades de vx
        for (let vx of dias?.Vxs) {
          // console.log("vx", vx);
          dia.vx.id = vx.id;
          dia.vx.creditos = vx.creditos;
        }
        // entrando a las propiedades de lives
        for (let lives of dias?.Lives) {
          // console.log("lives", lives);
          dia.live7.id = lives.id;
          dia.live7.creditos = lives.creditos;
        }
        quincenaOrdenada.dias.push(dia);
      }
    }

    // console.log("quincena", quincena);
    // console.log("quincena ordenada", quincenaOrdenada);
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
