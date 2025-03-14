const {Day, Quincena} = require("../db.cjs")
const { BrowserWindow } = require("electron");

const postDay = async (data) => {
  try {
    const quince = await Quincena.findByPk(data.q)
    const [nuevoDia, created] = await Day.findOrCreate({
      where: { name: data.dia },
      defaults: {
        name: data.dia,
      },
    });
    if (!created) {
      return { error: "El dia ya existe" };
    }
    await nuevoDia.setQuincena(quince);
    // 🔹 Enviar evento a React para actualizar la lista
    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send("dayActualizado", nuevoDia);
    });
    return nuevoDia;
  } catch (error) {
    return { success: false, message: "Error al crear la Day", error: error  };

  }
}

const getAllDay = async () => {
  try {
    const respuesta = await Day.findAll();
    const res = respuesta.map((x) => x.dataValues);
    return res;
  } catch (error) {
    return { success: false, message: "Error al obtener Day", error: error  };
  }
}

module.exports = {postDay, getAllDay}
// buscar dias
