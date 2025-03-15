const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("Electron", {
  minimize: () => ipcRenderer.send("window:minimize"),
  maximize: () => ipcRenderer.send("window:maximize"),
  close: () => ipcRenderer.send("window:close"),
  openDevTools: () => ipcRenderer.send("open-devtools"),
  //eventos para quincenas
  addQuincena: (data) => ipcRenderer.invoke("add-quincena", data),
  getQuincena: () => ipcRenderer.invoke("get-quincena"),
  getQuincenaById: (id) => ipcRenderer.invoke("get-quincena-By-Id", id),
  deleteQuincena: (id) => ipcRenderer.invoke("delete-quincena", id),
  //eventos para dias
  addDay: (data) => ipcRenderer.invoke("add-day",data),
  getDay: ()=>ipcRenderer.invoke("get-day"),

  //eventos para actualizar quincenas en react
  onAbrirRegistroQuincena: (callback) =>
    ipcRenderer.on("abrir-registro-quincena", callback),
  onQuincenaActualizada: (callback) =>
    ipcRenderer.on("quincenaActualizada", callback),
  removeQuincenaActualizada: () =>
    ipcRenderer.removeAllListeners("quincenaActualizada"),
  //eventos para actualizar dias en react
  onDayActualizado: (callback) =>
    ipcRenderer.on("dayActualizado", callback),

});
