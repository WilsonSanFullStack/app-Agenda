const { Day, Dirty, Page } = require("../db.cjs");
const { BrowserWindow } = require("electron");

const postDirty = async ({ dolares, mostrar, page, day }) => {
  try {
    const dayId = await Day.findOne({ where: { id: day } });
    const pageId = await Page.findOne({ where: { id: page } });
    const newDirty = await Dirty.create({ dolares: dolares, mostrar: mostrar });
    if (newDirty) {
      await newDirty.setDay(dayId);
      await newDirty.setPaginaD(pageId);
    }
    // 🔹 Enviar evento a React para actualizar la lista
    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send("dirtyaActualizado", newDirty);
    });
    return newDirty;
  } catch (error) {
    return {
      success: false,
      message: "Error al subir los dolares",
      error: error,
    };
  }
};

module.exports = { postDirty };
