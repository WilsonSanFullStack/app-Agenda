// electron/preload.cjs
const { contextBridge, ipcRenderer } = require("electron");

const exposeSafeMethod = (methodName, ipcChannel, isInvoke = false) => {
  return (...args) => {
    if (isInvoke) {
      return ipcRenderer.invoke(ipcChannel, ...args);
    } else {
      return ipcRenderer.send(ipcChannel, ...args);
    }
  };
};

const exposeSafeEventListener = (methodName, ipcChannel) => {
  return (callback) => {
    ipcRenderer.removeAllListeners(ipcChannel);
    ipcRenderer.on(ipcChannel, callback);
  };
};

contextBridge.exposeInMainWorld("Electron", {
  // =============================================
  // CONTROL DE VENTANA
  // =============================================
  reload: exposeSafeMethod("reload", "window:reload"),
  reloadForce: exposeSafeMethod("reloadForce", "window:reload-force"),
  minimize: exposeSafeMethod("minimize", "window:minimize"),
  maximize: exposeSafeMethod("maximize", "window:maximize"),
  close: exposeSafeMethod("close", "window:close"),
  openDevTools: exposeSafeMethod("openDevTools", "open-devtools"),

  // =============================================
  // QUINCENAS
  // =============================================
  addQuincena: exposeSafeMethod("addQuincena", "add-quincena", true),
  getQuincenaYear: exposeSafeMethod("getQuincenaYear", "get-quincena-year", true),
  getQuincenaById: exposeSafeMethod("getQuincenaById", "get-quincena-by-id", true),
  deleteQuincena: exposeSafeMethod("deleteQuincena", "delete-quincena", true),

  // =============================================
  // DÍAS
  // =============================================
  addDay: exposeSafeMethod("addDay", "add-day", true),
  deleteDay: exposeSafeMethod("deleteDay", "delete-day", true),

  // =============================================
  // PÁGINAS
  // =============================================
  addPage: exposeSafeMethod("addPage", "add-page", true),
  getPage: exposeSafeMethod("getPage", "get-page", true),
  getPageName: exposeSafeMethod("getPageName", "get-all-page-name", true),
  deletePage: (id) => ipcRenderer.invoke("delete-page", id),

  // =============================================
  // MONEDAS
  // =============================================
  addMoneda: exposeSafeMethod("addMoneda", "add-moneda", true),

  // =============================================
  // ARANCELES
  // =============================================
  addAranceles: exposeSafeMethod("addAranceles", "post-aranceles", true),
  getAranceles: exposeSafeMethod("getAranceles", "get-aranceles", true),
  updateAranceles: exposeSafeMethod("updateAranceles", "update-aranceles", true),
  deleteAranceles: exposeSafeMethod("deleteAranceles", "delete-arancel", true),

  // =============================================
  // DATOS DE QUINCENA
  // =============================================
  getDataQ: exposeSafeMethod("getDataQ", "get-data-q", true),

  // =============================================
  // CIERRE/APERTURA DE QUINCENA
  // =============================================
  cerrarQ: exposeSafeMethod("cerrarQ", "cerrar-q", true),
  abrirQ: exposeSafeMethod("abrirQ", "abrir-q", true),

  // =============================================
  // UTILIDADES
  // =============================================
  ping: () => ipcRenderer.invoke("ping"),

  // =============================================
  // EVENT LISTENERS
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
  // REMOVE LISTENERS
  // =============================================
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  },

  // =============================================
  // DIAGNÓSTICO
  // =============================================
  onDiagnosticLog: (callback) => {
    ipcRenderer.on("diagnostic-log", callback);
  },
  getDiagnosticLogs: () => ipcRenderer.invoke("get-diagnostic-logs"),
});
