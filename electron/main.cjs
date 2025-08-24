const { app, BrowserWindow, ipcMain, Menu, nativeImage } = require("electron");
const path = require("path");
const chokidar = require("chokidar");
const { sequelize } = require("./db.cjs");

require("./ipcMain/ipcMain.cjs");

let mainWindow;

app.whenReady().then(async () => {
  await sequelize.sync({ force: true }); //sincroniza la db sin eliminar datos
  console.log("🔹 Base de datos lista");

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      enableRemoteModule: false,
      spellcheck: true, // 🔹 Desactiva el autocompletado
      preload: path.join(__dirname, "preload.cjs"),
    },
  });

  // ipcMain.handle();
  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:5173"); // 🔥 Carga desde Vite en dev
  } else {
    // mainWindow.loadFile("dist/index.html"); // 📦 Carga el archivo en producción
    mainWindow.loadURL(`file://${path.join(__dirname, "../dist/index.html")}`);
  }

  // 🔄 Detectar cambios en la carpeta de Vite y recargar Electron
  chokidar.watch("./dist").on("change", () => {
    if (mainWindow) {
      console.log("🔄 Recargando ventana...");
      mainWindow.reload();
    }
  });

  //manejo de otros ipcmain
  ipcMain.on("open-devtools", () => {
    if (mainWindow) {
      mainWindow.webContents.openDevTools();
    }
  });

  // Eventos para manejar acciones de la ventana desde el frontend
  ipcMain.on("window:minimize", () => {
    mainWindow.minimize();
  });

  ipcMain.on("window:maximize", () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });

  ipcMain.on("window:close", () => {
    mainWindow.close();
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
