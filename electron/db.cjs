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

const { Quincena, Day, Page, Sender, Vx } = sequelize.models;

//! relaciones entre modelos
Quincena.hasMany(Day, { as: "dias", foreignKey: "quincena" });
Day.belongsTo(Quincena, { foreignKey: "quincena" });

Day.hasMany(Sender, { as: "Senders", foreignKey: "dayId" });
Sender.belongsTo(Day, { foreignKey: "dayId" });

Page.hasMany(Sender, { as: "Senders", foreignKey: "pageId" });
Sender.belongsTo(Page, { foreignKey: "pageId" });
// Sincronizar base de datos

module.exports = {
  sequelize,
  Quincena,
  Day,
  Page,
  Sender,
  Vx,
};
