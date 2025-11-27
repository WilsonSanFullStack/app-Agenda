const { contextBridge, ipcRenderer } = require("electron");

// 🔧 FUNCIÓN PARA EXPONER MÉTODOS DE FORMA SEGURA
const exposeSafeMethod = (methodName, ipcChannel, isInvoke = false) => {
  return (...args) => {
    try {
      if (isInvoke) {
        return ipcRenderer.invoke(ipcChannel, ...args);
      } else {
        return ipcRenderer.send(ipcChannel, ...args);
      }
    } catch (error) {
      console.error(`Error en ${methodName}:`, error);
      throw error;
    }
  };
};

// 🔧 FUNCIÓN PARA EXPONER EVENT LISTENERS DE FORMA SEGURA
const exposeSafeEventListener = (methodName, ipcChannel) => {
  return (callback) => {
    try {
      // Limpiar listeners anteriores antes de agregar uno nuevo
      ipcRenderer.removeAllListeners(ipcChannel);
      ipcRenderer.on(ipcChannel, callback);
    } catch (error) {
      console.error(`Error en ${methodName}:`, error);
    }
  };
};

// 🔧 FUNCIÓN PARA EXPONER REMOVE LISTENERS DE FORMA SEGURA
const exposeSafeRemoveListener = (methodName, ipcChannel) => {
  return (callback) => {
    try {
      if (callback) {
        ipcRenderer.removeListener(ipcChannel, callback);
      } else {
        ipcRenderer.removeAllListeners(ipcChannel);
      }
    } catch (error) {
      console.error(`Error en ${methodName}:`, error);
    }
  };
};

contextBridge.exposeInMainWorld("Electron", {
  // =============================================
  // 🔧 CONTROL DE VENTANA Y RECARGAS
  // =============================================
  reload: exposeSafeMethod("reload", "window:reload"),
  reloadForce: exposeSafeMethod("reloadForce", "window:reload-force"),
  minimize: exposeSafeMethod("minimize", "window:minimize"),
  maximize: exposeSafeMethod("maximize", "window:maximize"),
  close: exposeSafeMethod("close", "window:close"),
  openDevTools: exposeSafeMethod("openDevTools", "open-devtools"),

  // =============================================
  // 🔧 EVENTOS DE ESTADO DE VENTANA (Para navbar)
  // =============================================
  onMaximized: exposeSafeEventListener("onMaximized", "window:maximized"),
  onUnmaximized: exposeSafeEventListener("onUnmaximized", "window:unmaximized"),
  removeMaximizedListeners: exposeSafeRemoveListener(
    "removeMaximizedListeners",
    "window:maximized"
  ),
  removeUnmaximizedListeners: exposeSafeRemoveListener(
    "removeUnmaximizedListeners",
    "window:unmaximized"
  ),

  // =============================================
  // 🔧 QUINCENAS
  // =============================================
  addQuincena: exposeSafeMethod("addQuincena", "add-quincena", true),
  getQuincenaYear: exposeSafeMethod(
    "getQuincenaYear",
    "get-quincena-year",
    true
  ),
  getQuincenaById: exposeSafeMethod(
    "getQuincenaById",
    "get-quincena-by-id",
    true
  ), // 🔧 CORREGIDO: "by-id" no "By-Id"
  deleteQuincena: exposeSafeMethod("deleteQuincena", "delete-quincena", true),

  // 🔧 NOTA: getQuincena no está definido en tu IPC Main, lo removí
  // getQuincena: exposeSafeMethod("getQuincena", "get-quincena", true),

  // =============================================
  // 🔧 DÍAS
  // =============================================
  addDay: exposeSafeMethod("addDay", "add-day", true),
  deleteDay: exposeSafeMethod("deleteDay", "delete-day", true),

  // 🔧 NOTA: getDay no está definido en tu IPC Main, lo removí
  // getDay: exposeSafeMethod("getDay", "get-day", true),

  // =============================================
  // 🔧 PÁGINAS
  // =============================================
  addPage: exposeSafeMethod("addPage", "add-page", true),
  getPage: exposeSafeMethod("getPage", "get-page", true),
  getPageName: exposeSafeMethod("getPageName", "get-all-page-name", true), // 🔧 CORREGIDO: "get-all-page-name"
  deletePage: (id) => ipcRenderer.invoke("delete-page", id),

  // =============================================
  // 🔧 MONEDAS
  // =============================================
  addMoneda: exposeSafeMethod("addMoneda", "add-moneda", true),

  // =============================================
  // 🔧 DATOS DE QUINCENA
  // =============================================
  getDataQ: exposeSafeMethod("getDataQ", "get-data-q", true), // 🔧 CORREGIDO: "get-data-q" no "get-data-quincena"

  // =============================================
  // 🔧 ARANCELES
  // =============================================
  addAranceles: exposeSafeMethod("addAranceles", "post-aranceles", true),
  getAranceles: exposeSafeMethod("getAranceles", "get-aranceles", true),
  updateAranceles: exposeSafeMethod(
    "updateAranceles",
    "update-aranceles",
    true
  ),
  deleteAranceles: exposeSafeMethod("deleteAranceles", "delete-arancel", true), // 🔧 CORREGIDO: "delete-arancel" no "delete-aranceles"

  // =============================================
  // 🔧 CIERRE Y APERTURA DE QUINCENAS
  // =============================================
  cerrarQ: exposeSafeMethod("cerrarQ", "cerrar-q", true), // 🔧 CORREGIDO: "cerrar-q" no "cerrar-quincena"
  abrirQ: exposeSafeMethod("abrirQ", "abrir-q", true), // 🔧 CORREGIDO: "abrir-q" no "abrir-quincena"

  // =============================================
  // 🔧 EVENT LISTENERS PARA ACTUALIZACIONES EN REACT
  // =============================================

  // Quincenas
  onAbrirRegistroQuincena: exposeSafeEventListener(
    "onAbrirRegistroQuincena",
    "abrir-registro-quincena"
  ),
  onQuincenaActualizada: exposeSafeEventListener(
    "onQuincenaActualizada",
    "quincena-actualizada"
  ), // 🔧 CORREGIDO: "quincena-actualizada"
  removeQuincenaActualizada: exposeSafeRemoveListener(
    "removeQuincenaActualizada",
    "quincena-actualizada"
  ),

  // Días
  onDayActualizado: exposeSafeEventListener(
    "onDayActualizado",
    "day-actualizado"
  ), // 🔧 CORREGIDO: "day-actualizado"
  removeDayActualizado: exposeSafeRemoveListener(
    "removeDayActualizado",
    "day-actualizado"
  ),

  // Páginas
  onPageActualizado: exposeSafeEventListener(
    "onPageActualizado",
    "page-actualizado"
  ), // 🔧 CORREGIDO: "page-actualizado"
  removePageActualizado: exposeSafeRemoveListener(
    "removePageActualizado",
    "page-actualizado"
  ),

  // Aranceles
  onPostAranceles: exposeSafeEventListener(
    "onPostAranceles",
    "arancel-actualizado"
  ), // 🔧 CORREGIDO: "arancel-actualizado"
  removePostAranceles: exposeSafeRemoveListener(
    "removePostAranceles",
    "arancel-actualizado"
  ),

  // =============================================
  // 🔧 EVENTOS DE CIERRE/APERTURA DE QUINCENAS
  // =============================================
  onCerrarQ: exposeSafeEventListener("onCerrarQ", "quincena-cerrada"),
  onAbrirQ: exposeSafeEventListener("onAbrirQ", "quincena-abierta"),

  removeCerrarQListener: exposeSafeRemoveListener(
    "removeCerrarQListener",
    "quincena-cerrada"
  ),
  removeAbrirQListener: exposeSafeRemoveListener(
    "removeAbrirQListener",
    "quincena-abierta"
  ),

  // =============================================
  // 🔧 UTILIDADES GLOBALES
  // =============================================
  removeAllListeners: (channel) => {
    try {
      ipcRenderer.removeAllListeners(channel);
    } catch (error) {
      console.error(`Error removiendo listeners de ${channel}:`, error);
    }
  },

  // 🔧 VERIFICAR CONEXIÓN (útil para debugging)
  ping: () => {
    return ipcRenderer.invoke("ping");
  },
});

// 🔧 MANEJO DE ERRORES GLOBAL
process.once("loaded", () => {
  console.log("✅ Preload cargado correctamente");
});

// 🔧 CAPTURAR ERRORES NO MANEJADOS
process.on("uncaughtException", (error) => {
  console.error("❌ Error no capturado en preload:", error);
});
