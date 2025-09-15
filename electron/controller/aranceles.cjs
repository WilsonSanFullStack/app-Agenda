const { Aranceles } = require("../db.cjs");
const { BrowserWindow } = require("electron");


const postAranceles = async ({ dolar, euro, gbp, parcial }) => {
  try {
    const arancel = await Aranceles.create({
      dolar,
      euro,
      gbp,
    });
    // 🔹 Enviar evento a React para actualizar la lista
    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send("ArancelActualizado", arancel);
    });
    return arancel;
  } catch (error) {
    return {
      sucess: false,
      message: "Error al registrar los aranceles",
      error: error,
    };
  }
};

const getAranceles = async () => {
  try {
    const res = await Aranceles.findAll();
    const rest =  res.map(x => x.get({plain: true}));
    return rest;
  } catch (error) {
    return {
      sucess: false,
      message: "Error al buscasr los aranceles",
      error: error,
    };
  }
};

const updateAranceles = async ({ id, arancel }) => {
  try {
    const update = await Aranceles.findByPk(id);
    if (!update) {
      return {
        sucess: false,
        message: "Error al editar los aranceles",
        error: error,
      };
    }
    await update.update(arancel);
    const updateAracencel = await Aranceles.findByPk(id);
    const rest =  updateAracencel.get({plain: true});
    // 🔹 Enviar evento a React para actualizar la lista
    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send("ArancelActualizado", rest);
    });
    return rest;
  } catch (error) {
    return {
      sucess: false,
      message: "Error al editar los aranceles",
      error: error,
    };
  }
};

const deleteArancel = async (id) => {
  try {
    const deleteArancel = await Aranceles.findByPk(id);
    if (!deleteArancel) {
      return {
        sucess: false,
        message: "Error al eliminar el arancel",
        error: error,
      };
    }
    await deleteArancel.destroy();
    // 🔹 Enviar evento a React para actualizar la lista
    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send("ArancelActualizado", {
        message: "Fue eliminar el arancel",
      });
    });
    return { message: "Fue eliminar el arancel" };
  } catch (error) {
    return {
      sucess: false,
      message: "Error al eliminar el arancel",
      error: error,
    };
  }
};

module.exports = {
  postAranceles,
  getAranceles,
  updateAranceles,
  deleteArancel,
};
