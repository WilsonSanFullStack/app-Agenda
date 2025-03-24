const {Day, Sender, Page} = require("../db.cjs")
const { BrowserWindow } = require("electron");

const postSender = async ({ page, day, coins}) => {
try {
  const dayId = await Day.findOne({where:{ id: day}})
  const pageId = await Page.findOne({where:{id: page}})
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