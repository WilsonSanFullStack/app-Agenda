const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const {Mes, Quincena, Dias}= require('./db.js')

let mainWindow;

app.whenReady().then(() => {
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

  ipcMain.handle()

  mainWindow.loadURL(`file://${path.join(__dirname, "../dist/index.html")}`);
  // mainWindow.loadFile('index.html')

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
