const path = require("path");

const { Aranceles } = require(path.join(__dirname, "..", "db.cjs"));
const { BrowserWindow } = require("electron");


const postAranceles = async ({ dolar, euro, gbp, porcentaje }) => {
  try {
    // 🔹 ELIMINAR TODOS LOS ARANCELES ANTERIORES
    await Aranceles.destroy({
      where: {}, // Elimina todos los registros
      truncate: false
    });

    // 🔹 CREAR EL NUEVO ARANCEL
    const arancel = await Aranceles.create({
      dolar,
      euro,
      gbp,
      porcentaje
    });
    
    const arancelPlain = arancel.get({ plain: true });
    
    // 🔹 Enviar evento a React para actualizar la lista
    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send("ArancelActualizado", arancelPlain);
    });
    
    return arancelPlain;
  } catch (error) {
    return {
      success: false,
      message: "Error al registrar los aranceles",
      error: error.message,
    };
  }
};

const getAranceles = async () => {
  try {
    const res = await Aranceles.findOne({
      order: [['createdAt', 'DESC']] // Siempre obtiene el más reciente
    });
    
    if (!res) {
      return {
        success: false,
        message: "No se encontraron aranceles"
      };
    }
    
    return res.get({ plain: true });
  } catch (error) {
    return {
      success: false,
      message: "Error al buscar los aranceles",
      error: error.message,
    };
  }
};

const updateAranceles = async ({ id, arancel }) => {
  try {
    const update = await Aranceles.findByPk(id);
    if (!update) {
      return {
        success: false,
        message: "Arancel no encontrado",
      };
    }
    
    await update.update(arancel);
    const updateArancel = await Aranceles.findByPk(id);
    const rest = updateArancel.get({ plain: true });
    
    // 🔹 Enviar evento a React para actualizar la lista
    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send("ArancelActualizado", rest);
    });
    
    return rest;
  } catch (error) {
    return {
      success: false,
      message: "Error al editar los aranceles",
      error: error.message,
    };
  }
};

const deleteArancel = async (id) => {
  try {
    const deleteArancel = await Aranceles.findByPk(id);
    if (!deleteArancel) {
      return {
        success: false,
        message: "Arancel no encontrado",
      };
    }
    
    await deleteArancel.destroy();
    
    // 🔹 Enviar evento a React para actualizar la lista
    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send("ArancelActualizado", {
        message: "Arancel eliminado correctamente",
      });
    });
    
    return { 
      success: true,
      message: "Arancel eliminado correctamente" 
    };
  } catch (error) {
    return {
      success: false,
      message: "Error al eliminar el arancel",
      error: error.message,
    };
  }
};

module.exports = {
  postAranceles,
  getAranceles,
  updateAranceles,
  deleteArancel,
};