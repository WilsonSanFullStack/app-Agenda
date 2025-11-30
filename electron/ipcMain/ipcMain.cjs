const { ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

// --- CARGAR CONTROLADORES ---
function loadController(name) {
  const file = path.join(__dirname, "..", "controller", name);
  return fs.existsSync(file) ? require(file) : null;
}

const quincenaController = loadController("quincena.cjs");
const pageController = loadController("page.cjs");
const dayController = loadController("day.cjs");
const monedaController = loadController("moneda.cjs");
const arancelesController = loadController("aranceles.cjs");
const cerradoQController = loadController("cerradoQ.cjs");
const getQDataController = loadController("getQData.cjs");

// -------------------------------
// QUINCENA
// -------------------------------
if (quincenaController) {
  ipcMain.handle("add-quincena", (e, data) =>
    quincenaController.postQuincena(data)
  );

  ipcMain.handle("get-quincena-year", (e, year) =>
    quincenaController.getAllQuincenaYear(year)
  );

  ipcMain.handle("get-all-quincenas", () =>
    quincenaController.getAllQuincenas()
  );

  ipcMain.handle("get-quincena-by-id", (e, id) =>
    quincenaController.getQuincenaById(id)
  );

  ipcMain.handle("delete-quincena", (e, id) =>
    quincenaController.deleteQuincena(id)
  );
}

// -------------------------------
// PAGE
// -------------------------------
if (pageController) {
  ipcMain.handle("get-page", () => pageController.getAllPage());
  ipcMain.handle("get-all-page-name", () => pageController.getAllPageName());
  ipcMain.handle("add-page", (e, data) => pageController.postPage(data));
  ipcMain.handle("delete-page", (e, id) => pageController.deletePage(id));
}

// -------------------------------
// DAY
// -------------------------------
if (dayController) {
  ipcMain.handle("add-day", (e, data) => dayController.postDay(data));
  ipcMain.handle("delete-day", (e, id) => dayController.deleteDay(id));
}

// -------------------------------
// MONEDA
// -------------------------------
if (monedaController) {
  ipcMain.handle("add-moneda", (e, data) => monedaController.postMoneda(data));
}

// -------------------------------
// ARANCELES
// -------------------------------
if (arancelesController) {
  ipcMain.handle("post-aranceles", (e, data) =>
    arancelesController.postAranceles(data)
  );

  ipcMain.handle("get-aranceles", () =>
    arancelesController.getAranceles()
  );

  ipcMain.handle("update-aranceles", (e, data) =>
    arancelesController.updateAranceles(data)
  );

  ipcMain.handle("delete-arancel", (e, id) =>
    arancelesController.deleteArancel(id)
  );
}

// -------------------------------
// GET Q DATA
// -------------------------------
if (getQDataController) {
  ipcMain.handle("get-data-q", (e, data) =>
    getQDataController.getDataQ(data)
  );
}

// -------------------------------
// CERRAR / ABRIR QUINCENA
// -------------------------------
if (cerradoQController) {
  ipcMain.handle("cerrar-q", async (event, data) => {
    const result = await cerradoQController.cerrarQ(data);
    event.sender?.send("quincena-cerrada", result);
    return result;
  });

  ipcMain.handle("abrir-q", async (event, data) => {
    const result = await cerradoQController.abrirQ(data);
    event.sender?.send("quincena-abierta", result);
    return result;
  });
}

// -------------------------------
// PING
// -------------------------------
ipcMain.handle("ping", () => ({
  success: true,
  message: "pong",
  timestamp: new Date().toISOString(),
}));

module.exports = ipcMain;
