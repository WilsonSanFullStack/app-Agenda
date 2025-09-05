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
  getDay: (id) => ipcRenderer.invoke("get-day", id),
  //eventos para pages
  addPage: (data) => ipcRenderer.invoke("add-page", data),
  getPage: () => ipcRenderer.invoke("get-page"),
  getPageName: () => ipcRenderer.invoke("get-page-name"),
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
  onPageActualizado: (callback) => ipcRenderer.on("pageActualizado", callback),
});
