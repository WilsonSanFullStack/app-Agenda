const { Sequelize, DataTypes } = require("sequelize");
const path = require("path");

// Ruta de la base de datos SQLite
const dbPath = path.join(__dirname, "database.sqlite");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: dbPath,
  logging: false, // Desactiva logs de SQL
});

// Definir modelo
const Mes = sequelize.define("Mes", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
});
// Definir modelo
const Quincena = sequelize.define("Quincena", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
});
// Definir modelo
const Dias = sequelize.define("Dias", {
  name: {
    type: DataTypes.NUMBER,
    allowNull: false,
    unique: true
  },
});

// Sincronizar base de datos
sequelize
  .sync()
  .then(() => console.log("Base de datos sincronizada"))
  .catch((err) => console.error("Error al sincronizar DB:", err));

module.exports = { sequelize, User };
