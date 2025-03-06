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
    unique: true,
  },
});
// Definir modelo
const Quincena = sequelize.define("Quincena", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  inicio: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fin: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
// Definir modelo
const Dias = sequelize.define("Dias", {
  name: {
    type: DataTypes.NUMBER,
    allowNull: false,
    unique: true,
  },
});

// Sincronizar base de datos
async function db() {
  try {
    await sequelize.sync({ force: false }); //sincroniza la db sin eliminar datos
    console.log("🔹 Base de datos lista");
  } catch (error) {
    console.log("❌ Error al configurar la base de datos:", error);
  }
}
// sequelize
//   .sync()
//   .then(() => console.log("Base de datos sincronizada"))
//   .catch((err) => console.error("Error al sincronizar DB:", err));

module.exports = { Quincena, db };
