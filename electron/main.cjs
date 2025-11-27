const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

console.log("🚀 ELECTRON INICIANDO...");
console.log("📁 Directorio actual:", __dirname);

let mainWindow;

// 🔧 CARGAR IPC MAIN DE FORMA SEGURA
function loadIpcMain() {
  const ipcMainPath = path.join(__dirname, "ipcMain", "ipcMain.cjs");
  console.log("📁 Ruta de IPC Main:", ipcMainPath);
  console.log("📁 ¿Existe el archivo?", fs.existsSync(ipcMainPath));

  if (fs.existsSync(ipcMainPath)) {
    try {
      require(ipcMainPath);
      console.log("✅ IPC Main cargado exitosamente");
    } catch (error) {
      console.error("❌ Error cargando IPC Main:", error);
    }
  } else {
    console.error("❌ Archivo IPC Main NO encontrado");
  }
}

// 🔧 CONFIGURAR MANEJADORES DE VENTANA
function setupWindowHandlers() {
  // 🔧 MANEJADORES PARA EL CONTROL DE VENTANA
  ipcMain.on("window:minimize", () => {
    if (mainWindow) {
      mainWindow.minimize();
    }
  });

  ipcMain.on("window:maximize", () => {
    if (mainWindow) {
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
      } else {
        mainWindow.maximize();
      }
    }
  });

  ipcMain.on("window:unmaximize", () => {
    if (mainWindow) {
      mainWindow.unmaximize();
    }
  });

  ipcMain.on("window:close", () => {
    if (mainWindow) {
      mainWindow.close();
    }
  });

  // 🔧 MANEJADORES PARA RECARGAS
  ipcMain.on("window:reload", () => {
    if (mainWindow) {
      mainWindow.reload();
    }
  });

  ipcMain.on("window:reload-force", () => {
    if (mainWindow) {
      mainWindow.webContents.reloadIgnoringCache();
    }
  });

  // 🔧 MANEJADOR PARA HERRAMIENTAS DE DESARROLLO
  ipcMain.on("open-devtools", () => {
    if (mainWindow) {
      mainWindow.webContents.openDevTools();
    }
  });
}

// 🔧 CONFIGURAR EVENTOS DE VENTANA
function setupWindowEvents() {
  if (!mainWindow) return;

  // 🔹 EVENTOS DE DEBUG
  mainWindow.webContents.on("did-finish-load", () => {
    console.log("✅ Contenido cargado correctamente");
  });

  mainWindow.webContents.on(
    "did-fail-load",
    (event, errorCode, errorDescription) => {
      console.log("❌ Error cargando contenido:", errorCode, errorDescription);
    }
  );

  mainWindow.on("ready-to-show", () => {
    console.log("✅ Ventana lista para mostrar - MOSTRANDO...");
    mainWindow.show();
    mainWindow.focus();

    // 🔹 SOLO abrir DevTools en desarrollo
    if (process.env.NODE_ENV === "development") {
      mainWindow.webContents.openDevTools();
    }
  });

  mainWindow.on("show", () => {
    console.log("👀 Ventana VISIBLE en pantalla");
  });

  mainWindow.on("closed", () => {
    console.log("🔴 Ventana cerrada");
    mainWindow = null;
  });

  // 🔧 EVENTOS DE ESTADO DE VENTANA
  mainWindow.on("maximize", () => {
    if (mainWindow) {
      mainWindow.webContents.send("window:maximized");
    }
  });

  mainWindow.on("unmaximize", () => {
    if (mainWindow) {
      mainWindow.webContents.send("window:unmaximized");
    }
  });
}

// 🔧 CARGAR CONTENIDO DE LA VENTANA
function loadWindowContent() {
  if (!mainWindow) return;

  const devURL = "http://localhost:5173";
  const prodPath = path.join(__dirname, "..", "dist", "index.html");

  console.log("🔍 Rutas verificadas:");
  console.log("   - Desarrollo:", devURL);
  console.log("   - Producción:", prodPath);
  console.log("   - ¿Existe dist/index.html?", fs.existsSync(prodPath));

  if (process.env.NODE_ENV === "development") {
    console.log("🔧 MODO DESARROLLO - Cargando desde Vite...");
    mainWindow.loadURL(devURL).catch((err) => {
      console.error("❌ Error cargando URL de desarrollo:", err);
      loadEmergencyHTML();
    });
  } else {
    console.log("📦 MODO PRODUCCIÓN - Cargando archivo local...");

    // 🔹 INTENTAR DIFERENTES RUTAS
    const possiblePaths = [
      path.join(__dirname, "..", "dist", "index.html"),
      path.join(process.resourcesPath, "app", "dist", "index.html"),
      path.join(process.cwd(), "dist", "index.html"),
    ];

    let loaded = false;
    for (const htmlPath of possiblePaths) {
      if (fs.existsSync(htmlPath)) {
        console.log("✅ Cargando desde:", htmlPath);
        mainWindow.loadFile(htmlPath).catch((err) => {
          console.error("❌ Error cargando archivo:", htmlPath, err);
        });
        loaded = true;
        break;
      } else {
        console.log("❌ No existe:", htmlPath);
      }
    }

    if (!loaded) {
      console.log(
        "❌ NO SE ENCONTRÓ NINGÚN ARCHIVO HTML - Creando HTML de emergencia"
      );
      loadEmergencyHTML();
    }
  }
}

// 🔧 CARGAR HTML DE EMERGENCIA
function loadEmergencyHTML() {
  if (!mainWindow) return;

  const emergencyHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>AppAgenda - EMERGENCY</title>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                padding: 40px; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                text-align: center;
            }
            h1 { font-size: 2.5em; margin-bottom: 20px; }
            p { font-size: 1.2em; margin-bottom: 10px; }
            .info { 
                background: rgba(255,255,255,0.1); 
                padding: 20px; 
                border-radius: 10px; 
                margin: 20px 0; 
                text-align: left;
            }
            .button {
                background: #4CAF50;
                color: white;
                padding: 10px 20px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                margin: 5px;
            }
            .button:hover {
                background: #45a049;
            }
        </style>
    </head>
    <body>
        <h1>🚨 MODO EMERGENCIA</h1>
        <p>La aplicación se está ejecutando pero no encontró los archivos.</p>
        <div class="info">
            <p><strong>Directorio:</strong> ${__dirname}</p>
            <p><strong>Plataforma:</strong> ${process.platform}</p>
            <p><strong>Recursos:</strong> ${process.resourcesPath}</p>
            <p><strong>Modo:</strong> ${
              process.env.NODE_ENV || "production"
            }</p>
        </div>
        <p>✅ Electron está funcionando correctamente</p>
        <div>
            <button class="button" onclick="window.location.reload()">Reintentar Carga</button>
            <button class="button" onclick="window.Electron?.openDevTools?.()">Abrir Consola</button>
        </div>
    </body>
    </html>
  `;

  mainWindow.loadURL(
    `data:text/html;charset=utf-8,${encodeURIComponent(emergencyHTML)}`
  );
}

function createWindow() {
  console.log("🪟 Creando ventana principal...");

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    icon: path.join(__dirname, "../dist/notebook.ico"),
    frame: false, // 🔹 NAVBAR PERSONALIZADA
    titleBarStyle: "hidden",
    show: false, // 🔹 No mostrar hasta que esté lista
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      spellcheck: false,
      preload: path.join(__dirname, "preload.cjs"),
    },
  });

  console.log("✅ Ventana creada");

  // 🔧 CONFIGURAR EVENTOS Y MANEJADORES
  setupWindowEvents();
  setupWindowHandlers();

  // 🔧 CARGAR CONTENIDO
  loadWindowContent();
}

// 🔹 INICIAR APLICACIÓN
app.whenReady().then(() => {
  console.log("🎉 APP READY - Creando ventana...");

  // 🔧 CARGAR IPC PRIMERO
  loadIpcMain();

  // 🔧 CREAR VENTANA
  createWindow();
});

app.on("activate", () => {
  console.log("🔹 App activada");
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("window-all-closed", () => {
  console.log("🔴 Todas las ventanas cerradas - Saliendo...");
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// 🔹 ERROR HANDLING
process.on("uncaughtException", (error) => {
  console.error("💥 ERROR NO CAPTURADO:", error);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("💥 PROMESA RECHAZADA NO MANEJADA:", reason);
});

console.log("🔹 MAIN.JS CARGADO - Esperando app.ready...");
