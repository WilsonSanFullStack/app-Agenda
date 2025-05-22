const { Day, Adult, Page } = require("../db.cjs");
const { BrowserWindow } = require("electron");

const postAdult = async ({ page, day, lb, corte }) => {
  try {
    const dayId = await Day.findOne({ where: { id: day } });
    const pageId = await Page.findOne({ where: { id: page } });
    const newAdult = await Adult.create({ lb: lb, corte: corte });
    if (newAdult) {
      await newAdult.setDay(dayId);
      await newAdult.setPaginaA(pageId);
    }
    // 🔹 Enviar evento a React para actualizar la lista
    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send("adultActualizado", newAdult);
    });
    return newAdult;
  } catch (error) {
    return {
      success: false,
      message: "Error al subir los creditos de adult",
      error: error,
    };
  }
};

module.exports = { postAdult };
