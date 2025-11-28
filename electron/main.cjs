const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

let mainWindow;
let diagnosticLogs = [];

function sendToFrontend(message, type = 'info') {
  diagnosticLogs.push({ message, type, timestamp: new Date().toISOString() });
  console.log(`${type === 'error' ? '❌' : '✅'} ${message}`);
}

// 🔧 VERIFICAR HANDLERS IPC (MÉTODO CORREGIDO)
function verifyIpcHandlers() {
  sendToFrontend('🔍 Verificando handlers IPC...');
  const testHandlers = ['get-page', 'ping'];
  const registeredHandlers = ipcMain.eventNames();
  
  testHandlers.forEach(handler => {
    if (registeredHandlers.includes(handler)) {
      sendToFrontend(`   ✅ ${handler} registrado`);
    } else {
      sendToFrontend(`   ❌ ${handler} NO registrado`, 'error');
    }
  });
}

// 🔧 CONFIGURAR RUTA DE BASE DE DATOS PARA PRODUCCIÓN
function getDatabasePath() {
  if (app.isPackaged) {
    // En producción: usar AppData del usuario
    const userDataPath = app.getPath('userData');
    const dbPath = path.join(userDataPath, 'database.sqlite');
    sendToFrontend(`📁 Ruta DB producción: ${dbPath}`);
    return dbPath;
  } else {
    // En desarrollo: usar ruta local
    const devDbPath = path.join(__dirname, 'database.sqlite');
    sendToFrontend(`📁 Ruta DB desarrollo: ${devDbPath}`);
    return devDbPath;
  }
}

// 🔧 DIAGNÓSTICO ESPECÍFICO DE LA BASE DE DATOS (CORREGIDO)
async function diagnoseDatabase() {
  sendToFrontend('🗄️ DIAGNÓSTICO DE BASE DE DATOS');
  
  try {
    // Cargar db.cjs
    const dbPath = path.join(__dirname, 'db.cjs');
    sendToFrontend(`📁 Cargando: ${dbPath}`);
    
    const dbModule = require(dbPath);
    sendToFrontend('✅ db.cjs cargado');

    // Verificar sequelize
    if (!dbModule.sequelize) {
      throw new Error('sequelize no está exportado en db.cjs');
    }
    sendToFrontend('✅ sequelize encontrado');

    // OBTENER RUTA CORRECTA DE LA BASE DE DATOS
    const correctDbPath = getDatabasePath();
    
    // Actualizar la configuración de sequelize con la ruta correcta
    const sequelize = dbModule.sequelize;
    sequelize.options.storage = correctDbPath;
    
    sendToFrontend(`📊 Configuración sequelize actualizada:`);
    sendToFrontend(`   - Dialect: ${sequelize.options.dialect}`);
    sendToFrontend(`   - Storage: ${sequelize.options.storage}`);
    sendToFrontend(`   - Logging: ${sequelize.options.logging}`);

    // Verificar si el directorio de la DB existe
    const dbDir = path.dirname(correctDbPath);
    sendToFrontend(`📁 Directorio de DB: ${dbDir}`);
    
    if (!fs.existsSync(dbDir)) {
      sendToFrontend(`⚠️ Directorio no existe, creando: ${dbDir}`);
      fs.mkdirSync(dbDir, { recursive: true });
    }

    // Verificar permisos de escritura
    try {
      const testFile = path.join(dbDir, 'test-write.txt');
      fs.writeFileSync(testFile, 'test');
      fs.unlinkSync(testFile);
      sendToFrontend('✅ Permisos de escritura OK');
    } catch (error) {
      sendToFrontend(`❌ Sin permisos de escritura en: ${dbDir}`, 'error');
      throw error;
    }

    // Verificar modelos cargados en sequelize
    sendToFrontend('🔍 Verificando modelos en sequelize...');
    const modelNames = Object.keys(sequelize.models);
    sendToFrontend(`📊 Modelos cargados: ${modelNames.length}`);
    modelNames.forEach(name => {
      sendToFrontend(`   ✅ ${name}`);
    });

    if (modelNames.length === 0) {
      throw new Error('No se cargaron modelos en sequelize');
    }

    // DIAGNÓSTICO DETALLADO: Verificar cada modelo individualmente
    sendToFrontend('🔍 Diagnóstico detallado de modelos...');
    for (const modelName of modelNames) {
      try {
        const model = sequelize.models[modelName];
        sendToFrontend(`   ✅ Modelo ${modelName}: OK`);
        
        // Verificar atributos del modelo
        const attributes = Object.keys(model.rawAttributes || {});
        sendToFrontend(`      Atributos: ${attributes.length}`);
        
      } catch (error) {
        sendToFrontend(`   ❌ Error en modelo ${modelName}: ${error.message}`, 'error');
      }
    }

    // INTENTAR SINCRONIZACIÓN CON MÁS DETALLES
    sendToFrontend('🔄 Intentando sincronización...');
    
    try {
      await sequelize.authenticate();
      sendToFrontend('✅ Autenticación con DB exitosa');
    } catch (authError) {
      sendToFrontend(`❌ Error de autenticación: ${authError.message}`, 'error');
      throw authError;
    }

    // Sincronizar con opciones específicas
    const syncOptions = {
      force: false,
      alter: false,
      logging: (sql) => {
        sendToFrontend(`   📝 SQL: ${sql}`, 'info');
      }
    };

    sendToFrontend('🔧 Sincronizando con opciones:', syncOptions);
    await sequelize.sync(syncOptions);
    sendToFrontend('✅ Sincronización completada');

    return true;

  } catch (error) {
    sendToFrontend(`💥 ERROR en diagnoseDatabase: ${error.message}`, 'error');
    
    // Información adicional del error
    if (error.original) {
      sendToFrontend(`   📌 Error original: ${error.original.message}`, 'error');
    }
    if (error.parent) {
      sendToFrontend(`   📌 Error parent: ${error.parent.message}`, 'error');
    }
    
    throw error;
  }
}

// 🔧 CARGAR MÓDULOS SIMPLIFICADO (CORREGIDO)
async function loadAllModules() {
  sendToFrontend('🚀 CARGANDO MÓDULOS');
  
  try {
    // 1. DIAGNÓSTICO DE BASE DE DATOS
    await diagnoseDatabase();

    // 2. CARGAR IPC MAIN
    sendToFrontend('📦 Cargando IPC Main...');
    const ipcMainPath = path.join(__dirname, 'ipcMain', 'ipcMain.cjs');
    
    if (!fs.existsSync(ipcMainPath)) {
      throw new Error(`ipcMain.cjs no encontrado: ${ipcMainPath}`);
    }
    
    require(ipcMainPath);
    sendToFrontend('✅ IPC Main cargado');

    // 3. VERIFICAR HANDLERS (USANDO MÉTODO CORREGIDO)
    verifyIpcHandlers();

    return true;

  } catch (error) {
    sendToFrontend(`💥 ERROR: ${error.message}`, 'error');
    throw error;
  }
}

// 🔧 CREAR VENTANA PRINCIPAL
function createMainWindow() {
  sendToFrontend('🪟 Creando ventana principal...');

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    frame: false,
    titleBarStyle: 'hidden',
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs'),
    },
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
    sendToFrontend('✅ Ventana lista');
    // Solo abrir DevTools en desarrollo
    if (!app.isPackaged) {
      mainWindow.webContents.openDevTools();
    }
  });

  // Cargar contenido
  loadWindowContent();
}

function loadWindowContent() {
  sendToFrontend('🌐 Cargando interfaz...');
  
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    const htmlPath = path.join(__dirname, '..', 'dist', 'index.html');
    if (fs.existsSync(htmlPath)) {
      mainWindow.loadFile(htmlPath);
    } else {
      throw new Error(`index.html no encontrado: ${htmlPath}`);
    }
  }
}

// 🔧 CREAR VENTANA DE DIAGNÓSTICO
function createDiagnosticWindow(error = null) {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    show: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false,
    }
  });

  const diagnosticHTML = `
<html>
<head>
  <title>Diagnóstico Base de Datos</title>
  <style>
    body { font-family: Arial; padding: 20px; background: #1e1e1e; color: white; }
    .header { background: #2d2d2d; padding: 20px; border-radius: 10px; margin-bottom: 20px; }
    .error { background: #5c2a2a; padding: 15px; border-radius: 5px; margin-bottom: 20px; border-left: 5px solid #ff4444; }
    .logs { background: #2d2d2d; padding: 20px; border-radius: 10px; height: 400px; overflow-y: auto; font-family: 'Courier New', monospace; font-size: 14px; }
    .log-entry { margin: 8px 0; padding: 5px; border-left: 3px solid #666; }
    .log-error { border-left-color: #ff4444; color: #ff8888; }
    .log-info { border-left-color: #44ff44; color: #88ff88; }
    .timestamp { color: #888; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🔧 Diagnóstico Base de Datos</h1>
    <p>Identificando el error ENOTDIR en sequelize.sync()</p>
  </div>

  ${error ? `<div class="error"><h2>❌ ERROR</h2><p><strong>${error.message}</strong></p></div>` : ''}

  <div class="logs" id="logsContainer">
    <div class="log-entry log-info">
      <span class="timestamp">[Iniciando...]</span> Diagnóstico de base de datos...
    </div>
  </div>

  <script>
    const logsContainer = document.getElementById('logsContainer');
    const logs = ${JSON.stringify(diagnosticLogs)};

    logs.forEach(log => {
      const logEntry = document.createElement('div');
      logEntry.className = 'log-entry log-' + (log.type || 'info');
      const timestamp = new Date(log.timestamp).toLocaleTimeString();
      logEntry.innerHTML = '<span class="timestamp">[' + timestamp + ']</span> ' + log.message;
      logsContainer.appendChild(logEntry);
    });

    logsContainer.scrollTop = logsContainer.scrollHeight;
  </script>
</body>
</html>
  `;

  win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(diagnosticHTML)}`);
  if (!app.isPackaged) {
    win.webContents.openDevTools();
  }
}

// 🔹 INICIAR APLICACIÓN
app.whenReady().then(async () => {
  console.log('=== DIAGNÓSTICO DB ENOTDIR ===');
  sendToFrontend(`📦 Modo: ${app.isPackaged ? 'PRODUCCIÓN' : 'DESARROLLO'}`);
  
  try {
    await loadAllModules();
    createMainWindow();
    sendToFrontend('🎉 APLICACIÓN INICIADA CORRECTAMENTE');
  } catch (error) {
    sendToFrontend(`💥 ERROR: ${error.message}`, 'error');
    createDiagnosticWindow(error);
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});