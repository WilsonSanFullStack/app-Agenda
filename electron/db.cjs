const fs = require("fs");
const { Sequelize } = require('sequelize');
const path = require('path');
const { app } = require('electron');
// Configuración dinámica según el entorno
const dbPath = app.isPackaged 
  ? path.join(app.getPath('userData'), 'database.sqlite')
  : path.join(__dirname, 'database.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false,
  define: {
    timestamps: false
  }
});

const basename = path.basename(__filename);

const modelDefiners = [];

fs.readdirSync(path.join(__dirname, "models"))
  ?.filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-4) === ".cjs"
  )
  ?.forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "models", file)));
  });
modelDefiners?.forEach((model) => model(sequelize));

let entries = Object?.entries(sequelize.models);
let capsEntries = entries?.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

const { Quincena, Day, Page, Moneda, Aranceles, CerradoQ } = sequelize.models;

// //! relaciones entre modelos
Quincena.hasMany(Day, { as: "dias", foreignKey: "quincena" });
Day.belongsTo(Quincena, { foreignKey: "quincena" });

Quincena.hasMany(Moneda, { as: "Monedas", foreignKey: "quincenaId" });
Moneda.belongsTo(Quincena, { foreignKey: "quincenaId" });

Quincena.hasOne(CerradoQ, {
  as: "cierre",
  foreignKey: "quincenaId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

CerradoQ.belongsTo(Quincena, {
  foreignKey: "quincenaId",
});

module.exports = {
  sequelize,
  Quincena,
  Day,
  Page,
  Moneda,
  Aranceles,
  CerradoQ,
};
