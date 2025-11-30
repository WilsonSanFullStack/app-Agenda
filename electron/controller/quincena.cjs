const path = require("path");

const { Quincena, Day } = require(path.join(__dirname, "..", "db.cjs"));
const { BrowserWindow } = require("electron");

const postQuincena = async (data) => {
  try {
    const [quincena, created] = await Quincena.findOrCreate({
      where: { name: data.name },
      defaults: {
        year: data.year,
        name: data.name,
        inicio: data.inicio,
        fin: data.fin,
      },
    });
    if (!created) {
      return { error: "La quincena ya existe" };
    }
    // 🔹 Enviar evento a React para actualizar la lista
    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send("quincenaActualizada", quincena);
    });
    return quincena;
  } catch (error) {
    return {
      success: false,
      message: "Error al crear la Quincenas",
      error: error,
    };
  }
};
const getAllQuincenaYear = async (year) => {
  try {
    const res = await Quincena.findAll({
      where: { year: year },
      order: [["inicio", "ASC"]],
      attributes: ["id", "name", "inicio", "fin", "year", "cerrado"],
    });
    const quincena = res?.map((x) => x.get({ plain: true }));
    return quincena;
  } catch (error) {
    return {
      success: false,
      message: "Error al obtener Quincenas",
      error: error,
    };
  }
};

//falta de auditoria para esta funciones
const getAllQuincenas = async (date) => {
  // console.log(date);
  try {
    const months = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ];
    const data = date?.split("-");
    const day = parseInt(data[1]);
    const monthIndex = months.indexOf(data[0].toLowerCase()) + 1;
    const year = parseInt(data[2]);
    // console.log("dia", day, "mes", monthIndex, "año", year);

    const respuesta = await Quincena?.findAll({
      where: { name: date },
      order: [["inicio", "ASC"]],
      attributes: ["id", "name", "inicio", "fin"],
      limit: 5,
    });
    // Ordenar por "inicio" de mayor a menor

    return respuesta;
  } catch (error) {
    return {
      success: false,
      message: "Error al obtener Quincenas",
      error: error,
    };
  }
};

const getQuincenaById = async (id) => {
  try {
    const res = await Quincena.findByPk(id, {
      include: [{ model: Day, as: "dias" }],
      attributes: ["id", "name", "inicio", "fin"],
    });
    if (!res) {
      return { error: "La quincena no existe" };
    }
    // 🔹 Formatear el objeto para quitar dataValues
    return {
      id: res.id,
      name: res.name,
      inicio: res.inicio,
      fin: res.fin,
      dias: res.dias.map((dia) => ({
        id: dia.id,
        name: dia.name,
        page: dia.page,
        coins: dia.coins,
        usd: dia.usd,
        euro: dia.euro,
        gbp: dia.gbp,
        gbpParcial: dia.gbpParcial,
        mostrar: dia.mostrar,
        adelantos: dia.adelantos,
        worked: dia.worked,
      })),
    };
  } catch (error) {
    return {
      success: false,
      message: "Error al obtener Quincena",
      error: error,
    };
  }
};


const deleteQuincena = async (quincenaId) => {
  try {
    return await Quincena.destroy({ where: { id: quincenaId } });
  } catch (error) {
    return {
      success: false,
      message: "Error al eliminar Quincena",
      error: error,
    };
  }
};

module.exports = {
  postQuincena,
  getAllQuincenaYear,
  getAllQuincenas,
  getQuincenaById,
  deleteQuincena,
};
