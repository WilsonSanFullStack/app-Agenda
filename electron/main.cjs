const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let mainWindow;

// ===== CARGAR MÓDULOS =====
async function loadModules() {
  const { sequelize } = require(path.join(__dirname, "db.cjs"));

  await sequelize.sync({ force: false });
  // require(path.join(__dirname, "db.cjs"));
  require(path.join(__dirname, "ipcMain", "ipcMain.cjs"));
}

// ===== MANEJADORES DE VENTANA =====
function setupWindowHandlers() {
  ipcMain.on("window:minimize", () => {
    mainWindow?.minimize();
  });

  ipcMain.on("window:maximize", () => {
    if (!mainWindow) return;
    mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
  });

  ipcMain.on("window:unmaximize", () => {
    mainWindow?.unmaximize();
  });

  ipcMain.on("window:close", () => {
    mainWindow?.close();
  });

  ipcMain.on("window:reload", () => {
    mainWindow?.reload();
  });

  ipcMain.on("window:reload-force", () => {
    mainWindow?.webContents.reloadIgnoringCache();
  });

  ipcMain.on("open-devtools", () => {
    mainWindow?.webContents.openDevTools();
  });
}

// ===== CARGAR FRONTEND =====
function loadWindowContent() {
  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    const htmlPath = path.join(__dirname, "..", "dist", "index.html");
    mainWindow.loadFile(htmlPath);
  }
}

// ===== CREAR VENTANA =====
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    frame: false,
    titleBarStyle: "hidden",
    show: false,
    icon: path.join(__dirname, "../dist/notebook.ico"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.cjs"),
    },
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
    mainWindow.focus();
    if (!app.isPackaged) {
      mainWindow.webContents.openDevTools();
    }
  });

  loadWindowContent();
  setupWindowHandlers();
}

// ===== APP READY =====
app.whenReady().then(async () => {
  await loadModules();
  
  createMainWindow();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
