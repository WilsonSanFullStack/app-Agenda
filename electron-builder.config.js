export default {
  asar: true,
  files: [
    "dist/**/*",
    "electron/main.cjs",
    "electron/preload.cjs",
    "electron/db.cjs",
    "electron/ipcMain/ipcMain.cjs",
    "electron/controller/**/*.cjs",
    "electron/controller/processors/**/*.cjs",
    "electron/models/**/*.cjs",
    "!**/node_modules/@tailwindcss/**",
    "!**/node_modules/@emnapi/**",
  ],
  extraResources: [
    {
      from: "node_modules/sqlite3/lib/binding",
      to: "Resources",
      filter: ["**/*"],
    },
  ],
};
