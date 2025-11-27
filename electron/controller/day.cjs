const path = require("path");

const { Day, Quincena } = require(path.join(__dirname, "..", "db.cjs"));
const { BrowserWindow } = require("electron");

const postDay = async (data) => {
  try {
    const q = await Quincena.findByPk(data.q);
    // buscar si ya existe un día con el mismo name y page
    const existingDay = await Day.findOne({
      where: { name: data.name, page: data.page },
    });
     // si existe, lo borramos
    if (existingDay) {
      await existingDay.destroy();
    }
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

const deleteDay = async (id) => {
  try {
    const dayDelete = await Day.findByPk(id);
    if (!dayDelete) {
      return {
        sucess: false,
        message: "Error al eliminar el arancel",
        error: error,
      };
    }
    await dayDelete.destroy();
    // 🔹 Enviar evento a React para actualizar la lista
    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send("ArancelActualizado", {
        message: "Se elimino el dia",
      });
    });
    return { message: "Se elimino el dia" };
  } catch (error) {
    return {
      sucess: false,
      message: "Error al eliminar el dia",
      error: error,
    };
  }
};

module.exports = { postDay, getDay, deleteDay };
