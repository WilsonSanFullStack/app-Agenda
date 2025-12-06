const { app, BrowserWindow, ipcMain, shell } = require("electron");
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
  // 🔧 Manejar la apertura de enlaces externos
// 🔧 SOLUCIÓN: Manejar TODOS los enlaces externos automáticamente
mainWindow.webContents.setWindowOpenHandler(({ url }) => {
  // Si es un enlace externo, ábrelo en el navegador del sistema
  if (url.startsWith('http://') || url.startsWith('https://')) {
    // Usa shell.openExternal para abrir en el navegador predeterminado
    shell.openExternal(url).catch(err => {
      console.error('Error al abrir URL externa:', err);
    });
    return { action: 'deny' }; // No permitas que Electron abra una ventana
  }
  return { action: 'allow' }; // Permite ventanas para otras URLs
});

// 🔧 También manejar navegación dentro de la misma ventana
mainWindow.webContents.on('will-navigate', (event, url) => {
  const parsedUrl = new URL(url);
  
  // Si la URL es externa (http/https), abrir en navegador
  if (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') {
    event.preventDefault();
    shell.openExternal(url).catch(err => {
      console.error('Error al abrir URL externa:', err);
    });
  }
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

  // Manejar enlaces de navegación externa
mainWindow.webContents.setWindowOpenHandler(({ url }) => {
  // Abrir enlaces http/https en el navegador del sistema
  if (url.startsWith('http://') || url.startsWith('https://')) {
    shell.openExternal(url);
    return { action: 'deny' }; // Evitar que Electron abra una nueva ventana
  }
  return { action: 'allow' };
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
