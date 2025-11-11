const { ipcMain } = require("electron");
const {
  postQuincena,
  getAllQuincenas,
  getAllQuincenaYear,
  getQuincenaById,
  deleteQuincena,
} = require("../controller/quincena.cjs");
const { postDay, deleteDay } = require("../controller/day.cjs");
const {
  postPage,
  getAllPage,
  getAllPageName,
} = require("../controller/page.cjs");
const { postMoneda } = require("../controller/moneda.cjs");
const { getDataQ } = require("../controller/getQData.cjs");
const {
  postAranceles,
  getAranceles,
  updateAranceles,
  deleteArancel,
} = require("../controller/aranceles.cjs");
const { cerrarQ, abrirQ, } = require("../controller/cerradoQ.cjs");

//quincenas
ipcMain.handle("get-quincena", async (_, date) => {
  return await getAllQuincenas(date);
});
ipcMain.handle("get-quincena-year", async (_, year) => {
  return await getAllQuincenaYear(year);
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
ipcMain.handle("get-day", async (_, id) => {
  return await getDay(id);
});
ipcMain.handle("delete-day", async (_, id) => {
  return await deleteDay(id);
});
// Pages
ipcMain.handle("add-page", async (_, data) => {
  return await postPage(data);
});
// buscar pages
ipcMain.handle("get-page", async () => {
  return await getAllPage();
});
// buscar pages return solo name
ipcMain.handle("get-page-name", async () => {
  return await getAllPageName();
});
//monedas
ipcMain.handle("add-moneda", async (_, data) => {
  return await postMoneda(data);
});
//getAllQuincena
ipcMain.handle("get-data-quincena", async (_, data) => {
  return await getDataQ(data);
});
//postAranceles
ipcMain.handle("post-aranceles", async (_, data) => {
  return await postAranceles(data);
});
// getAranceles
ipcMain.handle("get-aranceles", async () => {
  return await getAranceles();
});
// updateAranceles
ipcMain.handle("update-aranceles", async (_, data) => {
  return await updateAranceles(data);
});
//deleteAranceles
ipcMain.handle("delete-aranceles", async (_, id) => {
  return await deleteArancel(id);
});
//cerrar quincena
ipcMain.handle("cerrar-quincena", async (_, id) => {
  return await cerrarQ(id);
});
//abrir quincena
ipcMain.handle("abrir-quincena", async (_, id) => {
  return await abrirQ(id);
});
