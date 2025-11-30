const path = require("path");

const { Page } = require(path.join(__dirname, "..", "db.cjs"));
const { BrowserWindow } = require("electron");

const postPage = async ({
  name,
  coins,
  valorCoins,
  moneda,
  mensual,
  tope,
  descuento,
}) => {
  try {
    const [nuevaPage, created] = await Page.findOrCreate({
      where: { name: name },
      defaults: {
        name: name,
        coins: coins,
        moneda: moneda,
        mensual: mensual,
        valorCoins: valorCoins,
        tope: tope,
        descuento: descuento,
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
      attributes: [
        "name",
        "id",
        "coins",
        "moneda",
        "mensual",
        "valorCoins",
        "tope",
        "descuento",
      ],
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
const getAllPageName = async () => {
  try {
    const pages = await Page.findAll({
      attributes: ["name", "id", "moneda", "coins", "valorCoins", "tope"],
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
const deletePage = async (id) => {
  try {
    // 🔍 Verificar que la página existe
    const page = await Page.findByPk(id);
    
    if (!page) {
      return { 
        success: false, 
        message: "La página no existe",
        error: "Página no encontrada" 
      };
    }

    // 🗑️ Eliminar la página
    await Page.destroy({
      where: { id: id }
    });

    // 🔹 Enviar evento a React para actualizar la lista
    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send("page-actualizado", { 
        id: id, 
        action: "deleted" 
      });
    });

    return { 
      success: true, 
      message: "Página eliminada correctamente",
      deletedPage: page.dataValues
    };

  } catch (error) {
    console.error("❌ Error eliminando página:", error);
    return {
      success: false,
      message: "Error al eliminar la página",
      error: error.message,
    };
  }
};
module.exports = { postPage, getAllPage, getAllPageName, deletePage };
