const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const path = require("path");
const { Mes, Quincena, Dias, db } = require("./db.cjs");
const { error } = require("console");

let mainWindow;

app.whenReady().then(async () => {
  await db();
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      enableRemoteModule: false,
      spellcheck: true, // 🔹 Desactiva el autocompletado
      preload: path.join(__dirname, "preload.cjs"),
    },
  });

  // ipcMain.handle();

  mainWindow.loadURL(`file://${path.join(__dirname, "../dist/index.html")}`);
  // mainWindow.loadURL("http://localhost:5173");
  // mainWindow.loadFile('index.html')
  // Crear y establecer el menú
  const menu = Menu.buildFromTemplate([
    {
      label: "Archivo",
      submenu: [
        {
          label: "Registro",
          submenu: [
            {
              label: "Quincena",
              click: () => {
                mainWindow.webContents.send("abrir-registro-quincena")
              },
            },
          ],
        },
        {
          label: "Salir",
          role: "quit", // Cierra la aplicación
        },
      ],
    },
    {
      label: "Editar",
      submenu: [
        { role: "undo", label: "Deshacer" },
        { role: "redo", label: "Rehacer" },
        { type: "separator" },
        { role: "cut", label: "Cortar" },
        { role: "copy", label: "Copiar" },
        { role: "paste", label: "Pegar" },
      ],
    },
    {
      label: "Ver",
      submenu: [
        { role: "reload", label: "Recargar" },
        { role: "toggleDevTools", label: "Herramientas de desarrollo" },
      ],
    },
  ]);

  Menu.setApplicationMenu(menu); // 🔹 Establecer el menú en la ventana

  //manejar IPC para obtener datos desde el frontend
  ipcMain.handle("get-quincena", async () => {
    const respuesta = await Quincena.findAll();
    const res = respuesta.map((x) => x.dataValues)
    return res
  });

  ipcMain.handle("add-quincena", async (_, data) => {
    try {
      const [nuevaQuincena, created] = await Quincena.findOrCreate({
        where: { name: data.name },
        defaults: {
          name: data.name,
          inicio: data.inicio,
          fin: data.fin,
        },
      });

      if (!created) {
        return { error: "La quincena ya existe" };
      }
      // 🔹 Enviar evento a React para actualizar la lista
    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send("quincenaActualizada", nuevaQuincena);
    });
      return nuevaQuincena;
    } catch (error) {
      console.log(error);
    }
  });

  ipcMain.handle("delete-quincena", async (_, quincenaId) => {
    return await Quincena.destroy({ where: { id: quincenaId } });
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
