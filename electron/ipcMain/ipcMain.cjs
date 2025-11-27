// electron/ipcMain/ipcMain.cjs
const { ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

console.log("🎯 INICIANDO REGISTRO DE HANDLERS IPC...");

// 🔍 Función para cargar controladores de forma segura
function loadController(controllerName) {
  try {
    const controllerPath = path.join(
      __dirname,
      "..",
      "controller",
      controllerName
    );
    console.log(`📁 Intentando cargar: ${controllerPath}`);

    if (fs.existsSync(controllerPath)) {
      const controller = require(controllerPath);
      console.log(`✅ ${controllerName} cargado correctamente`);
      return controller;
    } else {
      console.log(`❌ ${controllerName} no encontrado en: ${controllerPath}`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Error cargando ${controllerName}:`, error);
    return null;
  }
}

// 🎯 CARGAR CONTROLADORES
const quincenaController = loadController("quincena.cjs");
const pageController = loadController("page.cjs");
const dayController = loadController("day.cjs");
const monedaController = loadController("moneda.cjs");
const arancelesController = loadController("aranceles.cjs");
const cerradoQController = loadController("cerradoQ.cjs");
const getQDataController = loadController("getQData.cjs");

// 🎯 REGISTRAR HANDLERS SOLO SI LOS CONTROLADORES EXISTEN

// =============================================
// 🔧 HANDLERS DE QUINCENA
// =============================================
if (quincenaController) {
  ipcMain.handle("add-quincena", async (event, quincenaData) => {
    console.log("📅 Handler: add-quincena");
    try {
      return await quincenaController.postQuincena(quincenaData);
    } catch (error) {
      console.error("❌ Error en add-quincena:", error);
      throw error;
    }
  });

  ipcMain.handle("get-quincena-year", async (event, year) => {
    console.log("📅 Handler: get-quincena-year:", year);
    try {
      return await quincenaController.getAllQuincenaYear(year);
    } catch (error) {
      console.error("❌ Error en get-quincena-year:", error);
      throw error;
    }
  });

  ipcMain.handle("get-all-quincenas", async (event) => {
    console.log("📅 Handler: get-all-quincenas");
    try {
      return await quincenaController.getAllQuincenas();
    } catch (error) {
      console.error("❌ Error en get-all-quincenas:", error);
      throw error;
    }
  });

  ipcMain.handle("get-quincena-by-id", async (event, id) => {
    console.log("📅 Handler: get-quincena-by-id:", id);
    try {
      return await quincenaController.getQuincenaById(id);
    } catch (error) {
      console.error("❌ Error en get-quincena-by-id:", error);
      throw error;
    }
  });

  ipcMain.handle("delete-quincena", async (event, id) => {
    console.log("📅 Handler: delete-quincena:", id);
    try {
      return await quincenaController.deleteQuincena(id);
    } catch (error) {
      console.error("❌ Error en delete-quincena:", error);
      throw error;
    }
  });
}

// =============================================
// 🔧 HANDLERS DE PAGE
// =============================================
if (pageController) {
  ipcMain.handle("get-page", async (event) => {
    console.log("📄 Handler: get-page");
    try {
      return await pageController.getAllPage();
    } catch (error) {
      console.error("❌ Error en get-page:", error);
      throw error;
    }
  });

  ipcMain.handle("get-all-page-name", async (event) => {
    console.log("📄 Handler: get-all-page-name");
    try {
      return await pageController.getAllPageName();
    } catch (error) {
      console.error("❌ Error en get-all-page-name:", error);
      throw error;
    }
  });

  ipcMain.handle("add-page", async (event, pageData) => {
    console.log("📄 Handler: add-page");
    try {
      return await pageController.postPage(pageData);
    } catch (error) {
      console.error("❌ Error en add-page:", error);
      throw error;
    }
  });
  ipcMain.handle("delete-page", async (event, id) => {
    console.log("📄 Handler: delete-page:", id);
    try {
      return await pageController.deletePage(id);
    } catch (error) {
      console.error("❌ Error en delete-page:", error);
      throw error;
    }
  });
}

// =============================================
// 🔧 HANDLERS DE DAY
// =============================================
if (dayController) {
  ipcMain.handle("add-day", async (event, dayData) => {
    console.log("📅 Handler: add-day");
    try {
      return await dayController.postDay(dayData);
    } catch (error) {
      console.error("❌ Error en add-day:", error);
      throw error;
    }
  });

  ipcMain.handle("delete-day", async (event, id) => {
    console.log("📅 Handler: delete-day:", id);
    try {
      return await dayController.deleteDay(id);
    } catch (error) {
      console.error("❌ Error en delete-day:", error);
      throw error;
    }
  });
}

// =============================================
// 🔧 HANDLERS DE MONEDA
// =============================================
if (monedaController) {
  ipcMain.handle("add-moneda", async (event, monedaData) => {
    console.log("💰 Handler: add-moneda");
    try {
      return await monedaController.postMoneda(monedaData);
    } catch (error) {
      console.error("❌ Error en add-moneda:", error);
      throw error;
    }
  });
}

// =============================================
// 🔧 HANDLERS DE ARANCELES
// =============================================
if (arancelesController) {
  ipcMain.handle("post-aranceles", async (event, arancelData) => {
    console.log("📊 Handler: post-aranceles");
    try {
      return await arancelesController.postAranceles(arancelData);
    } catch (error) {
      console.error("❌ Error en post-aranceles:", error);
      throw error;
    }
  });

  ipcMain.handle("get-aranceles", async (event) => {
    console.log("📊 Handler: get-aranceles");
    try {
      return await arancelesController.getAranceles();
    } catch (error) {
      console.error("❌ Error en get-aranceles:", error);
      throw error;
    }
  });

  ipcMain.handle("update-aranceles", async (event, arancelData) => {
    console.log("📊 Handler: update-aranceles");
    try {
      return await arancelesController.updateAranceles(arancelData);
    } catch (error) {
      console.error("❌ Error en update-aranceles:", error);
      throw error;
    }
  });

  ipcMain.handle("delete-arancel", async (event, id) => {
    console.log("📊 Handler: delete-arancel:", id);
    try {
      return await arancelesController.deleteArancel(id);
    } catch (error) {
      console.error("❌ Error en delete-arancel:", error);
      throw error;
    }
  });
}

// =============================================
// 🔧 HANDLERS DE DATOS DE QUINCENA (GET Q DATA)
// =============================================
if (getQDataController) { // ← AHORA USA EL CONTROLADOR CORRECTO
  ipcMain.handle("get-data-q", async (event, data) => {
    console.log("📅 Handler: get-data-q");
    try {
      return await getQDataController.getDataQ(data);
    } catch (error) {
      console.error("❌ Error en get-data-q:", error);
      throw error;
    }
  });
}

// =============================================
// 🔧 HANDLERS DE CIERRE/APERTURA DE QUINCENAS
// =============================================
if (cerradoQController) {
  ipcMain.handle("cerrar-q", async (event, data) => {
    console.log("🔒 Handler: cerrar-q");
    try {
      const result = await cerradoQController.cerrarQ(data);
      // 🔧 EMITIR EVENTO PARA REACT
      if (event.sender) {
        event.sender.send("quincena-cerrada", result);
      }
      return result;
    } catch (error) {
      console.error("❌ Error en cerrar-q:", error);
      throw error;
    }
  });

  ipcMain.handle("abrir-q", async (event, data) => {
    console.log("🔓 Handler: abrir-q");
    try {
      const result = await cerradoQController.abrirQ(data);
      // 🔧 EMITIR EVENTO PARA REACT
      if (event.sender) {
        event.sender.send("quincena-abierta", result);
      }
      return result;
    } catch (error) {
      console.error("❌ Error en abrir-q:", error);
      throw error;
    }
  });
}

// =============================================
// 🔧 HANDLER DE PING (Para debugging)
// =============================================
ipcMain.handle("ping", async (event) => {
  console.log("🏓 Handler: ping");
  return { success: true, message: "pong", timestamp: new Date().toISOString() };
});

// =============================================
// 🔧 EVENT EMITTERS PARA ACTUALIZACIONES EN REACT
// =============================================

// Función helper para emitir eventos de actualización
const emitUpdateEvent = (event, eventName, data) => {
  if (event.sender) {
    event.sender.send(eventName, data);
  }
};

// Emitir eventos cuando se crean/actualizan datos
if (quincenaController) {
  // Ejemplo: después de crear una quincena, emitir evento
  // Esto deberías llamarlo desde tus controllers después de operaciones exitosas
}

if (pageController) {
  // Ejemplo: después de crear una página, emitir evento
}

if (dayController) {
  // Ejemplo: después de crear un día, emitir evento
}

if (arancelesController) {
  // Ejemplo: después de crear/actualizar aranceles, emitir evento
}

// 🎯 VERIFICAR HANDLERS REGISTRADOS
console.log("✅ HANDLERS REGISTRADOS EXITOSAMENTE");
console.log("📋 Lista de handlers activos:");

// Listar todos los handlers registrados (actualizada)
const handlerNames = [
  "add-quincena",
  "get-quincena-year", 
  "get-all-quincenas",
  "get-quincena-by-id",
  "delete-quincena",
  "get-page",
  "get-all-page-name",
  "add-page",
  "delete-page",
  "add-day",
  "delete-day",
  "add-moneda",
  "post-aranceles",
  "get-aranceles",
  "update-aranceles",
  "delete-arancel",
  "get-data-q",
  "cerrar-q",
  "abrir-q",
  "ping"
];

handlerNames.forEach((handlerName) => {
  try {
    // Verificar si el handler está registrado
    const handler = ipcMain._handle(handlerName);
    if (handler) {
      console.log(`   ✅ ${handlerName}`);
    } else {
      console.log(`   ❌ ${handlerName} (NO REGISTRADO)`);
    }
  } catch (error) {
    console.log(`   ❌ ${handlerName} (ERROR: ${error.message})`);
  }
});

console.log("🎉 CONFIGURACIÓN IPC COMPLETADA");

module.exports = ipcMain;