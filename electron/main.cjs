const { app, BrowserWindow, ipcMain, Menu, nativeImage } = require("electron");
const path = require("path");
const { Mes, Quincena, Dias, db } = require("./db.cjs");
const { error } = require("console");
const chokidar = require("chokidar");

let mainWindow;

app.whenReady().then(async () => {
  await db();
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

  mainWindow.webContents.openDevTools(); // 🔥 Abre DevTools para depurar

  // 🔄 Detectar cambios en la carpeta de Vite y recargar Electron
  chokidar.watch("./dist").on("change", () => {
    if (mainWindow) {
      console.log("🔄 Recargando ventana...");
      mainWindow.reload();
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

  //manejar IPC para obtener datos desde el frontend
  ipcMain.handle("get-quincena", async () => {
    const respuesta = await Quincena.findAll();// Ordenar por "inicio" de mayor a menor
    const res = respuesta.map((x) => x.dataValues);
    const sortedData = res.sort((a, b) => {
      const dateA = a.inicio.split('/').reverse().join('-'); // Convierte '01/01/2025' a '2025-01-01'
      const dateB = b.inicio.split('/').reverse().join('-'); // Convierte '16/01/2025' a '2025-01-16'
      return new Date(dateA) - new Date(dateB);
    });    return sortedData;
  });

  ipcMain.handle("add-quincena", async (_, data) => {
    try {
      const [nuevaQuincena, created] = await Quincena.findOrCreate({
        where: { name: data.name },
        defaults: {
          name: data.name,
          inicio: data.inicio,
          fin: data.fin,
        },
      });

      if (!created) {
        return { error: "La quincena ya existe" };
      }
      // 🔹 Enviar evento a React para actualizar la lista
      BrowserWindow.getAllWindows().forEach((win) => {
        win.webContents.send("quincenaActualizada", nuevaQuincena);
      });
      return nuevaQuincena;
    } catch (error) {
      console.log(error);
    }
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
