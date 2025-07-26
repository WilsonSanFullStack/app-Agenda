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
function filtrarAdults(dias) {
  const diasSoloAdult = dias.flatMap((dia) =>
    dia.Adults.map((adult) => ({
      ...adult,
      name: dia.name,
      createdAt: new Date(adult.createdAt), // Asegurar que es Date
    }))
  );

  const getDia = (item) =>
    parseInt(item.name.split("-")[0].replace(/\D/g, ""), 10);

  const corteTrue = diasSoloAdult.filter((a) => a.corte === true);
  const corteFalse = diasSoloAdult.filter((a) => a.corte === false);

  const mostRecentTrue = corteTrue.reduce(
    (latest, current) =>
      current.createdAt > latest.createdAt ? current : latest,
    corteTrue[0] ?? null
  );
  
  const mostRecentFalse = corteFalse.reduce(
    (latest, current) =>
      current.createdAt > latest.createdAt ? current : latest,
    corteFalse[0] ?? null
  );
  console.log("mostRecentFalse", mostRecentFalse);
  console.log("mostRecentTrue", mostRecentTrue);

  const maxDiaTrue = Math.max(...corteTrue.map(getDia), 0);
  console.log("maxDiaTrue", maxDiaTrue);
  const maxDiaFalse = Math.max(...corteFalse.map(getDia), 0);
  console.log("maxDiaFalse", maxDiaFalse);

  return diasSoloAdult.filter((item) => {
    if (item.corte === true) return true;

    const dia = getDia(item);
    console.log("dia", dia);
    const isMostRecent = item.id === mostRecentFalse?.id;
    console.log("isMostRecent", isMostRecent);
    console.log("item", item);

    // Condición 1: Es el corte:false más reciente y su día es >= al corte:true más reciente
    const condition1 =
      isMostRecent &&
      (!mostRecentTrue || dia >= getDia(mostRecentTrue));
      console.log("condition1", condition1);
    // Condición 2: Tiene día mayor a todos los corte:true y a todos los corte:false
    const condition2 = dia > maxDiaTrue && dia > maxDiaFalse;
console.log("condition2", condition2);
    // Condición 3: Tiene el día máximo entre todos los corte:false
    const condition3 = dia === maxDiaFalse;
console.log("condition3", condition3);
    // Condición de exclusión
    const removeByOtherFalse = dia < maxDiaFalse && !isMostRecent;
    console.log("removeByOtherFalse", removeByOtherFalse);
    const removeByTrue = dia < maxDiaTrue;
    console.log("removeByTrue", removeByTrue);
    console.log("return ",(condition1 || condition2 || condition3) && !removeByOtherFalse && !removeByTrue)
    return (condition1 || condition2 || condition3) && !removeByOtherFalse && !removeByTrue;
  });
}


const getAllsQuincenas = async (data) => {
  // console.log("data id quincena", data);
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
      //filtramos los dias para poder luego filtrar los adults
      const dias = q?.dias;
      // console.log("dias =", dias);
      // metemos los adults en un array
      // y le agregamos el nombre del dia
      let diasConParcial = [];
      let diasSoloAdult = filtrarAdults(dias);
      // console.log("diasSoloAdult =", diasSoloAdult);
      // [];
      for (let dia = 0; dia < dias.length; dia++) {
        for (let adult = 0; adult < dias[dia].Adults.length; adult++) {
          dias[dia].Adults[adult].name = dias[dia].name;
          diasConParcial.push(dias[dia].Adults[adult]);
        }
      }

      // console.log("diasConParcial =", diasConParcial);
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
        for (let adult of diasSoloAdult) {
          // console.log("reciente", reciente);
          if (adult.name === dias.name) {
            // console.log("numero del dia", dias.name?.split("-")[0]);

            //quitamos a las libras el porcentaje de la pagina
            const corte = adult.lb * quincenaOrdenada.adult;
            // libras por el porcentaje del studio
            const cortePorcentaje = corte * quincenaOrdenada.porcentaje;
            // luego miramos si hay moneda de pago
            // si no hay moneda de pago, usamos la estadistica
            const precioLb =
              quincenaOrdenada.moneda.pago.lb !== 0
                ? quincenaOrdenada.moneda.pago.lb -
                  quincenaOrdenada.aranceles.lb
                : quincenaOrdenada.moneda.estadisticas.lb;
            const AdultPesos = cortePorcentaje * precioLb;
            //agregamos todo al array de adult
            dia.adult.push({
              id: adult.id,
              lb: adult.lb,
              corte: adult.corte,
              lbr: corte,
              pesos: AdultPesos,
            });
          }
        }
        //entrando a las propiedades de sender
        for (let sender of dias?.Senders) {
          // console.log("revisando array de senders", dias?.Senders);
          // console.log("sender", sender);
          // console.log("numero del dia", dias.name?.split("-")[0]);
          const diaPrimero = 1;
          const dia16 = 16;
          const curren = parseInt(dias.name?.split("-")[0]);
          //todo revisamos si es el dia primero
          if (diaPrimero === curren) {
            dia.sender.id = sender.id;
            dia.sender.totalCoins = sender.coins;
            const euros = sender.coins * sender.paginaS.valor;
            dia.sender.totalEuros = euros;
            const eurosPorcentaje = euros * quincenaOrdenada.porcentaje;
            const valorEuro =
              quincenaOrdenada.moneda.pago.euro !== 0
                ? quincenaOrdenada.moneda.pago.euro -
                  quincenaOrdenada.aranceles.euro
                : quincenaOrdenada.moneda.estadisticas.euro;
            const totalPesos = eurosPorcentaje * valorEuro;
            dia.sender.totalPesos = totalPesos;

            //todo revisamos si es el dia 16
          } else if (dia16 === curren) {
            // console.log("prueba dia 16", curren === dia16);
            //agregamos el id del dia actual al dia
            dia.sender.id = sender.id;
            //calculamos los coins del dia descontando los coins de quincena  anterior
            const coins = dia.qa ? sender.coins - dia?.qa : sender.coins;
            // console.log("coins", coins);
            // agregamos al dia el total de coins
            dia.sender.totalCoins = coins;
            //calculamos los euros del dia
            const euros = coins * sender.paginaS.valor;
            //agregamos los euros al total
            dia.sender.totalEuros = euros;
            //calculamos los euros por el porcentaje de la quincena
            const eurosPorcentaje = euros * quincenaOrdenada.porcentaje;
            const valorEuro =
              quincenaOrdenada.moneda.pago.euro !== 0
                ? quincenaOrdenada.moneda.pago.euro -
                  quincenaOrdenada.aranceles.euro
                : quincenaOrdenada.moneda.estadisticas.euro;
            //calculamos los pesos del dia
            const pesos = eurosPorcentaje * valorEuro;
            //agregamos los pesos al total
            dia.sender.totalPesos = pesos;

            //todo revisamos si es de la primera quincena
          } else if (curren > diaPrimero && curren < dia16) {
            //filtramos los dias anteriores
            //y ordenamos de mayor a menor
            const diaAnterior = q?.dias
              ?.filter((x) => parseInt(x.name?.split("-")[0]) < curren)
              .sort(
                (a, b) =>
                  parseInt(b.name?.split("-")[0]) -
                  parseInt(a.name?.split("-")[0])
              );
            // tomamos el ultimo dia anterior y restamos los coins
            const coins =
              diaAnterior[0]?.Senders[0]?.coins === sender.coins
                ? sender.coins
                : sender.coins - diaAnterior[0]?.Senders[0]?.coins;
            // agregamos al dia el total de coins y los coins del dia
            dia.sender.totalCoins = sender.coins;
            dia.sender.coinsDias = coins;
            // calculamos los euros del dia y el total de euros
            const eurosDia = coins * sender.paginaS.valor;
            const euros = sender.coins * sender.paginaS.valor;
            // agregamos los euros al dia y al total
            dia.sender.totalEuros = euros;
            dia.sender.eurosDias = eurosDia;
            //calculamos los euros por el porcentaje de la quincena
            const eurosPorcentajeDia = eurosDia * quincenaOrdenada.porcentaje;
            const eurosPorcentaje = euros * quincenaOrdenada.porcentaje;
            //calculamos el valor del euro
            // si hay moneda de pago, usamos el valor de pago de lo contrario usamos el de estadisticas
            // y restamos los aranceles
            const valorEuro =
              quincenaOrdenada.moneda.pago.euro !== 0
                ? quincenaOrdenada.moneda.pago.euro -
                  quincenaOrdenada.aranceles.euro
                : quincenaOrdenada.moneda.estadisticas.euro;
            //ca;lculamos los pesos del dia y el total
            const pesosDias = eurosPorcentajeDia * valorEuro;
            const totalPesos = eurosPorcentaje * valorEuro;
            // agregamos los pesos al dia y al total
            dia.sender.totalPesos = totalPesos;
            dia.sender.pesosDias = pesosDias;
            // agregamos el id del diaactual al dia
            dia.sender.id = sender.id;

            //todo revisamos si es de la segunda quincena
          } else if (curren > dia16) {
            // console.log("curren", curren === 21);
            // agregamos el id del diaactual al dia
            dia.sender.id = sender.id;
            //filtramos los dias anteriores
            //y ordenamos de mayor a menor
            const diaAnterior = q?.dias
              ?.filter((x) => parseInt(x.name?.split("-")[0]) < curren)
              .sort(
                (a, b) =>
                  parseInt(b.name?.split("-")[0]) -
                  parseInt(a.name?.split("-")[0])
              );
            // console.log("dia anterior", diaAnterior);
            // tomamos el ultimo dia anterior y restamos los coins
            const coins =
              diaAnterior[0]?.Senders[0]?.coins === sender.coins
                ? sender.coins
                : sender.coins - diaAnterior[0]?.Senders[0]?.coins;
            // agregamos al dia el total de coins y los coins del dia
            dia.sender.totalCoins = sender.coins;
            dia.sender.coinsDias = coins;
            // calculamos los euros del dia y el total de euros
            const eurosDia = coins * sender.paginaS.valor;
            const euros = sender.coins * sender.paginaS.valor;
            // agregamos los euros al dia y al total
            dia.sender.totalEuros = euros;
            dia.sender.eurosDias = eurosDia;
            //calculamos los euros por el porcentaje de la quincena
            const eurosPorcentajeDia = eurosDia * quincenaOrdenada.porcentaje;
            const eurosPorcentaje = euros * quincenaOrdenada.porcentaje;
            //calculamos el valor del euro
            // si hay moneda de pago, usamos el valor de pago de lo contrario usamos el de estadisticas
            // y restamos los aranceles
            const valorEuro =
              quincenaOrdenada.moneda.pago.euro !== 0
                ? quincenaOrdenada.moneda.pago.euro -
                  quincenaOrdenada.aranceles.euro
                : quincenaOrdenada.moneda.estadisticas.euro;
            //ca;lculamos los pesos del dia y el total
            const pesosDias = eurosPorcentajeDia * valorEuro;
            const totalPesos = eurosPorcentaje * valorEuro;
            // agregamos los pesos al dia y al total
            dia.sender.totalPesos = totalPesos;
            dia.sender.pesosDias = pesosDias;
          }
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
