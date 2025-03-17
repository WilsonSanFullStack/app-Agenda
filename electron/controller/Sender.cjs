const {Day, Sender, Page} = require("../db.cjs")
const { BrowserWindow } = require("electron");

const postSender = async ({coins, page, day}) => {
try {
  const dayId = await Day.findByPk(day)
  const pageId = await Page.findByPk(page)
const sender = await Sender.create({
  coins: coins
}) 
if (sender) {
  await sender.setDay(dayId)
  await sender.setPage(pageId)
}
 // 🔹 Enviar evento a React para actualizar la lista
 BrowserWindow.getAllWindows().forEach((win) => {
  win.webContents.send("senderaActualizado", sender);
});
return sender
} catch (error) {
  return {
    success: false,
    message: "Error al subir los coins",
    error: error,
  };
}
};

const getAllCoins = async () => {
try {
const res = await Sender.findAll({attributes: ["id", "coins"]})
const sender = res.map((x)=> x.dataValues)
return sender
} catch (error) {
  return {
    success: false,
    message: "Error al obtener los coins",
    error: error,
  };}
};

module.exports= {postSender, getAllCoins}