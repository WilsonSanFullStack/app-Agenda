const { Sequelize } = require("sequelize");
const path = require("path");
const fs = require("fs");
// Ruta de la base de datos SQLite
const dbPath = path.join(__dirname, "database.sqlite");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: dbPath,
  logging: false, // Desactiva logs de SQL
});

const basename = path.basename(__filename);

const modelDefiners = [];

fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-4) === ".cjs"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });
modelDefiners.forEach((model) => model(sequelize));

let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

const { Quincena, Day, Page, Moneda } =
  sequelize.models;

// //! relaciones entre modelos
Quincena.hasMany(Day, { as: "dias", foreignKey: "quincena" });
Day.belongsTo(Quincena, { foreignKey: "quincena" });

Quincena.hasMany(Moneda, { as: "Monedas", foreignKey: "quincenaId" });
Moneda.belongsTo(Quincena, { foreignKey: "quincenaId" });
// //relacion sender
// Day.hasMany(Sender, { as: "Senders", foreignKey: "dayId" });
// Sender.belongsTo(Day, { foreignKey: "dayId" });

// Page.hasMany(Sender, { as: "paginaS", foreignKey: "pageId" });
// Sender.belongsTo(Page, { foreignKey: "pageId", as: "paginaS" });
// //relacion dirty
// Day.hasMany(Dirty, { as: "Dirtys", foreignKey: "dayId" });
// Dirty.belongsTo(Day, { foreignKey: "dayId" });

// Page.hasMany(Dirty, { as: "paginaD", foreignKey: "pageId" });
// Dirty.belongsTo(Page, { foreignKey: "pageId", as: "paginaD" });
// //relacion Adult
// Day.hasMany(Adult, { as: "Adults", foreignKey: "dayId" });
// Adult.belongsTo(Day, { foreignKey: "dayId" });

// Page.hasMany(Adult, { as: "paginaA", foreignKey: "pageId" });
// Adult.belongsTo(Page, { foreignKey: "pageId", as: "paginaA" });

// //relacion VX
// Day.hasMany(Vx, { as: "Vxs", foreignKey: "dayId" });
// Vx.belongsTo(Day, { foreignKey: "dayId" });

// Page.hasMany(Vx, { as: "paginaV", foreignKey: "pageId" });
// Vx.belongsTo(Page, { foreignKey: "pageId", as: "paginaV" });
// //relacion VX
// Day.hasMany(Live7, { as: "Lives", foreignKey: "dayId" });
// Live7.belongsTo(Day, { foreignKey: "dayId" });

// Page.hasMany(Live7, { as: "paginaL", foreignKey: "pageId" });
// Live7.belongsTo(Page, { foreignKey: "pageId", as: "paginaL" });
// // Sincronizar base de datos

module.exports = {
  sequelize,
  Quincena,
  Day,
  Page,
  Moneda
};
