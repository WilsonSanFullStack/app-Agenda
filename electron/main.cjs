const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { Mes, Quincena, Dias, db } = require("./db.cjs");
const { error } = require("console");

let mainWindow;

app.whenReady().then(async () => {
  await db();
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      spellcheck: false, // 🔹 Desactiva el autocompletado
      preload: path.join(__dirname, "preload.js"),
    },
  });

  ipcMain.handle();

  mainWindow.loadURL(`file://${path.join(__dirname, "../dist/index.html")}`);
  // mainWindow.loadFile('index.html')

  //manejar IPC para obtener datos desde el frontend
  ipcMain.handle("get-quincena", async () => {
    return await Quincena.findAll();
  });

  ipcMain.handle("add-quincena", async (_, name) => {
    const q = await Quincena.findAll({ where: { name: name } });
    if (q) {
      console.log(error);
    } else {
      const quin = await Quincena.create({ where: { name: name } });
    }

    return quin;
  });

  ipcMain.handle("delete-quincena", async (_, quincenaId) => {
    return await Quincena.destroy({ where: { id: quincenaId } });
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
