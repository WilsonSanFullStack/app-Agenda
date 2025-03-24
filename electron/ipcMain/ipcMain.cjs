const { ipcMain } = require("electron");
const {
  postQuincena,
  getAllQuincenas,
  getQuincenaById,
  deleteQuincena,
} = require("../controller/quincena.cjs");
const { postDay, getAllDay } = require("../controller/day.cjs");
const { postPage, getAllPage } = require("../controller/page.cjs");
const { postSender, getAllCoins } = require("../controller/Sender.cjs");

//quincenas
ipcMain.handle("get-quincena", async () => {
  return await getAllQuincenas();
});
ipcMain.handle("get-quincena-By-Id", async (_, id) => {
  return await getQuincenaById(id);
});
//agregar quincena
ipcMain.handle("add-quincena", async (_, data) => {
  return await postQuincena(data);
});
//eliminar quincena
ipcMain.handle("delete-quincena", async (_, quincenaId) => {
  return await deleteQuincena(quincenaId);
});
// Dias 
ipcMain.handle("add-day", async (_, data) => {
  return await postDay(data);
});
// buscar dias
ipcMain.handle("get-day", async () => {
  return await getAllDay();
});
//Pages
ipcMain.handle("add-page", async (_, data) => {
  return await postPage(data);
});
// buscar pages
ipcMain.handle("get-page", async () => {
  return await getAllPage();
});
//sender
ipcMain.handle("add-sender", async (_, data) => {
  return await postSender(data);
});
// buscar sender
ipcMain.handle("get-sender", async () => {
  return await getAllCoins();
});
