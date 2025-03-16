const { DataTypes, UUIDV4 } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Page",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      coins: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        unique: true,
      },
      moneda: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      mensual: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        unique: true,
      },
      valor: {
        type: DataTypes.FLOAT,
        allowNull: false,
        unique: true,
      },
      tope: {
        type: DataTypes.FLOAT,
        allowNull: false,
        unique: true,
      },
    },
    {
      paranoid: true,
      timestamps: true,
    }
  );
};
