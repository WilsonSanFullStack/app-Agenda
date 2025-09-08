const { Day, Quincena } = require("../db.cjs")
const { BrowserWindow } = require("electron");

const postDay = async (data) => {
  try {
    const q = await Quincena.findByPk(data.q);
    const day = await Day.create({
        name: data.name,
        coins: data.coins,
        usd: data.usd,
        euro: data.euro,
        gbp: data.gbp,
        gbpParcial: data.gbpParcial,
        mostrar: data.mostrar,
        adelantos: data.adelantos,
        worked: data.worked,
        page: data.page
    });
    if (day) {
      await day.setQuincena(q);

    }
    // 🔹 Enviar evento a React para actualizar la lista
    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send("dayActualizado", day);
    });
    return day;
  } catch (error) {
    return {
      success: false,
      message: "Error al crear el dia",
      error: error,
    };
  }
};

const getDay = async (id) => {
  try {
    const res = await Day.findByPk(id);
    return res;
  } catch (error) {
    return {
      success: false,
      message: "Error al buscar el dia",
      error: error,
    };
  }
};

module.exports = { postDay, getDay };
