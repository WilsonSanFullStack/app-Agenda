// electron/preload.cjs - VERSIÓN CORREGIDA
const { contextBridge, ipcRenderer } = require("electron");

// 🔥 VERIFICAR QUE contextBridge EXISTA
if (!contextBridge) {
  console.error("❌ contextBridge no disponible en este contexto");
  // Fallback para entornos sin contextBridge
  if (typeof window !== "undefined") {
    window.Electron = {
      ping: () => Promise.resolve({ error: "contextBridge no disponible" }),
    };
  }
  return;
}

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
      ipcRenderer.removeAllListeners(ipcChannel);
      ipcRenderer.on(ipcChannel, callback);
    } catch (error) {
      console.error(`Error en ${methodName}:`, error);
    }
  };
};

// 🔧 EXPONER AL MAIN WORLD
try {
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
    ),
    deleteQuincena: exposeSafeMethod("deleteQuincena", "delete-quincena", true),

    // =============================================
    // 🔧 DÍAS
    // =============================================
    addDay: exposeSafeMethod("addDay", "add-day", true),
    deleteDay: exposeSafeMethod("deleteDay", "delete-day", true),

    // =============================================
    // 🔧 PÁGINAS
    // =============================================
    addPage: exposeSafeMethod("addPage", "add-page", true),
    getPage: exposeSafeMethod("getPage", "get-page", true),
    getPageName: exposeSafeMethod("getPageName", "get-all-page-name", true),
    deletePage: (id) => ipcRenderer.invoke("delete-page", id),

    // =============================================
    // 🔧 MONEDAS
    // =============================================
    addMoneda: exposeSafeMethod("addMoneda", "add-moneda", true),

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
    deleteAranceles: exposeSafeMethod(
      "deleteAranceles",
      "delete-arancel",
      true
    ),

    // =============================================
    // 🔧 DATOS DE QUINCENA
    // =============================================
    getDataQ: exposeSafeMethod("getDataQ", "get-data-q", true),

    // =============================================
    // 🔧 CIERRE/APERTURA DE QUINCENAS
    // =============================================
    cerrarQ: exposeSafeMethod("cerrarQ", "cerrar-q", true),
    abrirQ: exposeSafeMethod("abrirQ", "abrir-q", true),

    // =============================================
    // 🔧 UTILIDADES
    // =============================================
    ping: () => ipcRenderer.invoke("ping"),

    // =============================================
    // 🔧 EVENT LISTENERS
    // =============================================
    onAbrirRegistroQuincena: (callback) =>
      ipcRenderer.on("abrir-registro-quincena", callback),
    onQuincenaActualizada: exposeSafeEventListener(
      "onQuincenaActualizada",
      "quincena-actualizada"
    ),
    onPageActualizado: exposeSafeEventListener(
      "onPageActualizado",
      "page-actualizado"
    ),
    onArancelActualizado: exposeSafeEventListener(
      "onArancelActualizado",
      "ArancelActualizado"
    ),

    // =============================================
    // 🔧 REMOVE LISTENERS
    // =============================================
    removeAllListeners: (channel) => {
      try {
        ipcRenderer.removeAllListeners(channel);
      } catch (error) {
        console.error(`Error removiendo listeners de ${channel}:`, error);
      }
    },
    // 🔧 DIAGNÓSTICO
    onDiagnosticLog: (callback) => {
      ipcRenderer.on("diagnostic-log", callback);
    },
    getDiagnosticLogs: () => ipcRenderer.invoke("get-diagnostic-logs"),
  });

  console.log("✅ Preload cargado correctamente");
} catch (error) {
  console.error("❌ Error en preload:", error);

  // Fallback para desarrollo
  if (typeof window !== "undefined") {
    window.Electron = {
      ping: () =>
        Promise.resolve({ error: "Preload falló", message: error.message }),
    };
  }
}
