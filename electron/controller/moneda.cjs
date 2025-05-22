const { Quincena, Moneda,  } = require("../db.cjs");
const { BrowserWindow } = require("electron");

const postMoneda = async ({ dolar, euro, lb, pago, quincena }) => {
  try {
    const quincenaId = await Quincena.findOne({ where: { id: quincena } });
    const newMoneda = await Moneda.create({ dolar: dolar, euro: euro, lb: lb, pago: pago });
    if (newMoneda) {
      await newMoneda.setQuincena(quincenaId);
    }
    // 🔹 Enviar evento a React para actualizar la lista
    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send("monedasaActualizado", newMoneda);
    });
    return newMoneda;
  } catch (error) {
    return {
      success: false,
      message: "Error al subir las monedas",
      error: error,
    };
  }
};



module.exports = { postMoneda };
