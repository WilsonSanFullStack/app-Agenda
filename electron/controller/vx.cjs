const { Day, Vx, Page } = require("../db.cjs");
const { BrowserWindow } = require("electron");

const postVx = async ({ euros, page, day }) => {
  try {
    const dayId = await Day.findOne({ where: { id: day } });
    const pageId = await Page.findOne({ where: { id: page } });
    const newVx = await Vx.create({ creditos: euros });
    if (newVx) {
      await newVx.setDay(dayId);
      await newVx.setPage(pageId);
    }
    // 🔹 Enviar evento a React para actualizar la lista
    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send("VxaActualizado", newVx);
    });
    return newVx;
  } catch (error) {
    return {
      success: false,
      message: "Error al subir los Euros",
      error: error,
    };
  }
};

module.exports = { postVx };
