const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("Electron", {
  getQuincena: () => ipcRenderer.invoke("get-quincena"),
  addQuincena: (data) => ipcRenderer.invoke("add-quincena", data),
  deleteQuincena: (id) => ipcRenderer.invoke("delete-quincena", id),
  onAbrirRegistroQuincena: (callback) =>
    ipcRenderer.on("abrir-registro-quincena", callback),
  onQuincenaActualizada: (callback) =>
    ipcRenderer.on("quincenaActualizada", callback),
  removeQuincenaActualizada: () =>
    ipcRenderer.removeAllListeners("quincenaActualizada"),
});
