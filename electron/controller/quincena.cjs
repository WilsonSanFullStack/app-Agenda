const { Quincena, Day } = require("../db.cjs");
const { BrowserWindow } = require("electron");

const postQuincena = async (data) => {
  try {
    const [nuevaQuincena, created] = await Quincena.findOrCreate({
      where: { name: data.name },
      defaults: {
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
      win.webContents.send("quincenaActualizada", nuevaQuincena);
    });
    return nuevaQuincena;
  } catch (error) {
    return {
      success: false,
      message: "Error al crear la Quincenas",
      error: error,
    };
  }
};

const getAllQuincenas = async () => {
  try {
    const respuesta = await Quincena?.findAll(); // Ordenar por "inicio" de mayor a menor
    const res = respuesta?.map((x) => x?.dataValues);
    const sortedData = res?.sort((a, b) => {
      const dateA = a?.inicio?.split("/")?.reverse()?.join("-"); // Convierte '01/01/2025' a '2025-01-01'
      const dateB = b?.inicio?.split("/")?.reverse()?.join("-"); // Convierte '16/01/2025' a '2025-01-16'
      return new Date(dateA) - new Date(dateB);
    });
    return sortedData;
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
    console.log(id)
    const res = await Quincena.findByPk(id, {
      include: [{model: Day, as: "dias", attributes: ["id", "name"]}],
      attributes: ["id", "name", "inicio", "fin"]
    })
    if (!res) {
      return {error: "La quincena no existe"}
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
      })),
    };
  } catch (error) {
    return {
      success: false,
      message: "Error al obtener Quincena",
      error: error,
    };
  }
}

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
  getAllQuincenas,
  getQuincenaById,
  deleteQuincena,
};
