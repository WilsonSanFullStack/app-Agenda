const { Day, Live7, Page } = require("../db.cjs");
const { BrowserWindow } = require("electron");

const postLive7 = async ({ creditos, page, day }) => {
  try {
    const dayId = await Day.findOne({ where: { id: day } });
    const pageId = await Page.findOne({ where: { id: page } });
    const newLive7 = await Live7.create({ creditos: creditos });
    if (newLive7) {
      await newLive7.setDay(dayId);
      await newLive7.setPage(pageId);
    }
    // 🔹 Enviar evento a React para actualizar la lista
    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send("live7aActualizado", newLive7);
    });
    return newLive7;
  } catch (error) {
    return {
      success: false,
      message: "Error al subir los euros",
      error: error,
    };
  }
};

module.exports = { postLive7 };
