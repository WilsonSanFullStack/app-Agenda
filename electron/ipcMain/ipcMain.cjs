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
const { postDirty } = require("../controller/dirty.cjs");
const { postAdult } = require("../controller/adult.cjs");
const { postVx } = require("../controller/vx.cjs");
const { postLive7 } = require("../controller/live7.cjs");
const { postMoneda } = require("../controller/moneda.cjs");
const { getAllsQuincenas } = require("../controller/serchAllQuincena.cjs");


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
//dirty
ipcMain.handle("add-dirty", async (_, data) => {
  return await postDirty(data);
});
//adult
ipcMain.handle("add-adult", async (_, data) => {
  return await postAdult(data);
});
//vx
ipcMain.handle("add-vx", async (_, data) => {
  return await postVx(data);
});
//7live
ipcMain.handle("add-live7", async (_, data) => {
  return await postLive7(data);
});
//monedas
ipcMain.handle("add-moneda", async (_, data) => {
  return await postMoneda(data);
});
//getAllQuincena
ipcMain.handle("get-all-quincena", async () => {
  return await getAllsQuincenas();
});
