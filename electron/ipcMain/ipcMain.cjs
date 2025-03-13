const { ipcMain } = require("electron");
const {
  postQuincena,
  getAllQuincenas,
  deleteQuincena,
} = require("../controller/quincena.cjs");
const { postDay, getAllDay } = require("../controller/day.cjs");

ipcMain.handle("get-quincena", async () => {
  return await getAllQuincenas();
});
//agregar quincena
ipcMain.handle("add-quincena", async (_, data) => {
  return await postQuincena(data);
});
//eliminar quincena
ipcMain.handle("delete-quincena", async (_, quincenaId) => {
  return await deleteQuincena(quincenaId);
});

ipcMain.handle("add-day", async (_, data) => {
  return await postDay(data);
});
// buscar dias
ipcMain.handle("get-day", async () => {
  return await getAllDay();
});
