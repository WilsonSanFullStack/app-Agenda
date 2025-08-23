const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("Electron", {
  minimize: () => ipcRenderer.send("window:minimize"),
  maximize: () => ipcRenderer.send("window:maximize"),
  close: () => ipcRenderer.send("window:close"),
  openDevTools: () => ipcRenderer.send("open-devtools"),
  //eventos para quincenas
  addQuincena: (data) => ipcRenderer.invoke("add-quincena", data),
  getQuincena: (date) => ipcRenderer.invoke("get-quincena", date),
  getQuincenaYear: (year) => ipcRenderer.invoke("get-quincena-year", year),
  getQuincenaById: (id) => ipcRenderer.invoke("get-quincena-By-Id", id),
  deleteQuincena: (id) => ipcRenderer.invoke("delete-quincena", id),
  //eventos para dias
  addDay: (data) => ipcRenderer.invoke("add-day", data),
  getDay: () => ipcRenderer.invoke("get-day"),
  //eventos para pages
  addPage: (data) => ipcRenderer.invoke("add-page", data),
  getPage: () => ipcRenderer.invoke("get-page"),
  //eventos para sender
  addSender: (data) => ipcRenderer.invoke("add-sender", data),
  getSender: () => ipcRenderer.invoke("get-sender"),
  //eventos para dirty
  addDirty: (data) => ipcRenderer.invoke("add-dirty", data),
  //eventos para adult
  addAdult: (data) => ipcRenderer.invoke("add-adult", data),
  //eventos para vx
  addVx: (data) => ipcRenderer.invoke("add-vx", data),
  //eventos para 7Live
  addLive7: (data) => ipcRenderer.invoke("add-live7", data),
  //eventos para monedas
  addMoneda: (data) => ipcRenderer.invoke("add-moneda", data),
  //eventos para buscar todas las quincenas
  getAllData: (data) => ipcRenderer.invoke("get-all-quincena", data),


  //eventos para actualizar quincenas en react
  onAbrirRegistroQuincena: (callback) =>
    ipcRenderer.on("abrir-registro-quincena", callback),
  onQuincenaActualizada: (callback) =>
    ipcRenderer.on("quincenaActualizada", callback),
  removeQuincenaActualizada: () =>
    ipcRenderer.removeAllListeners("quincenaActualizada"),
  //eventos para actualizar dias en react
  onDayActualizado: (callback) => ipcRenderer.on("dayActualizado", callback),
  //eventos para actualizar pages en react
  onDayActualizado: (callback) => ipcRenderer.on("pageActualizado", callback),
});
