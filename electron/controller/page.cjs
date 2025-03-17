const { Page } = require("../db.cjs");
const { BrowserWindow } = require("electron");

const postPage = async ({ name, coins, moneda, mensual, valor, tope }) => {
  try {
    const [nuevaPage, created] = await Page.findOrCreate({
      where: { name: name },
      defaults: {
        name: name,
        coins: coins,
        moneda: moneda,
        mensual: mensual,
        valor: valor,
        tope: tope,
      },
    });
    if (!created) {
      return { error: "La pagina ya existe" };
    }
    // 🔹 Enviar evento a React para actualizar la lista
    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send("pageActualizado", nuevaPage);
    });
    return nuevaPage;
  } catch (error) {
    return {
      success: false,
      message: "Error al crear la Pagina",
      error: error,
    };
  }
};

const getAllPage = async () => {
  try {
    const pages = await Page.findAll({
      attributes: ["name", "id", "coins", "moneda", "mensual", "valor", "tope"],
    });
    const res = pages.map((x) => x.dataValues);
    return res;
  } catch (error) {
    return {
      success: false,
      message: "Error al obtener las Paginas",
      error: error,
    };
  }
};

module.exports = { postPage, getAllPage };
