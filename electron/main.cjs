const { app, BrowserWindow } = require("electron");
const path = require("path");

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      spellcheck: false, // 🔹 Desactiva el autocompletado
    },
  });

  mainWindow.loadURL(`file://${path.join(__dirname, "../dist/index.html")}`);

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
