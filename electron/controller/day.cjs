import { Day } from "../db.cjs";

const postDay = async (data) => {
  try {
    const [day, created] = await Day.findOrCreate({
      where: { name: data.name },
      defaults: {
        name: data.name,
        usd: data.usd,
        euro: data.euro,
        gbp: data.gbp,
        gbpParcial: data.gbpParcial,
        mostrar: data.mostrar,
        adelantos: data.adelantos,
        worked: data.worked,
      },
    });
    if (!created) return { error: "No fue posible crear el registro" };
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
const res = await Day.findByPk(id) 
return res
} catch (error) {
return {
      success: false,
      message: "Error al buscar el dia",
      error: error,
    };
}
};

module.exports = {postDay, getDay}