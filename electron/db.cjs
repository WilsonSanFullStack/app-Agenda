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
console.log(modelDefiners);
modelDefiners.forEach((model) => model(sequelize));

let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);
console.log(sequelize.models);
const { Quincena, Day } = sequelize.models;

//! relaciones entre modelos
Quincena.hasMany(Day, { as: "modenas", foreignKey: "quincena" });
Day.belongsTo(Quincena, { foreignKey: "quincena" });
// Sincronizar base de datos

module.exports = {
  sequelize,
  Quincena,
  Day
};
