const { DataTypes, UUIDV4 } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "CerradoQ",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      diasTrabajados: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      mejorDia: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
      },
      peorDia: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
      },
      dirty: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      sender: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      vx: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      live7: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      adultwork: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      totalUsd: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      totalEuro: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      totalGbp: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      totalCop: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      totalPrestamos: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      totalCreditos: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      promedioDiario: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      paranoid: true,
      timestamps: true,
    }
  );
};
