const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  getQuincena: () => ipcRenderer.invoke("get-quincena"),
  addQuincena: (name) => ipcRenderer.invoke("add-quincena", name),
  deleteQuincena: (id) => ipcRenderer.invoke("delete-quincena", id),
});
